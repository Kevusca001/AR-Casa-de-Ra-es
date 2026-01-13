
import React, { useState } from 'react';
import { CONTACT } from '../constants';

interface HeaderProps {
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    onNavigateHome(); // Garante que volta pra home se estiver no admin
    
    // Pequeno timeout para garantir que o componente montou se houve troca de screen
    setTimeout(() => {
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
    }, 50);
    
    setIsOpen(false);
  };

  return (
    <header className="bg-royal-blue text-white sticky top-0 z-50 shadow-lg border-b-4 border-vibrant-yellow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, 'home')} 
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-12 h-12 md:w-14 md:h-14 bg-royal-blue border-4 border-vibrant-yellow rounded-full flex items-center justify-center">
            <span className="text-vibrant-yellow font-black text-xl md:text-2xl tracking-tighter">A.R</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-none">CASA DE RAÇÕES</h1>
            <p className="text-[10px] text-vibrant-yellow font-medium uppercase">Seropédica - RJ</p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-vibrant-yellow transition-colors font-semibold">Início</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'sobre')} className="hover:text-vibrant-yellow transition-colors font-semibold">Sobre</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'catalogo')} className="hover:text-vibrant-yellow transition-colors font-semibold">Produtos</a>
          <a 
            href={`https://wa.me/${CONTACT.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-vibrant-yellow text-royal-blue px-4 py-2 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105"
          >
            WhatsApp
          </a>
        </nav>

        <button 
          className="md:hidden text-vibrant-yellow text-2xl p-2"
          onClick={toggleMenu}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-royal-blue border-t border-vibrant-yellow/30 p-4 space-y-4 shadow-inner">
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="block py-3 border-b border-vibrant-yellow/10 font-bold">Início</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'sobre')} className="block py-3 border-b border-vibrant-yellow/10 font-bold">Sobre</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'catalogo')} className="block py-3 border-b border-vibrant-yellow/10 font-bold">Produtos</a>
          <a 
            href={`https://wa.me/${CONTACT.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-vibrant-yellow text-royal-blue p-4 rounded-xl text-center font-black"
          >
            WHATSAPP
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
