import { useState, useEffect } from 'react';
import { CreditCard, Plus, Lock, Unlock, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface CardsProps {
  onBack?: () => void;
}

interface Card {
  id: string;
  type: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  status: string;
  color: string;
}

export function Cards({ onBack }: CardsProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState<Record<string, boolean>>({});
  
  const [cards, setCards] = useState<Card[]>([]);

  // Load cards from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem('trust_bank_cards');
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, []);

  // Save cards to localStorage
  useEffect(() => {
    localStorage.setItem('trust_bank_cards', JSON.stringify(cards));
  }, [cards]);

  const [newCard, setNewCard] = useState({
    type: 'Debit',
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  });

  const toggleCardStatus = (id: string) => {
    setCards(cards.map(card => {
      if (card.id === id) {
        return { ...card, status: card.status === 'active' ? 'locked' : 'active' };
      }
      return card;
    }));
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const toggleNumberVisibility = (id: string) => {
    setShowCardNumber(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const card = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCard,
      status: 'active',
      color: newCard.type === 'Credit' ? 'bg-gradient-to-r from-purple-600 to-purple-800' : 'bg-gradient-to-r from-blue-600 to-blue-800'
    };
    setCards([...cards, card]);
    setShowAddCard(false);
    setNewCard({ type: 'Debit', number: '', expiry: '', cvv: '', holder: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
            <p className="text-gray-600">Manage your debit and credit cards</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3d2759] px-4 py-2 text-white hover:bg-[#4d3569]"
        >
          <Plus className="h-5 w-5" />
          <span>Add Card</span>
        </button>
      </div>

      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Add New Card</h2>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Card Type</label>
                <select
                  value={newCard.type}
                  onChange={e => setNewCard({...newCard, type: e.target.value})}
                  className="w-full rounded-lg border p-2 outline-none focus:border-[#3d2759]"
                >
                  <option value="Debit">Debit Card</option>
                  <option value="Credit">Credit Card</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={newCard.number}
                  onChange={e => setNewCard({...newCard, number: e.target.value})}
                  className="w-full rounded-lg border p-2 outline-none focus:border-[#3d2759]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                    className="w-full rounded-lg border p-2 outline-none focus:border-[#3d2759]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={e => setNewCard({...newCard, cvv: e.target.value})}
                    className="w-full rounded-lg border p-2 outline-none focus:border-[#3d2759]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newCard.holder}
                  onChange={e => setNewCard({...newCard, holder: e.target.value})}
                  className="w-full rounded-lg border p-2 outline-none focus:border-[#3d2759]"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 rounded-lg border border-gray-300 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#3d2759] py-2 text-white hover:bg-[#4d3569]"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.id} className={`relative overflow-hidden rounded-xl ${card.color} p-6 text-white shadow-lg transition-transform hover:-translate-y-1`}>
              <div className="mb-8 flex items-start justify-between">
                <CreditCard className="h-8 w-8 opacity-80" />
                <span className="font-mono text-lg tracking-widest">{card.type}</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl tracking-widest">
                    {showCardNumber[card.id] ? card.number : `**** **** **** ${card.number.slice(-4)}`}
                  </span>
                  <button 
                    onClick={() => toggleNumberVisibility(card.id)}
                    className="rounded-full p-1 hover:bg-white/20"
                  >
                    {showCardNumber[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/70">Cardholder</p>
                  <p className="font-medium tracking-wide">{card.holder}</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">Expires</p>
                  <p className="font-medium tracking-wide">{card.expiry}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-6 flex gap-2 border-t border-white/20 pt-4">
                <button
                  onClick={() => toggleCardStatus(card.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-white/20 py-2 text-sm backdrop-blur-sm hover:bg-white/30"
                >
                  {card.status === 'active' ? (
                    <>
                      <Lock className="h-4 w-4" /> Lock
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" /> Unlock
                    </>
                  )}
                </button>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="flex items-center justify-center rounded bg-red-500/20 px-4 text-white backdrop-blur-sm hover:bg-red-500/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
             <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
             <p className="text-lg font-medium">No cards added yet</p>
             <p className="text-sm">Click "Add Card" to add your first card</p>
          </div>
        )}
      </div>
    </div>
  );
}

