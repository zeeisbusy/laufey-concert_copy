'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass">
      <Link href="/" className="font-display text-xl tracking-widest text-gold-light">
        LAUFEY
      </Link>
      <div className="flex items-center gap-8 font-mono text-xs tracking-widest text-cream/60">
        <Link href="/" className={`hover:text-gold transition-colors ${pathname === '/' ? 'text-gold' : ''}`}>
          BERANDA
        </Link>
        <Link href="/event" className={`hover:text-gold transition-colors ${pathname === '/event' ? 'text-gold' : ''}`}>
          EVENT
        </Link>
        <Link href="/seats" className={`hover:text-gold transition-colors ${pathname === '/seats' ? 'text-gold' : ''}`}>
          TIKET
        </Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gold/80">{user.email.split('@')[0].toUpperCase()}</span>
            <button onClick={handleLogout} className="px-4 py-2 border border-rose/30 text-rose/70 hover:bg-rose/10 rounded-full transition-all">
              KELUAR
            </button>
          </div>
        ) : (
          <Link href="/login" className="px-6 py-2 bg-gold text-ink rounded-full hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all">
            MASUK
          </Link>
        )}
      </div>
    </nav>
  )
}
