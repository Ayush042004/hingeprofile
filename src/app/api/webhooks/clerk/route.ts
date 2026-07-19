import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import dbConnect from '@/lib/db/connect';
import UserModel from '@/lib/db/models/User';

type WebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
  };
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const body = await req.text();

  let evt: WebhookEvent;

  // Verify webhook if secret is configured
  if (WEBHOOK_SECRET && svix_id && svix_timestamp && svix_signature) {
    const wh = new Webhook(WEBHOOK_SECRET);
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }
  } else {
    // Dev mode: accept unsigned payloads
    evt = JSON.parse(body) as WebhookEvent;
  }

  await dbConnect();

  if (evt.type === 'user.created') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;

    const email = email_addresses?.[0]?.email_address || '';
    const name = username || `${first_name || ''} ${last_name || ''}`.trim() || 'user';

    await UserModel.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email,
        username: name,
        imageUrl: image_url || '',
      },
      { upsert: true, new: true }
    );
  }

  if (evt.type === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address || '';
    const name = username || `${first_name || ''} ${last_name || ''}`.trim();

    await UserModel.findOneAndUpdate(
      { clerkId: id },
      {
        ...(email && { email }),
        ...(name && { username: name }),
        ...(image_url && { imageUrl: image_url }),
      }
    );
  }

  if (evt.type === 'user.deleted') {
    await UserModel.findOneAndDelete({ clerkId: evt.data.id });
  }

  return NextResponse.json({ success: true });
}