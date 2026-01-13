
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Fix: Usando process.env para acessar variáveis de ambiente para resolver o erro 'Property env does not exist on type ImportMeta'
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Verificação de configuração
const hasConfig = Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://'));

if (!hasConfig) {
  console.warn(
    'A.R Casa de Rações: Variáveis de ambiente do Supabase não encontradas.\n' +
    'O sistema está operando em modo de contingência (LocalStorage).'
  );
}

/**
 * Cliente Supabase com fallback seguro.
 * Se as chaves estiverem ausentes, usa placeholders para evitar que o createClient lance erro fatal.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * Helper para verificar se a conexão real com o Supabase está ativa.
 */
export const isSupabaseConfigured = () => {
  return hasConfig && supabaseUrl !== 'https://placeholder-project.supabase.co';
};
