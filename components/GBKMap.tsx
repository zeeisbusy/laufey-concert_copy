'use client'
import { useState, useCallback } from 'react'
import { TICKET_CATEGORIES, formatPrice, SeatCategory } from '@/lib/seats'

interface SeatData {
  id: string
  category: SeatCategory
  label: string
  section: string
}

interface PopupState {
  seat: SeatData | null
  x: number
  y: number
}

interface GBKMapProps {
  selectedSeats: SeatData[]
  onSeatSelect: (seat: SeatData) => void
  onSeatDeselect: (id: string) => void
  takenSeats: Set<string>
}

const ZONES: Record<string, { category: SeatCategory; label: string; sections: string[] }> = {
  vvip_floor: { category: 'VVIP', label: 'VVIP Floor', sections: ['VVIP-A', 'VVIP-B', 'VVIP-C'] },
  vip_north: { category: 'VIP', label: 'VIP Utara', sections: ['VIP-N1', 'VIP-N2', 'VIP-N3'] },
  vip_south: { category: 'VIP', label: 'VIP Selatan', sections: ['VIP-S1', 'VIP-S2', 'VIP-S3'] },
  festival_east: { category: 'Festival', label: 'Festival Timur', sections: ['FES-E1', 'FES-E2'] },
  festival_west: { category: 'Festival', label: 'Festival Barat', sections: ['FES-W1', 'FES-W2'] },
  regular_ne: { category: 'Regular', label: 'Regular NE', sections: ['REG-NE'] },
  regular_nw: { category: 'Regular', label: 'Regular NW', sections: ['REG-NW'] },
  regular_se: { category: 'Regular', label: 'Regular SE', sections: ['REG-SE'] },
  regular_sw: { category: 'Regular', label: 'Regular SW', sections: ['REG-SW'] },
  regular_north: { category: 'Regular', label: 'Regular Utara', sections: ['REG-N'] },
  regular_south: { category: 'Regular', label: 'Regular Selatan', sections: ['REG-S'] },
}

const CAT_COLORS: Record<SeatCategory, string> = {
  VVIP: '#C9A84C',
  VIP: '#9B7EC8',
  Festival: '#5B9BD5',
  Regular: '#6BA896',
}

