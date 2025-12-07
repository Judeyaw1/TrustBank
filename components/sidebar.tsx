import { Home, Receipt, ArrowLeftRight, FileText, Settings, Send, Camera, CreditCard, ArrowDownCircle } from 'lucide-react';
import { View } from './banking-dashboard';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: Home },
    { id: 'transactions' as View, label: 'Transactions', icon: Receipt },
    { id: 'transfer' as View, label: 'Transfer', icon: ArrowLeftRight },
    { id: 'send-money' as View, label: 'Send / Request', icon: Send },
    { id: 'bills' as View, label: 'Pay Bills', icon: FileText },
    { id: 'cards' as View, label: 'Cards', icon: CreditCard },
    { id: 'deposit' as View, label: 'Deposit Check', icon: Camera },
    { id: 'settings' as View, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 bg-white">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    currentView === item.id
                      ? 'bg-[#3d2759] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
