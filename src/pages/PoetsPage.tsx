import React, { useState, useMemo } from 'react';
import { StorageService, normalizeArabicText } from '../services/storage';
import { PoetProfile, LiterarySchool } from '../types';
import { PoetCard } from '../components/PoetCard';
import { SudaneseEmblem } from '../components/SudaneseEmblem';
import { Search, Filter, ShieldCheck, MapPin, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface PoetsPageProps {
  onSelectPoet: (slug: string) => void;
}

export const PoetsPage: React.FC<PoetsPageProps> = ({ onSelectPoet }) => {
  const allPoets = StorageService.getPoets();

  const [searchName, setSearchName] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all'); // all, historical, contemporary
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'poems' | 'recent'>('name');

  // Extract unique cities/regions
  const cities = useMemo(() => {
    const set = new Set<string>();
    allPoets.forEach(p => {
      const parts = p.city.split(/[/،-]/);
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed) set.add(trimmed);
      });
    });
    return Array.from(set);
  }, [allPoets]);

  const filteredPoets = useMemo(() => {
    return allPoets.filter(poet => {
      // Search
      if (searchName.trim()) {
        const normQuery = normalizeArabicText(searchName);
        const matchName = normalizeArabicText(poet.literaryName).includes(normQuery) ||
                          normalizeArabicText(poet.fullName || '').includes(normQuery);
        if (!matchName) return false;
      }

      // School
      if (selectedSchool !== 'all' && poet.literarySchool !== selectedSchool) {
        return false;
      }

      // Region
      if (selectedRegion !== 'all' && !poet.city.includes(selectedRegion)) {
        return false;
      }

      // Era
      if (selectedEra === 'historical' && !poet.isHistorical) return false;
      if (selectedEra === 'contemporary' && poet.isHistorical) return false;

      // Only Verified
      if (onlyVerified && !poet.verificationStatus) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.literaryName.localeCompare(b.literaryName, 'ar');
      }
      if (sortBy === 'poems') {
        const countA = StorageService.getPoemsByPoetId(a.id).length;
        const countB = StorageService.getPoemsByPoetId(b.id).length;
        return countB - countA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allPoets, searchName, selectedSchool, selectedRegion, selectedEra, onlyVerified, sortBy]);

  const resetFilters = () => {
    setSearchName('');
    setSelectedSchool('all');
    setSelectedRegion('all');
    setSelectedEra('all');
    setOnlyVerified(false);
    setSortBy('name');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-[#D9B56D]/30 pb-6">
        <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          دليل شعراء السودان
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 font-sans-ar mt-1">
          اكتشف الشعراء السودانيين الذين كتبوا ويكتبون الشعر العربي الفصيح عبر الأجيال والمدن.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-5 shadow-xs space-y-4">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="ابحث بالاسم الأدبي للشاعر..."
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
              <option value="name">ترتيب أبجدي (أ - ي)</option>
              <option value="poems">الأكثر قصائد منشورة</option>
              <option value="recent">أحدث الإضافات</option>
            </select>

            <button
              onClick={resetFilters}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 border border-[#D9B56D]/20 rounded-xl"
              title="إعادة ضبط التصفية"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
          {/* School filter */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">المدرسة الشعرية</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">جميع المدارس</option>
              <option value="كلاسيكي عمودي">كلاسيكي عمودي</option>
              <option value="رومانسي وجداني">رومانسي وجداني</option>
              <option value="واقعي وتفعيلة">واقعي وتفعيلة</option>
              <option value="حر حديث">حر حديث</option>
              <option value="فلسفي وصوفي">فلسفي وصوفي</option>
            </select>
          </div>

          {/* Region filter */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">المدينة / الإقليم</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">جميع المدن والمناطق</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Era filter */}
          <div>
            <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الجيل الأدبي</label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/25 rounded-lg py-1.5 px-2 text-[#39352F] dark:text-[#F4EFE3] outline-none"
            >
              <option value="all">جميع الأجيال</option>
              <option value="historical">الرواد والشعراء الراحلون</option>
              <option value="contemporary">الشعراء المعاصرون</option>
            </select>
          </div>

          {/* Verified toggle checkbox */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#183C35] dark:text-[#D9B56D]">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded accent-[#183C35]"
              />
              <span>عرض الموثقين رسمياً فقط</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>عرض {filteredPoets.length} من أصل {allPoets.length} شاعر</span>
      </div>

      {/* Poets Grid */}
      {filteredPoets.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
          <p className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">لا توجد نتائج مطابقة لخيارات التصفية</p>
          <p className="text-xs text-stone-500">جرّب إعادة ضبط الفلاتر أو البحث باسم آخر.</p>
          <button
            onClick={resetFilters}
            className="mt-3 px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoets.map((poet) => {
            const count = StorageService.getPoemsByPoetId(poet.id).length;
            return (
              <PoetCard
                key={poet.id}
                poet={poet}
                poemCount={count}
                onSelect={onSelectPoet}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
