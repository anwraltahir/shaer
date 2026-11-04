import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { Category, Poem } from '../types';
import { PoemCard } from '../components/PoemCard';
import { Layers, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  onSelectPoem: (slug: string) => void;
  onSelectPoet: (slugOrId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectPoem,
  onSelectPoet
}) => {
  const categories = StorageService.getCategories();
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);

  const poems = selectedCat
    ? StorageService.getApprovedPoems().filter(p => p.categoryId === selectedCat.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-[#D9B56D]/30 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            {selectedCat ? selectedCat.name : 'التصنيفات والبحور الشعرية'}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300 font-sans-ar mt-1">
            {selectedCat 
              ? selectedCat.description 
              : 'استعرض ذخائر الشعر الفصيح السوداني المصنفة بحسب الأغراض الشعرية التراثية والحديثة.'
            }
          </p>
        </div>

        {selectedCat && (
          <button
            onClick={() => setSelectedCat(null)}
            className="px-3.5 py-1.5 rounded-lg border border-[#D9B56D]/30 text-xs text-[#183C35] dark:text-[#D9B56D] font-bold hover:bg-[#D9B56D]/15 flex items-center gap-1.5"
          >
            <ArrowRight size={14} />
            <span>العودة لجميع التصنيفات</span>
          </button>
        )}
      </div>

      {!selectedCat ? (
        /* Categories Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = StorageService.getApprovedPoems().filter(p => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 hover:border-[#D9B56D] p-6 shadow-xs hover:shadow-md transition-all text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2.5 rounded-xl bg-[#F4EFE3] dark:bg-[#0D1D1A] text-[#183C35] dark:text-[#D9B56D] border border-[#D9B56D]/20">
                      <Layers size={20} />
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums font-mono">
                      {count} قصيدة معتمدة
                    </span>
                  </div>
                  <h3 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D] group-hover:text-[#7D302D] dark:group-hover:text-white transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#39352F]/80 dark:text-[#F4EFE3]/80 leading-relaxed font-sans-ar">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#D9B56D]/15 flex items-center justify-end text-xs text-[#183C35] dark:text-[#D9B56D] font-bold group-hover:underline">
                  استعراض قصائد {cat.name} ←
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Poems in selected category */
        <div className="space-y-6">
          <div className="text-xs text-stone-500">
            عرض {poems.length} قصيدة منشورة في هذا التصنيف
          </div>
          {poems.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
              <BookOpen size={36} className="mx-auto text-[#D9B56D] mb-2" />
              <p className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">لا توجد قصائد حالياً في هذا التصنيف</p>
              <p className="text-xs text-stone-500">القصائد قيد التدقيق والإجازة من قِبل هيئة التحرير.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {poems.map(poem => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  onSelect={onSelectPoem}
                  onPoetSelect={(id) => onSelectPoet(id.replace('poet-', ''))}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
