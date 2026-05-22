'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TICKET_CATEGORIES, formatPrice, SeatCategory } from '@/lib/seats'
import { api } from '@/lib/api'

export default function EventPage() {
  const [dbSeats, setDbSeats] = useState<any[]>([])

  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await api.events.getById(1)
        setDbSeats(res.data.seats)
      } catch (err) {
        console.error(err)
      }
    }
    loadSeats()
  }, [])

  // Merge DB data (price, stock) with UI metadata (perks, colors)
  const mergedCategories = TICKET_CATEGORIES.map(cat => {
    const dbSeat = dbSeats.find(s => s.type === cat.category)
    return {
      ...cat,
      price: dbSeat ? dbSeat.price : cat.price,
      stock: dbSeat ? dbSeat.stock : 0
    }
  })

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[300px] rounded-full bg-rose/4 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/4 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-mono text-[10px] tracking-[0.5em] text-gold/60 mb-4">THE EVENT</p>
          <h1 className="font-display text-6xl md:text-8xl italic text-cream mb-4">Laufey</h1>
          <p className="font-display text-xl tracking-widest text-gold">LIVE IN JAKARTA 2025</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass rounded-3xl p-8">
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">TENTANG KONSER</p>
            <h2 className="font-display text-3xl italic text-cream mb-6">Malam yang Tak Terlupakan</h2>
            <div className="space-y-4 font-body text-cream/70 leading-relaxed text-lg">
              <p>Laufey, musisi jazz-pop Islandia yang telah memikat dunia dengan suara emasnya, hadir pertama kali di Indonesia dalam konser megah di Gelora Bung Karno, Jakarta.</p>
              <p>Dikenal dengan lagu-lagu seperti <em className="text-gold-light">Bewitched</em>, <em className="text-gold-light">From The Start</em>, dan <em className="text-gold-light">Valentine</em>, Laufey akan membawakan malam penuh jazz dan string orchestra.</p>
              <p>Bergabunglah bersama puluhan ribu penonton dalam satu malam yang akan menjadi kenangan seumur hidup.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'TANGGAL', value: 'Sabtu, 15 November 2025', icon: '📅' },
              { label: 'VENUE', value: 'Stadion Utama Gelora Bung Karno', icon: '🏟️' },
              { label: 'ALAMAT', value: 'Jl. Pintu Satu Senayan, Jakarta Pusat 10270', icon: '📍' },
              { label: 'WAKTU', value: 'Pintu Buka 17.00 WIB · Show 19.00 WIB', icon: '⏰' },
              { label: 'KAPASITAS', value: '± 80.000 Penonton', icon: '👥' },
              { label: 'PROMOTOR', value: 'Soundscape Asia', icon: '🎵' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="glass rounded-2xl p-5 flex items-start gap-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-mono text-[9px] tracking-[0.4em] text-gold/60 mb-1">{label}</p>
                  <p className="font-body text-cream text-lg">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 mb-16 text-center">
          <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">KEMUNGKINAN SETLIST</p>
          <h2 className="font-display text-3xl italic text-cream mb-8">Lagu-lagu yang Mungkin Dibawakan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Bewitched','From The Start','Valentine','Let You Break My Heart Again','Haunted','Falling Behind','Serendipity','Beautiful Stranger','Promise','A Night to Remember','Goddess','Mine'].map((song, i) => (
              <div key={song} className="py-3 px-4 rounded-xl border border-gold/15 hover:border-gold/40 hover:bg-gold/5 transition-all cursor-default">
                <span className="font-mono text-[10px] text-gold/40 mr-2">{String(i+1).padStart(2,'0')}</span>
                <span className="font-body text-cream/80 text-sm">{song}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-3">KATEGORI TIKET</p>
            <h2 className="font-display text-4xl italic text-cream">Pilih Kategorimu</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mergedCategories.map(cat => (
              <div key={cat.category} className="rounded-2xl p-6 border transition-all hover:scale-105"
                style={{ background: cat.bgColor, borderColor: cat.borderColor }}>
                <div className="w-3 h-3 rounded-full mb-4" style={{ background: cat.color }} />
                <p className="font-mono text-xs tracking-widest mb-1" style={{ color: cat.color }}>{cat.category}</p>
                <p className="font-display text-2xl text-cream mb-2">{formatPrice(cat.price)}</p>
                <p className="font-body text-cream/60 text-sm mb-4">{cat.description}</p>
                <div className="space-y-1">
                  {cat.perks.slice(0, 3).map(perk => (
                    <p key={perk} className="font-mono text-[10px] text-cream/50 flex items-center gap-2">
                      <span style={{ color: cat.color }}>✓</span> {perk}
                    </p>
                  ))}
                </div>
                {cat.stock === 0 && (
                  <div className="mt-4 p-2 bg-rose/20 text-rose font-mono text-[10px] text-center rounded-lg">
                    HABIS TERJUAL
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/seats"
            className="group inline-flex items-center gap-3 px-14 py-5 bg-gold text-ink font-mono text-sm tracking-[0.3em] rounded-full hover:shadow-[0_0_50px_rgba(201,168,76,0.4)] hover:scale-105 transition-all">
            PILIH KURSI SEKARANG
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
