import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { PoemCard } from '../components/PoemCard';
import { PoetCard } from '../components/PoetCard';
import { Bookmark, UserCheck, BookOpen, Feather } from 'lucide-react';

interface FavoritesPageProps {
  onSelectPoem: (slug: string) => void;
  onSelectPoet: (slug: string) => void;
  onNavigateHome: () => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onSelectPoem,
  onSelectPoet,
  onNavigateHome
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'poems' | 'poets'>('poems');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4 text-right">
        <Bookmark size={36} className="mx-auto text-[#D9B56D]" />
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          المفضلة والشعراء المتابعون
        </h2>
        <p className="text-xs text-stone-500">
          يرجى تسجيل الدخول للوصول إلى قائمة قصائدك المفضلة والشعراء الذين تتابعهم.
        </p>
      </div>
    );
  }

  const favoritePoemIds = StorageService.getFavorites(currentUser.id);
  const followedPoetIds = StorageService.getFollowedPoetIds(currentUser.id);

  const favoritePoems = StorageService.getApprovedPoems().filter(p => favoritePoemIds.includes(p.id));
  const followedPoets = StorageService.getPoets().filter(p => followedPoetIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      <div className="border-b border-[#D9B56D]/30 pb-6">
        <h1 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          مكتبتي الخاصة
        </h1>
        <p className="text-xs text-stone-500 mt-1 font-sans-ar">
          القصائد المحفوظة في المفضلة والشعراء السودانيون الذين تتابعهم.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9B56D]/30 pb-1 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('poems')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'poems'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Bookmark size={15} />
          <span>القصائد المحفوظة ({favoritePoems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('poets')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'poets'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <UserCheck size={15} />
          <span>الشعراء المتابعون ({followedPoets.length})</span>
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'poems' && (
        <div>
          {favoritePoems.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
              <Bookmark size={32} className="mx-auto text-stone-400" />
              <p className="font-bold text-sm text-[#183C35] dark:text-[#D9B56D]">لم تحفظ أي قصائد في المفضلة بعد</p>
              <p className="text-xs text-stone-500">انقر على أيقونة الإشارة المرجعية بجانب أي قصيدة لإضافتها هنا.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritePoems.map(poem => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  isFavorited={true}
                  onToggleFavorite={() => {
                    StorageService.toggleFavorite(currentUser.id, poem.id);
                  }}
                  onSelect={onSelectPoem}
                  onPoetSelect={(id) => onSelectPoet(id.replace('poet-', ''))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'poets' && (
        <div>
          {followedPoets.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
              <UserCheck size={32} className="mx-auto text-stone-400" />
              <p className="font-bold text-sm text-[#183C35] dark:text-[#D9B56D]">لا تتابع أي شعراء حالياً</p>
              <p className="text-xs text-stone-500">يمكنك متابعة الشعراء من صفحاتهم الشخصية لتصلك أحدث قصائدهم.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedPoets.map(poet => (
                <PoetCard
                  key={poet.id}
                  poet={poet}
                  poemCount={StorageService.getPoemsByPoetId(poet.id).length}
                  onSelect={onSelectPoet}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
