import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { EquipmentPin, NlFilterResult } from '../../../types/lem'

const ZERO_ACTIVITY_DAYS = 3 // 72hrs

function daysSince(dateStr: string): number {
  const d = new Date(dateStr)
  return (Date.now() - d.getTime()) / (24 * 60 * 60 * 1000)
}

function isZeroActivity(pin: EquipmentPin): boolean {
  return daysSince(pin.lastActivityAt) > ZERO_ACTIVITY_DAYS
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const idleIcon = L.divIcon({
  className: 'idle-marker',
  html: '<span style="background:#dc2626;width:16px;height:16px;border-radius:50%;display:inline-block;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

interface CommandCenterMapProps {
  pins: EquipmentPin[]
  /** From NL bar e.g. "idle dozers on Site B" */
  nlFilter?: NlFilterResult['equipmentFilter']
  /** Passed from parent so we don't duplicate the count; used for summary text */
  zeroActivityCount?: number
}

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  map.setView([lat, lng], map.getZoom())
  return null
}

export default function CommandCenterMap({ pins, nlFilter, zeroActivityCount: zeroActivityCountProp }: CommandCenterMapProps) {
  const [zeroActivityOnly, setZeroActivityOnly] = useState(false)

  const computedIdleCount = useMemo(() => pins.filter(isZeroActivity).length, [pins])
  const zeroActivityCount = zeroActivityCountProp ?? computedIdleCount

  const visiblePins = useMemo(() => {
    let list = pins
    if (nlFilter) {
      if (nlFilter.idleOnly) list = list.filter(isZeroActivity)
      if (nlFilter.type) list = list.filter((p) => p.type.toLowerCase() === nlFilter!.type!.toLowerCase())
      if (nlFilter.site) list = list.filter((p) => p.site?.toLowerCase() === nlFilter!.site!.toLowerCase())
    }
    if (zeroActivityOnly) list = list.filter(isZeroActivity)
    return list
  }, [pins, zeroActivityOnly, nlFilter])

  const center = useMemo(() => {
    if (visiblePins.length === 0) return { lat: 47.6062, lng: -122.3321 }
    const lat = visiblePins.reduce((s, p) => s + p.lat, 0) / visiblePins.length
    const lng = visiblePins.reduce((s, p) => s + p.lng, 0) / visiblePins.length
    return { lat, lng }
  }, [visiblePins])

  return (
    <div className="flex min-h-[280px] flex-col">
      <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
        {zeroActivityCount > 0 && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--figma-error)',
              color: 'white',
            }}
          >
            {zeroActivityCount} unit{zeroActivityCount !== 1 ? 's' : ''} idle 3+ days — costing money
          </span>
        )}
        <label className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: 'var(--figma-text-secondary)' }}>
          <input
            type="checkbox"
            checked={zeroActivityOnly}
            onChange={(e) => setZeroActivityOnly(e.target.checked)}
            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
          />
          Only show units with no activity in 3+ days
        </label>
      </div>
      <div className="relative min-h-[240px] flex-1 rounded-lg overflow-hidden border border-slate-200" style={{ minHeight: 240 }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          className="h-full w-full min-h-[240px]"
          scrollWheelZoom={false}
          style={{ height: '100%', minHeight: 240 }}
        >
          <MapCenter lat={center.lat} lng={center.lng} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visiblePins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={isZeroActivity(pin) ? idleIcon : defaultIcon}
            >
              <Popup>
                <strong>{pin.name}</strong>
                <br />
                {pin.type} · {isZeroActivity(pin) ? 'Idle' : pin.status ?? 'Active'}
                <br />
                Last activity: {new Date(pin.lastActivityAt).toLocaleDateString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
