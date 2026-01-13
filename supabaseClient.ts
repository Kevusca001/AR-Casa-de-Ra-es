
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Captura as variáveis de ambiente com segurança
const supabaseUrl = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) || '';
const supabaseKey = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) || '';

// Verifica se a configuração é válida
const hasConfig = Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://'));

if (!hasConfig) {
  console.warn(
    'A.R Casa de Rações: Configuração do Supabase ausente ou incompleta.\n' +
    'O site continuará funcionando em modo Offline/LocalStorage.'
  );
}

/**
 * Instância do cliente Supabase.
 * Se não houver configuração, exportamos um objeto que não quebra as importações,
 * mas o app deve sempre checar `isSupabaseConfigured()` antes de usar.
 */
export const supabase = hasConfig 
  ? createClient(supabaseUrl, supabaseKey) 
  : ({} as any);

/**
 * Helper para verificar se o Supabase está ativo e pronto para uso.
 * Garante que o App saiba quando usar o mockService ou o banco real.
 */
export const isSupabaseConfigured = () => hasConfig;
