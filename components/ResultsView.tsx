
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PersonRecord, SearchSummary, Category, Language, Source } from '../types';
import { translations } from '../i18n';
import InfoSections from './InfoSections';
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
  selectedForReport: string[];
  onToggleSelection: (id: string) => void;
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
  important?: boolean;
}> = ({ value, label, tooltip, important }) => {
  const displayValue = value && value.trim() !== '' && value !== '-' && value.toLowerCase() !== 'n/a' ? value : 'N/D';
  const isMissing = displayValue === 'N/D';
  
  return (
    <div className={important ? 'bg-amber-50 p-2 rounded-lg border border-amber-100' : ''}>
      {label && (
        <p className="text-[9px] font-black uppercase tracking-tighter mb-1 text-stone-500">
          {label}
        </p>
      )}
      <p className={`font-bold text-sm flex items-center gap-1.5 ${isMissing ? 'text-stone-400 italic' : (important ? 'text-amber-900' : 'text-stone-800')}`}>
        {important && !isMissing && <i className="fas fa-medal text-amber-500 text-[10px]"></i>}
        {displayValue}
      </p>
    </div>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, summary, lang, query, selectedForReport, onToggleSelection }) => {
  const t = translations[lang].results;
  const commonT = translations[lang];
  
  const [selectedSourceRecord, setSelectedSourceRecord] = useState<PersonRecord | null>(null);
  const [activeShareMenu, setActiveShareMenu] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');

  const finalResults = useMemo(() => {
    const searchLastName = query.lastName1.toLowerCase();
    let filtered = results.filter(r => r.fullName.toLowerCase().includes(searchLastName));
    
    if (locationFilter.trim()) {
      const lowerLoc = locationFilter.toLowerCase();
      filtered = filtered.filter(r => 
        (r.location?.toLowerCase().includes(lowerLoc)) || 
        (r.birthPlace?.toLowerCase().includes(lowerLoc)) ||
        (r.additionalNotes?.toLowerCase().includes(lowerLoc))
      );
    }
    return filtered;
  }, [results, locationFilter, query]);
  
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

  const handleIndividualShare = (record: PersonRecord, method: 'copy' | 'whatsapp' | 'email' | 'download') => {
    const text = `Ficha Histórica: ${record.fullName}\nCategoría: ${record.category}\nUbicación: ${record.location}\nFecha: ${formatDate(record.deathDate || record.date)}\nDetalles: ${record.details}\nFuentes: ${record.sources.map(s => `${s.title} (${s.searchPath})`).join(', ')}`;

    if (method === 'copy') {
      navigator.clipboard.writeText(text);
    } else if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else if (method === 'email') {
      window.location.href = `mailto:?subject=Ficha MemoriaViva: ${record.fullName}&body=${encodeURIComponent(text)}`;
    } else if (method === 'download') {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ficha_${record.fullName.replace(/\s+/g, '_')}.txt`;
      a.click();
    }
    setActiveShareMenu(null);
  };

  return (
    <div className="space-y-12 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-magnifying-glass-chart text-xl"></i>
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-900">{t.analysisTitle}</h3>
          </div>
          <p className="historical-font text-xl text-stone-800 leading-relaxed italic border-l-4 border-amber-500 pl-6">{summary.keyFindings}</p>
        </div>

        <div className="bg-stone-900 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-3 flex items-center gap-2">
            <i className="fas fa-location-dot"></i> Filtrar Provincia
          </label>
          <input 
            type="text" 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Teruel, Madrid..."
            className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-stone-500"
          />
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-3xl historical-font font-bold flex items-center gap-4">
          <i className="fas fa-folder-open text-stone-400"></i>
          {t.identifiedRecords} ({finalResults.length})
        </h3>
        
        {finalResults.length === 0 ? (
          <div className="p-20 bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl text-center">
            <i className="fas fa-database text-4xl text-stone-300 mb-6"></i>
            <p className="text-stone-500 historical-font text-xl italic max-w-lg mx-auto">{commonT.noResultsFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {finalResults.map((record) => {
              const isCombatant = record.category.toLowerCase().includes('combate') || record.category.toLowerCase().includes('condecorado') || !!record.rank;
              const isSelected = selectedForReport.includes(record.id);
              
              return (
                <div key={record.id} className={`bg-white border-2 p-8 rounded-3xl shadow-md flex flex-col hover:shadow-xl transition-all relative ${isCombatant ? 'border-amber-200' : 'border-stone-100'}`}>
                  <div className="absolute top-6 right-6 z-10">
                    <button 
                      onClick={() => onToggleSelection(record.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-stone-200 text-stone-200 hover:border-amber-400'}`}
                    >
                      <i className={`fas ${isSelected ? 'fa-check' : 'fa-plus'} text-xs`}></i>
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[7px] font-black bg-stone-900 text-white px-2 py-1 rounded shadow-sm">
                        <i className="fas fa-certificate text-amber-400 mr-1"></i> VERIFICADO
                      </span>
                      <span className="text-[9px] px-3 py-1.5 rounded-full text-white font-black uppercase tracking-widest" style={{ backgroundColor: getCategoryColor(record.category) }}>
                        {record.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="historical-font text-3xl font-bold uppercase mb-4 pr-10">{record.fullName}</h4>

                  <div className="bg-stone-50 p-6 rounded-2xl mb-6 text-sm text-stone-600 flex-grow border border-stone-100">
                     <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-stone-200">
                       <ValueDisplay label="Rango" value={record.rank} tooltip={t.dataNotAvailable} important={!!record.rank} />
                       <ValueDisplay label="Cuerpo" value={record.unit} tooltip={t.dataNotAvailable} />
                     </div>
                     <ValueDisplay label="Hechos" value={formatDate(record.deathDate || record.date)} tooltip={t.dataNotAvailable} />
                     <p className="mt-4 historical-font italic text-stone-800 text-base leading-relaxed">{record.details}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedSourceRecord(record)} className="flex-1 py-4 bg-stone-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all">
                      <i className="fas fa-scroll text-amber-500 mr-2"></i>{t.exploreSources}
                    </button>
                    <div className="relative">
                      <button onClick={() => setActiveShareMenu(activeShareMenu === record.id ? null : record.id)} className="p-4 bg-amber-100 text-amber-900 rounded-xl hover:bg-amber-200 transition-all border border-amber-200">
                        <i className="fas fa-share-nodes"></i>
                      </button>
                      {activeShareMenu === record.id && (
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-stone-200 rounded-xl shadow-2xl z-50 p-1">
                          <button onClick={() => handleIndividualShare(record, 'copy')} className="w-full text-left px-3 py-2 text-[9px] font-bold uppercase hover:bg-stone-50 rounded-lg flex items-center gap-2">
                            <i className="fas fa-copy text-amber-600"></i> {t.shareOptions.copyText}
                          </button>
                          <button onClick={() => handleIndividualShare(record, 'whatsapp')} className="w-full text-left px-3 py-2 text-[9px] font-bold uppercase hover:bg-stone-50 rounded-lg flex items-center gap-2">
                            <i className="fab fa-whatsapp text-green-600"></i> {t.shareOptions.whatsapp}
                          </button>
                          <button onClick={() => handleIndividualShare(record, 'email')} className="w-full text-left px-3 py-2 text-[9px] font-bold uppercase hover:bg-stone-50 rounded-lg flex items-center gap-2">
                            <i className="fas fa-envelope text-blue-600"></i> {t.shareOptions.email}
                          </button>
                          <button onClick={() => handleIndividualShare(record, 'download')} className="w-full text-left px-3 py-2 text-[9px] font-bold uppercase hover:bg-stone-50 rounded-lg flex items-center gap-2">
                            <i className="fas fa-download text-stone-600"></i> {t.shareOptions.download}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <InfoSections lang={lang} />

      {selectedSourceRecord && (
        <div className="fixed inset-0 bg-stone-900/95 z-[150] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setSelectedSourceRecord(null)}>
          <div className="bg-white max-w-xl w-full rounded-3xl p-10 max-h-[85vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <i className="fas fa-book-open text-3xl text-amber-700"></i>
                <h2 className="historical-font text-3xl font-bold uppercase">Fuentes Oficiales</h2>
              </div>
              <button onClick={() => setSelectedSourceRecord(null)} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors">
                <i className="fas fa-times text-xl text-stone-400"></i>
              </button>
            </div>
            <div className="space-y-6">
              {selectedSourceRecord.sources.map((s, i) => (
                <div key={i} className="p-6 rounded-2xl border-2 bg-stone-50 border-stone-100">
                  <p className="font-bold text-xl text-stone-900 mb-2">{s.title}</p>
                  <p className="text-[10px] font-mono p-1.5 bg-stone-900 text-amber-400 rounded uppercase font-bold mb-4 inline-block">
                    <i className="fas fa-barcode mr-2"></i>SIGNATURA: {s.searchPath || 'Consultar en Archivo'}
                  </p>
                  {s.url.startsWith('http') && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-stone-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-black flex items-center justify-center gap-2">
                      <i className="fas fa-external-link-alt"></i> Fondo Digital
                    </a>
                  )}
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
