import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ActionableInsightCard from '../../cards/ActionableInsightCard'
import type { EquipmentPin } from '../../../hooks/useHubData'

// Fix default marker icon for Leaflet in bundler environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const idleIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:var(--figma-error,#dc2626);border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

interface CommandCenterMapCardProps {
  data: EquipmentPin[]
}

export default function CommandCenterMapCard({ data }: CommandCenterMapCardProps) {
  const [idleOnly, setIdleOnly] = useState(false)

  const idleCount = useMemo(() => data.filter((p) => p.status === 'idle').length, [data])
  const pins = useMemo(() => (idleOnly ? data.filter((p) => p.status === 'idle') : data), [data, idleOnly])
  const center = useMemo<[number, number]>(() => {
    if (pins.length === 0) return [47.608, -122.335]
    const lat = pins.reduce((s, p) => s + p.lat, 0) / pins.length
    const lng = pins.reduce((s, p) => s + p.lng, 0) / pins.length
    return [lat, lng]
  }, [pins])

  const signal = (
    <div className="flex flex-col gap-3">
      {idleCount > 0 && (
        <div
          className="rounded-lg px-3 py-2 text-[12px] font-medium"
          style={{ backgroundColor: 'var(--figma-error-light)', color: 'var(--figma-error)' }}
        >
          {idleCount} unit(s) idle 3+ days &mdash; costing money
        </div>
      )}
      <div className="h-[220px] overflow-hidden rounded-lg" style={{ border: '1px solid var(--figma-bg-outline)' }}>
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={pin.status === 'idle' ? idleIcon : new L.Icon.Default()}
            >
              <Popup>
                <strong>{pin.name}</strong> ({pin.type})<br />
                {pin.site} &middot; {pin.status === 'idle' ? 'Idle' : 'Active'}<br />
                Last activity: {new Date(pin.lastActivityAt).toLocaleDateString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <label className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--figma-text-secondary)' }}>
        <input
          type="checkbox"
          checked={idleOnly}
          onChange={(e) => setIdleOnly(e.target.checked)}
          className="accent-[var(--figma-primary-main)]"
        />
        Only show units with no activity in 3+ days
      </label>
    </div>
  )

  const context = (
    <span>Equipment locations with status indicators. Red markers = idle 3+ days (active rental spend with no productivity).</span>
  )

  return (
    <ActionableInsightCard
      title="Command Center Map"
      signal={signal}
      context={context}
      kickoff={{ label: 'Off-Rent Idle', onClick: () => {} }}
      kickoffPriority="p2"
    />
  )
}
