import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { PoetProfile, Poem, Category } from '../types';
import { PoetCard } from '../components/PoetCard';
import { PoemCard } from '../components/PoemCard';
import { SudaneseEmblem, NubianDivider } from '../components/SudaneseEmblem';
import { 
  Search, 
  Feather, 
  BookOpen, 
  Sparkles, 
  Share2, 
  ArrowLeft, 
  CheckCircle, 
  Award, 
  MapPin, 
  Compass,
  Bookmark
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenReport?: (poem: Poem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const user = StorageService.getCurrentUser();
    return user ? StorageService.getFavorites(user.id) : [];
  });

  const poets = StorageService.getPoets();
  const poems = StorageService.getApprovedPoems();
  const categories = StorageService.getCategories();
  const poemOfTheDay = StorageService.getPoemOfTheDay();

  const handleToggleFavorite = (poemId: string) => {
    const user = StorageService.getCurrentUser();
    if (!user) {
      onNavigate('auth');
      return;
    }
    const isFav = StorageService.toggleFavorite(user.id, poemId);
    setFavorites(prev => isFav ? [...prev, poemId] : prev.filter(id => id !== poemId));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('search', searchQuery.trim());
    } else {
      onOpenSearch();
    }
  };

  return (
    <div className="space-y-16 pb-16 text-right">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 border border-[#D9B56D]/30 shadow-lg mt-4">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_sudan_nile_palms_1793826078595.jpg"
            alt="النيل والنخيل في السودان"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim for high-contrast legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#183C35] via-[#183C35]/85 to-[#183C35]/70" />
          <div className="absolute inset-0 opacity-10 nubian-pattern-line pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center text-[#F4EFE3] space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B56D]/20 border border-[#D9B56D]/40 text-[#D9B56D] text-xs font-semibold">
            <SudaneseEmblem size={18} />
            <span>المرجع الرقمي الأول للشعر العربي الفصيح في السودان</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4EFE3] text-balance">
            «هنا تسكن القصيدة السودانية»
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#F4EFE3]/90 leading-relaxed font-sans-ar text-balance">
            منصة تجمع الشعراء السودانيين، وتوثق إبداعهم الشعري، وتحفظ ذاكرة الشعر العربي الفصيح في السودان من عصر الرواد إلى جيل اليوم.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('poets')}
              className="px-6 py-3.5 rounded-xl bg-[#D9B56D] hover:bg-[#e2c17b] text-[#183C35] font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2"
            >
              <Compass size={18} />
              <span>اكتشف الشعراء</span>
            </button>
            <button
              onClick={() => onNavigate('poems')}
              className="px-6 py-3.5 rounded-xl bg-[#F4EFE3]/15 hover:bg-[#F4EFE3]/25 text-[#F4EFE3] border border-[#F4EFE3]/30 font-bold text-sm sm:text-base transition-all backdrop-blur-xs flex items-center gap-2"
            >
              <BookOpen size={18} />
              <span>اقرأ القصائد</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <form 
          onSubmit={handleSearchSubmit}
          className="relative bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 p-2 shadow-md hover:shadow-lg transition-all flex items-center gap-3"
        >
          <div className="p-3 text-[#D9B56D]">
            <Search size={24} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن شاعر، قصيدة، بيت شعري، أو موضوع..."
            className="w-full bg-transparent border-none outline-none text-[#183C35] dark:text-[#F4EFE3] placeholder-stone-400 text-sm sm:text-base font-sans-ar py-2"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#183C35] hover:bg-[#13302a] text-[#D9B56D] font-bold text-sm shrink-0 transition-colors"
          >
            بحث
          </button>
        </form>
      </section>

      {/* 4. Poem of the Day Section */}
      {poemOfTheDay && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/50 p-6 sm:p-12 shadow-lg overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-[#D9B56D]/20 mb-8 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9B56D]" />
                <h2 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                  قصيدة اليوم المختارة
                </h2>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                تصنيف: {poemOfTheDay.categoryName} · بحر {poemOfTheDay.form}
              </span>
            </div>

            {/* Poem Header */}
            <div className="text-center space-y-2 mb-8">
              <h3 
                onClick={() => onNavigate('poem-detail', poemOfTheDay.slug)}
                className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#F4EFE3] hover:text-[#7D302D] cursor-pointer transition-colors"
              >
                «{poemOfTheDay.title}»
              </h3>
              <p className="text-sm text-[#7D302D] dark:text-[#D9B56D] font-medium flex items-center justify-center gap-1.5">
                <Feather size={14} />
                <span>للشاعر: </span>
                <button
                  onClick={() => onNavigate('poet-detail', poemOfTheDay.poetId.replace('poet-', ''))}
                  className="font-bold hover:underline"
                >
                  {poemOfTheDay.poetName}
                </button>
              </p>
            </div>

            {/* Selected Verses Block in Diwan Style */}
            <div className="bg-[#F4EFE3]/70 dark:bg-[#0D1D1A]/70 rounded-2xl p-6 sm:p-8 border border-[#D9B56D]/20 max-w-2xl mx-auto space-y-4 font-amiri text-lg sm:text-xl text-[#39352F] dark:text-[#F4EFE3] text-center leading-loose">
              {poemOfTheDay.verses.slice(0, 3).map((verse, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                  <span>{verse.first}</span>
                  <span className="text-[#D9B56D] text-xs hidden sm:inline">✤</span>
                  <span>{verse.second}</span>
                </div>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#D9B56D]/20">
              <div className="text-xs text-stone-500 dark:text-stone-400">
                المصدر: {poemOfTheDay.source}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('poem-detail', poemOfTheDay.slug)}
                  className="px-5 py-2 rounded-lg bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                >
                  <span>اقرأ القصيدة كاملة</span>
                  <ArrowLeft size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Discover Sudanese Poets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#D9B56D]/20 pb-4 flex-wrap gap-4">
          <div>
            <h2 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              اكتشف شعراء السودان
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-sans-ar mt-1">
              نخبة من رواد وأعلام الشعر العربي الفصيح من مختلف الأجيال والمدارس الأدبية.
            </p>
          </div>
          <button
            onClick={() => onNavigate('poets')}
            className="text-xs sm:text-sm font-bold text-[#183C35] dark:text-[#D9B56D] hover:underline flex items-center gap-1"
          >
            <span>عرض جميع الشعراء ({poets.length})</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poets.slice(0, 6).map((poet) => {
            const count = StorageService.getPoemsByPoetId(poet.id).length;
            return (
              <PoetCard
                key={poet.id}
                poet={poet}
                poemCount={count}
                onSelect={(slug) => onNavigate('poet-detail', slug)}
              />
            );
          })}
        </div>
      </section>

      {/* 6. Latest Verified Poems */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#D9B56D]/20 pb-4 flex-wrap gap-4">
          <div>
            <h2 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              أحدث القصائد المعتمدة
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 font-sans-ar mt-1">
              قصائد عربية فصيحة مدققة ومجازة من هيئة التحرير والتوثيق الأدبي.
            </p>
          </div>
          <button
            onClick={() => onNavigate('poems')}
            className="text-xs sm:text-sm font-bold text-[#183C35] dark:text-[#D9B56D] hover:underline flex items-center gap-1"
          >
            <span>عرض مكتبة القصائد ({poems.length})</span>
            <ArrowLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.slice(0, 6).map((poem) => (
            <PoemCard
              key={poem.id}
              poem={poem}
              isFavorited={favorites.includes(poem.id)}
              onToggleFavorite={handleToggleFavorite}
              onSelect={(slug) => onNavigate('poem-detail', slug)}
              onPoetSelect={(poetId) => onNavigate('poet-detail', poetId.replace('poet-', ''))}
            />
          ))}
        </div>
      </section>

      {/* 7. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            التصنيفات والبحور الشعرية
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            تصفح القصائد حسب الأغراض الشعرية العربية والمدارس الفنية الأصيلة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const catPoemsCount = StorageService.getApprovedPoems().filter(p => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('category-detail', cat.slug)}
                className="group cursor-pointer rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 hover:border-[#D9B56D] p-5 shadow-xs hover:shadow-md transition-all text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] group-hover:text-[#7D302D] dark:group-hover:text-white transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-stone-400 dark:text-stone-400 tabular-nums font-mono">
                      {catPoemsCount} قصيدة
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D9B56D]/15 flex items-center justify-end text-xs text-[#183C35] dark:text-[#D9B56D] font-bold group-hover:underline">
                  استعراض قصائد التصنيف ←
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Sudanese Poetry Memory Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#183C35] text-[#F4EFE3] p-8 sm:p-12 relative overflow-hidden border border-[#D9B56D]/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B56D]/20 text-[#D9B56D] text-xs font-bold">
                <BookOpen size={14} />
                <span>ذاكرة الشعر السوداني</span>
              </div>
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#D9B56D]">
                أعلامٌ شيدوا صرح القصيدة النيلية
              </h2>
              <p className="text-sm sm:text-base text-[#F4EFE3]/85 leading-relaxed font-sans-ar">
                قسم خاص مكرّس لتوثيق سير ودواوين كبار الشعراء الراحلين، من أمثال العباسي، والتجاني يوسف بشير، وإدريس جمّاع، ومحمد الفيتوري، وصلاح أحمد إبراهيم، والهادي آدم، وتوفير المراجع والمصادر الأدبية المعتمدة.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('memory')}
                  className="px-5 py-2.5 rounded-xl bg-[#D9B56D] hover:bg-[#e4c27a] text-[#183C35] font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <span>زيارة ركن الذاكرة الشعرية</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl overflow-hidden border border-[#D9B56D]/40 shadow-md">
                <img
                  src="/src/assets/images/poet_manuscript_ink_1793826079779.jpg"
                  alt="مخطوطة شعرية سودانية"
                  className="w-full h-56 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call for Poets */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="rounded-3xl bg-white dark:bg-[#162E28] border-2 border-dashed border-[#D9B56D] p-8 sm:p-12 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#183C35] text-[#D9B56D] flex items-center justify-center mx-auto shadow-xs">
            <Feather size={26} />
          </div>

          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            «قصيدتك تستحق أن تكون جزءاً من ذاكرة السودان»
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#39352F]/80 dark:text-[#F4EFE3]/80 leading-relaxed font-sans-ar">
            انضم إلى منصة شعراء السودان، ووثق أعمالك الأدبية، وشارك قصائدك مع القراء ومحبي الشعر العربي الفصيح.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('apply-poet')}
              className="px-8 py-3.5 rounded-xl bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-sm sm:text-base transition-all shadow-md inline-flex items-center gap-2"
            >
              <Feather size={16} />
              <span>قدّم طلب الانضمام</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
