
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  loading?: boolean;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddToCart, loading }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Cachorro', 'Gato', 'Aves'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <section id="catalogo" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <h3 className="text-royal-blue text-4xl font-black mb-4">Nosso Catálogo</h3>
            <p className="text-gray-600 font-medium">Confira nossas ofertas imperdíveis para o seu pet diretamente de nosso estoque.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-royal-blue text-white shadow-lg scale-105' 
                  : 'bg-white text-royal-blue border border-royal-blue/20 hover:bg-royal-blue/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center">
             <div className="w-16 h-16 border-4 border-royal-blue/10 border-t-royal-blue rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Carregando estoque real...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
             <i className="fas fa-search text-6xl text-gray-200 mb-4"></i>
             <p className="text-gray-400 font-bold text-lg">Nenhum produto encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="relative group animate-fadeInUp">
                <ProductCard product={product} />
                <button 
                  onClick={() => onAddToCart(product)}
                  className="absolute bottom-5 right-16 w-11 h-11 bg-vibrant-yellow text-royal-blue rounded-full flex items-center justify-center hover:scale-125 transition-all shadow-xl z-20 active:scale-95"
                  title="Adicionar ao Carrinho"
                >
                  <i className="fas fa-plus text-lg"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out backwards; }
      `}</style>
    </section>
  );
};

export default ProductCatalog;
