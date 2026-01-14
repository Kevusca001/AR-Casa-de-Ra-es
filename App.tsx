
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoSection from './components/InfoSection';
import ProductCatalog from './components/ProductCatalog';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { CartItem, Product } from './types';
import { supabase } from './supabaseClient';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'admin'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Chamada direta ao Supabase sem intermediários
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // Verificação de segurança para garantir que o array nunca seja nulo
      setProducts(data || []);
    } catch (err) {
      console.error('Falha ao buscar produtos do banco:', err);
      setProducts([]); // Fallback para array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentScreen]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  if (currentScreen === 'admin') {
    return <AdminPanel onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-vibrant-yellow selection:text-royal-blue">
      <Header onNavigateHome={() => setCurrentScreen('home')} />

      <main>
        <Hero />
        <InfoSection />
        <ProductCatalog 
          products={products} 
          onAddToCart={addToCart} 
          loading={loading}
        />
      </main>

      <Footer onAdminClick={() => setCurrentScreen('admin')} />

      {isCartOpen && (
        <Cart 
          items={cart} 
          onClose={() => setIsCartOpen(false)} 
          onUpdateQuantity={updateCartQuantity}
          onClearCart={clearCart}
        />
      )}

      {cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-pet-red text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all animate-bounce"
        >
          <i className="fas fa-shopping-cart text-xl"></i>
          <span className="absolute -top-2 -right-2 bg-vibrant-yellow text-royal-blue w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white">
            {cart.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </button>
      )}

      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <a 
          href="https://wa.me/5521998703626"
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-vibrant-yellow text-royal-blue rounded-full flex items-center justify-center shadow-2xl"
        >
          <i className="fab fa-whatsapp text-3xl"></i>
        </a>
      </div>
    </div>
  );
}

export default App;
