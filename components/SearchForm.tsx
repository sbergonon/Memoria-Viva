
import React, { useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface SearchFormProps {
  onSearch: (data: { firstName: string; lastName1: string; lastName2: string; militaryServiceNumber: string; fuzzy: boolean }) => void;
  loading: boolean;
  initialData?: { firstName: string; lastName1: string; lastName2: string; militaryServiceNumber: string; fuzzySearch: boolean };
  lang: Language;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading, initialData, lang }) => {
  const t = translations[lang].searchForm;
  const [firstName, setFirstName] = React.useState('');
  const [lastName1, setLastName1] = React.useState('');
  const [lastName2, setLastName2] = React.useState('');
  const [militaryServiceNumber, setMilitaryServiceNumber] = React.useState('');
  const [fuzzy, setFuzzy] = React.useState(true);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '');
      setLastName1(initialData.lastName1 || '');
      setLastName2(initialData.lastName2 || '');
      setMilitaryServiceNumber(initialData.militaryServiceNumber || '');
      setFuzzy(initialData.fuzzySearch);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName1.trim()) return;
    onSearch({ firstName, lastName1, lastName2, militaryServiceNumber, fuzzy });
  };

  const handleClear = () => {
    setFirstName('');
    setLastName1('');
    setLastName2('');
    setMilitaryServiceNumber('');
    setFuzzy(true);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">{t.firstName}</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-300 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Manuel" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">{t.lastName1}</label>
          <input type="text" value={lastName1} onChange={(e) => setLastName1(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-300 outline-none focus:ring-2 focus:ring-amber-500 transition-all" required placeholder="García" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">{t.lastName2}</label>
          <input type="text" value={lastName2} onChange={(e) => setLastName2(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-300 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Pérez" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1 flex items-center gap-2">
            <i className="fas fa-id-card-clip text-amber-700"></i>
            {t.militaryServiceNumber}
          </label>
          <input type="text" value={militaryServiceNumber} onChange={(e) => setMilitaryServiceNumber(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-stone-300 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono" placeholder="CH-12345 / EXP..." />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-4 border-stone-100">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="search_type" 
              checked={fuzzy} 
              onChange={() => setFuzzy(true)} 
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-stone-300" 
            />
            <span className={`text-xs font-black uppercase tracking-widest ${fuzzy ? 'text-amber-800' : 'text-stone-400'}`}>
              {t.fuzzyLabel}
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="search_type" 
              checked={!fuzzy} 
              onChange={() => setFuzzy(false)} 
              className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-stone-300" 
            />
            <span className={`text-xs font-black uppercase tracking-widest ${!fuzzy ? 'text-amber-800' : 'text-stone-400'}`}>
              {t.exactLabel}
            </span>
          </label>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <button 
            type="button" 
            onClick={handleClear} 
            disabled={loading}
            className="px-4 py-3 rounded-lg font-bold border border-stone-200 text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-all flex items-center gap-2"
          >
            <i className="fas fa-eraser"></i>
            {t.clear}
          </button>
          <button type="submit" disabled={loading || !lastName1.trim()} className="flex-1 md:flex-none px-8 py-3 rounded-lg font-bold text-white bg-amber-800 hover:bg-amber-900 transition-all shadow-md active:scale-95 disabled:opacity-50">
            {loading ? t.consulting : t.investigate}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
