
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = (product.stock_quantity || 0) <= 0;

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100 flex flex-col group h-full relative ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges Flutuantes */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isOutOfStock ? (
            <div className="bg-gray-800 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
              Esgotado
            </div>
          ) : product.tag && (
            <div className="bg-pet-red text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
              {product.tag}
            </div>
          )}
          <div className="bg-royal-blue/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest w-fit">
            {product.category}
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-10">
             <span className="bg-royal-blue text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest rotate-[-5deg] shadow-2xl">Em breve</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{product.brand}</span>
          <h4 className="text-xl font-black text-royal-blue mt-1 leading-tight group-hover:text-pet-red transition-colors uppercase tracking-tighter">
            {product.name}
          </h4>
        </div>

        <p className="text-sm text-gray-500 mb-6 flex-grow line-clamp-2 font-medium leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.weight && (
              <span className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1 uppercase tracking-widest">
                <i className="fas fa-weight-hanging text-xs"></i> {product.weight}
              </span>
            )}
            <div className={`px-4 py-2 rounded-2xl shadow-sm border border-black/5 ${isOutOfStock ? 'bg-gray-200' : 'bg-vibrant-yellow'}`}>
              <span className="text-royal-blue text-[11px] font-black mr-1 uppercase opacity-60">R$</span>
              <span className="text-royal-blue text-2xl font-black tracking-tighter">
                {(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
