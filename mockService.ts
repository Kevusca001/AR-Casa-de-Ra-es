
import { Product } from './types';
import { PRODUCTS_DATA } from './constants';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'ar_racao_products';

export const mockService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage', err);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS_DATA));
      return PRODUCTS_DATA;
    }
    return JSON.parse(stored);
  },

  uploadImage: async (file: File | string): Promise<string> => {
    // Se for string (base64 de fallback ou URL externa), retorna direto
    if (typeof file === 'string') return file;

    if (!isSupabaseConfigured()) {
      // Fallback: Converte File para Base64 para salvar no localStorage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  saveProduct: async (product: Omit<Product, 'id' | 'created_at'>, file?: File): Promise<Product> => {
    let imageUrl = product.image_url;

    if (file) {
      imageUrl = await mockService.uploadImage(file);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...product, image_url: imageUrl }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save failed', err);
      }
    }

    // Fallback LocalStorage
    const products = await mockService.getProducts();
    const newProduct: Product = {
      ...product,
      image_url: imageUrl,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newProduct;
  },

  deleteProduct: async (id: string, imageUrl?: string): Promise<void> => {
    if (isSupabaseConfigured()) {
      try {
        // Tenta deletar a imagem do Storage se for uma URL do Supabase
        if (imageUrl && imageUrl.includes('storage.googleapis.com')) {
          const path = imageUrl.split('/public/images/')[1];
          if (path) {
            await supabase.storage.from('images').remove([path]);
          }
        }

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase delete failed', err);
      }
    }

    const products = await mockService.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
