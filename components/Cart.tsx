
import React, { useState } from 'react';
import { CartItem } from '../types';
import { CONTACT } from '../constants';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onClearCart }) => {
  // Estados para o formulário de entrega
  const [customerName, setCustomerName] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [referencePoint, setReferencePoint] = useState('');

  // PROTEÇÃO: (item.price || 0) garante que o cálculo não resulte em NaN
  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  // Validação: Nome, Rua e Bairro são obrigatórios
  const isAddressValid = customerName.trim().length > 2 && street.trim().length > 4 && neighborhood.trim().length > 2;

  const sendOrderToWhatsApp = () => {
    if (items.length === 0) return;
    
    if (!isAddressValid) {
      alert('⚠️ Por favor, preencha o endereço para entrega (Nome, Rua/Nº e Bairro são obrigatórios).');
      return;
    }

    // Formatação da lista de itens
    const itemsText = items.map(item => 
      `• ${item.quantity}x ${item.name} (${item.weight || 'N/A'}) - R$ ${((item.price || 0) * item.quantity).toFixed(2)}`
    ).join('\n');

    // Montagem da mensagem com endereço no TOPO conforme solicitado pelo usuário
    const message = `*NOVO PEDIDO - A.R CASA DE RAÇÕES* 🐾
---------------------------------------
📦 *DADOS PARA ENTREGA:*
👤 *Nome:* ${customerName}
📍 *Rua/Nº:* ${street}
🏘️ *Bairro:* ${neighborhood}
✨ *Ponto de Ref:* ${referencePoint || 'Não informado'}
---------------------------------------
🛒 *ITENS DO PEDIDO:*
${itemsText}
---------------------------------------
💰 *VALOR TOTAL: R$ ${total.toFixed(2)}*

_Olá! Gostaria de confirmar meu pedido feito pelo site._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Painel Lateral */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
        
        {/* Header */}
        <div className="p-6 bg-royal-blue text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10">
            <i className="fas fa-shopping-basket text-8xl rotate-12"></i>
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">Meu Carrinho</h2>
              <p className="text-[10px] text-vibrant-yellow font-bold uppercase tracking-widest">
                {items.length} itens selecionados
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Área de Scroll */}
        <div className="flex-grow overflow-y-auto bg-gray-50/50">
          <div className="p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 px-10">
                <i className="fas fa-cart-arrow-down text-5xl text-gray-200 mb-4"></i>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Seu carrinho está vazio</p>
                <button 
                  onClick={onClose}
                  className="mt-6 text-royal-blue font-black text-sm underline uppercase"
                >
                  Voltar às compras
                </button>
              </div>
            ) : (
              <>
                {/* Itens */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Produtos Selecionados</h3>
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-fadeIn">
                      <img src={item.image_url} className="w-12 h-12 object-contain bg-gray-50 rounded-lg" alt="" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-royal-blue text-xs uppercase truncate">{item.name}</h4>
                        {/* PROTEÇÃO: (item.price || 0) */}
                        <p className="text-[9px] text-pet-red font-black">R$ {((item.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-xs"><i className="fas fa-minus"></i></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-xs"><i className="fas fa-plus"></i></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de Endereço */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="text-royal-blue font-black text-sm italic uppercase flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-vibrant-yellow"></i>
                    Informações para Entrega
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu Nome completo *</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        className="cart-input-field"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Rua e Número *</label>
                      <input 
                        type="text" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Rua Principal, 100"
                        className="cart-input-field"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bairro *</label>
                      <input 
                        type="text" 
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex: Campo Tiradentes"
                        className="cart-input-field"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ponto de Referência</label>
                      <input 
                        type="text" 
                        value={referencePoint}
                        onChange={(e) => setReferencePoint(e.target.value)}
                        placeholder="Ex: Próximo ao Colégio X"
                        className="cart-input-field"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mb-1">Total do Pedido</p>
                <h3 className="text-3xl font-black text-royal-blue italic tracking-tighter">
                  R$ {total.toFixed(2)}
                </h3>
              </div>
              {!isAddressValid && (
                <div className="text-right">
                  <p className="text-[9px] text-red-500 font-black animate-pulse uppercase tracking-tighter">
                    Preencha o endereço!
                  </p>
                </div>
              )}
            </div>
            
            <button 
              onClick={sendOrderToWhatsApp}
              disabled={!isAddressValid}
              className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${
                isAddressValid 
                ? 'bg-[#25D366] text-white hover:bg-[#1fb355] hover:-translate-y-1' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fab fa-whatsapp text-2xl"></i>
              {isAddressValid ? 'FINALIZAR NO WHATSAPP' : 'COMPLETE O ENDEREÇO'}
            </button>
            <p className="text-center text-[9px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
              Entregamos em toda Seropédica/RJ
            </p>
          </div>
        )}
      </div>

      <style>{`
        .cart-input-field {
          width: 100%;
          background: #fdfdfd;
          border: 2px solid #f3f4f6;
          padding: 10px 14px;
          border-radius: 0.8rem;
          font-weight: 700;
          font-size: 0.8rem;
          color: #002395;
          outline: none;
          transition: border-color 0.2s;
        }
        .cart-input-field:focus { border-color: #FFD700; background: white; }
        .cart-input-field::placeholder { color: #d1d5db; font-weight: 500; font-size: 0.75rem; }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Cart;
