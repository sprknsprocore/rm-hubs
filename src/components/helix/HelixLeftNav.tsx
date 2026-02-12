import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, Heart, Plus, User } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: LayoutGrid, label: 'Dashboard', href: '/helix' },
  { icon: Heart, label: 'Favorites', href: undefined },
  { icon: Plus, label: 'Add', href: undefined },
]

export default function HelixLeftNav() {
  const { pathname } = useLocation()
  return (
    <aside
      className="flex flex-col items-center border-r py-4"
      style={{
        width: 'var(--helix-nav-width)',
        backgroundColor: 'var(--helix-bg-nav)',
        borderColor: 'var(--helix-border-nav)',
      }}
      aria-label="Main navigation"
    >
      <div
        className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'var(--helix-primary)' }}
      >
        <span className="text-sm font-bold text-white">P</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = href !== undefined && pathname === href
          const base = 'flex h-10 w-10 items-center justify-center rounded-lg transition-colors'
          const style = active
            ? { backgroundColor: 'var(--helix-bg-nav-active)', color: 'var(--helix-text-inverse)' }
            : { color: 'var(--helix-text-muted)' }
          const hover = !active ? 'hover:opacity-90' : ''
          if (href) {
            return (
              <Link
                key={label}
                to={href}
                className={`${base} ${hover}`}
                style={style}
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            )
          }
          return (
            <button
              key={label}
              type="button"
              className={`${base} ${hover}`}
              style={style}
              aria-label={label}
              title={label}
            >
              <Icon className="h-5 w-5" />
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        className="mt-auto flex h-10 w-10 items-center justify-center rounded-full opacity-80 hover:opacity-100"
        style={{ backgroundColor: 'var(--helix-bg-nav-active)', color: 'var(--helix-text-muted)' }}
        aria-label="Profile"
      >
        <User className="h-5 w-5" />
      </button>
    </aside>
  )
}
