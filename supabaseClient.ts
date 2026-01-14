
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// No ambiente do navegador/Vite, usamos import.meta.env. 
// Substitua o que está no arquivo por isso:
const supabaseUrl = 'https://mzpkqfsfubrnujchfbbj.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cGtxZnNmdWJybnVqY2hmYmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNDIwMzcsImV4cCI6MjA4MzkxODAzN30.rjLNFB0I_eT70xhyX9qYRCOWb0XaSuYTbMlL7jUNm80'; // Aquela que começa com eyJ...

const hasConfig = Boolean(supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://'));

if (!hasConfig) {
  console.warn(
    'A.R Casa de Rações: Variáveis de ambiente do Supabase não encontradas.\n' +
    'O sistema está operando em modo de contingência (LocalStorage).'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Fix: Cast supabaseUrl to string to prevent literal type comparison error
export const isSupabaseConfigured = () => {
  return hasConfig && (supabaseUrl as string) !== 'https://placeholder-project.supabase.co';
};
