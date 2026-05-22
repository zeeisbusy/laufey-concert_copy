'use client'
import { useState, useEffect, Suspense, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { formatPrice, SeatCategory } from '@/lib/seats'
import { SeatData } from '@/components/GBKMap'
import { api } from '@/lib/api'

const CAT_COLORS: Record<SeatCategory, string> = {
  VVIP: '#C9A84C', VIP: '#9B7EC8', Festival: '#5B9BD5', Regular: '#6BA896',
}

const PAYMENT_METHODS = [
  { id: 'bca', label: 'BCA Virtual Account', icon: '🏦' },
  { id: 'mandiri', label: 'Mandiri Virtual Account', icon: '🏦' },
  { id: 'bni', label: 'BNI Virtual Account', icon: '🏦' },
  { id: 'gopay', label: 'GoPay', icon: '💚' },
  { id: 'ovo', label: 'OVO', icon: '💜' },
  { id: 'dana', label: 'DANA', icon: '💙' },
  { id: 'qris', label: 'QRIS', icon: '📱' },
  { id: 'cc', label: 'Kartu Kredit/Debit', icon: '💳' },
]

function CheckoutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [seats, setSeats] = useState<(SeatData & { dbId: number, price: number })[]>([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', idNumber: '', address: '', city: '', province: '', postal: '' })

  useEffect(() => {
    try {
      const seatsData = params.get('seats')
      const totalData = params.get('total')
      if (seatsData) setSeats(JSON.parse(seatsData))
      if (totalData) setTotal(Number(totalData))
    } catch (e) {}
  }, [params])

  const serviceFee = Math.round(total * 0.05)
  const grandTotal = total + serviceFee

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Nama harus diisi'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email tidak valid'
    if (!form.phone.match(/^(\+62|0)[0-9]{9,12}$/)) newErrors.phone = 'Nomor HP tidak valid'
    if (!form.idNumber.match(/^[0-9]{16}$/)) newErrors.idNumber = 'NIK harus 16 digit'
    if (!paymentMethod) newErrors.payment = 'Pilih metode pembayaran'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    
    try {
      // Group seats by dbId
      const grouped = seats.reduce((acc: any, seat) => {
        acc[seat.dbId] = (acc[seat.dbId] || 0) + 1
        return acc
      }, {})

      const orderResults = []
      // Call API for each group
      for (const [seatId, quantity] of Object.entries(grouped)) {
        const res = await api.orders.create({ seatId: Number(seatId), quantity })
        orderResults.push(res.data)
      }

      const orderData = {
        orderId: 'LFY-' + Date.now().toString(36).toUpperCase(),
        seats, total, grandTotal, form, paymentMethod,
        orderDate: new Date().toISOString(),
        dbOrders: orderResults
      }
      
      router.push(`/confirmation?order=${encodeURIComponent(JSON.stringify(orderData))}`)
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat pemesanan')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) => `w-full bg-white/5 border ${errors[field] ? 'border-rose' : 'border-white/10 focus:border-gold/50'} rounded-xl px-4 py-3 font-body text-cream text-base outline-none transition-all placeholder:text-cream/25`

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]" />
      <div className="relative z-10 pt-24 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] tracking-[0.5em] text-gold/60 mb-3">LANGKAH 2 DARI 2</p>
          <h1 className="font-display text-5xl italic text-cream mb-2">Data Pembelian</h1>
          <p className="font-body text-cream/50">Lengkapi data diri dan pilih metode pembayaran</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass rounded-3xl p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-6">DATA DIRI PEMESAN</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5">NAMA LENGKAP *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass('name')} placeholder="Sesuai KTP" />
                  {errors.name && <p className="text-rose text-xs mt-1 font-mono">{errors.name}</p>}
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5">EMAIL *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass('email')} placeholder="email@kamu.com" />
                  {errors.email && <p className="text-rose text-xs mt-1 font-mono">{errors.email}</p>}
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5">NOMOR HP *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass('phone')} placeholder="08xxxxxxxxxx" />
                  {errors.phone && <p className="text-rose text-xs mt-1 font-mono">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5">NIK (KTP) *</label>
                  <input value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})} className={inputClass('idNumber')} placeholder="16 digit NIK" maxLength={16} />
                  {errors.idNumber && <p className="text-rose text-xs mt-1 font-mono">{errors.idNumber}</p>}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-6">METODE PEMBAYARAN</p>
              {errors.payment && <p className="text-rose text-xs mb-4 font-mono">{errors.payment}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${paymentMethod === pm.id ? 'border-gold bg-gold/10 scale-[1.02]' : 'border-white/10 hover:border-gold/30'}`}>
                    <div className="text-2xl mb-1">{pm.icon}</div>
                    <p className="font-mono text-[9px] text-cream/70 leading-tight">{pm.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass rounded-2xl p-5 sticky top-24">
              <p className="font-mono text-[10px] tracking-[0.4em] text-gold/60 mb-4">RINGKASAN PESANAN</p>
              <div className="pb-4 mb-4 border-b border-white/10">
                <p className="font-display text-xl italic text-cream">Laufey Live in Jakarta</p>
                <p className="font-mono text-[10px] text-cream/40 tracking-widest mt-1">15 NOV 2025 · GBK</p>
              </div>
              <div className="space-y-2 mb-4">
                {seats.map(seat => {
                  return (
                    <div key={seat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: CAT_COLORS[seat.category] }} />
                        <span className="font-mono text-xs text-cream/70">{seat.category}</span>
                      </div>
                      <span className="font-body text-sm text-cream/70">{formatPrice(seat.price)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-2 pt-4 border-t border-white/10 mb-6">
                <div className="flex justify-between font-body text-cream/60 text-sm">
                  <span>Subtotal ({seats.length} tiket)</span><span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-body text-cream/60 text-sm">
                  <span>Biaya layanan (5%)</span><span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gold/20">
                  <span className="font-mono text-xs tracking-widest text-gold/60">TOTAL</span>
                  <span className="font-display text-2xl text-cream">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={loading}
                className={`w-full py-4 rounded-full font-mono text-sm tracking-[0.3em] transition-all ${loading ? 'bg-gold/50 text-ink/50 cursor-wait' : 'bg-gold text-ink hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] hover:scale-[1.02]'}`}>
                {loading ? 'MEMPROSES...' : 'BAYAR SEKARANG'}
              </button>
              <p className="text-center font-mono text-[9px] text-cream/25 mt-3">🔒 TRANSAKSI AMAN & TERENKRIPSI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center"><p className="font-mono text-gold animate-pulse">MEMUAT...</p></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
