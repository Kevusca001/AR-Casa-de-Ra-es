
import React from 'react';
import { CONTACT, OPERATIONAL_HOURS } from '../constants';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-royal-blue text-white pt-16 pb-8 border-t-8 border-vibrant-yellow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-vibrant-yellow">
                <span className="text-royal-blue font-black text-2xl tracking-tighter">A.R</span>
              </div>
              <h5 className="text-2xl font-black">CASA DE RAÇÕES</h5>
            </div>
            <p className="text-white/70 leading-relaxed">
              Qualidade e tradição em Seropédica. O melhor para o seu pet, agora com checkout online simplificado.
            </p>
          </div>

          <div>
            <h6 className="text-vibrant-yellow font-black uppercase tracking-widest mb-6">Contato</h6>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <i className="fas fa-phone-alt text-vibrant-yellow"></i>
                <span className="font-bold">{CONTACT.displayPhone}</span>
              </li>
              <li className="flex gap-3">
                <i className="fas fa-map-marker-alt text-vibrant-yellow"></i>
                <span className="text-sm">{CONTACT.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-vibrant-yellow font-black uppercase tracking-widest mb-6">Funcionamento</h6>
            <ul className="space-y-4">
              {OPERATIONAL_HOURS.map((h, i) => (
                <li key={i} className="flex justify-between border-b border-white/10 pb-2 text-sm">
                  <span>{h.weekday}</span>
                  <span className="font-bold">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-vibrant-yellow font-black uppercase tracking-widest mb-6">Social</h6>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-vibrant-yellow hover:text-royal-blue transition-all">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-vibrant-yellow hover:text-royal-blue transition-all">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
            <button 
              onClick={onAdminClick}
              className="text-[10px] text-white/30 hover:text-white transition-colors flex items-center gap-1 uppercase font-bold tracking-tighter"
            >
              <i className="fas fa-lock"></i> Área Restrita
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} A.R Casa de Rações. Feito com carinho para Seropédica.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
