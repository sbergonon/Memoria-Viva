
import React, { useState } from 'react';
import { PersonRecord, SearchSummary, Language } from '../types';
import { translations } from '../i18n';

interface ReportGeneratorProps {
  results: PersonRecord[];
  summary: SearchSummary;
  query: { firstName: string; lastName1: string; lastName2: string };
  lang: Language;
}

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.trim() === '' || dateStr === '-' || dateStr.toLowerCase() === 'n/a') return 'N/D';
  const cleanStr = dateStr.trim();
  const ymd = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymd) return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  const dmy = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmy) return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`;
  return cleanStr;
};

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ results, summary, query, lang }) => {
  const t = translations[lang].report;
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const generateFullTextReport = () => {
    const divider = "================================================================================";
    const subDivider = "--------------------------------------------------------------------------------";
    
    return `${divider}\n` +
      `INFORME DE INVESTIGACIÓN HISTÓRICA - MEMORIAVIVA\n` +
      `${divider}\n\n` +
      `SUJETO: ${query.firstName} ${query.lastName1} ${query.lastName2}\n` +
      `EMISIÓN: ${new Date().toLocaleString()}\n` +
      `REGISTROS SELECCIONADOS: ${results.length}\n\n` +
      `1. SÍNTESIS GENERAL\n` +
      `${subDivider}\n` +
      `${summary.keyFindings}\n\n` +
      `2. RELACIÓN DOCUMENTAL\n` +
      `${subDivider}\n\n` +
      results.map((r, i) => 
        `[${i + 1}] ${r.fullName}\n` +
        `Categoría: ${r.category}\n` +
        `Ubicación: ${r.location}\n` +
        `Fecha: ${formatDate(r.deathDate || r.date)}\n` +
        `Biografía: ${r.details}\n` +
        `Fuentes: ${r.sources.map(s => `${s.title} (${s.searchPath || 'S/S'})`).join(', ')}\n` +
        `${subDivider}`
      ).join('\n\n') +
      `\n\n${divider}\n` +
      `Documento generado por MemoriaViva • https://memoriaviva.ia\n` +
      `${divider}\n`;
  };

  const handleDownloadTxt = () => {
    const text = generateFullTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Investigacion_${query.lastName1}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateFullTextReport());
    setCopyStatus("¡Copiado!");
    setTimeout(() => setCopyStatus(null), 3000);
    setShowShareMenu(false);
  };

  const handleShareEmail = () => {
    const subject = `Investigación MemoriaViva: ${query.lastName1}`;
    const body = generateFullTextReport();
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareMenu(false);
  };

  return (
    <div className="mt-16 p-12 bg-stone-100 text-center space-y-8 border-t border-stone-200 rounded-b-3xl">
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-stone-500">{t.finishTitle}</h3>
        <p className="text-[11px] text-amber-700 font-bold uppercase tracking-widest italic">
          <i className="fas fa-check-circle mr-2"></i>{results.length} registros seleccionados para el informe
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={handleDownloadTxt} className="px-10 py-5 bg-amber-800 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-amber-900 transition-all border-b-4 border-amber-950 active:translate-y-1">
          <i className="fas fa-file-download mr-3"></i>{t.downloadFullTxt}
        </button>

        <div className="relative">
          <button onClick={() => setShowShareMenu(!showShareMenu)} className="px-10 py-5 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all border-b-4 border-stone-950 active:translate-y-1">
            <i className="fas fa-share-nodes mr-3"></i>{t.shareReport}
          </button>
          
          {showShareMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl z-[150] p-2">
              <button onClick={handleCopyToClipboard} className="w-full text-left px-4 py-4 text-[10px] font-black uppercase hover:bg-stone-50 rounded-xl flex items-center gap-3 border-b border-stone-100 transition-colors">
                <i className="fas fa-copy text-amber-600"></i> {copyStatus || t.shareOptions.copy}
              </button>
              <button onClick={handleShareEmail} className="w-full text-left px-4 py-4 text-[10px] font-black uppercase hover:bg-stone-50 rounded-xl flex items-center gap-3 transition-colors">
                <i className="fas fa-envelope text-blue-600"></i> {t.shareOptions.email}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
