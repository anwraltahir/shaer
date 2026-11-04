import React, { useState, useMemo } from 'react';
import { StorageService, normalizeArabicText } from '../services/storage';
import { Poem, Category } from '../types';
import { PoemCard } from '../components/PoemCard';
import { Search, Filter, BookOpen, RotateCcw } from 'lucide-react';

interface PoemsPageProps {
  onSelectPoem: (slug: string) => void;
  onSelectPoet: (slugOrId: string) => void;
  initialCategorySlug?: string;
}

export const PoemsPage: React.FC<PoemsPageProps> = ({
  onSelectPoem,
  onSelectPoet,
  initialCategorySlug
}) => {
  const allApprovedPoems = StorageService.getApprovedPoems();
  const allCategories = StorageService.getCategories();
  const allPoets = StorageService.getPoets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    if (initialCategorySlug) {
      const match = allCategories.find(c => c.slug === initialCategorySlug);
      return match ? match.id : 'all';
    }
    return 'all';
  });
  const [selectedPoetId, setSelectedPoetId] = useState<string>('all');
  const [selectedForm, setSelectedForm] = useState<string>('all'); // عمودي, تفعيلة, حر
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'title'>('latest');

  const [favorites, setFavorites] = useState<string[]>(() => {
    const user = StorageService.getCurrentUser();
    return user ? StorageService.getFavorites(user.id) : [];
  });

  const handleToggleFavorite = (poemId: string) => {
    const user = StorageService.getCurrentUser();
    if (!user) {
      alert('يرجى تسجيل الدخول لحفظ القصائد في المفضلة.');
      return;
    }
    const isFav = StorageService.toggleFavorite(user.id, poemId);
    setFavorites(prev => isFav ? [...prev, poemId] : prev.filter(id => id !== poemId));
  };

  const filteredPoems = useMemo(() => {
    return allApprovedPoems.filter(poem => {
      // Search
      if (searchQuery.trim()) {
        const norm = normalizeArabicText(searchQuery);
        const matchTitle = normalizeArabicText(poem.title).includes(norm);
        const matchPoet = normalizeArabicText(poem.poetName).includes(norm);
        const matchText = normalizeArabicText(poem.poemText).includes(norm);
        if (!matchTitle && !matchPoet && !matchText) return false;
      }

      // Category
      if (selectedCategoryId !== 'all' && poem.categoryId !== selectedCategoryId) {
        return false;
      }

      // Poet
      if (selectedPoetId !== 'all' && poem.poetId !== selectedPoetId) {
        return false;
      }

      // Form
      if (selectedForm !== 'all' && poem.form !== selectedForm) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'views') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ar');
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allApprovedPoems, searchQuery, selectedCategoryId, selectedPoetId, selectedForm, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId('all');
    setSelectedPoetId('all');
    setSelectedForm('all');
    setSortBy('latest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-[#D9B56D]/30 pb-6">
        <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          مكتبة القصائد العربية الفصيحة
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 font-sans-ar mt-1">
          ديوان رقمي جامع لروائع الشعر العربي الفصيح للشعراء السودانيين، محققاً وموثقاً.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-5 shadow-xs space-y-4">
        {/* Top search & sorting row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في عنوان القصيدة، أو نصوص الأبيات، أو اسم الشاعر..."
              className="w-full bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 border border-[#D9B56D]/30 rounded-xl py-2 px-3 pl-9 text-sm text-[#183C35] dark:text-[#F4EFE3] placeholder-stone-400 outline-none focus:border-[#D9B56D]"
            />
            <Search size={16} className="absolute left-3 top-3 text-[#D9B56D]" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 border border-[#D9B56D]/30 rounded-xl py-2 px-3 text-xs text-[#183C35] dark:text-[#F4EFE3] outline-none"
            >
              <option value="latest">الأحدث نشرأ</option>
              <option value="views">الأكثر قراءة</option>
              <option value="title">ترتيب أبجدي للعنوان</option>
            </select>

            <button
              onClick={resetFilters}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 border border-[#D9B56D]/20 rounded-xl"
              title="إعادة ضبط الفلاتر"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          {/* Category */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">التصنيف الشعري</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">جميع التصنيفات</option>
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Poet */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الشاعر</label>
            <select
              value={selectedPoetId}
              onChange={(e) => setSelectedPoetId(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">جميع الشعراء</option>
              {allPoets.map(p => (
                <option key={p.id} value={p.id}>{p.literaryName}</option>
              ))}
            </select>
          </div>

          {/* Form */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">النمط الشعري</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">كل الأنماط الشعرية</option>
              <option value="عمودي">شعر عمودي مقفى</option>
              <option value="تفعيلة">شعر تفعيلة</option>
              <option value="حر">شعر حر فصيح</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>عرض {filteredPoems.length} من أصل {allApprovedPoems.length} قصيدة منشورة</span>
      </div>

      {/* Poems Grid */}
      {filteredPoems.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
          <BookOpen size={36} className="mx-auto text-[#D9B56D] mb-2" />
          <p className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">لم يتم العثور على قصائد مطابقة</p>
          <p className="text-xs text-stone-500">جرّب اختيار تصنيف مختلف أو مسح كلمات البحث.</p>
          <button
            onClick={resetFilters}
            className="mt-3 px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              isFavorited={favorites.includes(poem.id)}
              onToggleFavorite={handleToggleFavorite}
              onSelect={onSelectPoem}
              onPoetSelect={(poetId) => onSelectPoet(poetId.replace('poet-', ''))}
            />
          ))}
        </div>
      )}
    </div>
  );
};
