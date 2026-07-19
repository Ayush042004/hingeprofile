import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="min-h-screen flex flex-col bg-paper bg-dot-pattern">
      {/* ── Top Nav Header (Neo-Brutalist Electric Lime Vibe) ────────────── */}
      <header className="sticky top-0 z-50 border-b-4 border-ink bg-surface shadow-[0px_4px_0px_#0c0b09]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 font-display text-xl font-black uppercase tracking-tight text-ink transition-transform duration-200 hover:scale-[1.02]"
          >
            <span className="rounded-xl border-3 border-ink bg-ink px-2.5 py-1 text-xs font-black tracking-widest text-[#C6FF4D] shadow-[3px_3px_0px_#C6FF4D] transition-all group-hover:bg-[#C6FF4D] group-hover:text-ink group-hover:shadow-[3px_3px_0px_#0c0b09]">
              HP.
            </span>
            <span className="flex items-center">
              Hinge<span className="rounded-md border-2 border-ink bg-[#C6FF4D] px-1.5 py-0.5 text-ink ml-1 shadow-brutal-sm">Profile</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-3 sm:gap-6 font-display text-xs sm:text-sm font-black uppercase tracking-wider">
            <Link
              href="/interview"
              className="flex items-center gap-2 rounded-xl border-3 border-ink bg-[#C6FF4D] px-3.5 sm:px-4 py-2 text-ink shadow-[3px_3px_0px_#0c0b09] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0c0b09]"
            >
              <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
              <span>Interview</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-xl border-3 border-ink bg-surface px-3.5 sm:px-4 py-2 text-ink shadow-[3px_3px_0px_#0c0b09] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#C6FF4D] hover:shadow-[5px_5px_0px_#0c0b09]"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5] fill-[#C6FF4D]" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Button inside Neo-Brutalist Frame */}
          <div className="rounded-xl border-3 border-ink bg-surface p-1 shadow-[3px_3px_0px_#0c0b09] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0c0b09] flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    'w-8 h-8 rounded-lg border-2 border-ink shadow-none transition-transform duration-150 hover:scale-105',
                  userButtonPopoverCard:
                    '!bg-surface !border-4 !border-ink !rounded-2xl !p-4 !shadow-[8px_8px_0px_#0c0b09] !w-80 !overflow-hidden !animate-popover',
                  userButtonPopoverActions: '!p-0 !mt-3 !flex !flex-col !gap-3',
                  userButtonPopoverActionButton:
                    '!border-3 !border-ink !bg-surface !rounded-xl !p-3.5 !shadow-[4px_4px_0px_#0c0b09] hover:!bg-[#C6FF4D] hover:!shadow-[6px_6px_0px_#0c0b09] hover:!-translate-y-0.5 !transition-all !duration-150 !w-full !flex !items-center !gap-3 !text-ink !font-display !font-bold !text-sm',
                  userButtonPopoverActionButtonText:
                    '!text-ink !font-display !font-extrabold !text-xs sm:!text-sm !uppercase !tracking-wider',
                  userButtonPopoverActionButtonIcon: '!text-ink !w-4 !h-4',
                  userPreview:
                    '!bg-[#C6FF4D] !border-3 !border-ink !rounded-xl !p-3.5 !shadow-[4px_4px_0px_#0c0b09] !flex !items-center !gap-3.5 !mb-3',
                  userPreviewAvatarBox: '!w-11 !h-11 !rounded-lg !border-2 !border-ink !shadow-none !flex-shrink-0',
                  userPreviewAvatarContainer: '!border-0 !shadow-none !p-0 !m-0 !bg-transparent',
                  userPreviewTextContainer: '!border-0 !shadow-none !p-0 !m-0 !bg-transparent !flex !flex-col !gap-0.5',
                  userPreviewMainIdentifier:
                    '!border-0 !shadow-none !p-0 !m-0 !bg-transparent !text-ink !font-display !font-black !text-base',
                  userPreviewSecondaryIdentifier:
                    '!border-0 !shadow-none !p-0 !m-0 !bg-transparent !text-ink/75 !font-sans !font-bold !text-xs',
                  userButtonPopoverFooter:
                    '!bg-transparent !border-0 !border-t-2 !border-solid !border-ink/15 !pt-3 !mt-3 !flex !flex-col !items-center !justify-center !shadow-none !gap-1',
                },
              }}
            />
          </div>
        </nav>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
