
import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface InfoSectionsProps {
  lang: Language;
}

const InfoSections: React.FC<InfoSectionsProps> = ({ lang }) => {
  const d = translations[lang].disclaimer;
  const h = translations[lang].helpModal;

  return (
    <div className="mt-16 border-t-2 border-stone-200 pt-16 space-y-12 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-6">
          <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
            <h4 className="historical-font text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2 mb-4 flex items-center gap-3">
              <i className="fas fa-triangle-exclamation"></i> {d.title}
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase text-amber-800 mb-1">{d.veracityTitle}</p>
                <p className="text-xs text-stone-700 leading-relaxed text-justify italic">
                  ADVERTENCIA: Esta herramienta utiliza IA para rastrear fondos públicos. Aunque el sistema ha sido instruido para ser riguroso, pueden existir errores en la transcripción de apellidos o bandos militares. **Coteje siempre con la Signatura proporcionada.**
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-amber-800 mb-1">{d.archivesTitle}</p>
                <p className="text-xs text-stone-700 leading-relaxed text-justify">{d.archivesText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h4 className="historical-font text-2xl font-bold text-stone-800 border-b border-stone-200 pb-2 flex items-center gap-3">
            <i className="fas fa-book-open"></i> {h.sourcesTitle}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {h.sourcesList.map((source, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                <i className="fas fa-bookmark text-amber-600 mt-1 text-[10px]"></i>
                <p className="text-xs text-stone-700 font-medium">{source}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InfoSections;
