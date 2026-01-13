
import React, { useState, useEffect } from 'react';
import { mockService } from '../mockService';
import { Product } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Cachorro');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
    setFetchLoading(true);
    try {
      const data = await mockService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Senha incorreta!');
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
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name || !price || (!imagePreview && !selectedFile)) {
      return alert('Preencha: Nome, Preço e selecione uma Foto.');
    }
    
    setLoading(true);
    try {
      await mockService.saveProduct({
        name,
        brand,
        description,
        category,
        weight,
        price: parseFloat(price.replace(',', '.')),
        image_url: imagePreview || ''
      }, selectedFile || undefined);

      await fetchProducts();
      
      // Reset Form
      setName(''); setPrice(''); setBrand(''); setDescription(''); setWeight(''); 
      setImagePreview(null); setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      alert('Produto cadastrado com sucesso!');
    } catch (err) {
      alert('Falha ao salvar no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setLoading(true);
      try {
        await mockService.deleteProduct(productToDelete.id, productToDelete.image_url);
        await fetchProducts();
        setProductToDelete(null);
      } catch (err) {
        alert('Erro ao excluir.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-royal-blue flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-vibrant-yellow rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
           <i className="fas fa-key text-royal-blue text-3xl"></i>
        </div>
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-sm w-full">
          <h2 className="text-royal-blue text-3xl font-black mb-1 text-center italic tracking-tighter uppercase">Painel A.R</h2>
          <p className="text-gray-400 text-[10px] text-center mb-8 font-black uppercase tracking-widest">Acesso Gestor Estufa</p>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha Mestra</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-2xl focus:border-vibrant-yellow outline-none transition-all font-mono text-center text-xl tracking-[0.5em]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button className="w-full bg-royal-blue text-white font-black py-5 rounded-2xl hover:bg-vibrant-yellow hover:text-royal-blue transition-all shadow-xl active:scale-95 uppercase tracking-widest">
              Entrar no Sistema
            </button>
            <button type="button" onClick={onBack} className="w-full text-gray-300 font-bold text-xs py-2 uppercase tracking-widest">
              Sair para o Site
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
          <div className="w-12 h-12 bg-royal-blue rounded-2xl flex items-center justify-center border-2 border-vibrant-yellow rotate-3">
            <span className="text-vibrant-yellow font-black text-lg">A.R</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-royal-blue leading-none italic uppercase">Gestão de Estoque</h1>
            <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Database Realtime</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-royal-blue hover:text-white transition-all">
            Ver Site
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 text-red-500 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-grow p-4 md:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cadastro de Novo Produto */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-2xl font-black text-royal-blue mb-8 flex items-center gap-3 italic uppercase">
                <i className="fas fa-plus-circle text-vibrant-yellow"></i>
                Adicionar
              </h3>
              
              <div className="space-y-5">
                <div className="relative group">
                  <div className={`w-full h-56 rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all bg-gray-50 ${imagePreview ? 'border-royal-blue border-solid' : 'border-gray-200'}`}>
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-contain p-4" alt="Preview" />
                    ) : (
                      <div className="text-center opacity-30">
                        <i className="fas fa-camera text-5xl mb-3"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">Escolher Foto</p>
                      </div>
                    )}
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
                    <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-royal-blue/80 transition-all">
                      <span className="bg-vibrant-yellow text-royal-blue px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                        {imagePreview ? 'Trocar Foto' : 'Subir Imagem'}
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
                  <textarea placeholder="BREVE DESCRIÇÃO..." className="admin-input h-24 resize-none" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-royal-blue text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-vibrant-yellow hover:text-royal-blue transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  {loading && <i className="fas fa-spinner fa-spin"></i>}
                  {loading ? 'Sincronizando...' : 'Publicar Produto'}
                </button>
              </div>
            </div>
          </div>

          {/* Listagem de Produtos */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-royal-blue uppercase italic tracking-tighter">
                  Itens Cadastrados <span className="text-gray-300 ml-3 font-bold normal-case text-sm tracking-normal">({products.length})</span>
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-300 uppercase text-[10px] font-black tracking-[0.2em] border-b">
                    <tr>
                      <th className="px-8 py-6">Produto</th>
                      <th className="px-6 py-6">Categoria</th>
                      <th className="px-6 py-6">Preço</th>
                      <th className="px-8 py-6 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fetchLoading ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-royal-blue/10 border-t-royal-blue rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">Buscando do Supabase...</p>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-24 text-center">
                          <i className="fas fa-box-open text-5xl text-gray-100 mb-4"></i>
                          <p className="text-gray-400 font-bold italic">Estoque vazio. Comece a cadastrar!</p>
                        </td>
                      </tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-5">
                              <img src={p.image_url} className="w-14 h-14 object-contain rounded-2xl bg-white border shadow-sm group-hover:scale-110 transition-transform" alt="" />
                              <div>
                                <p className="font-black text-royal-blue leading-none uppercase tracking-tight">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{p.brand} {p.weight && `• ${p.weight}`}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${
                              p.category === 'Cachorro' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                              p.category === 'Gato' ? 'bg-purple-50 text-purple-500 border-purple-100' :
                              'bg-orange-50 text-orange-500 border-orange-100'
                            }`}>
                              {p.category}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-black text-royal-blue text-lg tracking-tighter">R$ {p.price.toFixed(2)}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <button 
                              onClick={() => setProductToDelete(p)}
                              className="w-11 h-11 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all inline-flex items-center justify-center shadow-sm"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
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

      {/* Modal Deleção Customizado */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-royal-blue/80 backdrop-blur-md" onClick={() => !loading && setProductToDelete(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl animate-scaleIn">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i className="fas fa-exclamation-circle text-4xl"></i>
            </div>
            <h2 className="text-3xl font-black text-royal-blue mb-3 uppercase italic tracking-tighter">Apagar Produto?</h2>
            <p className="text-gray-500 mb-10 leading-relaxed font-medium">
              Tem certeza que deseja remover <strong>{productToDelete.name}</strong>? Esta ação é irreversível no Supabase.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={loading}
                onClick={() => setProductToDelete(null)}
                className="bg-gray-100 text-gray-500 font-black py-5 rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {loading && <i className="fas fa-spinner fa-spin"></i>}
                {loading ? 'Removendo' : 'Confirmar'}
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
          transition: all 0.3s;
        }
        .admin-input:focus {
          border-color: #FFD700;
          background: white;
          box-shadow: 0 10px 20px -10px rgba(0,35,149,0.1);
        }
        .admin-input::placeholder { color: #d1d5db; font-weight: 800; }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default AdminPanel;
