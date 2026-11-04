import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { PoetProfile, Poem, Collection } from '../types';
import { PoemCard } from '../components/PoemCard';
import { SudaneseEmblem, NubianDivider } from '../components/SudaneseEmblem';
import { 
  CheckCircle, 
  MapPin, 
  BookOpen, 
  Feather, 
  Share2, 
  UserCheck, 
  UserPlus, 
  Calendar, 
  Edit3, 
  Quote, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface PoetDetailPageProps {
  poetSlug: string;
  onNavigateBack: () => void;
  onSelectPoem: (poemSlug: string) => void;
  onNavigateToNewPoem?: () => void;
}

export const PoetDetailPage: React.FC<PoetDetailPageProps> = ({
  poetSlug,
  onNavigateBack,
  onSelectPoem,
  onNavigateToNewPoem,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'bio' | 'poems' | 'collections' | 'quotes'>('bio');
  const [isFollowed, setIsFollowed] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Load poet profile by slug or ID
  const poet = StorageService.getPoetBySlug(poetSlug) || StorageService.getPoetById(`poet-${poetSlug}`);

  const poems = poet ? StorageService.getPoemsByPoetId(poet.id) : [];
  const collections = poet ? StorageService.getCollectionsByPoetId(poet.id) : [];

  useEffect(() => {
    if (currentUser && poet) {
      const follows = StorageService.getFollowedPoetIds(currentUser.id);
      setIsFollowed(follows.includes(poet.id));
    }
  }, [currentUser, poet]);

  if (!poet) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">الشاعر غير موجود</h2>
        <p className="text-sm text-stone-500">عذراً، لم يتم العثور على الشاعر المطلوب في السجل الأدبي.</p>
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
        >
          العودة لدليل الشعراء
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === poet.userId;

  const handleToggleFollow = () => {
    if (!currentUser) {
      alert('يرجى تسجيل الدخول لمتابعة الشاعر.');
      return;
    }
    const nextState = StorageService.toggleFollow(currentUser.id, poet.id);
    setIsFollowed(nextState);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Back button */}
      <div>
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-[#183C35] dark:hover:text-[#D9B56D] transition-colors"
        >
          <ArrowRight size={14} />
          <span>العودة لدليل الشعراء</span>
        </button>
      </div>

      {/* Poet Profile Header */}
      <div className="rounded-3xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/40 p-6 sm:p-10 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar with verification badge */}
          <div className="relative shrink-0">
            <img
              src={poet.profileImage}
              alt={poet.literaryName}
              referrerPolicy="no-referrer"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-[#D9B56D]/60 shadow-md"
            />
            {poet.verificationStatus && (
              <div 
                className="absolute -bottom-2 -left-2 bg-[#183C35] text-[#D9B56D] p-1.5 rounded-full border border-[#D9B56D] shadow-xs"
                title="شاعر معتمد وموثق رسمياً"
              >
                <CheckCircle size={18} className="fill-[#D9B56D] text-[#183C35]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-right space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                  {poet.literaryName}
                </h1>
                {poet.fullName && poet.fullName !== poet.literaryName && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    الاسم الكامل: {poet.fullName}
                  </p>
                )}
              </div>

              {/* Action Buttons: Follow, Share, Edit */}
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <button
                  onClick={handleToggleFollow}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isFollowed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-400'
                      : 'bg-[#183C35] text-[#D9B56D] hover:bg-[#122e28]'
                  }`}
                >
                  {isFollowed ? <UserCheck size={14} /> : <UserPlus size={14} />}
                  <span>{isFollowed ? 'مُتابع' : 'متابعة الشاعر'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/20 transition-colors"
                  title="مشاركة صفحة الشاعر"
                  aria-label="مشاركة"
                >
                  <Share2 size={16} />
                </button>

                {isOwner && onNavigateToNewPoem && (
                  <button
                    onClick={onNavigateToNewPoem}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D9B56D] text-[#183C35] hover:bg-[#e2c17b] flex items-center gap-1"
                  >
                    <Edit3 size={14} />
                    <span>إضافة قصيدة</span>
                  </button>
                )}
              </div>
            </div>

            {/* Zero-pill metadata */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-600 dark:text-stone-300 font-sans-ar pt-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[#D9B56D]" />
                <span>{poet.city}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>المدرسة: {poet.literarySchool}</span>
              {poet.birthYear && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono">
                    {poet.birthYear} {poet.deathYear ? `– ${poet.deathYear}` : ''} م
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="text-[#183C35] dark:text-[#D9B56D] font-bold">
                {poems.length} قصيدة منشورة
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#39352F]/85 dark:text-[#F4EFE3]/85 leading-relaxed pt-1">
              {poet.biography}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-[#D9B56D]/30 pb-1 text-sm font-bold">
        <button
          onClick={() => setActiveTab('bio')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'bio'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35] dark:hover:text-[#D9B56D]'
          }`}
        >
          <Feather size={15} />
          <span>نبذة الشاعر وتوثيقه</span>
        </button>

        <button
          onClick={() => setActiveTab('poems')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'poems'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35] dark:hover:text-[#D9B56D]'
          }`}
        >
          <BookOpen size={15} />
          <span>قصائده المعتمدة ({poems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'collections'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35] dark:hover:text-[#D9B56D]'
          }`}
        >
          <Layers size={15} />
          <span>دواوينه ({collections.length})</span>
        </button>

        {poet.quotes && poet.quotes.length > 0 && (
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35] dark:hover:text-[#D9B56D]'
            }`}
          >
            <Quote size={15} />
            <span>اقتباسات مختارة</span>
          </button>
        )}
      </div>

      {/* Tab Contents */}
      {activeTab === 'bio' && (
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D] mb-3">
              السيرة الأدبية والمسيرة الشعرية
            </h3>
            <p className="text-sm text-[#39352F] dark:text-[#F4EFE3]/90 leading-relaxed font-sans-ar">
              {poet.biography}
            </p>
          </div>

          {poet.sources && (
            <div className="pt-4 border-t border-[#D9B56D]/15">
              <h4 className="text-xs font-bold text-[#D9B56D] mb-1">المصادر والمراجع الأدبية الموثقة:</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-sans-ar">
                {poet.sources}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'poems' && (
        <div className="space-y-6">
          {poems.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30">
              <BookOpen size={32} className="mx-auto text-[#D9B56D] mb-2" />
              <p className="text-sm font-bold text-[#183C35] dark:text-[#D9B56D]">لا توجد قصائد منشورة حتى الآن</p>
              <p className="text-xs text-stone-500 mt-1">القصائد قيد التحقيق والمراجعة التحريرية لدى الإدارة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {poems.map((poem) => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  onSelect={onSelectPoem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'collections' && (
        <div className="space-y-6">
          {collections.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30">
              <Layers size={32} className="mx-auto text-[#D9B56D] mb-2" />
              <p className="text-sm font-bold text-[#183C35] dark:text-[#D9B56D]">لم تُدرج دواوين بعد</p>
              <p className="text-xs text-stone-500 mt-1">يجري توثيق الدواوين الورقية والمخطوطات التراثية للشاعر.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 p-5 shadow-xs flex gap-4 text-right"
                >
                  {col.coverImage && (
                    <img
                      src={col.coverImage}
                      alt={col.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-28 object-cover rounded-lg border border-[#D9B56D]/40 shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <h4 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D]">{col.title}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      سنة النشر: <span className="tabular-nums font-mono">{col.publicationYear} م</span> · {col.publisher || 'طبعة موثقة'}
                    </p>
                    <p className="text-xs text-[#39352F]/80 dark:text-[#F4EFE3]/80 line-clamp-3 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'quotes' && poet.quotes && (
        <div className="space-y-4">
          {poet.quotes.map((quote, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#F4EFE3]/70 dark:bg-[#0D1D1A]/70 border border-[#D9B56D]/30 font-amiri text-lg sm:text-xl text-[#183C35] dark:text-[#F4EFE3] text-center leading-loose relative"
            >
              <Quote size={20} className="text-[#D9B56D] mb-2 opacity-60 mx-auto" />
              <p>«{quote}»</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
