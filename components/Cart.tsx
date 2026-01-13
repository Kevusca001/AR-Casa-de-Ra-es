
import React from 'react';
import { CartItem } from '../types';
import { CONTACT } from '../constants';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onClose, onUpdateQuantity, onClearCart }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const sendOrderToWhatsApp = () => {
    if (items.length === 0) return;

    // Formatação da lista de itens para a mensagem
    const itemsText = items.map(item => 
      `• ${item.quantity}x ${item.name} (${item.weight || 'Peso N/D'}) - R$ ${item.price.toFixed(2)} cada`
    ).join('\n');

    const message = `*NOVO PEDIDO - A.R CASA DE RAÇÕES* 🐾
---------------------------------------
*ITENS DO PEDIDO:*
${itemsText}
---------------------------------------
*VALOR TOTAL: R$ ${total.toFixed(2)}*

Olá! Acabei de montar meu carrinho no site e gostaria de combinar a entrega e o pagamento via Pix.`;

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

        {/* Lista de Itens */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-12 animate-fadeIn">
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
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border p-1">
                  <img src={item.image_url} className="w-full h-full object-contain" alt={item.name} />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-black text-royal-blue text-base leading-tight truncate uppercase">{item.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{item.brand} • {item.weight || 'Peso N/D'}</p>
                  <p className="text-sm font-black text-pet-red mt-2 tracking-tight">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-royal-blue font-black hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                  >
                    <i className="fas fa-minus text-[10px]"></i>
                  </button>
                  <span className="w-6 text-center font-black text-royal-blue text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)} 
                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-royal-blue font-black hover:bg-green-50 hover:text-green-500 transition-all active:scale-90"
                  >
                    <i className="fas fa-plus text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé do Checkout */}
        {items.length > 0 && (
          <div className="p-8 bg-white border-t-2 border-gray-100 space-y-6 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Estimado</p>
                <h3 className="text-4xl font-black text-royal-blue tracking-tighter">
                  <span className="text-xl mr-1 opacity-50">R$</span>{total.toFixed(2)}
                </h3>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                  Pronto para Enviar
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={sendOrderToWhatsApp}
                className="w-full bg-[#25D366] text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-green-200 hover:bg-[#1fb355] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                <i className="fab fa-whatsapp text-2xl group-hover:animate-bounce"></i>
                CONCLUIR NO WHATSAPP
              </button>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <i className="fas fa-lock text-[10px]"></i>
                <p className="text-center text-[10px] font-bold uppercase tracking-widest">
                  Pagamento e entrega via Chat
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
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
