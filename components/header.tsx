import { Bell, Mail, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../lib/stack';

interface HeaderProps {
  onLogout: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface Message {
  id: number;
  sender: string;
  subject: string;
  time: string;
  unread: boolean;
}

export function Header({ onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const user = useUser();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize data
  useEffect(() => {
    const savedNotifications = localStorage.getItem('trust_bank_notifications');
    const savedMessages = localStorage.getItem('trust_bank_messages');

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      // Default notifications for new user
      const defaults = [
        { 
          id: 1, 
          title: 'Account Opened', 
          message: 'Welcome to Trust Bank! Your account has been successfully opened.', 
          time: 'Just now', 
          unread: true 
        },
        { 
          id: 2, 
          title: 'Security Alert', 
          message: 'New login detected from your current device.', 
          time: '2 mins ago', 
          unread: true 
        }
      ];
      setNotifications(defaults);
      localStorage.setItem('trust_bank_notifications', JSON.stringify(defaults));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Default messages for new user
      const defaults = [
        { 
          id: 1, 
          sender: 'Trust Bank Support', 
          subject: 'Welcome to Online Banking', 
          time: '10:00 AM', 
          unread: true 
        }
      ];
      setMessages(defaults);
      localStorage.setItem('trust_bank_messages', JSON.stringify(defaults));
    }
  }, []);

  const markNotificationRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    setNotifications(updated);
    localStorage.setItem('trust_bank_notifications', JSON.stringify(updated));
  };

  const markMessageRead = (id: number) => {
    const updated = messages.map(m => m.id === id ? { ...m, unread: false } : m);
    setMessages(updated);
    localStorage.setItem('trust_bank_messages', JSON.stringify(updated));
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => m.unread).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    setShowUserMenu(false);
  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
    setShowMessages(false);
  };
  
  // Get display name properly
  const userDisplayName = user?.displayName || 
    (user?.clientMetadata?.firstName && user?.clientMetadata?.lastName 
      ? `${user.clientMetadata.firstName} ${user.clientMetadata.lastName}` 
      : 'User');

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-2">
        <span className="tracking-wider text-[#3d2759]">TRUST BANK</span>
        <div className="flex h-6 w-6 items-center justify-center border-2 border-[#3d2759] text-[#3d2759]">
          <span className="text-xs font-serif">TB</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Messages */}
        <div className="relative" ref={messagesRef}>
          <button 
            onClick={toggleMessages}
            className="relative rounded-full p-2 hover:bg-gray-100"
          >
          <Mail className="h-5 w-5 text-gray-600" />
            {unreadMessages > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
        </button>
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Messages</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      onClick={() => markMessageRead(msg.id)}
                      className={`border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${msg.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className={`font-medium ${msg.unread ? 'text-[#3d2759]' : 'text-gray-900'}`}>{msg.sender}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className={`text-sm ${msg.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{msg.subject}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No messages</div>
                )}
              </div>
              <div className="border-t border-gray-200 p-2 text-center">
                <button className="text-sm text-[#3d2759] hover:underline">View All Messages</button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={toggleNotifications}
            className="relative rounded-full p-2 hover:bg-gray-100"
          >
          <Bell className="h-5 w-5 text-gray-600" />
            {unreadNotifications > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            )}
        </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      onClick={() => markNotificationRead(notification.id)}
                      className={`border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${notification.unread ? 'bg-blue-50' : ''}`}
                    >
                      <div className="mb-1 flex items-start justify-between">
                        <p className={`text-sm font-medium ${notification.unread ? 'text-[#3d2759]' : 'text-gray-900'}`}>{notification.title}</p>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                    </div>
                  ))
                ) : (
                   <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                )}
              </div>
              <div className="border-t border-gray-200 p-2 text-center">
                <button className="text-sm text-[#3d2759] hover:underline">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="flex items-center gap-2 rounded-full bg-[#3d2759] px-4 py-2 text-white hover:bg-[#4d3569]"
          >
            <User className="h-5 w-5" />
            <span>{userDisplayName}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
