import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Smartphone,
  Gamepad2,
  BarChart3,
  Target,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', name: '首页仪表板', icon: <LayoutDashboard size={20} /> },
  { path: '/devices', name: '设备管理', icon: <Smartphone size={20} /> },
  { path: '/control', name: '设备控制', icon: <Gamepad2 size={20} /> },
  { path: '/monitor', name: '数据监控', icon: <BarChart3 size={20} /> },
  { path: '/scenes', name: '智能场景', icon: <Target size={20} /> },
  { path: '/platform', name: '平台管理', icon: <Settings size={20} /> },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary-800 to-primary-900 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-center border-b border-primary-700">
          <h1 className="text-xl font-bold text-white">物联网控制平台</h1>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-primary-200 hover:bg-primary-700 hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <div className="bg-primary-700/50 rounded-lg p-4">
            <p className="text-xs text-primary-300">版本 1.0.0</p>
            <p className="text-xs text-primary-400 mt-1">© 2024 IoT Platform</p>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
