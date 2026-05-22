export type SeatCategory = 'VVIP' | 'VIP' | 'Festival' | 'Regular'

export interface SeatInfo {
  id: string
  category: SeatCategory
  row: string
  number: number
  taken: boolean
}

export interface TicketCategory {
  category: SeatCategory
  price: number
  color: string
  bgColor: string
  borderColor: string
  description: string
  perks: string[]
  available: number
  total: number
}

export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    category: 'VVIP',
    price: 2500000,
    color: '#C9A84C',
    bgColor: 'rgba(201,168,76,0.12)',
    borderColor: 'rgba(201,168,76,0.5)',
    description: 'Pengalaman paling dekat dengan panggung',
    perks: [
      'Kursi paling depan — 3 baris pertama',
      'Merchandise eksklusif Laufey',
      'Meet & Greet pass (terpilih)',
      'Akses lounge VIP + catering',
      'Priority entry',
      'Lanyard & pin eksklusif',
    ],
    available: 180,
    total: 200,
  },
  {
    category: 'VIP',
    price: 1500000,
    color: '#9B7EC8',
    bgColor: 'rgba(155,126,200,0.12)',
    borderColor: 'rgba(155,126,200,0.5)',
    description: 'Pandangan sempurna dari tribun utama',
    perks: [
      'Kursi tribun premium — baris 4–12',
      'Merchandise tote bag Laufey',
      'Akses lounge VIP',
      'Priority entry',
      'Souvenir digital program',
    ],
    available: 540,
    total: 600,
  },
  {
    category: 'Festival',
    price: 850000,
    color: '#5B9BD5',
    bgColor: 'rgba(91,155,213,0.12)',
    borderColor: 'rgba(91,155,213,0.5)',
    description: 'Nikmati konser dari area festival standing',
    perks: [
      'Area festival standing',
      'Akses penuh area konser',
      'Souvenir digital program',
    ],
    available: 2800,
    total: 3000,
  },
  {
    category: 'Regular',
    price: 450000,
    color: '#6BA896',
    bgColor: 'rgba(107,168,150,0.12)',
    borderColor: 'rgba(107,168,150,0.5)',
    description: 'Kursi tribun samping & belakang',
    perks: [
      'Kursi tribun samping/belakang',
      'Akses penuh area konser',
      'Souvenir digital program',
    ],
    available: 8200,
    total: 9000,
  },
]

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)