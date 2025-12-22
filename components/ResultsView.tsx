
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PersonRecord, SearchSummary, Category, Language, Source } from '../types';
import { translations } from '../i18n';
import L from 'leaflet';
import 'leaflet.markercluster';

interface ResultsViewProps {
  results: PersonRecord[]; 
  allResults: PersonRecord[];
  summary: SearchSummary;
  query: { firstName: string; lastName1: string; lastName2: string; fuzzySearch: boolean };
  savedRecordIds: string[];
  onToggleSaveRecord: (id: string) => void;
  filterState: any;
  setFilterState: any;
  lang: Language;
}

const CATEGORY_COLORS: Record<string, string> = {
  'combate': '#7f1d1d', 
  'retaguardia': '#9a3412', 
  'represión': '#1c1917', 
  'exilio': '#1e3a8a', 
  'desaparecido': '#581c87', 
  'combatiente condecorado': '#b45309', 
  'otros': '#44403c', 
};

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.trim() === '' || dateStr === '-' || dateStr.toLowerCase() === 'n/a') return 'N/D';
  const cleanStr = dateStr.trim();
  const ymd = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymd) return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  const dmy = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmy) return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`;
  return cleanStr;
};

const getCategoryColor = (cat: string) => CATEGORY_COLORS[cat.toLowerCase()] || '#44403c';

const ValueDisplay: React.FC<{ 
  value?: string; 
  label?: string; 
  tooltip: string; 
  light?: boolean;
  action?: React.ReactNode;
}> = ({ value, label, tooltip, light, action }) => {
  const displayValue = value && value.trim() !== '' && value !== '-' && value.toLowerCase() !== 'n/a' ? value : 'N/D';
  const isMissing = displayValue === 'N/D';
  
  return (
    <div>
      {label && (
        <p className={`text-[9px] font-black uppercase tracking-tighter mb-1 ${light ? 'text-stone-400' : 'text-stone-500'}`}>
          {label}
        </p>
      )}
      <div className="flex items-center gap-2">
        <p 
          className={`font-bold text-sm flex items-center gap-1.5 ${isMissing ? (light ? 'text-stone-500 italic' : 'text-stone-500 italic') : (light ? 'text-stone-200' : 'text-stone-800')}`}
          title={isMissing ? tooltip : undefined}
        >
          {displayValue}
          {isMissing && <i className="fas fa-circle-info opacity-40 text-[10px]"></i>}
        </p>
        {!isMissing && action}
      </div>
    </div>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, summary, lang }) => {
  const t = translations[lang].results;
  const commonT = translations[lang];
  const [selectedSourceRecord, setSelectedSourceRecord] = useState<PersonRecord | null>(null);
  const [activeShareMenu, setActiveShareMenu] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  
  const [locationQuery, setLocationQuery] = useState('');
  const [rankQuery, setRankQuery] = useState('');

  const finalResults = useMemo(() => {
    let filtered = results;
    if (locationQuery.trim()) {
      const lowerLoc = locationQuery.toLowerCase();
      filtered = filtered.filter(r => (r.location?.toLowerCase().includes(lowerLoc)) || (r.birthPlace?.toLowerCase().includes(lowerLoc)));
    }
    if (rankQuery.trim()) {
      const lowerRank = rankQuery.toLowerCase();
      filtered = filtered.filter(r => r.rank?.toLowerCase().includes(lowerRank));
    }
    return filtered;
  }, [results, locationQuery, rankQuery]);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, { scrollWheelZoom: false }).setView([40.4168, -3.7038], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
      clusterGroupRef.current = (L as any).markerClusterGroup();
      mapInstanceRef.current.addLayer(clusterGroupRef.current);
    }
    const clusters = clusterGroupRef.current;
    if (clusters) {
      clusters.clearLayers();
      finalResults.filter(r => r.latitude && r.longitude).forEach(record => {
        const markerColor = getCategoryColor(record.category);
        clusters.addLayer(L.marker([record.latitude!, record.longitude!], { 
          icon: L.divIcon({
            html: `<div style="background-color: ${markerColor}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
            className: 'custom-marker',
            iconSize: [10, 10]
          })
        }).bindPopup(`<b>${record.fullName}</b>`));
      });
    }
  }, [finalResults]);

  const generateRecordText = (record: PersonRecord) => {
    const d = "--------------------------------------------------";
    return `INVESTIGACIÓN HISTÓRICA - MemoriaViva\n` +
           `${d}\n` +
           `NOMBRE: ${record.fullName}\n` +
           `CATEGORÍA: ${record.category}\n` +
           `ESTADO: ${record.status}\n` +
           `LOCALIZACIÓN: ${record.location}\n` +
           `${d}\n\n` +
           `BIOGRAFÍA:\n${record.details}\n\n` +
           (record.additionalNotes ? `NOTAS ADICIONALES (FOSAS/HONORES):\n${record.additionalNotes}\n\n` : '') +
           `FUENTES:\n` +
           record.sources.map(s => `  - ${s.title}: ${s.url}`).join('\n') +
           `\n\nGenerado por MemoriaViva el ${new Date().toLocaleString()}`;
  };

  const handleDownloadRecordTxt = (record: PersonRecord) => {
    const blob = new Blob([generateRecordText(record)], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Ficha_${record.fullName.replace(/\s+/g, '_')}.txt`;
    link.click();
    setActiveShareMenu(null);
  };

  return (
    <div className="space-y-12 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-stone-900 text-white p-8 rounded-2xl shadow-xl">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-6">{t.statsTitle}</h3>
          <div className="space-y-4">
            {Object.entries(summary.categoriesBreakdown || {}).map(([name, value]) => (
              (value as number) > 0 && (
                <div key={name} className="flex justify-between text-[11px] font-bold uppercase">
                  <span className="text-stone-400">{name}</span><span>{value as React.ReactNode}</span>
                </div>
              )
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">{t.analysisTitle}</h3>
          <p className="historical-font text-xl text-stone-800 leading-relaxed italic">{summary.keyFindings}</p>
          
          {summary.groundingSources && summary.groundingSources.length > 0 && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-amber-600 mb-3">Fuentes Verificadas (Google Search)</h4>
              <div className="flex flex-wrap gap-2">
                {summary.groundingSources.map((source, idx) => (
                  <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-600 transition-colors">
                    <i className="fas fa-link mr-1 opacity-50"></i>{source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder={t.locationFilterPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <input 
              type="text" 
              value={rankQuery}
              onChange={(e) => setRankQuery(e.target.value)}
              placeholder={t.rankFilterPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Filtrado</p>
            <p className="text-2xl font-bold historical-font">{finalResults.length} / {results.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border shadow-sm">
          <div ref={mapContainerRef} className="h-64 rounded-xl overflow-hidden border" />
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl historical-font font-bold">{t.identifiedRecords} ({finalResults.length})</h3>
        
        {finalResults.length === 0 ? (
          <div className="p-12 bg-white border-2 border-dashed border-stone-200 rounded-3xl text-center">
            <p className="text-stone-500 historical-font text-xl italic">{commonT.noResultsFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {finalResults.map((record) => (
              <div key={record.id} className="bg-white border-2 p-8 rounded-3xl shadow-sm flex flex-col hover:border-amber-500 transition-all border-stone-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <button onClick={() => setActiveShareMenu(activeShareMenu === record.id ? null : record.id)} className="px-4 py-2 bg-stone-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-100">
                      <i className="fas fa-share-nodes mr-2"></i>{t.share}
                    </button>
                    {activeShareMenu === record.id && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-2xl z-[100] p-2">
                         <button onClick={() => { navigator.clipboard.writeText(generateRecordText(record)); setCopiedStatus(record.id); setTimeout(() => setCopiedStatus(null), 2000); setActiveShareMenu(null); }} className="w-full text-left px-3 py-3 text-[10px] font-bold uppercase hover:bg-stone-50 rounded flex items-center gap-3">
                           <i className="fas fa-copy text-amber-600"></i> {copiedStatus === record.id ? t.copied : t.shareOptions.copyText}
                         </button>
                         <button onClick={() => handleDownloadRecordTxt(record)} className="w-full text-left px-3 py-3 text-[10px] font-bold uppercase hover:bg-stone-50 rounded flex items-center gap-3">
                           <i className="fas fa-file-arrow-down text-stone-600"></i> {t.shareOptions.download}
                         </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] px-3 py-1.5 rounded-full text-white font-black uppercase tracking-widest" style={{ backgroundColor: getCategoryColor(record.category) }}>
                    {record.category}
                  </span>
                </div>

                <h4 className="historical-font text-3xl font-bold uppercase leading-tight mb-4">{record.fullName}</h4>

                <div className="bg-stone-50 p-6 rounded-2xl mb-6 text-sm text-stone-600 flex-grow">
                   <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
                     <ValueDisplay label={t.location} value={record.location} tooltip={t.dataNotAvailable} />
                     <ValueDisplay label={t.date} value={formatDate(record.date)} tooltip={t.dataNotAvailable} />
                   </div>
                   <p className="historical-font italic leading-relaxed text-stone-800 text-justify mb-4">{record.details}</p>
                   
                   {/* Nueva sección para notas adicionales (donde irán los datos de fosas/entierro) */}
                   {record.additionalNotes && (
                     <div className="mt-4 pt-4 border-t border-stone-200">
                        <p className="text-[9px] font-black uppercase tracking-tighter text-amber-700 mb-1">Información de Memoria (Fosas/Entierro/Honores)</p>
                        <p className="text-xs italic text-stone-700">{record.additionalNotes}</p>
                     </div>
                   )}
                </div>

                <button onClick={() => setSelectedSourceRecord(record)} className="w-full py-4 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">
                  <i className="fas fa-folder-tree text-amber-500 mr-2"></i>{t.exploreSources}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSourceRecord && (
        <div className="fixed inset-0 bg-stone-900/90 z-[150] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedSourceRecord(null)}>
          <div className="bg-white max-w-lg w-full rounded-2xl p-8 max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="historical-font text-2xl font-bold">Fuentes Documentales</h2>
              <button onClick={() => setSelectedSourceRecord(null)} className="text-stone-400 hover:text-stone-900"><i className="fas fa-times text-xl"></i></button>
            </div>
            <div className="space-y-6">
              {selectedSourceRecord.sources.map((s, i) => (
                <div key={i} className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <p className="font-bold text-lg mb-2">{s.title}</p>
                  <p className="text-[10px] font-mono mb-3 p-1 bg-amber-100 inline-block rounded">SIGNATURA: {s.searchPath || 'N/A'}</p>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="block text-center py-2 bg-stone-800 text-white text-[10px] font-black uppercase rounded hover:bg-black">Ir al Archivo</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
