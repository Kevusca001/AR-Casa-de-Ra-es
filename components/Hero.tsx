
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
            Referência em nutrição animal no Campo Lindo próximo ao Dom Bosco. <br className="hidden md:block" /> 
            Variedade, preço justo e a conveniência de pedir tudo pelo WhatsApp.
          </p>
          
          <div className="flex justify-center pt-8">
            <a 
              href="#catalogo"
              onClick={(e) => handleNavClick(e, 'catalogo')}
              className="bg-vibrant-yellow text-royal-blue px-12 py-6 rounded-3xl font-black text-2xl flex items-center justify-center transition-all shadow-2xl shadow-yellow-500/40 active:scale-95 animate-pulse-scale"
            >
              FAZER PEDIDO AGORA
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
