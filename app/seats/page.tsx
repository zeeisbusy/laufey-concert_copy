'use client'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GBKMap, { SeatData } from '@/components/GBKMap'
import { formatPrice, SeatCategory } from '@/lib/seats'
import { api } from '@/lib/api'

const CAT_COLORS: Record<SeatCategory, string> = {
  VVIP: '#C9A84C', VIP: '#9B7EC8', Festival: '#5B9BD5', Regular: '#6BA896',
}

const CAT_BG_COLORS: Record<SeatCategory, string> = {
  VVIP: 'rgba(201,168,76,0.12)', 
  VIP: 'rgba(155,126,200,0.12)', 
  Festival: 'rgba(91,155,213,0.12)', 
  Regular: 'rgba(107,168,150,0.12)',
}

const TAKEN_SEATS = new Set<string>(['VVIP-A-3','VVIP-A-7','VVIP-B-5','VIP-N1-4','VIP-N1-8','FES-E1-10','REG-N-20'])

export default function SeatsPage() {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([])
  const [qty, setQty] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await api.events.getById(1)
        setEvent(res.data)
        const initialQty: Record<string, number> = {}
        res.data.seats.forEach((s: any) => initialQty[s.type] = 0)
        setQty(initialQty)
      } catch (err) {
        console.error('Failed to load event', err)
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [])

  const handleSeatSelect = (seat: SeatData) => {
    if (selectedSeats.length >= 8) return
    if (!selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(prev => [...prev, seat])
      setQty(prev => ({ ...prev, [seat.category]: (prev[seat.category] || 0) + 1 }))
    }
  }

  const handleSeatDeselect = (id: string) => {
    const seat = selectedSeats.find(s => s.id === id)
    if (!seat) return
    setSelectedSeats(prev => prev.filter(s => s.id !== id))
    setQty(prev => ({ ...prev, [seat.category]: Math.max(0, (prev[seat.category] || 0) - 1) }))
  }

  const totalPrice = useMemo(() =>
    selectedSeats.reduce((sum, seat) => {
      const seatInfo = event?.seats.find((s: any) => s.type === seat.category)
      return sum + (seatInfo?.price || 0)
    }, 0)
  , [selectedSeats, event])

  const handleQtyChange = (category: string, delta: number) => {
    const currentQty = qty[category] || 0
    const newQty = Math.max(0, Math.min(8, currentQty + delta))
    const diff = newQty - currentQty
    
    if (diff > 0) {
      const seatInfo = event?.seats.find((s: any) => s.type === category)
      const newSeat: SeatData = {
        id: `${category}-manual-${Date.now()}-${Math.random()}`,
        category: category as SeatCategory,
        label: `${category} Ticket`,
        section: `${category}-AUTO`,
      }
      handleSeatSelect(newSeat)
    } else if (diff < 0) {
      const last = [...selectedSeats].reverse().find(s => s.category === category)
      if (last) handleSeatDeselect(last.id)
    }
  }

  const handleCheckout = () => {
    if (selectedSeats.length === 0) return
    
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=/seats')
      return
    }

    const params = new URLSearchParams()
    // Map selected seats to their database seat IDs
    const seatsToOrder = selectedSeats.map(s => {
      const seatInfo = event?.seats.find((es: any) => es.type === s.category)
      return { ...s, dbId: seatInfo?.id, price: seatInfo?.price || 0 }
    })
    
    params.set('seats', JSON.stringify(seatsToOrder))
    params.set('total', String(totalPrice))
    router.push(`/checkout?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="font-mono text-gold animate-pulse">MEMUAT DATA KONSER...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[300px] rounded-full bg-gold/4 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] tracking-[0.5em] text-gold/60 mb-3">PILIH KURSI</p>
          <h1 className="font-display text-5xl italic text-cream mb-2">{event?.title || 'Gelora Bung Karno'}</h1>
          <p className="font-body text-cream/50">Klik zona pada peta untuk memilih kursi · Maksimal 8 tiket</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-4 md:p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {(Object.entries(CAT_COLORS) as [SeatCategory, string][]).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                    <span className="font-mono text-[10px] tracking-widest text-cream/60">{cat}</span>
                  </div>
                ))}
              </div>
              <GBKMap selectedSeats={selectedSeats} onSeatSelect={handleSeatSelect} onSeatDeselect={handleSeatDeselect} takenSeats={TAKEN_SEATS} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">PILIH JUMLAH TIKET</p>
              <div className="space-y-3">
                {event?.seats.map((cat: any) => (
                  <div key={cat.id} className="rounded-xl p-4 border transition-all"
                    style={{ 
                      borderColor: qty[cat.type] > 0 ? CAT_COLORS[cat.type as SeatCategory] : 'rgba(255,255,255,0.1)', 
                      background: qty[cat.type] > 0 ? CAT_BG_COLORS[cat.type as SeatCategory] : 'transparent' 
                    }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs tracking-widest" style={{ color: CAT_COLORS[cat.type as SeatCategory] }}>{cat.type}</span>
                        <p className="font-body text-cream/60 text-xs">{formatPrice(cat.price)}</p>
                        <p className={`font-mono text-[9px] mt-1 ${cat.stock < 10 ? 'text-rose' : 'text-cream/30'}`}>
                          STOK: {cat.stock} {cat.stock === 0 ? '(HABIS)' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleQtyChange(cat.type, -1)}
                          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-cream hover:border-gold hover:text-gold transition-all">−</button>
                        <span className="font-mono text-lg text-cream w-4 text-center">{qty[cat.type] || 0}</span>
                        <button onClick={() => handleQtyChange(cat.type, 1)} disabled={cat.stock <= (qty[cat.type] || 0)}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                            cat.stock <= (qty[cat.type] || 0) ? 'border-white/5 text-white/10' : 'border-white/20 text-cream hover:border-gold hover:text-gold'
                          }`}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">TIKET DIPILIH</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedSeats.map(seat => {
                    const catInfo = event?.seats.find((s: any) => s.type === seat.category)
                    if (!catInfo) return null
                    
                    return (
                      <div key={seat.id} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[seat.category] }} />
                          <div>
                            <p className="font-mono text-xs text-cream">{seat.category}</p>
                            <p className="font-mono text-[9px] text-cream/40">{seat.section}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-body text-sm text-cream/70">{formatPrice(catInfo.price)}</span>
                          <button onClick={() => handleSeatDeselect(seat.id)} className="text-cream/30 hover:text-rose transition-colors">×</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-5">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">RINGKASAN</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between font-body text-cream/60 text-sm">
                  <span>Jumlah Tiket</span><span>{selectedSeats.length} tiket</span>
                </div>
                <div className="flex justify-between font-body text-cream/60 text-sm">
                  <span>Biaya Layanan (5%)</span><span>{formatPrice(Math.round(totalPrice * 0.05))}</span>
                </div>
                <div className="h-px bg-gold/20 my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs tracking-widest text-gold/60">TOTAL</span>
                  <span className="font-display text-2xl text-cream">{formatPrice(Math.round(totalPrice * 1.05))}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-full font-mono text-sm tracking-[0.3em] transition-all ${
                  selectedSeats.length > 0 ? 'bg-gold text-ink hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-[1.02]' : 'bg-white/10 text-cream/30 cursor-not-allowed'
                }`}>
                {selectedSeats.length > 0 ? 'LANJUT PEMBELIAN' : 'PILIH KURSI DULU'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
