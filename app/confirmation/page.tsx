'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TICKET_CATEGORIES, formatPrice, SeatCategory } from '@/lib/seats'
import { SeatData } from '@/components/GBKMap'

const CAT_COLORS: Record<SeatCategory, string> = {
  VVIP: '#C9A84C', VIP: '#9B7EC8', Festival: '#5B9BD5', Regular: '#6BA896',
}

const PAYMENT_LABELS: Record<string, string> = {
  bca: 'BCA Virtual Account', mandiri: 'Mandiri Virtual Account', bni: 'BNI Virtual Account',
  gopay: 'GoPay', ovo: 'OVO', dana: 'DANA', qris: 'QRIS', cc: 'Kartu Kredit/Debit',
}

interface OrderData {
  orderId: string
  seats: (SeatData & { price: number })[]
  total: number
  grandTotal: number
  form: { name: string; email: string; phone: string; idNumber: string; address: string; city: string; province: string; postal: string }
  paymentMethod: string
  orderDate: string
}

function ConfirmationContent() {
  const params = useSearchParams()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    try {
      const orderData = params.get('order')
      if (orderData) {
        setOrder(JSON.parse(decodeURIComponent(orderData)))
        setTimeout(() => setShowAnimation(true), 100)
      }
    } catch (e) {}
  }, [params])

  if (!order) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-gold animate-pulse mb-4">MEMUAT KONFIRMASI...</p>
        <Link href="/" className="font-mono text-xs text-cream/40 hover:text-cream">← Kembali ke Beranda</Link>
      </div>
    </div>
  )

  const paymentDeadline = new Date(new Date(order.orderDate).getTime() + 24 * 60 * 60 * 1000)

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gold/5 blur-[150px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4 max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
            <svg className="w-12 h-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-mono text-[10px] tracking-[0.5em] text-gold/60 mb-2">PESANAN BERHASIL</p>
          <h1 className="font-display text-5xl md:text-6xl italic text-cream mb-3">Selamat! 🎵</h1>
          <p className="font-body text-cream/60 text-lg">Tiket kamu sudah dikonfirmasi. Sampai jumpa di konser!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`transition-all duration-700 delay-100 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="rounded-3xl overflow-hidden border border-gold/30" style={{background:'linear-gradient(135deg, #1A1208 0%, #0D0A05 100%)'}}>
              <div className="bg-gradient-to-r from-gold/20 to-transparent p-6 border-b border-gold/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.4em] text-gold/60">E-TICKET</p>
                    <p className="font-display text-3xl italic text-cream mt-1">Laufey</p>
                    <p className="font-mono text-[10px] tracking-widest text-gold">LIVE IN JAKARTA</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[9px] tracking-widest text-cream/40">ORDER ID</p>
                    <p className="font-mono text-sm text-gold">{order.orderId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'TANGGAL', val: '15 November 2025' },
                    { label: 'WAKTU', val: '19.00 WIB' },
                    { label: 'VENUE', val: 'Stadion Utama GBK' },
                    { label: 'JUMLAH', val: `${order.seats.length} Tiket` },
                  ].map(({ label, val }) => (
                    <div key={label}>
                      <p className="font-mono text-[9px] tracking-widest text-cream/40 mb-1">{label}</p>
                      <p className="font-body text-cream text-sm">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-[#0D0A05] -ml-2.5 border-r border-gold/20" />
                <div className="flex-1 border-t border-dashed border-gold/20" />
                <div className="w-5 h-5 rounded-full bg-[#0D0A05] -mr-2.5 border-l border-gold/20" />
              </div>

              <div className="p-6">
                <p className="font-mono text-[9px] tracking-widest text-cream/40 mb-3">TIKET YANG DIPESAN</p>
                <div className="space-y-2 mb-4">
                  {order.seats.map(seat => {
                    return (
                      <div key={seat.id} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[seat.category] }} />
                          <span className="font-mono text-xs text-cream">{seat.category}</span>
                        </div>
                        <span className="font-body text-sm text-cream/70">{formatPrice(seat.price || 0)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-center py-4">
                  <div className="text-center">
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(40)].map((_, i) => (
                        <div key={i} className="bg-cream/80" style={{ width: i % 3 === 0 ? '2px' : '1px', height: '40px' }} />
                      ))}
                    </div>
                    <p className="font-mono text-[9px] text-cream/30 tracking-widest">{order.orderId}</p>
                  </div>
                </div>
                <p className="text-center font-mono text-[9px] text-cream/30 tracking-widest">TUNJUKKAN TIKET INI SAAT MASUK VENUE</p>
              </div>
            </div>
          </div>

          <div className={`space-y-4 transition-all duration-700 delay-200 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="glass rounded-2xl p-5">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">DATA PEMESAN</p>
              <div className="space-y-3">
                {[
                  { label: 'NAMA', value: order.form.name },
                  { label: 'EMAIL', value: order.form.email },
                  { label: 'NO. HP', value: order.form.phone },
                  { label: 'NIK', value: order.form.idNumber.replace(/(.{4})/g, '$1 ').trim() },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between">
                    <span className="font-mono text-[9px] tracking-widest text-cream/40">{label}</span>
                    <span className="font-body text-sm text-cream/80 text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">INFORMASI PEMBAYARAN</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] tracking-widest text-cream/40">METODE</span>
                  <span className="font-body text-sm text-cream/80">{PAYMENT_LABELS[order.paymentMethod]}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between font-body text-cream/50 text-xs">
                    <span>Subtotal ({order.seats.length} tiket)</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between font-body text-cream/50 text-xs">
                    <span>Biaya Layanan (5%)</span>
                    <span>{formatPrice(order.grandTotal - order.total)}</span>
                  </div>
                </div>
                <div className="flex justify-between pt-3 mt-1 border-t border-gold/20">
                  <span className="font-mono text-xs tracking-widest text-gold/60">TOTAL BAYAR</span>
                  <span className="font-display text-2xl text-cream">{formatPrice(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5 border border-rose/30 bg-rose/5">
              <p className="font-mono text-[10px] tracking-[0.4em] text-rose/80 mb-2">⚠️ BATAS PEMBAYARAN</p>
              <p className="font-body text-cream/80 text-sm mb-1">Selesaikan pembayaran sebelum:</p>
              <p className="font-display text-lg text-rose">
                {paymentDeadline.toLocaleDateString('id-ID', { dateStyle: 'long' })} pukul {paymentDeadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 border border-gold/40 text-gold font-mono text-xs tracking-widest rounded-full hover:bg-gold/10 transition-all">
                UNDUH TIKET
              </button>
              <Link href="/" className="flex-1 py-3 bg-gold/10 text-cream font-mono text-xs tracking-widest rounded-full hover:bg-gold/20 transition-all text-center">
                KE BERANDA
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="font-display italic text-cream/25 text-xl">&ldquo;Thank you for choosing to spend this evening with me&rdquo;</p>
          <p className="font-mono text-[10px] tracking-widest text-cream/15 mt-2">— Laufey</p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center"><p className="font-mono text-gold animate-pulse">MEMUAT...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  )
}