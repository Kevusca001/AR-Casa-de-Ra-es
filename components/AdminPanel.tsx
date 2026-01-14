
import React, { useState, useEffect } from 'react';
import { mockService } from '../mockService';
import { Product } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  // --- Estados de Autenticação ---
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // --- Estados do Dashboard ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // --- Estados do Formulário ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Cachorro');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Erro na sessão:", err);
      } finally {
        setInitializing(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProducts([]);
        resetForm();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    if (!user) return;
    setFetchLoading(true);
    try {
      // BUSCA DIRETA DO BANCO (TOTALMENTE INDEPENDENTE DE MOCK)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos no banco:', err);
      setProducts([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('E-mail ou senha incorretos.');
        }
        throw error;
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setBrand('');
    setPrice('');
    setCategory('Cachorro');
    setDescription('');
    setWeight('');
    setImagePreview(null);
    setSelectedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setPrice((product.price || 0).toString().replace('.', ','));
    setCategory(product.category);
    setDescription(product.description);
    setWeight(product.weight || '');
    setImagePreview(product.image_url);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Máximo 5MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name || !price || (!imagePreview && !selectedFile)) {
      return alert('Preencha Nome, Preço e selecione uma Foto.');
    }
    
    setLoading(true);
    try {
      let imageUrl = imagePreview || '';

      if (selectedFile) {
        imageUrl = await mockService.uploadImage(selectedFile);
      }

      const productData = {
        name,
        brand,
        description,
        category,
        weight,
        price: parseFloat(price.replace(',', '.')),
        image_url: imageUrl
      };

      let resultError;
      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);
        resultError = error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        resultError = error;
      }

      if (resultError) throw resultError;

      await fetchProducts();
      resetForm();
      alert(editingId ? 'Produto atualizado!' : 'Produto cadastrado!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar dados no banco.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const idToDelete = productToDelete.id;
      setLoading(true);
      setDeletingId(idToDelete);

      try {
        // COMANDO DIRETO PARA O SUPABASE (SEM MOCKSERVICE)
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', idToDelete);

        if (error) {
          console.error("Erro real do Supabase:", error);
          throw new Error(`O banco recusou a exclusão: ${error.message}`);
        }

        // Tiramos da tela e sincronizamos
        setProducts(prev => prev.filter(p => p.id !== idToDelete));
        setProductToDelete(null);
        alert('Produto removido com sucesso!');

      } catch (err: any) {
        console.error("Erro na exclusão:", err);
        alert(err.message || 'Erro ao excluir item.');
      } finally {
        setLoading(false);
        setDeletingId(null);
      }
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-royal-blue flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-vibrant-yellow/20 border-t-vibrant-yellow rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-royal-blue flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-vibrant-yellow rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
           <i className="fas fa-lock text-royal-blue text-3xl"></i>
        </div>
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full">
          <h2 className="text-royal-blue text-3xl font-black mb-1 text-center italic tracking-tighter uppercase">Admin A.R</h2>
          <p className="text-gray-400 text-[10px] text-center mb-8 font-black uppercase tracking-widest">Acesso Exclusivo</p>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="seu-email@exemplo.com" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-vibrant-yellow outline-none transition-all font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-vibrant-yellow outline-none transition-all font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {authError && (
              <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
                <i className="fas fa-exclamation-circle"></i>
                {authError}
              </div>
            )}

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full bg-royal-blue text-white font-black py-5 rounded-2xl hover:bg-vibrant-yellow hover:text-royal-blue transition-all shadow-xl active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {authLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
              {authLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
            
            <button type="button" onClick={onBack} className="w-full text-gray-300 font-bold text-xs py-2 uppercase tracking-widest hover:text-gray-500 transition-colors">
              Voltar ao Site
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b-2 p-4 md:px-10 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-royal-blue rounded-2xl flex items-center justify-center border-2 border-vibrant-yellow rotate-3 shadow-md">
            <span className="text-vibrant-yellow font-black text-lg">A.R</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-royal-blue leading-none italic uppercase">Gestão de Estoque</h1>
            <p className="text-[10px] text-green-500 font-black tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Admin: {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="hidden sm:block bg-gray-100 text-gray-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-royal-blue hover:text-white transition-all">
            Ir para o Site
          </button>
          <button onClick={handleLogout} className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm">
            Sair
          </button>
        </div>
      </nav>

      <div className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4">
            <div className={`bg-white p-8 rounded-[3rem] shadow-sm border-2 transition-colors sticky top-28 ${editingId ? 'border-vibrant-yellow' : 'border-gray-100'}`}>
              <h3 className="text-2xl font-black text-royal-blue mb-8 flex items-center gap-3 italic uppercase">
                <i className={`fas ${editingId ? 'fa-edit' : 'fa-plus-circle'} text-vibrant-yellow`}></i>
                {editingId ? 'Editar Item' : 'Novo Item'}
              </h3>
              
              <div className="space-y-5">
                <div className="relative group">
                  <div className={`w-full h-56 rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all bg-gray-50 ${imagePreview ? 'border-royal-blue border-solid' : 'border-gray-200'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-contain p-4" alt="Preview" />
                    ) : (
                      <div className="text-center opacity-30">
                        <i className="fas fa-image text-5xl mb-3"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">Foto do Produto</p>
                      </div>
                    )}
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                    <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-royal-blue/80 transition-all">
                      <span className="bg-vibrant-yellow text-royal-blue px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                        Mudar Imagem
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="NOME DO PRODUTO" className="admin-input" value={name} onChange={e => setName(e.target.value)} />
                  <div className="flex gap-3">
                    <input type="text" placeholder="MARCA" className="admin-input flex-grow" value={brand} onChange={e => setBrand(e.target.value)} />
                    <select className="admin-input w-36" value={category} onChange={e => setCategory(e.target.value)}>
                      <option>Cachorro</option>
                      <option>Gato</option>
                      <option>Aves</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-sm">R$</span>
                      <input type="text" placeholder="PREÇO" className="admin-input w-full pl-12" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <input type="text" placeholder="PESO" className="admin-input w-32" value={weight} onChange={e => setWeight(e.target.value)} />
                  </div>
                  <textarea placeholder="DESCRIÇÃO..." className="admin-input h-24 resize-none" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>

                <div className="flex gap-3">
                  {editingId && (
                    <button onClick={resetForm} className="flex-grow bg-gray-100 text-gray-400 font-black py-5 rounded-[1.5rem] uppercase tracking-widest text-xs">
                      Cancelar
                    </button>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-[2] bg-royal-blue text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-vibrant-yellow hover:text-royal-blue transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                  >
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                    {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Publicar')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-royal-blue uppercase italic tracking-tighter">
                  Catálogo Atual <span className="text-gray-300 ml-3 font-bold normal-case text-sm">({products.length})</span>
                </h3>
                <button onClick={fetchProducts} className="text-royal-blue/30 hover:text-royal-blue transition-colors">
                  <i className={`fas fa-sync-alt ${fetchLoading ? 'animate-spin' : ''}`}></i>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-300 uppercase text-[10px] font-black tracking-[0.2em] border-b">
                    <tr>
                      <th className="px-8 py-6">Produto</th>
                      <th className="px-6 py-6">Tipo</th>
                      <th className="px-6 py-6">Preço</th>
                      <th className="px-8 py-6 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fetchLoading && products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center">
                          <div className="w-10 h-10 border-4 border-royal-blue/10 border-t-royal-blue rounded-full animate-spin mx-auto mb-4"></div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center">
                          <p className="text-gray-400 font-bold italic">Nenhum produto no catálogo.</p>
                        </td>
                      </tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id} className={`transition-all group ${editingId === p.id ? 'bg-yellow-50' : 'hover:bg-gray-50'} ${deletingId === p.id ? 'opacity-30' : ''}`}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-5">
                              <img src={p.image_url} className="w-14 h-14 object-contain rounded-2xl bg-white border shadow-sm" alt="" />
                              <div>
                                <p className="font-black text-royal-blue leading-none uppercase truncate max-w-[200px]">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{p.brand} | {p.weight}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-black px-3 py-1.5 rounded-xl uppercase border bg-blue-50 text-blue-500 border-blue-100">
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            {/* PROTEÇÃO: (p.price || 0).toFixed(2) evita quebras se o valor for nulo no banco */}
                            <p className="font-black text-royal-blue text-lg">R$ {(p.price || 0).toFixed(2)}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {deletingId === p.id ? (
                                <div className="w-10 h-10 flex items-center justify-center text-red-500">
                                  <i className="fas fa-spinner fa-spin"></i>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => startEdit(p)} className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all inline-flex items-center justify-center">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button onClick={() => setProductToDelete(p)} className="w-10 h-10 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all inline-flex items-center justify-center">
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-royal-blue/80 backdrop-blur-md" onClick={() => !loading && setProductToDelete(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl animate-scaleIn">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            <h2 className="text-3xl font-black text-royal-blue mb-2 uppercase italic">Excluir?</h2>
            <p className="text-gray-500 mb-8 font-medium">
              Confirma a exclusão de <strong>{productToDelete.name}</strong>?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button disabled={loading} onClick={() => setProductToDelete(null)} className="bg-gray-100 text-gray-500 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all uppercase text-xs">
                Cancelar
              </button>
              <button disabled={loading} onClick={handleConfirmDelete} className="bg-red-500 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 uppercase text-xs">
                {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input {
          width: 100%;
          background: #fdfdfd;
          border: 2px solid #f3f4f6;
          padding: 18px 20px;
          border-radius: 1.2rem;
          font-weight: 700;
          font-size: 0.9rem;
          color: #002395;
          outline: none;
          transition: all 0.2s;
        }
        .admin-input:focus { border-color: #FFD700; background: white; }
        .admin-input::placeholder { color: #d1d5db; font-weight: 800; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;
