import { AlertTriangle, Map, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/map', label: 'Map', icon: Map },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/map'}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
