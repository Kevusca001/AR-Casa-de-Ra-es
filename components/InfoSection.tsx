
import React from 'react';
import { CONTACT } from '../constants';

const InfoSection: React.FC = () => {
  const features = [
    {
      icon: 'fa-truck-fast',
      title: 'Entrega Rápida',
      desc: 'Entregamos em toda a região do Km 40 e Campo Tiradentes.'
    },
    {
      icon: 'fa-award',
      title: 'Referência Local',
      desc: 'Mais de 10 anos atendendo com carinho a comunidade de Seropédica.'
    },
    {
      icon: 'fa-boxes-stacked',
      title: 'Variedade',
      desc: 'As melhores marcas: Quatree, Golden, WestDog, Toro e mais.'
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-royal-blue text-4xl font-black mb-4">Por que escolher a A.R?</h3>
          <p className="text-gray-600 text-lg">Cuidar do seu pet é nossa prioridade. Oferecemos o que há de melhor no mercado pet com a conveniência que você precisa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-2xl border-b-8 border-royal-blue hover:border-vibrant-yellow transition-colors group">
              <div className="w-16 h-16 bg-royal-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-vibrant-yellow transition-colors">
                <i className={`fas ${f.icon} text-white group-hover:text-royal-blue text-2xl`}></i>
              </div>
              <h4 className="text-2xl font-black text-royal-blue mb-2">{f.title}</h4>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div id="localizacao" className="mt-20 bg-royal-blue rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
            <i className="fas fa-map-marker-alt text-[15rem]"></i>
          </div>
          <div className="md:w-1/2 z-10">
            <h4 className="text-vibrant-yellow text-3xl font-black mb-4 uppercase tracking-wider">Nossa Localização</h4>
            <p className="text-2xl font-medium mb-6">{CONTACT.address}</p>
            <div className="flex gap-4">
               <a 
                 href={`https://www.google.com/maps/search/${encodeURIComponent(CONTACT.address)}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-white text-royal-blue px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-vibrant-yellow transition-all"
               >
                 <i className="fas fa-location-arrow"></i>
                 Como Chegar
               </a>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-64 bg-gray-200 rounded-2xl overflow-hidden border-4 border-vibrant-yellow z-10">
            <img 
              src="https://picsum.photos/seed/map/600/400" 
              alt="Mapa local" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
