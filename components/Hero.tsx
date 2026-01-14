
import React from 'react';
import { CONTACT } from '../constants';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden bg-royal-blue text-white py-20 md:py-32">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <i className="fas fa-paw text-[20rem] rotate-12"></i>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-8">
          <div className="inline-block bg-vibrant-yellow text-royal-blue px-6 py-2 rounded-full font-black uppercase text-xs mb-4 animate-bounce shadow-lg">
            <i className="fas fa-truck-fast mr-2"></i> Entregas Rápidas em Toda Seropédica
          </div>
          
          <h2 className="text-4xl md:text-7xl font-black leading-tight italic tracking-tighter">
            SEU PET MERECE O MELHOR E <br/>
            <span className="text-vibrant-yellow underline decoration-pet-red">NÓS ENTREGAMOS A ELES.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed">
            Referência em nutrição animal no Km 40 próximo ao Campo Tiradentes. <br className="hidden md:block" /> 
            Variedade, preço justo e a conveniência de pedir tudo pelo WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center">
            <a 
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-vibrant-yellow text-royal-blue px-10 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95"
            >
              <i className="fab fa-whatsapp text-3xl"></i>
              FAZER PEDIDO AGORA
            </a>
            <button 
              onClick={(e) => handleNavClick(e as any, 'catalogo')}
              className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-white hover:text-royal-blue hover:border-white transition-all active:scale-95"
            >
              VER CATÁLOGO
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
