'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegister) {
        await api.auth.register({ email, password })
        setIsRegister(false)
        setError('Registrasi berhasil! Silakan login.')
      } else {
        const res = await api.auth.login({ email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push('/seats')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <Navbar />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0D0A05] via-[#1A1208] to-[#0D0A05]" />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl italic text-cream mb-2">
              {isRegister ? 'Buat Akun' : 'Selamat Datang'}
            </h1>
            <p className="font-body text-cream/50 text-sm">
              {isRegister ? 'Daftar untuk mulai memesan tiket' : 'Masuk untuk mengelola pesanan kamu'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className={`p-4 rounded-xl text-xs font-mono text-center ${error.includes('berhasil') ? 'bg-gold/10 text-gold' : 'bg-rose/10 text-rose'}`}>
                {error}
              </div>
            )}

            <div>
              <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5 uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3 font-body text-cream outline-none transition-all"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-widest text-cream/50 block mb-1.5 uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3 font-body text-cream outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-4 rounded-full font-mono text-sm tracking-[0.3em] transition-all ${
                loading ? 'bg-gold/50 text-ink/50 cursor-wait' : 'bg-gold text-ink hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:scale-[1.02]'
              }`}
            >
              {loading ? 'MEMPROSES...' : isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE AKUN'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-mono text-[10px] tracking-widest text-gold/60 hover:text-gold transition-colors"
            >
              {isRegister ? 'SUDAH PUNYA AKUN? MASUK' : 'BELUM PUNYA AKUN? DAFTAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
