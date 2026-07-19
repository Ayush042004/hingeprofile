'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden px-3 pt-28 pb-28 sm:pt-36 lg:px-4">
      {/* Subtle architectural dot grid for neo-brutalist texture */}
      <div className="dotted-bg pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 grid max-w-none gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left: headline + tagline */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
          {/* Neo-brutalist tag pill */}
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-ink bg-highlight px-3.5 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-ink shadow-brutal-sm">
            <span className="h-2 w-2 rounded-full bg-ink" />
            AI Profile Engine v1.0
          </div>

          <h1 className="font-display text-[20vw] font-extrabold leading-[0.90] tracking-tight text-ink sm:text-[14vw] lg:text-[9vw]">
            Hinge-
            <br />
            Profiler
          </h1>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:gap-6 md:gap-8 lg:mt-12 lg:gap-10">
            {/* Left side: eyes icon + Less Forms / More Conversations */}
            <div className="shrink-0">
              {/* eyes icon */}
              <div className="mb-6 h-10 w-12 transition-transform duration-300 hover:scale-110" data-slot="icon-eyes">
                <svg viewBox="0 0 48 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-ink">
                  <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="3" />
                  <circle cx="14" cy="14" r="2.5" fill="currentColor" />
                  <circle cx="34" cy="14" r="7" stroke="currentColor" strokeWidth="3" />
                  <circle cx="34" cy="14" r="2.5" fill="currentColor" />
                  <path d="M14 28C18 33 30 33 34 28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>

              <p className="font-display text-2xl font-extrabold uppercase leading-[1.05] text-ink sm:text-4xl">
                Less
                <br />
                Forms.
              </p>
              <p className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.1] text-ink sm:text-4xl">
                More
                <br />
                <span className="mt-1 inline-block border-2 border-ink bg-[#C6FF4D] px-2.5 py-0.5 shadow-brutal-sm">
                  Conversations.
                </span>
              </p>
            </div>

            {/* Right side of left column: giant speech bubble SVG */}
            <div className="mt-8 flex items-center justify-center sm:mt-0 sm:justify-start translate-x-15 -translate-y-30" data-slot="graphic-speech-bubble">
              <svg
                width="512"
                height="512"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-[550px] lg:w-[550px] xl:h-[550px] xl:w-[550px] filter drop-shadow-[8px_8px_0px_#0c0b09] transition-all duration-300 hover:-translate-x-1.5 hover:-translate-y-1.5 hover:drop-shadow-[14px_14px_0px_#0c0b09]"
              >
                {/* Solid Black Outline / Shadow behind bubble */}
                <path
                  d="M256 48C144.2 48 56 131.2 56 236C56 340.8 144.2 424 256 424C282.3 424 307.4 419.6 330.8 411.4L394 464L381.2 392.7C430.8 358.3 456 300.9 456 236C456 131.2 367.8 48 256 48Z"
                  stroke="#0c0b09"
                  strokeWidth="26"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Chat Bubble Lime Path */}
                <path
                  d="M256 48C144.2 48 56 131.2 56 236C56 340.8 144.2 424 256 424C282.3 424 307.4 419.6 330.8 411.4L394 464L381.2 392.7C430.8 358.3 456 300.9 456 236C456 131.2 367.8 48 256 48Z"
                  stroke="#C6FF4D"
                  strokeWidth="16"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Typing Dots with crisp black stroke */}
                <circle cx="188" cy="236" r="16" fill="#0c0b09" />
                <circle cx="188" cy="236" r="13" fill="#C6FF4D" />
                <circle cx="256" cy="236" r="16" fill="#0c0b09" />
                <circle cx="256" cy="236" r="13" fill="#C6FF4D" />
                <circle cx="324" cy="236" r="16" fill="#0c0b09" />
                <circle cx="324" cy="236" r="13" fill="#C6FF4D" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Right: collage of interview/profile cards — neo-brutalist hard shadows and borders */}
        <div className="relative min-h-[560px] w-full sm:min-h-[720px] lg:min-h-[780px] xl:min-h-[840px]" data-slot="hero-collage">
          {/* Card 1: AI Interview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="absolute top-0 left-0 z-10 w-[310px] sm:w-[380px] lg:top-4 lg:left-4 lg:w-[420px] xl:w-[460px] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
          >
            <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full drop-shadow-[5px_5px_0px_#0c0b09] hover:drop-shadow-[10px_10px_0px_#0c0b09] transition-all">
              {/* Hard Black Shadow Block */}
              <rect x="18" y="18" width="384" height="304" rx="24" fill="#0c0b09" />

              {/* Card with Thick Black Border */}
              <rect x="10" y="10" width="384" height="304" rx="24" fill="white" stroke="#0c0b09" strokeWidth="3" />

              {/* Title */}
              <text x="34" y="44" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700" fill="#74C53A">
                AI Interview
              </text>

              {/* Three dots */}
              <circle cx="354" cy="38" r="3" fill="#0c0b09" />
              <circle cx="364" cy="38" r="3" fill="#0c0b09" />
              <circle cx="374" cy="38" r="3" fill="#0c0b09" />

              {/* AI Bubble with sharp outline */}
              <rect x="34" y="66" width="190" height="84" rx="18" fill="#F6F6F6" stroke="#0c0b09" strokeWidth="2" />

              <text x="52" y="96" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="#111">
                What&apos;s your
              </text>

              <text x="52" y="118" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="#111">
                ideal weekend?
              </text>

              <text x="176" y="136" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#777">
                10:42 AM
              </text>

              {/* User Bubble with sharp outline */}
              <rect x="142" y="182" width="238" height="94" rx="18" fill="#DDFD8B" stroke="#0c0b09" strokeWidth="2" />

              <text x="160" y="214" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="#111">
                Coffee.
              </text>

              <text x="160" y="236" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="#111">
                Bookstore.
              </text>

              <text x="160" y="258" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" fill="#111">
                Late night drive.
              </text>

              <text x="300" y="264" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#555">
                10:43 AM ✓✓
              </text>
            </svg>
          </motion.div>

          {/* Card 2: Generated Prompt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 12 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="absolute top-4 left-[190px] z-20 w-[310px] sm:top-6 sm:left-[270px] sm:w-[380px] lg:top-6 lg:left-[290px] lg:w-[420px] xl:left-[340px] xl:w-[460px] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
          >
            <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full drop-shadow-[5px_5px_0px_#0c0b09] hover:drop-shadow-[10px_10px_0px_#0c0b09] transition-all">
              {/* Hard Black Shadow Block */}
              <rect x="18" y="18" width="388" height="288" rx="24" fill="#0c0b09" />

              {/* Card with Thick Black Border */}
              <rect x="10" y="10" width="388" height="288" rx="24" fill="white" stroke="#0c0b09" strokeWidth="3" />

              {/* Header with black border */}
              <circle cx="42" cy="42" r="7" fill="#C6FF4D" stroke="#0c0b09" strokeWidth="2" />

              <text x="58" y="46" fontFamily="Inter, Arial, sans-serif" fontSize="15" fontWeight="700" fill="#111111">
                Generated Prompt
              </text>

              <circle cx="364" cy="40" r="3" fill="#0c0b09" />
              <circle cx="374" cy="40" r="3" fill="#0c0b09" />
              <circle cx="384" cy="40" r="3" fill="#0c0b09" />

              {/* Divider */}
              <line x1="34" y1="66" x2="374" y2="66" stroke="#0c0b09" strokeWidth="2" />

              {/* Label */}
              <text x="34" y="95" fontFamily="Inter, Arial, sans-serif" fontSize="14" fontWeight="600" fill="#33">
                We&apos;ll get along if...
              </text>

              {/* Prompt Card with black outline */}
              <rect x="34" y="112" width="320" height="110" rx="22" fill="#F6F6F6" stroke="#0c0b09" strokeWidth="2" />

              <text x="54" y="150" fontFamily="Inter, Arial, sans-serif" fontSize="24" fontWeight="800" fill="#111">
                you think terrible
              </text>

              <text x="54" y="182" fontFamily="Inter, Arial, sans-serif" fontSize="24" fontWeight="800" fill="#111">
                puns deserve
              </text>

              <text x="54" y="214" fontFamily="Inter, Arial, sans-serif" fontSize="24" fontWeight="800" fill="#111">
                a second chance.
              </text>

              {/* Heart Icon */}
              <path
                d="M330 250 C330 242 336 238 342 238 C347 238 350 241 352 244 C354 241 357 238 362 238 C368 238 374 242 374 250 C374 259 364 267 352 276 C340 267 330 259 330 250Z"
                stroke="#0c0b09"
                strokeWidth="3"
                fill="#C6FF4D"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Card 3: Personality Snapshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="absolute top-[240px] left-0 z-20 w-[310px] sm:top-[290px] sm:left-[10px] sm:w-[380px] lg:top-[300px] lg:left-[10px] lg:w-[420px] xl:top-[320px] xl:left-[20px] xl:w-[460px] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
          >
            <svg viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full drop-shadow-[5px_5px_0px_#0c0b09] hover:drop-shadow-[10px_10px_0px_#0c0b09] transition-all">
              {/* Hard Black Shadow Block */}
              <rect x="18" y="18" width="388" height="288" rx="24" fill="#0c0b09" />

              {/* Card with Thick Black Border */}
              <rect x="10" y="10" width="388" height="288" rx="24" fill="white" stroke="#0c0b09" strokeWidth="3" />

              <circle cx="40" cy="42" r="7" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="2" />
              <text x="56" y="47" fontFamily="Arial" fontSize="15" fontWeight="800" fill="#111">
                Personality
              </text>
              <circle cx="364" cy="40" r="3" fill="#0c0b09" />
              <circle cx="374" cy="40" r="3" fill="#0c0b09" />
              <circle cx="384" cy="40" r="3" fill="#0c0b09" />
              <line x1="34" y1="66" x2="364" y2="66" stroke="#0c0b09" strokeWidth="2" />
              <g fontFamily="Arial">
                <text x="34" y="100" fontSize="15" fontWeight="800">
                  Humor
                </text>
                <text x="345" y="100" textAnchor="end" fontSize="14" fontWeight="700" fill="#111">
                  9.1
                </text>
                <rect x="34" y="113" width="320" height="10" rx="99" fill="#ECECEC" stroke="#0c0b09" strokeWidth="1.5" />
                <rect x="34" y="113" width="291" height="10" rx="99" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="1.5" />

                <text x="34" y="148" fontSize="15" fontWeight="800">
                  Curiosity
                </text>
                <text x="345" y="148" textAnchor="end" fontSize="14" fontWeight="700" fill="#111">
                  8.2
                </text>
                <rect x="34" y="161" width="320" height="10" rx="99" fill="#ECECEC" stroke="#0c0b09" strokeWidth="1.5" />
                <rect x="34" y="161" width="262" height="10" rx="99" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="1.5" />

                <text x="34" y="196" fontSize="15" fontWeight="800">
                  Adventure
                </text>
                <text x="345" y="196" textAnchor="end" fontSize="14" fontWeight="700" fill="#111">
                  6.4
                </text>
                <rect x="34" y="209" width="320" height="10" rx="99" fill="#ECECEC" stroke="#0c0b09" strokeWidth="1.5" />
                <rect x="34" y="209" width="205" height="10" rx="99" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="1.5" />

                <text x="34" y="244" fontSize="15" fontWeight="800">
                  Thoughtfulness
                </text>
                <text x="345" y="244" textAnchor="end" fontSize="14" fontWeight="700" fill="#111">
                  8.8
                </text>
                <rect x="34" y="257" width="320" height="10" rx="99" fill="#ECECEC" stroke="#0c0b09" strokeWidth="1.5" />
                <rect x="34" y="257" width="282" height="10" rx="99" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="1.5" />

                <text x="34" y="294" fontSize="12" fontWeight="600" fill="#555">
                  Generated after interview
                </text>
              </g>
            </svg>
          </motion.div>

          {/* Card 4: Confidence Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 14 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="absolute top-[260px] left-[180px] z-20 w-[270px] sm:top-[310px] sm:left-[260px] sm:w-[340px] lg:top-[320px] lg:left-[300px] lg:w-[380px] xl:top-[340px] xl:left-[350px] xl:w-[420px] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
          >
            <svg viewBox="0 0 320 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full drop-shadow-[5px_5px_0px_#0c0b09] hover:drop-shadow-[10px_10px_0px_#0c0b09] transition-all">
              {/* Hard Black Shadow Block */}
              <rect x="18" y="18" width="288" height="268" rx="24" fill="#0c0b09" />

              {/* Card with Thick Black Border */}
              <rect x="10" y="10" width="288" height="268" rx="24" fill="white" stroke="#0c0b09" strokeWidth="3" />

              <circle cx="38" cy="42" r="7" fill="#C8FF4D" stroke="#0c0b09" strokeWidth="2" />
              <text x="54" y="47" fontFamily="Inter" fontSize="15" fontWeight="800" fill="#111">
                Confidence Score
              </text>
              <circle cx="272" cy="40" r="3" fill="#0c0b09" />
              <circle cx="282" cy="40" r="3" fill="#0c0b09" />
              <circle cx="292" cy="40" r="3" fill="#0c0b09" />
              <line x1="30" y1="68" x2="290" y2="68" stroke="#0c0b09" strokeWidth="2" />

              <circle cx="160" cy="165" r="68" stroke="#ECECEC" strokeWidth="16" />
              <circle
                cx="160"
                cy="165"
                r="68"
                stroke="#C8FF4D"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="427"
                strokeDashoffset="38"
                transform="rotate(-90 160 165)"
              />
              <circle cx="160" cy="165" r="60" stroke="#0c0b09" strokeWidth="2" fill="none" opacity="0.1" />

              <text x="160" y="160" textAnchor="middle" fontFamily="Inter" fontSize="50" fontWeight="800" fill="#111">
                91
              </text>
              <text x="160" y="186" textAnchor="middle" fontFamily="Inter" fontSize="15" fontWeight="600" fill="#555">
                Confidence
              </text>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
