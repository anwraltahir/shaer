import React, { useState } from 'react';
import { Poem } from '../types';
import { SudaneseEmblem, NubianDivider } from './SudaneseEmblem';
import { 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  AlertCircle, 
  Bookmark, 
  Eye, 
  BookOpen,
  Calendar,
  Feather
} from 'lucide-react';

interface PoemVerseViewerProps {
  poem: Poem;
  isFavorited?: boolean;
  onToggleFavorite?: (poemId: string) => void;
  onOpenReport?: (poem: Poem) => void;
  onPoetSelect?: (poetId: string) => void;
}

export const PoemVerseViewer: React.FC<PoemVerseViewerProps> = ({
  poem,
  isFavorited = false,
  onToggleFavorite,
  onOpenReport,
  onPoetSelect
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const handleCopyText = async () => {
    try {
      const fullPoemFormatted = `${poem.title}\nللشاعر: ${poem.poetName}\n\n${poem.verses.map(v => `${v.first} ... ${v.second}`).join('\n')}\n\nالمصدر: ${poem.source}\nمنصة شعراء السودان`;
      await navigator.clipboard.writeText(fullPoemFormatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `قصيدة «${poem.title}» - الشاعر ${poem.poetName}`,
          text: `اقرأ روائع الشعر الفصيح السوداني: «${poem.title}» للشاعر ${poem.poetName}`,
          url: window.location.href,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'large': return 'text-xl sm:text-2xl leading-[2.6rem]';
      case 'xlarge': return 'text-2xl sm:text-3xl leading-[3.2rem]';
      default: return 'text-lg sm:text-xl leading-[2.4rem]';
    }
  };

  return (
    <article className="print-area max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/40 p-6 sm:p-10 shadow-md text-right relative transition-all">
      {/* Decorative top Nubian gold corner */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" fill="none" className="text-[#D9B56D]">
          <polygon points="100,0 100,100 0,0" fill="currentColor" />
        </svg>
      </div>

      {/* Header Utilities Strip: Font Zoom, Copy, Print, Share, Favorite */}
      <div className="no-print flex items-center justify-between gap-2 pb-6 border-b border-[#D9B56D]/20 mb-8 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <span className="text-[#183C35] dark:text-[#D9B56D] font-bold">{poem.categoryName}</span>
          <span aria-hidden="true">·</span>
          <span>شعر {poem.form}</span>
          <span aria-hidden="true">·</span>
          <span>{poem.literarySchool}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-[#F4EFE3] dark:bg-[#0D1D1A] rounded-lg p-1 border border-[#D9B56D]/20">
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-1 text-xs rounded transition-colors ${fontSizeLevel === 'normal' ? 'bg-[#183C35] text-[#D9B56D] font-bold' : 'text-stone-600 dark:text-stone-300'}`}
              title="خط عادي"
            >
              عادي
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-1 text-xs rounded transition-colors ${fontSizeLevel === 'large' ? 'bg-[#183C35] text-[#D9B56D] font-bold' : 'text-stone-600 dark:text-stone-300'}`}
              title="خط كبير"
            >
              كبير
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-1 text-xs rounded transition-colors ${fontSizeLevel === 'xlarge' ? 'bg-[#183C35] text-[#D9B56D] font-bold' : 'text-stone-600 dark:text-stone-300'}`}
              title="خط مكبّر جداً"
            >
              مكبّر
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyText}
            className="p-2 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] border border-[#D9B56D]/20 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/20 transition-colors"
            title="نسخ نص القصيدة"
            aria-label="نسخ"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] border border-[#D9B56D]/20 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/20 transition-colors"
            title="طباعة القصيدة"
            aria-label="طباعة"
          >
            <Printer size={16} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] border border-[#D9B56D]/20 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/20 transition-colors"
            title="مشاركة القصيدة"
            aria-label="مشاركة"
          >
            <Share2 size={16} />
          </button>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(poem.id)}
              className={`p-2 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] border border-[#D9B56D]/20 transition-colors ${
                isFavorited ? 'text-[#7D302D] dark:text-[#D9B56D]' : 'text-stone-600 dark:text-stone-300'
              }`}
              title={isFavorited ? 'في المفضلة' : 'حفظ في المفضلة'}
              aria-label="مفضلة"
            >
              <Bookmark size={16} className={isFavorited ? 'fill-current' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Title & Poet Header */}
      <header className="text-center space-y-3 mb-10">
        <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#183C35] dark:text-[#D9B56D] tracking-normal">
          {poem.title}
        </h1>

        <div className="flex items-center justify-center gap-2 text-sm text-[#7D302D] dark:text-[#F4EFE3]/90 font-medium">
          <Feather size={15} className="text-[#D9B56D]" />
          <span>للشاعر:</span>
          <button
            onClick={() => onPoetSelect && onPoetSelect(poem.poetId)}
            className="font-bold hover:underline text-[#183C35] dark:text-[#D9B56D] text-base"
          >
            {poem.poetName}
          </button>
        </div>

        <NubianDivider className="my-4 max-w-xs mx-auto" />
      </header>

      {/* Main Verses Body */}
      <div className={`font-amiri ${getFontSizeClass()} text-[#39352F] dark:text-[#F4EFE3] text-center space-y-6 sm:space-y-8 my-10 py-4`}>
        {poem.verses.map((verse, index) => (
          <div 
            key={index}
            className="poem-verse-grid hover:bg-[#F4EFE3]/30 dark:hover:bg-[#0D1D1A]/30 py-1.5 px-3 rounded-lg transition-colors"
          >
            {/* الصدر */}
            <span className="text-center sm:text-left select-text">{verse.first}</span>

            {/* الفاصل الزخرفي النوبي/العربي */}
            <span className="text-[#D9B56D] text-sm select-none opacity-80 px-2">
              ✤
            </span>

            {/* العجز */}
            <span className="text-center sm:text-right select-text">{verse.second}</span>
          </div>
        ))}
      </div>

      <NubianDivider className="my-10 max-w-sm mx-auto" />

      {/* Footer Metadata & Documentation Info */}
      <footer className="pt-6 border-t border-[#D9B56D]/20 text-xs text-stone-500 dark:text-stone-400 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="font-bold text-[#183C35] dark:text-[#D9B56D] mb-0.5">المصدر والتوثيق الأدبي:</p>
            <p className="leading-relaxed">{poem.source}</p>
          </div>
          <div>
            <p className="font-bold text-[#183C35] dark:text-[#D9B56D] mb-0.5">حقوق النشر والنسبة:</p>
            <p className="leading-relaxed">{poem.copyrightStatus}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#D9B56D]/15 flex-wrap gap-3">
          <div className="flex items-center gap-3 text-[11px] tabular-nums font-mono">
            <span className="flex items-center gap-1">
              <Eye size={13} />
              <span>{poem.viewsCount} قراءة</span>
            </span>
            {poem.writtenAt && (
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                <span>سنة النظم: {poem.writtenAt} م</span>
              </span>
            )}
          </div>

          {onOpenReport && (
            <button
              onClick={() => onOpenReport(poem)}
              className="text-[#7D302D] dark:text-amber-300 hover:underline flex items-center gap-1 font-medium text-xs no-print"
            >
              <AlertCircle size={13} />
              <span>الإبلاغ عن خطأ طباعي أو نسبة</span>
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};
