
import React, { useState, useEffect } from 'react';
import { mockService } from '../mockService';
import { Product } from '../types';
import { supabase } from '../supabaseClient';

interface DashboardStats {
  totalSales: number;
  orderCount: number;
  avgTicket: number;
  growth: number;
}

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
  const [stats, setStats] = useState<DashboardStats>({ totalSales: 0, orderCount: 0, avgTicket: 0, growth: 0 });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // --- Estados do Formulário ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [category, setCategory] = useState('Rações');
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

  const fetchStats = async () => {
    try {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

      const { data: currentMonthData } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', thisMonthStart);
      
      const { data: lastMonthData } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', lastMonthStart)
        .lte('created_at', lastMonthEnd);

      const currentSales = currentMonthData?.reduce((s, o) => s + o.total_amount, 0) || 0;
      const lastSales = lastMonthData?.reduce((s, o) => s + o.total_amount, 0) || 0;
      const currentCount = currentMonthData?.length || 0;

      let growth = 0;
      if (lastSales > 0) {
        growth = ((currentSales - lastSales) / lastSales) * 100;
      } else if (currentSales > 0) {
        growth = 100;
      }

      setStats({
        totalSales: currentSales,
        orderCount: currentCount,
        avgTicket: currentCount > 0 ? currentSales / currentCount : 0,
        growth: growth
      });
    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
    }
  };

  const fetchProducts = async () => {
    if (!user) return;
    setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
      fetchStats();
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setAuthError('E-mail ou senha inválidos.');
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
    setStock('10');
    setCategory('Rações');
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
    setStock((product.stock_quantity || 0).toString());
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
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name || !price || (!imagePreview && !selectedFile)) {
      return alert('Preencha os campos obrigatórios.');
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
        stock_quantity: parseInt(stock) || 0,
        image_url: imageUrl
      };

      let error;
      if (editingId) {
        const { error: err } = await supabase.from('products').update(productData).eq('id', editingId);
        error = err;
      } else {
        const { error: err } = await supabase.from('products').insert([productData]);
        error = err;
      }

      if (error) throw error;
      await fetchProducts();
      resetForm();
    } catch (err: any) {
      alert('Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      try {
        const { error } = await supabase.from('products').delete().eq('id', productToDelete.id);
        if (error) throw error;
        await fetchProducts();
        setProductToDelete(null);
      } catch (err: any) {
        alert('Erro ao excluir.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (initializing) return <div className="min-h-screen bg-royal-blue flex items-center justify-center"><i className="fas fa-paw text-vibrant-yellow text-5xl animate-bounce"></i></div>;

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#002395] via-[#001c76] to-[#001550] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <i className="fas fa-paw text-[20rem] absolute -top-20 -left-20 rotate-12"></i>
          <i className="fas fa-paw text-[15rem] absolute -bottom-20 -right-20 -rotate-12"></i>
        </div>

        <div className="w-full max-w-sm z-10">
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-vibrant-yellow animate-float">
               <span className="text-royal-blue font-black text-4xl italic">A.R</span>
            </div>
          </div>

          <form 
            onSubmit={handleLogin} 
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] w-full transition-all border-t-8 border-vibrant-yellow"
          >
            <div className="text-center mb-8">
              <h2 className="text-royal-blue text-3xl font-black italic uppercase tracking-tighter">Login Admin</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Acesso à gestão de estoque</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">E-mail Corporativo</label>
                <div className="relative group">
                  <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-vibrant-yellow"></i>
                  <input 
                    type="email" 
                    placeholder="admin@exemplo.com" 
                    className="admin-input pl-12 bg-white" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Senha Segura</label>
                <div className="relative group">
                  <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-vibrant-yellow"></i>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="admin-input pl-12 bg-white" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {authError && (
                <div className="bg-red-50 text-red-500 text-[10px] font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-shake">
                  <i className="fas fa-exclamation-circle text-sm"></i>
                  {authError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={authLoading} 
                className="w-full bg-royal-blue text-white font-black py-4.5 rounded-2xl hover:bg-vibrant-yellow hover:text-royal-blue transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-6 border-b-4 border-black/10 h-[58px]"
              >
                {authLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-shield-alt"></i>}
                {authLoading ? 'PROCESSANDO...' : 'ENTRAR NO SISTEMA'}
              </button>

              <button 
                type="button" 
                onClick={onBack} 
                className="w-full text-gray-400 font-bold text-[10px] py-2 uppercase tracking-widest hover:text-royal-blue transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-arrow-left"></i> Voltar ao site público
              </button>
            </div>
          </form>
          
          <p className="text-center text-white/30 text-[9px] mt-8 uppercase font-bold tracking-[0.2em]">
            &copy; {new Date().getFullYear()} A.R Casa de Rações - Tecnologia Pet
          </p>
        </div>
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
          <h1 className="text-xl font-black text-royal-blue leading-none italic uppercase">Gestão Pet</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-royal-blue hover:text-white transition-all">Site</button>
          <button onClick={handleLogout} className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Sair</button>
        </div>
      </nav>

      <div className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vendas do Mês</p>
            <h4 className="text-3xl font-black text-royal-blue">R$ {stats.totalSales.toFixed(2)}</h4>
            <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${stats.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
               <i className={`fas fa-arrow-${stats.growth >= 0 ? 'up' : 'down'}`}></i>
               {Math.abs(stats.growth).toFixed(1)}% vs mês passado
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedidos Novos</p>
            <h4 className="text-3xl font-black text-royal-blue">{stats.orderCount}</h4>
            <p className="text-[10px] text-gray-400 font-bold mt-2">Registrados no site</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ticket Médio</p>
            <h4 className="text-3xl font-black text-royal-blue">R$ {stats.avgTicket.toFixed(2)}</h4>
            <p className="text-[10px] text-gray-400 font-bold mt-2">Valor por pedido</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Sistema</p>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-lg font-black text-royal-blue uppercase">Online</span>
              </div>
            </div>
            <i className="fas fa-satellite text-4xl text-blue-50"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <div className={`bg-white p-8 rounded-[3rem] shadow-sm border-2 sticky top-28 ${editingId ? 'border-vibrant-yellow' : 'border-gray-100'}`}>
              <h3 className="text-2xl font-black text-royal-blue mb-8 italic uppercase">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <div className="space-y-4">
                <div className={`w-full h-48 rounded-[2rem] border-4 border-dashed relative overflow-hidden bg-gray-50 flex items-center justify-center ${imagePreview ? 'border-royal-blue' : 'border-gray-200'}`}>
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-contain p-4" /> : <i className="fas fa-image text-4xl opacity-20"></i>}
                  <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                  <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 bg-royal-blue/80 transition-all">
                    <span className="text-white font-black text-xs uppercase tracking-widest">Selecionar Foto</span>
                  </label>
                </div>
                <input type="text" placeholder="NOME DO PRODUTO" className="admin-input" value={name} onChange={e => setName(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MARCA" className="admin-input" value={brand} onChange={e => setBrand(e.target.value)} />
                  <select className="admin-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Rações</option><option>Medicamentos</option><option>Acessórios</option><option>Outros</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="PREÇO" className="admin-input" value={price} onChange={e => setPrice(e.target.value)} />
                  <input type="number" placeholder="ESTOQUE" className="admin-input" value={stock} onChange={e => setStock(e.target.value)} />
                  <input type="text" placeholder="PESO" className="admin-input" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <textarea placeholder="DESCRIÇÃO..." className="admin-input h-24" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                <div className="flex gap-3">
                  {editingId && <button onClick={resetForm} className="bg-gray-100 text-gray-500 font-black py-4 rounded-2xl w-full">Cancelar</button>}
                  <button onClick={handleSave} disabled={loading} className="bg-royal-blue text-white font-black py-4 rounded-2xl w-full hover:bg-vibrant-yellow hover:text-royal-blue transition-all">{loading ? '...' : 'SALVAR'}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-royal-blue uppercase italic">Catálogo ({products.length})</h3>
                <button onClick={fetchProducts} className="text-royal-blue/30 hover:text-royal-blue transition-colors">
                  <i className={`fas fa-sync-alt ${fetchLoading ? 'animate-spin' : ''}`}></i>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-300 uppercase text-[10px] font-black tracking-widest border-b">
                    <tr><th className="px-8 py-6">Produto</th><th className="px-6 py-6">Estoque</th><th className="px-6 py-6">Preço</th><th className="px-8 py-6 text-center">Ações</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p.id} className={`group hover:bg-gray-50 transition-all ${p.stock_quantity <= 0 ? 'bg-red-50/30' : ''}`}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={p.image_url} className="w-12 h-12 object-contain rounded-xl bg-white border" />
                            <div><p className="font-black text-royal-blue uppercase text-sm truncate max-w-[150px]">{p.name}</p><p className="text-[10px] text-gray-400 font-bold">{p.category}</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase ${p.stock_quantity <= 0 ? 'bg-red-500 text-white' : (p.stock_quantity < 5 ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-500')}`}>
                            {p.stock_quantity <= 0 ? 'SEM ESTOQUE' : `${p.stock_quantity} UN`}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-black text-royal-blue">R$ {(p.price || 0).toFixed(2)}</td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => startEdit(p)} className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><i className="fas fa-edit"></i></button>
                            <button onClick={() => setProductToDelete(p)} className="w-9 h-9 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><i className="fas fa-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center animate-scaleIn">
            <h2 className="text-2xl font-black text-royal-blue mb-4 italic uppercase">Excluir Item?</h2>
            <p className="text-gray-400 mb-8 font-medium">Deseja remover <strong>{productToDelete.name}</strong>?</p>
            <div className="flex gap-4">
              <button onClick={() => setProductToDelete(null)} className="w-full py-4 bg-gray-100 rounded-2xl font-black text-gray-500 uppercase">Não</button>
              <button onClick={handleConfirmDelete} className="w-full py-4 bg-red-500 rounded-2xl font-black text-white uppercase">Sim</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input { 
          width: 100%; 
          background: #ffffff !important; 
          border: 2px solid #f1f5f9; 
          padding: 16px 20px; 
          border-radius: 1.25rem; 
          font-weight: 700; 
          font-size: 0.9rem; 
          color: #002395 !important; 
          outline: none; 
          transition: all 0.2s; 
          box-shadow: none;
        }
        .admin-input:focus { 
          border-color: #FFD700; 
          background: white !important; 
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1); 
        }
        .admin-input::placeholder { color: #cbd5e1; font-weight: 700; }
        
        /* Autofill Neutralization */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          -webkit-text-fill-color: #002395 !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 3; }
        
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;
