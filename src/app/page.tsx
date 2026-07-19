import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/interview');

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0F0] bg-dot-pattern">
      {/* ── Nav Header ───────────────────────────────────── */}
      <header className="sticky top-0 w-full z-50 bg-white border-b-4 border-[#121212]">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter">
            {/* Bauhaus Geometric Logo */}
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#D02020] border-2 border-[#121212]" />
              <div className="w-5 h-5 bg-[#1040C0] border-2 border-[#121212]" />
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-[#F0C020] relative" style={{ filter: 'drop-shadow(2px 2px 0px #121212)' }} />
            </div>
            <span>ProfileCoach</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="btn-ghost font-bold text-sm">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-primary text-sm px-6 py-2">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero Section (Asymmetric Constructivist) ─────── */}
      <main className="flex-1">
        <section className="relative border-b-4 border-[#121212]">
          <div className="grid lg:grid-cols-12 min-h-[500px]">
            {/* Left Copy Panel */}
            <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-[#F0F0F0]">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 bg-[#F0C020] text-[#121212] border-2 border-[#121212] font-black text-xs uppercase tracking-widest mb-6 shadow-[2px_2px_0px_0px_#121212]">
                  🤖 REAL DATING COACHES IN YOUR POCKET
                </span>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-[#121212] mb-6">
                  YOUR PROFILE, <br />
                  <span className="text-[#D02020] block mt-2">ACTUALLY YOU.</span>
                </h1>

                <p className="text-lg text-[#121212] font-medium max-w-xl mb-8 leading-relaxed">
                  No generic templates. No cringe pickup lines. We interview you through natural voice/text conversation, analyze your real humor, and write a Hinge profile that sounds 100% human and full of natural rizz.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/sign-up" className="btn-primary text-base px-8 py-3.5 shadow-[4px_4px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-bauhaus">
                    Start Your Interview →
                  </Link>
                  <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5 shadow-[4px_4px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-bauhaus bg-[#1040C0]">
                    See How It Works
                  </a>
                </div>
              </div>
            </div>

            {/* Right Artistic Geometric Panel */}
            <div className="lg:col-span-5 bg-[#1040C0] border-t-4 lg:border-t-0 lg:border-l-4 border-[#121212] relative overflow-hidden flex items-center justify-center p-12 min-h-[400px]">
              <div className="bg-dot-pattern-light absolute inset-0 opacity-40" />
              
              {/* Constructivist Poster Composition */}
              <div className="relative w-72 h-72 border-4 border-[#121212] bg-[#F0F0F0] shadow-[12px_12px_0px_0px_#121212] p-8 overflow-hidden flex flex-col justify-between">
                {/* Red Circle */}
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-[#D02020] border-4 border-[#121212]" />
                
                {/* Yellow Rotated Square */}
                <div className="absolute bottom-6 left-6 w-24 h-24 bg-[#F0C020] border-4 border-[#121212] rotate-12" />
                
                {/* Black Diagonal Divider Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#121212] -rotate-45" />

                <div className="relative z-10">
                  <p className="font-black text-2xl tracking-tighter text-[#121212]">FORM</p>
                  <p className="font-black text-2xl tracking-tighter text-[#121212] leading-[0.8]">FOLLOWS</p>
                </div>
                <div className="relative z-10 text-right">
                  <p className="font-black text-3xl tracking-widest text-[#1040C0] bg-white border-2 border-[#121212] px-2 py-0.5 inline-block uppercase leading-none">RIZZ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works (Color Blocked Grid) ─────────────── */}
        <section id="how-it-works" className="py-20 px-6 border-b-4 border-[#121212] bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D02020]">
                THE BLUEPRINT
              </span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-[#121212] mt-2">
                HOW WE COACH YOU
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  bg: 'bg-[#D02020]',
                  text: 'text-white',
                  title: 'THE INTERVIEW',
                  desc: 'Have a casual, zero-pressure text conversation with our coach. We ask about your background, career, music tastes, and ideal dates.',
                },
                {
                  step: '02',
                  bg: 'bg-[#F0C020]',
                  text: 'text-[#121212]',
                  title: 'ANALYSIS',
                  desc: 'We map your traits using real psychology and calculate confidence levels. No fake algorithms—just capturing your actual voice.',
                },
                {
                  step: '03',
                  bg: 'bg-[#1040C0]',
                  text: 'text-white',
                  title: 'THE REVEAL',
                  desc: 'Get an customized Hinge bio, premium prompt answers, and a curated photo guide with high-rizz captions that attract matches.',
                },
              ].map(({ step, bg, text, title, desc }) => (
                <div key={step} className={`border-4 border-[#121212] p-8 shadow-[6px_6px_0px_0px_#121212] relative overflow-hidden flex flex-col justify-between min-h-[250px] ${bg} ${text}`}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-2xl tracking-tighter uppercase leading-none">{title}</h3>
                    {/* Rotated Step Number */}
                    <div className="font-black text-3xl px-2 py-0.5 border-2 border-[#121212] bg-[#F0F0F0] text-[#121212] rotate-12 shadow-[2px_2px_0px_0px_#121212]">
                      {step}
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed mt-8 opacity-90">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section (Stark Primary Blocks) ──────── */}
        <section className="py-20 px-6 bg-[#F0C020] border-b-4 border-[#121212]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#1040C0]">
                THE SPECIFICATIONS
              </span>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-[#121212] mt-2">
                WHAT YOU GET
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Dynamic Coaching', desc: 'The AI adaptively updates questions to cover empty spots in your profile.', accent: 'circle' },
                { title: 'Trait Metrics', desc: 'See confidence scores on your hobbies, fitness, relationship goals, and career.', accent: 'square' },
                { title: 'Elite Copywriting', desc: 'Custom prompts chosen specifically to tell your story and invite banter.', accent: 'triangle' },
                { title: 'Zero Clichés', desc: 'No generic tech-bro jokes, standard pick-up lines, or fake quotes.', accent: 'circle' },
                { title: 'Photo Playbook', desc: 'Ordered composition suggestions detailing background, clothing, and vibe.', accent: 'square' },
                { title: 'Hinge Emulator', desc: 'Review your complete bio and prompt preview styled exactly like Hinge.', accent: 'triangle' },
              ].map(({ title, desc, accent }, i) => (
                <div key={title} className="bg-white border-4 border-[#121212] p-6 shadow-[6px_6px_0px_0px_#121212] relative flex flex-col justify-between min-h-[160px]">
                  {/* Small geometric accent shape in top right corner */}
                  <div className="absolute top-4 right-4">
                    {accent === 'circle' && <div className="w-4 h-4 rounded-full bg-[#D02020] border-2 border-[#121212]" />}
                    {accent === 'square' && <div className="w-4 h-4 bg-[#1040C0] border-2 border-[#121212] rotate-12" />}
                    {accent === 'triangle' && <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#F0C020] filter drop-shadow-[1px_1px_0px_#121212]" />}
                  </div>

                  <h3 className="font-black text-xl tracking-tighter uppercase mb-2">{title}</h3>
                  <p className="text-[#121212] text-xs font-medium leading-relaxed opacity-95">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final Call To Action ────────────────────────── */}
        <section className="py-20 px-6 bg-white relative overflow-hidden">
          <div className="bg-dot-pattern absolute inset-0 opacity-10" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter text-[#121212] mb-6 leading-none">
              STOP SWIPING WITH <br />
              <span className="text-[#D02020]">A BAD PROFILE.</span>
            </h2>
            <p className="text-lg font-medium text-[#121212] max-w-xl mx-auto mb-10 leading-relaxed">
              Unlock natural conversations and attract matches who like you for who you actually are. Start your 5-minute interview now.
            </p>
            <Link href="/sign-up" className="btn-primary text-lg px-12 py-4 shadow-[6px_6px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-bauhaus">
              Build Your Profile Now
            </Link>
          </div>

          {/* Large decorative shapes in background */}
          <div className="absolute top-1/2 -left-16 w-32 h-32 rounded-full bg-[#1040C0] opacity-20 border-4 border-[#121212] pointer-events-none" />
          <div className="absolute bottom-4 right-12 w-24 h-24 bg-[#D02020] opacity-20 border-4 border-[#121212] rotate-45 pointer-events-none" />
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-[#121212] text-white py-12 px-6 border-t-4 border-[#121212]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-[#D02020] border border-white" />
              <div className="w-4 h-4 bg-[#1040C0] border border-white" />
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#F0C020]" />
            </div>
            <span className="font-black tracking-tighter uppercase text-lg text-white">ProfileCoach</span>
          </div>
          <p className="text-xs text-neutral-400 font-medium tracking-wide">
            BUILT WITH FUNCTIONAL HONESTY • POWERED BY YOUR REAL PERSONALITY.
          </p>
        </div>
      </footer>
    </div>
  );
}
