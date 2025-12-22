
import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface AboutPageProps {
  lang: Language;
  onClose: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ lang, onClose }) => {
  const t = translations[lang].about;
  const commonT = translations[lang];

  return (
    <div className="fixed inset-0 bg-stone-950/90 z-[300] flex items-center justify-center p-4 backdrop-blur-lg animate-in fade-in zoom-in duration-300">
      <div className="bg-[#fcfaf5] max-w-4xl w-full rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] border-8 border-stone-200">
        <div className="bg-stone-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="historical-font text-4xl font-bold text-amber-500">{t.title}</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">MemoriaViva Project • 2024</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition border border-white/20">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-4">
              <h3 className="text-amber-800 historical-font text-2xl font-bold border-b border-amber-200 pb-2">
                <i className="fas fa-bullseye mr-3 opacity-50"></i>{t.missionTitle}
              </h3>
              <p className="text-stone-700 leading-relaxed text-justify historical-font text-lg italic">
                {t.missionText}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-stone-900 historical-font text-2xl font-bold border-b border-stone-200 pb-2">
                <i className="fas fa-microscope mr-3 opacity-50"></i>{t.methodologyTitle}
              </h3>
              <p className="text-stone-600 leading-relaxed text-justify text-sm">
                {t.methodologyText}
              </p>
              <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 flex gap-4 items-center">
                 <i className="fas fa-database text-stone-400"></i>
                 <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">PARES • CDMH • ARCHIVOS MILITARES • COMBATIENTES.ES</p>
              </div>
            </section>
          </div>

          <section className="bg-stone-900 text-stone-100 p-10 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
               <i className="fas fa-landmark text-9xl"></i>
            </div>
            <div className="relative z-10 space-y-4 max-w-2xl">
              <h3 className="text-amber-500 historical-font text-3xl font-bold">
                {t.importanceTitle}
              </h3>
              <p className="text-stone-300 leading-relaxed text-justify historical-font text-xl italic">
                "{t.importanceText}"
              </p>
            </div>
          </section>

          <section className="border-t border-stone-200 pt-8">
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Memoria Democrática</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Justicia Transicional</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Reparación Histórica</p>
            </div>
          </section>
        </div>

        <div className="p-8 bg-stone-50 border-t border-stone-200 flex justify-center">
          <button onClick={onClose} className="px-12 py-4 bg-stone-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all border-b-4 border-stone-700 active:translate-y-1">
            {commonT.closeAbout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
