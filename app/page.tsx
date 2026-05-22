'use client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-rose/5 blur-[100px]" style={{animation:'float 7s ease-in-out infinite'}} />
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-cream"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="mb-8 animate-fade-up" style={{animationDelay:'0.1s', opacity:0}}>
          <span className="font-mono text-xs tracking-[0.4em] text-gold border border-gold/30 px-6 py-2 rounded-full bg-gold/5">
            PRESENTED BY SOUNDSCAPE ASIA
          </span>
        </div>

        <div className="relative mb-2 animate-fade-up" style={{animationDelay:'0.2s', opacity:0}}>
          <h1 className="font-display text-[clamp(5rem,18vw,16rem)] leading-[0.85] tracking-[-0.02em] italic text-cream">
            Laufey
          </h1>
        </div>

        <div className="animate-fade-up" style={{animationDelay:'0.35s', opacity:0}}>
          <p className="font-display text-[clamp(0.8rem,3vw,1.4rem)] tracking-[0.3em] text-gold-light mb-1">
            LIVE IN CONCERT
          </p>
          <p className="font-mono text-sm tracking-[0.5em] text-cream/40">JAKARTA · INDONESIA</p>
        </div>

        <div className="my-10 flex items-center gap-4 animate-fade-up" style={{animationDelay:'0.45s', opacity:0}}>
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold/60" />
          <div className="w-2 h-2 rounded-full bg-gold/60 rotate-45" />
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 mb-12 animate-fade-up" style={{animationDelay:'0.55s', opacity:0}}>
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-1">TANGGAL</p>
            <p className="font-display text-2xl text-cream">15 November 2025</p>
          </div>
          <div className="w-px h-10 bg-gold/20" />
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-1">VENUE</p>
            <p className="font-display text-2xl text-cream">Gelora Bung Karno</p>
          </div>
          <div className="w-px h-10 bg-gold/20" />
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-1">MULAI</p>
            <p className="font-display text-2xl text-cream">19.00 WIB</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{animationDelay:'0.65s', opacity:0}}>
          <Link href="/seats"
            className="group relative px-12 py-4 bg-gold text-ink font-mono text-sm tracking-[0.3em] rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-105">
            <span className="relative z-10">BELI TIKET</span>
            <div className="absolute inset-0 bg-gold-light translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>
          <Link href="/event"
            className="px-12 py-4 border border-gold/40 text-gold font-mono text-sm tracking-[0.3em] rounded-full hover:bg-gold/10 transition-all">
            INFO EVENT
          </Link>
        </div>

        <CountdownTimer />
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="font-display italic text-cream/30 text-sm">
          &ldquo;bewitched, bothered and bewildered am i&rdquo;
        </p>
      </div>
    </div>
  )
}

function CountdownTimer() {
  const targetDate = new Date('2025-11-15T19:00:00+07:00')
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  const days = Math.max(0, Math.floor(diff / (1000*60*60*24)))
  const hours = Math.max(0, Math.floor((diff % (1000*60*60*24)) / (1000*60*60)))
  const minutes = Math.max(0, Math.floor((diff % (1000*60*60)) / (1000*60)))

  return (
    <div className="mt-16 animate-fade-up" style={{animationDelay:'0.75s', opacity:0}}>
      <p className="font-mono text-[10px] tracking-[0.5em] text-cream/30 mb-4">HITUNG MUNDUR</p>
      <div className="flex gap-6">
        {[{val:days,label:'HARI'},{val:hours,label:'JAM'},{val:minutes,label:'MENIT'}].map(({val,label}) => (
          <div key={label} className="text-center">
            <div className="w-16 h-16 glass rounded-xl flex items-center justify-center mb-1">
              <span className="font-display text-2xl text-gold">{String(val).padStart(2,'0')}</span>
            </div>
            <p className="font-mono text-[9px] tracking-widest text-cream/30">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}