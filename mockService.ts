
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
      console.warn('Supabase fetch failed or not configured', err);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUCTS_DATA));
      return PRODUCTS_DATA;
    }
    return JSON.parse(stored);
  },

  uploadImage: async (file: File | string): Promise<string> => {
    if (typeof file === 'string') return file;

    if (!isSupabaseConfigured()) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Upload failed', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  },

  saveProduct: async (productData: Omit<Product, 'id' | 'created_at'> & { id?: string }, file?: File): Promise<Product> => {
    let imageUrl = productData.image_url;

    if (file) {
      imageUrl = await mockService.uploadImage(file);
    }

    if (isSupabaseConfigured()) {
      try {
        const payload = { ...productData, image_url: imageUrl };
        
        let result;
        if (productData.id) {
          // UPDATE
          const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', productData.id)
            .select()
            .single();
          if (error) throw error;
          result = data;
        } else {
          // INSERT
          const { data, error } = await supabase
            .from('products')
            .insert([payload])
            .select()
            .single();
          if (error) throw error;
          result = data;
        }
        return result;
      } catch (err: any) {
        console.error('Supabase save failed:', err);
        if (err.code === '42501' || err.status === 403) {
          throw new Error('Acesso Negado: Você não tem permissão para modificar o banco de dados. Verifique se está logado como administrador.');
        }
        throw err;
      }
    }

    const products = await mockService.getProducts();
    if (productData.id) {
      const updated = products.map(p => p.id === productData.id ? { ...p, ...productData, image_url: imageUrl } : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated.find(p => p.id === productData.id)!;
    } else {
      const newProduct: Product = {
        ...productData,
        image_url: imageUrl,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
      };
      const updated = [newProduct, ...products];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newProduct;
    }
  },

  deleteProduct: async (id: string, imageUrl?: string): Promise<void> => {
    if (isSupabaseConfigured()) {
      try {
        if (imageUrl && imageUrl.includes('storage')) {
          const parts = imageUrl.split('/public/images/');
          if (parts.length > 1) {
            const path = parts[1];
            await supabase.storage.from('images').remove([path]);
          }
        }

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return;
      } catch (err: any) {
        console.error('Supabase delete failed:', err);
        if (err.code === '42501' || err.status === 403) {
          throw new Error('Acesso Negado: Você não tem permissão para excluir itens. Verifique o login.');
        }
        throw err;
      }
    }

    const products = await mockService.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
