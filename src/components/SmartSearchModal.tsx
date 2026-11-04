import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from '../services/storage';
import { Search, X, User, BookOpen, Layers, Feather, ArrowLeft } from 'lucide-react';
import { PoetProfile, Poem, Collection, Category } from '../types';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPoet: (slug: string) => void;
  onSelectPoem: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPoet,
  onSelectPoem,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    poets: PoetProfile[];
    poems: Poem[];
    collections: Collection[];
    categories: Category[];
  }>({ poets: [], poems: [], collections: [], categories: [] });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ poets: [], poems: [], collections: [], categories: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ poets: [], poems: [], collections: [], categories: [] });
      return;
    }
    const searchRes = StorageService.searchAll(query);
    setResults(searchRes);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.poets.length +
    results.poems.length +
    results.collections.length +
    results.categories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 shadow-2xl overflow-hidden flex flex-col text-right animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#D9B56D]/20 flex items-center gap-3 bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50">
          <Search size={22} className="text-[#D9B56D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن شاعر، قصيدة، بيت شعري، أو موضوع..."
            className="w-full bg-transparent border-none outline-none text-[#183C35] dark:text-[#F4EFE3] placeholder-stone-400 text-base font-sans-ar"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-[#183C35] dark:bg-[#D9B56D] text-[#D9B56D] dark:text-[#183C35] px-2.5 py-1 rounded-md font-bold shrink-0"
          >
            إغلاق
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="py-8 text-center text-stone-400 space-y-2">
              <Feather size={32} className="mx-auto text-[#D9B56D]/50" />
              <p className="text-sm">اكتب كلمة للبحث في دواوين وقصائد وسير شعراء السودان</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-xs">
                {['إدريس جمّاع', 'التجاني يوسف بشير', 'أغداً ألقاك', 'محراب الجمال', 'الشعر الوجداني'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="px-2.5 py-1 rounded-full bg-[#F4EFE3] dark:bg-[#0D1D1A] text-[#183C35] dark:text-[#D9B56D] border border-[#D9B56D]/20 hover:border-[#D9B56D]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-stone-400">
              <p className="text-base font-bold text-stone-600 dark:text-stone-300">لم يُعثر على نتائج مطابقة لـ «{query}»</p>
              <p className="text-xs mt-1">جرّب البحث باسم الشاعر أو عنوان القصيدة أو كلمات من البيت الشعري.</p>
            </div>
          ) : (
            <>
              {/* Poets Results */}
              {results.poets.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#D9B56D] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#D9B56D]/20 pb-1">
                    <User size={14} />
                    <span>الشعراء ({results.poets.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.poets.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPoet(p.profileSlug);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F4EFE3] dark:hover:bg-[#0D1D1A] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.profileImage}
                            alt={p.literaryName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-[#D9B56D]/40"
                          />
                          <div>
                            <p className="font-amiri font-bold text-[#183C35] dark:text-[#D9B56D] text-base">{p.literaryName}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{p.city} · {p.literarySchool}</p>
                          </div>
                        </div>
                        <ArrowLeft size={16} className="text-[#D9B56D]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poems Results */}
              {results.poems.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#D9B56D] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#D9B56D]/20 pb-1">
                    <BookOpen size={14} />
                    <span>القصائد ({results.poems.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.poems.map((poem) => (
                      <div
                        key={poem.id}
                        onClick={() => {
                          onSelectPoem(poem.slug);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F4EFE3] dark:hover:bg-[#0D1D1A] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-amiri font-bold text-[#183C35] dark:text-[#F4EFE3] text-base">{poem.title}</p>
                          <p className="text-xs text-[#D9B56D]">الشاعر: {poem.poetName} · {poem.categoryName}</p>
                        </div>
                        <ArrowLeft size={16} className="text-[#D9B56D]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections Results */}
              {results.collections.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#D9B56D] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#D9B56D]/20 pb-1">
                    <Layers size={14} />
                    <span>الدواوين والمؤلفات ({results.collections.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.collections.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectPoet(c.poetId.replace('poet-', ''));
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-[#F4EFE3] dark:hover:bg-[#0D1D1A] cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="font-bold text-[#183C35] dark:text-[#F4EFE3] text-sm">{c.title}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">للشاعر: {c.poetName} ({c.publicationYear} م)</p>
                        </div>
                        <ArrowLeft size={16} className="text-[#D9B56D]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#D9B56D] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#D9B56D]/20 pb-1">
                    <Layers size={14} />
                    <span>التصنيفات ({results.categories.length})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] text-xs font-medium text-[#183C35] dark:text-[#D9B56D] border border-[#D9B56D]/30 hover:border-[#D9B56D]"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
