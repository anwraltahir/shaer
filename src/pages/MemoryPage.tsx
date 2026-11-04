import React from 'react';
import { StorageService } from '../services/storage';
import { PoetCard } from '../components/PoetCard';
import { SudaneseEmblem, NubianDivider } from '../components/SudaneseEmblem';
import { BookOpen, Award, Bookmark, Calendar, ScrollText, ArrowLeft } from 'lucide-react';

interface MemoryPageProps {
  onSelectPoet: (slug: string) => void;
  onSelectPoem: (slug: string) => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({ onSelectPoet, onSelectPoem }) => {
  const historicalPoets = StorageService.getPoets().filter(p => p.isHistorical);
  const collections = StorageService.getCollections();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-right">
      {/* Marquee Banner */}
      <div className="rounded-3xl bg-[#183C35] text-[#F4EFE3] p-8 sm:p-12 relative overflow-hidden border border-[#D9B56D]/30 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B56D]/20 text-[#D9B56D] text-xs font-bold">
            <ScrollText size={14} />
            <span>ذاكرة الشعر العربي الفصيح في السودان</span>
          </div>

          <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#D9B56D] leading-tight">
            سجل الخالدين.. من عصر الرواد إلى فجر النهضة
          </h1>

          <p className="text-sm sm:text-base text-[#F4EFE3]/85 leading-relaxed font-sans-ar">
            توثيق موثوق لأعلام الشعر السوداني الراحلين، وسيرهم الذاتية والأدبية، ودواوينهم المطبوعة، استناداً إلى أمهات الكتب والمصادر الأدبية والتاريخية المحققة.
          </p>
        </div>

        {/* Background watermark motif */}
        <div className="absolute left-6 bottom-4 opacity-15 pointer-events-none hidden sm:block">
          <SudaneseEmblem size={240} />
        </div>
      </div>

      {/* Historical Poets Grid */}
      <section className="space-y-6">
        <div className="border-b border-[#D9B56D]/30 pb-3 flex items-center justify-between">
          <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            شعراء الأجيال السابقة والرواد الراحلون
          </h2>
          <span className="text-xs text-stone-500">{historicalPoets.length} من أعلام الشعر</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historicalPoets.map(poet => {
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
      </section>

      {/* Historical Dawaween Section */}
      <section className="space-y-6">
        <div className="border-b border-[#D9B56D]/30 pb-3">
          <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            الدواوين والمؤلفات التاريخية المطبوعة
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            الدواوين الشعرية التي طبعت في كبريات دور النشر العربية وشكلت وجدان الشعر السوداني الفصيح.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map(col => (
            <div
              key={col.id}
              className="rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 p-6 shadow-xs flex flex-col sm:flex-row gap-5"
            >
              <img
                src={col.coverImage || '/src/assets/images/poet_manuscript_ink_1793826079779.jpg'}
                alt={col.title}
                referrerPolicy="no-referrer"
                className="w-full sm:w-28 h-36 object-cover rounded-xl border border-[#D9B56D]/40 shrink-0"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">{col.title}</h3>
                  <span className="text-xs bg-[#F4EFE3] dark:bg-[#0D1D1A] text-[#183C35] dark:text-[#D9B56D] px-2 py-0.5 rounded-md font-mono tabular-nums">
                    {col.publicationYear} م
                  </span>
                </div>
                <p className="text-xs text-[#7D302D] dark:text-[#D9B56D] font-medium">للشاعر: {col.poetName}</p>
                <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {col.description}
                </p>
                <p className="text-[11px] text-stone-400 pt-1">
                  جهة النشر: {col.publisher}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources & Editorial Verification Notice */}
      <section className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 p-6 sm:p-8 space-y-3">
        <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] flex items-center gap-2">
          <Award size={18} className="text-[#D9B56D]" />
          <span>منهجية التوثيق والمصادر التاريخية</span>
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans-ar">
          تعتمد منصة «شعراء السودان» على الطبعات المحققة والدراسات الأكاديمية الصادرة عن دور النشر المعتمدة (مثل دار المعارف، دار الفكر العربي، دار الشروق، مصلحة الثقافة، والهيئة المصرية العامة للكتاب). تلتزم المنصة بعدم إدراج أي قصيدة أو معلومة دون تدقيق مصادرها ونسبتها الحقيقية لصاحبها صوناً للذاكرة الوطنية.
        </p>
      </section>
    </div>
  );
};
