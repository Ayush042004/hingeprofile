import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0F0] bg-dot-pattern">
      {/* ── Top nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-[#121212]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/interview" className="flex items-center gap-3 font-black text-lg uppercase tracking-tighter">
            {/* Bauhaus Geometric Logo */}
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#D02020] border-2 border-[#121212]" />
              <div className="w-5 h-5 bg-[#1040C0] border-2 border-[#121212]" />
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-[#F0C020]" style={{ filter: 'drop-shadow(2px 2px 0px #121212)' }} />
            </div>
            <span>ProfileCoach</span>
          </Link>

          <div className="flex items-center gap-6 h-full font-bold text-sm uppercase tracking-wider">
            <Link href="/interview" className="hover:text-[#D02020] transition-colors py-5 border-b-4 border-transparent hover:border-[#D02020]">
              🎙️ Interview
            </Link>
            <Link href="/profile" className="hover:text-[#1040C0] transition-colors py-5 border-b-4 border-transparent hover:border-[#1040C0]">
              ✨ Profile
            </Link>
          </div>

          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 border-2 border-[#121212] rounded-none shadow-[2px_2px_0px_0px_#121212]',
              },
            }}
          />
        </nav>
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