export default function GBKMap({ selectedSeats, onSeatSelect, onSeatDeselect, takenSeats }: GBKMapProps) {
  const [popup, setPopup] = useState<PopupState>({ seat: null, x: 0, y: 0 })
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  const isSelected = useCallback((id: string) => selectedSeats.some(s => s.id === id), [selectedSeats])
  const isTaken = useCallback((id: string) => takenSeats.has(id), [takenSeats])

  const handleZoneClick = (e: React.MouseEvent<SVGElement>, zoneKey: string) => {
    const zone = ZONES[zoneKey]
    const section = zone.sections[0]
    const seatId = `${section}-${Math.floor(Math.random() * 50) + 1}`
    if (isTaken(seatId)) return
    const seat: SeatData = { id: seatId, category: zone.category, label: zone.label, section }
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
    const svgRect = (e.currentTarget.closest('svg') as SVGElement).getBoundingClientRect()
    setPopup({ seat, x: rect.left - svgRect.left + rect.width / 2, y: rect.top - svgRect.top })
  }

  const handleBuyFromPopup = () => {
    if (!popup.seat) return
    if (isSelected(popup.seat.id)) {
      onSeatDeselect(popup.seat.id)
    } else {
      onSeatSelect(popup.seat)
    }
    setPopup({ seat: null, x: 0, y: 0 })
  }

  const closePopup = () => setPopup({ seat: null, x: 0, y: 0 })

  const getZoneColor = (zoneKey: string) => {
    const cat = ZONES[zoneKey]?.category
    if (!cat) return '#333'
    const color = CAT_COLORS[cat]
    return hoveredZone === zoneKey ? color : color + '99'
  }

  const getZoneStroke = (zoneKey: string) => {
    const cat = ZONES[zoneKey]?.category
    if (!cat) return '#555'
    return CAT_COLORS[cat]
  }

  return (
    <div className="relative w-full select-none">
      <svg viewBox="0 0 900 680" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto"
        onClick={(e) => { if (e.target === e.currentTarget) closePopup() }}>

        <rect width="900" height="680" fill="#0D0A05" rx="16" />
        <ellipse cx="450" cy="340" rx="420" ry="300" fill="#151008" stroke="#C9A84C22" strokeWidth="1"/>
        <ellipse cx="450" cy="340" rx="220" ry="145" fill="#1A3020" stroke="#2A5030" strokeWidth="2"/>
        <ellipse cx="450" cy="340" rx="200" ry="125" fill="none" stroke="#2A5030" strokeWidth="1"/>
        <line x1="450" y1="215" x2="450" y2="465" stroke="#2A5030" strokeWidth="1"/>
        <ellipse cx="450" cy="340" rx="30" ry="30" fill="none" stroke="#2A5030" strokeWidth="1"/>
        <rect x="370" y="280" width="80" height="50" fill="none" stroke="#2A5030" strokeWidth="1"/>
        <rect x="370" y="350" width="80" height="50" fill="none" stroke="#2A5030" strokeWidth="1"/>

        {/* PANGGUNG */}
        <rect x="370" y="455" width="160" height="50" fill="#2A1F0A" stroke="#C9A84C" strokeWidth="2" rx="6"/>
        <text x="450" y="484" textAnchor="middle" fill="#C9A84C" fontSize="12" fontFamily="monospace" letterSpacing="3">PANGGUNG</text>

        {/* VVIP */}
        <rect x="310" y="420" width="280" height="30"
          fill={getZoneColor('vvip_floor')} stroke={getZoneStroke('vvip_floor')} strokeWidth="1.5" rx="4"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('vvip_floor')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'vvip_floor')}
        />
        <text x="450" y="439" textAnchor="middle" fill="#1A1208" fontSize="10" fontFamily="monospace" letterSpacing="2" pointerEvents="none">VVIP</text>

        {/* VIP Kiri */}
        <path d="M230,370 L310,410 L310,460 L230,460 Z"
          fill={getZoneColor('vip_north')} stroke={getZoneStroke('vip_north')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('vip_north')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'vip_north')}
        />
        <text x="268" y="432" textAnchor="middle" fill="#1A1208" fontSize="9" fontFamily="monospace" pointerEvents="none">VIP</text>

        {/* VIP Kanan */}
        <path d="M590,370 L670,370 L670,460 L590,460 L590,410 Z"
          fill={getZoneColor('vip_south')} stroke={getZoneStroke('vip_south')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('vip_south')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'vip_south')}
        />
        <text x="630" y="432" textAnchor="middle" fill="#1A1208" fontSize="9" fontFamily="monospace" pointerEvents="none">VIP</text>

        {/* VIP Utara */}
        <path d="M310,200 L590,200 L590,240 L310,240 Z"
          fill={getZoneColor('vip_north')} stroke={getZoneStroke('vip_north')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('vip_north')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'vip_north')}
        />
        <text x="450" y="225" textAnchor="middle" fill="#1A1208" fontSize="9" fontFamily="monospace" letterSpacing="2" pointerEvents="none">VIP UTARA</text>

        {/* Festival Timur */}
        <path d="M590,240 L720,260 L720,420 L670,460 L590,410 L590,370 L670,370 L670,260 Z"
          fill={getZoneColor('festival_east')} stroke={getZoneStroke('festival_east')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('festival_east')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'festival_east')}
        />
        <text x="645" y="320" textAnchor="middle" fill="#0a1520" fontSize="10" fontFamily="monospace" transform="rotate(90,645,320)" pointerEvents="none">FESTIVAL</text>

        {/* Festival Barat */}
        <path d="M310,240 L230,260 L180,260 L180,420 L230,460 L310,460 L310,410 L230,370 L230,260 Z"
          fill={getZoneColor('festival_west')} stroke={getZoneStroke('festival_west')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('festival_west')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'festival_west')}
        />
        <text x="255" y="320" textAnchor="middle" fill="#0a1520" fontSize="10" fontFamily="monospace" transform="rotate(-90,255,320)" pointerEvents="none">FESTIVAL</text>

        {/* Regular NW */}
        <path d="M50,150 L180,200 L180,260 L100,280 L50,250 Z"
          fill={getZoneColor('regular_nw')} stroke={getZoneStroke('regular_nw')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_nw')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_nw')}
        />
        <text x="110" y="228" textAnchor="middle" fill="#0a1a16" fontSize="8" fontFamily="monospace" pointerEvents="none">REG</text>

        {/* Regular NE */}
        <path d="M850,150 L720,200 L720,260 L800,280 L850,250 Z"
          fill={getZoneColor('regular_ne')} stroke={getZoneStroke('regular_ne')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_ne')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_ne')}
        />
        <text x="790" y="228" textAnchor="middle" fill="#0a1a16" fontSize="8" fontFamily="monospace" pointerEvents="none">REG</text>

        {/* Regular Utara */}
        <path d="M180,150 L720,150 L720,200 L590,200 L310,200 L180,200 Z"
          fill={getZoneColor('regular_north')} stroke={getZoneStroke('regular_north')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_north')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_north')}
        />
        <text x="450" y="180" textAnchor="middle" fill="#0a1a16" fontSize="9" fontFamily="monospace" letterSpacing="2" pointerEvents="none">REGULAR UTARA</text>

        {/* Regular SW */}
        <path d="M50,530 L180,480 L180,420 L100,400 L50,430 Z"
          fill={getZoneColor('regular_sw')} stroke={getZoneStroke('regular_sw')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_sw')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_sw')}
        />
        <text x="110" y="455" textAnchor="middle" fill="#0a1a16" fontSize="8" fontFamily="monospace" pointerEvents="none">REG</text>

        {/* Regular SE */}
        <path d="M850,530 L720,480 L720,420 L800,400 L850,430 Z"
          fill={getZoneColor('regular_se')} stroke={getZoneStroke('regular_se')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_se')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_se')}
        />
        <text x="790" y="455" textAnchor="middle" fill="#0a1a16" fontSize="8" fontFamily="monospace" pointerEvents="none">REG</text>

        {/* Regular Selatan */}
        <path d="M180,530 L720,530 L720,480 L230,480 L180,480 Z"
          fill={getZoneColor('regular_south')} stroke={getZoneStroke('regular_south')} strokeWidth="1.5"
          className="cursor-pointer"
          onMouseEnter={() => setHoveredZone('regular_south')}
          onMouseLeave={() => setHoveredZone(null)}
          onClick={(e) => handleZoneClick(e, 'regular_south')}
        />
        <text x="450" y="510" textAnchor="middle" fill="#0a1a16" fontSize="9" fontFamily="monospace" letterSpacing="2" pointerEvents="none">REGULAR SELATAN</text>

        {/* Arah */}
        <text x="450" y="50" textAnchor="middle" fill="#C9A84C40" fontSize="11" fontFamily="monospace" letterSpacing="3">UTARA ↑</text>
        <text x="450" y="640" textAnchor="middle" fill="#C9A84C40" fontSize="11" fontFamily="monospace" letterSpacing="3">SELATAN ↓</text>
        <text x="20" y="345" textAnchor="middle" fill="#C9A84C40" fontSize="11" fontFamily="monospace" transform="rotate(-90,20,345)">BARAT</text>
        <text x="880" y="345" textAnchor="middle" fill="#C9A84C40" fontSize="11" fontFamily="monospace" transform="rotate(90,880,345)">TIMUR</text>
        <text x="450" y="340" textAnchor="middle" fill="#2A5030" fontSize="11" fontFamily="monospace" letterSpacing="2">LAPANGAN</text>
        <text x="450" y="356" textAnchor="middle" fill="#2A5030" fontSize="9" fontFamily="monospace" letterSpacing="4">GBK</text>

        {/* POPUP */}
        {popup.seat && (
          <g>
            <rect width="900" height="680" fill="transparent" onClick={closePopup} />
            <g transform={`translate(${Math.min(Math.max(popup.x - 110, 10), 780)}, ${Math.max(popup.y - 200, 10)})`}>
              <rect x="2" y="2" width="220" height="180" rx="12" fill="rgba(0,0,0,0.5)" />
              <rect width="220" height="180" rx="12" fill="#1A1208" stroke={CAT_COLORS[popup.seat.category]} strokeWidth="1.5" />
              <rect width="220" height="36" rx="12" fill={CAT_COLORS[popup.seat.category]} />
              <rect y="24" width="220" height="12" fill={CAT_COLORS[popup.seat.category]} />
              <text x="110" y="24" textAnchor="middle" fill="#1A1208" fontSize="11" fontFamily="monospace" letterSpacing="3" fontWeight="bold">
                {popup.seat.category}
              </text>
              <text x="16" y="62" fill="#F5F0E8" fontSize="13" fontFamily="serif" fontStyle="italic">{popup.seat.label}</text>
              <text x="16" y="80" fill="#C9A84C80" fontSize="9" fontFamily="monospace" letterSpacing="2">{popup.seat.section}</text>
              <text x="16" y="110" fill="#C9A84C60" fontSize="9" fontFamily="monospace" letterSpacing="2">HARGA TIKET</text>
              <text x="16" y="130" fill="#F5F0E8" fontSize="16" fontFamily="serif">
                {formatPrice(TICKET_CATEGORIES.find(c => c.category === popup.seat!.category)?.price || 0)}
              </text>
              <rect x="16" y="144" width="188" height="26" rx="13" fill={CAT_COLORS[popup.seat.category]} className="cursor-pointer" onClick={handleBuyFromPopup} />
              <text x="110" y="162" textAnchor="middle" fill="#1A1208" fontSize="10" fontFamily="monospace" letterSpacing="2" fontWeight="bold" className="cursor-pointer pointer-events-none">
                {isSelected(popup.seat.id) ? '✓ DIPILIH' : 'PILIH KURSI INI'}
              </text>
              <text x="200" y="20" fill="#F5F0E8" fontSize="14" fontFamily="monospace" className="cursor-pointer" onClick={closePopup} fontWeight="bold">×</text>
            </g>
          </g>
        )}
      </svg>

      {hoveredZone && !popup.seat && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="glass px-4 py-2 rounded-full">
            <span className="font-mono text-xs tracking-widest" style={{ color: CAT_COLORS[ZONES[hoveredZone]?.category] }}>
              {ZONES[hoveredZone]?.label} — {formatPrice(TICKET_CATEGORIES.find(c => c.category === ZONES[hoveredZone]?.category)?.price || 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export type { SeatData }