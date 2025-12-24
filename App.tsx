
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SearchState, PersonRecord, Category, Language } from './types';
import { GeminiService } from './services/geminiService';
import SearchForm from './components/SearchForm';
import ResultsView from './components/ResultsView';
import ReportGenerator from './components/ReportGenerator';
import AboutPage from './components/AboutPage';
import InfoSections from './components/InfoSections';
import { translations } from './i18n';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  });

  const t = translations[lang];
  const rc = translations[lang].resetConfirm;

  const [state, setState] = useState<SearchState>({
    query: { firstName: '', lastName1: '', lastName2: '', militaryServiceNumber: '', fuzzySearch: true },
    results: [],
    summary: null,
    loading: false,
    error: null,
    searchedOnce: false
  });

  const [loadingTime, setLoadingTime] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedForReport, setSelectedForReport] = useState<string[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let interval: number;
    let timer: number;
    if (state.loading) {
      setLoadingTime(0);
      interval = window.setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % t.loadingMessages.length);
      }, 3500);
      timer = window.setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [state.loading, t.loadingMessages.length]);

  const handleSearch = async (params: { firstName: string; lastName1: string; lastName2: string; militaryServiceNumber: string; fuzzy: boolean }) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      searchedOnce: true, 
      results: [], 
      summary: null,
      query: { ...params, fuzzySearch: params.fuzzy } 
    }));
    
    try {
      const service = new GeminiService();
      const { results, summary } = await service.searchRecords({ ...params, language: lang });
      
      if (abortControllerRef.current?.signal.aborted) return;
      
      setState(prev => ({ 
        ...prev, 
        results: results || [], 
        summary: summary || null, 
        loading: false 
      }));
      
      if (results) setSelectedForReport(results.map(r => r.id));
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    } finally {
      abortControllerRef.current = null;
    }
  };

  const performReset = () => {
    setState({
      query: { firstName: '', lastName1: '', lastName2: '', militaryServiceNumber: '', fuzzySearch: true },
      results: [],
      summary: null,
      loading: false,
      error: null,
      searchedOnce: false
    });
    setSelectedForReport([]);
    setShowResetConfirm(false);
  };

  const filteredResults = useMemo(() => {
    if (!state.results) return [];
    return state.results.filter(r => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(r.category);
      return categoryMatch;
    });
  }, [state.results, selectedCategories]);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-stone-900 text-white pt-12 pb-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-4">
              <button onClick={() => setShowAboutPage(true)} className="px-4 py-2 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                <i className="fas fa-info-circle text-amber-500"></i>{t.aboutProject}
              </button>
              <button onClick={() => setShowHelpModal(true)} className="px-4 py-2 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                <i className="fas fa-question-circle text-amber-500"></i>{t.helpButton}
              </button>
            </div>
            <div className="bg-stone-800 rounded-lg p-1 flex gap-1">
              <button onClick={() => setLang('es')} className={`px-3 py-1 text-[10px] font-bold rounded ${lang === 'es' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}>ES</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}>EN</button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg"><i className="fas fa-landmark text-3xl"></i></div>
            <h1 className="historical-font text-5xl md:text-6xl font-bold tracking-tight">{t.appTitle}</h1>
          </div>
          <p className="text-xl text-stone-300 historical-font font-light">{t.appSubtitle}</p>
        </div>
      </header>

      {showAboutPage && <AboutPage lang={lang} onClose={() => setShowAboutPage(false)} />}
      
      {showHelpModal && (
        <div className="fixed inset-0 bg-stone-950/90 z-[400] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setShowHelpModal(false)}>
          <div className="bg-white max-w-2xl w-full rounded-3xl p-10 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="historical-font text-3xl font-bold uppercase">{t.helpCenter}</h2>
              <button onClick={() => setShowHelpModal(false)} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="space-y-8">
               <section>
                 <h3 className="font-black text-xs uppercase tracking-widest text-amber-700 mb-4">{translations[lang].helpModal.instructionsTitle}</h3>
                 <ul className="space-y-3 text-stone-600 text-sm">
                   <li className="flex gap-3"><i className="fas fa-1 text-[10px] bg-stone-100 p-1.5 rounded h-fit"></i> {translations[lang].helpModal.instructions1}</li>
                   <li className="flex gap-3"><i className="fas fa-2 text-[10px] bg-stone-100 p-1.5 rounded h-fit"></i> {translations[lang].helpModal.instructions2}</li>
                   <li className="flex gap-3"><i className="fas fa-3 text-[10px] bg-stone-100 p-1.5 rounded h-fit"></i> {translations[lang].helpModal.instructions3}</li>
                 </ul>
               </section>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-stone-950/60 z-[400] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 border border-stone-200">
            <h3 className="historical-font text-2xl font-bold text-stone-900 mb-4">{rc.title}</h3>
            <p className="text-stone-600 text-sm mb-8">{rc.message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowResetConfirm(false)} className="px-6 py-3 text-stone-500 uppercase font-black text-[10px]">{rc.cancel}</button>
              <button onClick={performReset} className="px-6 py-3 bg-red-700 text-white rounded-xl uppercase font-black text-[10px]">{rc.confirm}</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        <div className="flex justify-end mb-4">
          {state.searchedOnce && !state.loading && (
            <button onClick={() => setShowResetConfirm(true)} className="px-4 py-2 text-stone-600 hover:text-red-700 transition text-[10px] font-black uppercase tracking-widest bg-white rounded-xl border border-stone-200 shadow-md">
              <i className="fas fa-plus mr-2"></i>{t.newSearch}
            </button>
          )}
        </div>

        <SearchForm onSearch={(p) => handleSearch(p)} loading={state.loading} lang={lang} initialData={state.searchedOnce ? state.query : undefined} />

        {state.loading && (
          <div className="mt-12 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-stone-200">
             <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-stone-800 font-black uppercase tracking-widest text-sm mb-1">{t.loadingMessages[loadingMessageIndex]}</p>
             <p className="text-amber-700 font-bold text-lg mb-4">{loadingTime}s</p>
             <p className="text-[10px] text-stone-400 uppercase font-bold tracking-tighter mb-8 italic">Investigación en profundidad: este proceso puede demorar hasta 2 minutos.</p>
             <button onClick={() => setState(prev => ({ ...prev, loading: false }))} className="px-6 py-3 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-700 rounded-xl text-[10px] font-black uppercase border border-stone-200 transition-colors">
               {t.stopSearch}
             </button>
          </div>
        )}

        {state.error && !state.loading && (
          <div className="mt-8 p-6 bg-red-50 border border-red-100 text-red-800 rounded-2xl flex items-center gap-4">
             <i className="fas fa-circle-exclamation text-2xl"></i><p className="font-bold">{state.error}</p>
          </div>
        )}

        {!state.loading && !state.searchedOnce && (
          <div className="mt-12 opacity-90">
             <InfoSections lang={lang} />
          </div>
        )}

        {!state.loading && state.searchedOnce && state.summary && (
          <div className="mt-8 animate-in fade-in duration-700">
            <ResultsView 
              results={filteredResults} 
              allResults={state.results}
              summary={state.summary} 
              query={state.query}
              savedRecordIds={[]}
              onToggleSaveRecord={() => {}}
              filterState={{ selectedCategories }}
              setFilterState={{ setSelectedCategories }}
              lang={lang}
              selectedForReport={selectedForReport}
              onToggleSelection={(id) => setSelectedForReport(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
            />
            {selectedForReport.length > 0 && (
              <ReportGenerator 
                results={state.results.filter(r => selectedForReport.includes(r.id))} 
                summary={state.summary} 
                query={state.query} 
                lang={lang} 
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
