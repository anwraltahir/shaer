import React from 'react';
import { Poem } from '../types';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Eye, Bookmark, Feather, ArrowLeft } from 'lucide-react';

interface PoemCardProps {
  poem: Poem;
  onSelect: (poemSlug: string) => void;
  onPoetSelect?: (poetId: string) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (poemId: string) => void;
}

export const PoemCard: React.FC<PoemCardProps> = ({
  poem,
  onSelect,
  onPoetSelect,
  isFavorited = false,
  onToggleFavorite
}) => {
  const { currentUser } = useAuth();

  // Extract first 2 verses or sample lines for preview
  const previewVerses = poem.verses && poem.verses.length > 0 
    ? poem.verses.slice(0, 2)
    : [];

  return (
    <div className="group rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 hover:border-[#D9B56D] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-right relative">
      <div>
        {/* Top Metadata: Category & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span className="text-[#183C35] dark:text-[#D9B56D] font-medium">{poem.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>بحر {poem.form}</span>
            {poem.writtenAt && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-mono text-[11px]">{poem.writtenAt} م</span>
              </>
            )}
          </div>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(poem.id);
              }}
              className={`p-1.5 rounded-md hover:bg-[#D9B56D]/15 transition-colors ${
                isFavorited 
                  ? 'text-[#7D302D] dark:text-[#D9B56D]' 
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title={isFavorited ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              aria-label="حفظ القصيدة"
            >
              <Bookmark size={16} className={isFavorited ? 'fill-current' : ''} />
            </button>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(poem.slug)}
          className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#F4EFE3] group-hover:text-[#7D302D] dark:group-hover:text-[#D9B56D] cursor-pointer transition-colors mb-1"
        >
          {poem.title}
        </h3>

        {/* Poet name link */}
        <p className="text-xs text-[#D9B56D] font-medium mb-4 flex items-center gap-1">
          <Feather size={12} />
          <span>للشاعر: </span>
          <span 
            onClick={(e) => {
              if (onPoetSelect) {
                e.stopPropagation();
                onPoetSelect(poem.poetId);
              }
            }}
            className="hover:underline cursor-pointer font-bold"
          >
            {poem.poetName}
          </span>
        </p>

        {/* Verse preview block in authentic diwan style */}
        <div 
          onClick={() => onSelect(poem.slug)}
          className="cursor-pointer bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 rounded-lg p-3.5 border border-[#D9B56D]/15 text-center font-amiri text-sm sm:text-base text-[#39352F] dark:text-[#F4EFE3]/90 leading-relaxed mb-4 space-y-1.5"
        >
          {previewVerses.map((v, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <span>{v.first}</span>
              <span className="text-[#D9B56D] text-xs hidden sm:inline">✤</span>
              <span>{v.second}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Action bar */}
      <div className="pt-3 border-t border-[#D9B56D]/15 flex items-center justify-between text-xs">
        <span className="text-stone-400 dark:text-stone-400 flex items-center gap-1 tabular-nums font-mono">
          <Eye size={13} />
          <span>{poem.viewsCount} قراءة</span>
        </span>
        <button
          onClick={() => onSelect(poem.slug)}
          className="text-[#183C35] dark:text-[#D9B56D] font-bold group-hover:underline flex items-center gap-1"
        >
          <span>اقرأ القصيدة كاملة</span>
          <ArrowLeft size={13} />
        </button>
      </div>
    </div>
  );
};
