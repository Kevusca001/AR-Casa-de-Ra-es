
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Validação: Nome, Rua e Bairro são obrigatórios
  const isAddressValid = customerName.trim() !== '' && street.trim() !== '' && neighborhood.trim() !== '';

  const sendOrderToWhatsApp = () => {
    if (items.length === 0) return;
    if (!isAddressValid) {
      alert('Por favor, preencha o nome e o endereço completo para a entrega.');
      return;
    }

    // Formatação da lista de itens para a mensagem
    const itemsText = items.map(item => 
      `• ${item.quantity}x ${item.name} (${item.weight || 'Peso N/D'}) - R$ ${item.price.toFixed(2)} cada`
    ).join('\n');

    const message = `*NOVO PEDIDO - A.R CASA DE RAÇÕES* 🐾
---------------------------------------
*DADOS PARA ENTREGA:*
👤 *Nome:* ${customerName}
📍 *Endereço:* ${street}
🏘️ *Bairro:* ${neighborhood}
✨ *Ref:* ${referencePoint || 'Não informado'}
---------------------------------------
*ITENS DO PEDIDO:*
${itemsText}
---------------------------------------
*VALOR TOTAL: R$ ${total.toFixed(2)}*

Olá! Acabei de montar meu carrinho no site. Gostaria de confirmar o pedido e combinar o pagamento.`;

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
        
        {/* Header do Carrinho */}
        <div className="p-8 bg-royal-blue text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-10">
            <i className="fas fa-shopping-basket text-9xl rotate-12"></i>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter">MEU CARRINHO</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-vibrant-yellow text-royal-blue text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                {items.length} PRODUTOS
              </span>
              {items.length > 0 && (
                <button 
                  onClick={onClearCart}
                  className="text-white/40 hover:text-vibrant-yellow text-[10px] font-bold uppercase underline decoration-vibrant-yellow/30 transition-colors"
                >
                  Limpar Tudo
                </button>
              )}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:rotate-90 transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Área de Conteúdo (Itens + Formulário) */}
        <div className="flex-grow overflow-y-auto bg-gray-50/50">
          <div className="p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-12 py-20 animate-fadeIn">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <i className="fas fa-cart-plus text-4xl text-gray-300"></i>
                </div>
                <h4 className="text-xl font-black text-royal-blue uppercase tracking-tight">Opa! Nada por aqui.</h4>
                <p className="text-gray-400 font-medium text-sm mt-3 leading-relaxed">
                  Adicione algumas rações do nosso catálogo para começar o seu pedido.
                </p>
                <button 
                  onClick={onClose} 
                  className="mt-8 bg-royal-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-vibrant-yellow hover:text-royal-blue transition-all active:scale-95"
                >
                  VER PRODUTOS
                </button>
              </div>
            ) : (
              <>
                {/* Itens */}
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border p-1">
                        <img src={item.image_url} className="w-full h-full object-contain" alt={item.name} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-black text-royal-blue text-sm sm:text-base leading-tight truncate uppercase">{item.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.brand} • {item.weight || 'Peso N/D'}</p>
                        <p className="text-sm font-black text-pet-red mt-1 tracking-tight">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)} 
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-royal-blue font-black hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                        >
                          <i className="fas fa-minus text-[9px]"></i>
                        </button>
                        <span className="w-5 text-center font-black text-royal-blue text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)} 
                          className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-royal-blue font-black hover:bg-green-50 hover:text-green-500 transition-all active:scale-90"
                        >
                          <i className="fas fa-plus text-[9px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de Entrega */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 animate-fadeIn">
                  <h3 className="text-royal-blue font-black text-lg italic uppercase tracking-tighter flex items-center gap-3">
                    <i className="fas fa-truck text-vibrant-yellow"></i>
                    Informações de Entrega
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu Nome *</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Como podemos te chamar?"
                        className="cart-input"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rua e Número *</label>
                      <input 
                        type="text" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Ex: Rua das Flores, 123"
                        className="cart-input"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bairro *</label>
                      <input 
                        type="text" 
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ex: Km 40 / Campo Tiradentes"
                        className="cart-input"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ponto de Referência</label>
                      <input 
                        type="text" 
                        value={referencePoint}
                        onChange={(e) => setReferencePoint(e.target.value)}
                        placeholder="Perto de onde?"
                        className="cart-input"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rodapé do Checkout */}
        {items.length > 0 && (
          <div className="p-8 bg-white border-t-2 border-gray-100 space-y-6 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total do Pedido</p>
                <h3 className="text-4xl font-black text-royal-blue tracking-tighter">
                  <span className="text-xl mr-1 opacity-50">R$</span>{total.toFixed(2)}
                </h3>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                {!isAddressValid && (
                  <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter bg-red-50 px-2 py-1 rounded-md border border-red-100">
                    Aguardando endereço...
                  </span>
                )}
                {isAddressValid && (
                  <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase border border-green-100">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    Pronto para enviar
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={sendOrderToWhatsApp}
                disabled={!isAddressValid}
                className={`w-full font-black py-5 rounded-2xl text-lg shadow-xl transition-all flex items-center justify-center gap-4 group active:scale-95 ${
                  isAddressValid 
                  ? 'bg-[#25D366] text-white shadow-green-200 hover:bg-[#1fb355] hover:scale-[1.02]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <i className={`fab fa-whatsapp text-2xl ${isAddressValid ? 'group-hover:animate-bounce' : ''}`}></i>
                {isAddressValid ? 'CONCLUIR NO WHATSAPP' : 'INFORME O ENDEREÇO'}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <i className="fas fa-lock text-[10px]"></i>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest">
                  Pagamento via Pix ou Cartão na Entrega
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-input {
          width: 100%;
          background: #fdfdfd;
          border: 2px solid #f3f4f6;
          padding: 12px 16px;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 0.85rem;
          color: #002395;
          outline: none;
          transition: all 0.2s;
        }
        .cart-input:focus {
          border-color: #FFD700;
          background: white;
          box-shadow: 0 4px 12px rgba(0,35,149,0.05);
        }
        .cart-input::placeholder {
          color: #d1d5db;
          font-weight: 500;
          font-size: 0.75rem;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Cart;
