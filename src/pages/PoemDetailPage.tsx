import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { Poem, PoetProfile } from '../types';
import { PoemVerseViewer } from '../components/PoemVerseViewer';
import { PoemCard } from '../components/PoemCard';
import { ReportModal } from '../components/ReportModal';
import { ArrowRight, BookOpen, Feather, Share2, Bookmark } from 'lucide-react';

interface PoemDetailPageProps {
  poemSlug: string;
  onNavigateBack: () => void;
  onSelectPoem: (slug: string) => void;
  onSelectPoet: (slugOrId: string) => void;
}

export const PoemDetailPage: React.FC<PoemDetailPageProps> = ({
  poemSlug,
  onNavigateBack,
  onSelectPoem,
  onSelectPoet
}) => {
  const { currentUser } = useAuth();
  const [poem, setPoem] = useState<Poem | undefined>(() => {
    return StorageService.getPoemBySlug(poemSlug) || StorageService.getPoemById(poemSlug);
  });
  const [isFavorited, setIsFavorited] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const loaded = StorageService.getPoemBySlug(poemSlug) || StorageService.getPoemById(poemSlug);
    setPoem(loaded);
    if (loaded) {
      StorageService.incrementPoemViews(loaded.id);
      if (currentUser) {
        const favs = StorageService.getFavorites(currentUser.id);
        setIsFavorited(favs.includes(loaded.id));
      }
    }
  }, [poemSlug, currentUser]);

  const handleToggleFavorite = (poemId: string) => {
    if (!currentUser) {
      alert('يرجى تسجيل الدخول لحفظ القصيدة في المفضلة.');
      return;
    }
    const nextState = StorageService.toggleFavorite(currentUser.id, poemId);
    setIsFavorited(nextState);
  };

  if (!poem) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4 text-right">
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">القصيدة غير موجودة</h2>
        <p className="text-sm text-stone-500">عذراً، لم يتم العثور على القصيدة في المكتبة الشعرية المعتمدة.</p>
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
        >
          العودة لمكتبة القصائد
        </button>
      </div>
    );
  }

  // Related poems by the same poet
  const poetPoems = StorageService.getPoemsByPoetId(poem.poetId)
    .filter(p => p.id !== poem.id && p.publicationStatus === 'approved')
    .slice(0, 2);

  // Related poems in the same category
  const categoryPoems = StorageService.getApprovedPoems()
    .filter(p => p.categoryId === poem.categoryId && p.id !== poem.id && p.poetId !== poem.poetId)
    .slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-right">
      {/* Top back navigation */}
      <div className="no-print">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-[#183C35] dark:hover:text-[#D9B56D] transition-colors"
        >
          <ArrowRight size={14} />
          <span>العودة للمكتبة الشعرية</span>
        </button>
      </div>

      {/* Main Poem Reading Canvas */}
      <PoemVerseViewer
        poem={poem}
        isFavorited={isFavorited}
        onToggleFavorite={handleToggleFavorite}
        onOpenReport={() => setReportModalOpen(true)}
        onPoetSelect={() => onSelectPoet(poem.poetId.replace('poet-', ''))}
      />

      {/* Related Content Section */}
      <div className="no-print space-y-10 pt-8 border-t border-[#D9B56D]/30">
        {/* Other poems by this poet */}
        {poetPoems.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              قصائد أخرى للشاعر {poem.poetName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {poetPoems.map(p => (
                <PoemCard
                  key={p.id}
                  poem={p}
                  onSelect={onSelectPoem}
                  onPoetSelect={(id) => onSelectPoet(id.replace('poet-', ''))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other poems in same category */}
        {categoryPoems.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              من روائع {poem.categoryName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categoryPoems.map(p => (
                <PoemCard
                  key={p.id}
                  poem={p}
                  onSelect={onSelectPoem}
                  onPoetSelect={(id) => onSelectPoet(id.replace('poet-', ''))}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        poem={poem}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
