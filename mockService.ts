
import { supabase } from './supabaseClient';

/**
 * O mockService foi simplificado para remover qualquer persistência local.
 * Agora ele serve apenas como utilitário para upload de arquivos no Supabase Storage.
 */
export const mockService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
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
      console.error('Erro no upload da imagem:', err);
      throw new Error('Falha ao enviar imagem para o servidor.');
    }
  }
};
