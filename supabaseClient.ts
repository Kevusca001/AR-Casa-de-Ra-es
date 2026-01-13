
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Nota: No ambiente de execução, essas variáveis devem ser configuradas.
// Caso contrário, o serviço entrará em modo fallback (localStorage).
const supabaseUrl = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) || 'https://mzpkqfsfubrnujchfbbj.supabase.co';

const supabaseKey = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cGtxZnNmdWJybnVqY2hmYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNDIwMzcsImV4cCI6MjA4MzkxODAzN30.rjLNFB0I_eT70xhyX9qYRCOWb0XaSuYTbMlL7jUNm80';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://mzpkqfsfubrnujchfbbj.supabase.co' && supabaseKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cGtxZnNmdWJybnVqY2hmYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNDIwMzcsImV4cCI6MjA4MzkxODAzN30.rjLNFB0I_eT70xhyX9qYRCOWb0XaSuYTbMlL7jUNm80';
};
