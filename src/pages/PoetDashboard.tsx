import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Poem, PoetProfile, Category, LiterarySchool, PoemForm, PoemVerse } from '../types';
import { 
  Feather, 
  BookOpen, 
  Plus, 
  Layers, 
  BarChart2, 
  Bell, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  Send,
  Save
} from 'lucide-react';

interface PoetDashboardProps {
  onSelectPoem: (slug: string) => void;
  onNavigateHome: () => void;
}

export const PoetDashboard: React.FC<PoetDashboardProps> = ({
  onSelectPoem,
  onNavigateHome
}) => {
  const { currentUser, poetProfile, refreshUser } = useAuth();

  // If poet profile is missing (e.g. demo mode), pick default or create
  const poet = poetProfile || StorageService.getPoetByUserId(currentUser?.id || '') || StorageService.getPoets()[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'poems' | 'new-poem' | 'collections' | 'profile'>('overview');

  // Submissions State
  const [poemTitle, setPoemTitle] = useState('');
  const [poemForm, setPoemForm] = useState<PoemForm>('عمودي');
  const [categoryId, setCategoryId] = useState('cat-watan');
  const [literarySchool, setLiterarySchool] = useState<LiterarySchool>(poet?.literarySchool || 'كلاسيكي عمودي');
  const [writtenAt, setWrittenAt] = useState('');
  const [source, setSource] = useState('قصيدة أصلية خاصة بالشاعر');
  const [copyrightStatus, setCopyrightStatus] = useState('محفوظة الحقوق للشاعر، ومرخصة لمنصة شعراء السودان');
  
  // Couplet verses editor
  const [versesText, setVersesText] = useState(`يا نيل يا مهوى القلوب وسحرها ... فاضت بذكرك في الديار قوافِ
بلد الكرام ومهبط الأحرار في ... وادٍ خصيبٍ بالشهامة صافِ`);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Collections state
  const [colTitle, setColTitle] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colYear, setColYear] = useState('2026');

  // Load poems of this poet
  const poems = poet ? StorageService.getPoemsByPoetId(poet.id, true) : [];
  const publishedPoems = poems.filter(p => p.publicationStatus === 'approved');
  const pendingPoems = poems.filter(p => p.publicationStatus === 'pending_review');
  const draftPoems = poems.filter(p => p.publicationStatus === 'draft');
  const rejectedPoems = poems.filter(p => p.publicationStatus === 'rejected');

  const totalViews = publishedPoems.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const categories = StorageService.getCategories();
  const collections = poet ? StorageService.getCollectionsByPoetId(poet.id) : [];

  const handleCreatePoem = (status: 'draft' | 'pending_review') => {
    if (!poemTitle.trim() || !versesText.trim()) {
      alert('يرجى كتابة عنوان القصيدة وأبياتها.');
      return;
    }

    // Parse verses
    const lines = versesText.split('\n').filter(l => l.trim().length > 0);
    const parsedVerses: PoemVerse[] = lines.map(line => {
      // Split by ... or ··· or three dots or space gap
      const parts = line.split(/\.{2,4}|…|،،|✤/);
      if (parts.length >= 2) {
        return { first: parts[0].trim(), second: parts[1].trim() };
      }
      return { first: line.trim(), second: '' };
    });

    const selectedCategory = categories.find(c => c.id === categoryId);

    const newPoem: Poem = {
      id: `poem-${Date.now()}`,
      poetId: poet.id,
      poetName: poet.literaryName,
      title: poemTitle.trim(),
      slug: poemTitle.trim().replace(/\s+/g, '-').toLowerCase() + `-${Date.now().toString().slice(-4)}`,
      poemText: versesText,
      verses: parsedVerses,
      form: poemForm,
      categoryId,
      categoryName: selectedCategory ? selectedCategory.name : 'الشعر العربي',
      literarySchool,
      writtenAt: writtenAt.trim() || undefined,
      source: source.trim(),
      copyrightStatus: copyrightStatus.trim(),
      publicationStatus: status,
      viewsCount: 0,
      isFeatured: false,
      isPoemOfTheDay: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.savePoem(newPoem);

    if (currentUser) {
      StorageService.addNotification(
        currentUser.id,
        status === 'pending_review' ? 'تم تقديم القصيدة للمراجعة' : 'تم حفظ مسودة القصيدة',
        status === 'pending_review' 
          ? `قصيدتك «${newPoem.title}» أرسلت إلى هيئة التحرير وهي قيد التدقيق.`
          : `تم حفظ قصيدتك «${newPoem.title}» كمسودة خاصة.`,
        'info'
      );
    }

    setFeedbackMsg(
      status === 'pending_review' 
        ? 'تم إرسال القصيدة للمراجعة والتدقيق التحريري بنجاح!' 
        : 'تم حفظ القصيدة كمسودة بنجاح.'
    );

    setPoemTitle('');
    setVersesText('');
    setTimeout(() => {
      setFeedbackMsg('');
      setActiveTab('poems');
    }, 1500);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colTitle.trim()) return;

    StorageService.saveCollection({
      id: `col-${Date.now()}`,
      poetId: poet.id,
      poetName: poet.literaryName,
      title: colTitle.trim(),
      description: colDesc.trim(),
      publicationYear: Number(colYear) || new Date().getFullYear(),
      coverImage: '/src/assets/images/poet_manuscript_ink_1793826079779.jpg',
      publisher: 'طبعة خاصة موثقة',
      poemsCount: 0,
      poemIds: [],
      createdAt: new Date().toISOString()
    });

    setColTitle('');
    setColDesc('');
    alert('تمت إضافة الديوان بنجاح.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/40 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={poet.profileImage}
            alt={poet.literaryName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover border-2 border-[#D9B56D]/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                لوحة الشاعر: {poet.literaryName}
              </h1>
              {poet.verificationStatus && (
                <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>شاعر موثق</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {poet.city} · {poet.literarySchool}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new-poem')}
            className="px-4 py-2 bg-[#D9B56D] hover:bg-[#e2c17b] text-[#183C35] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>إضافة قصيدة جديدة</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9B56D]/30 pb-1 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <BarChart2 size={15} />
          <span>لوحة المعلومات والإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('poems')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'poems'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <BookOpen size={15} />
          <span>قصائدي ({poems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-poem')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'new-poem'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Feather size={15} />
          <span>محرر إضافة قصيدة</span>
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'collections'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Layers size={15} />
          <span>دواويني ({collections.length})</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 shadow-xs">
              <span className="text-xs text-stone-500">القصائد المنشورة المعتمدة</span>
              <p className="text-2xl sm:text-3xl font-bold text-[#183C35] dark:text-[#D9B56D] mt-1 tabular-nums font-mono">
                {publishedPoems.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 shadow-xs">
              <span className="text-xs text-stone-500">قصائد قيد التدقيق التحريري</span>
              <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1 tabular-nums font-mono">
                {pendingPoems.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 shadow-xs">
              <span className="text-xs text-stone-500">إجمالي القراءات الأدبية</span>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1 tabular-nums font-mono">
                {totalViews}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 shadow-xs">
              <span className="text-xs text-stone-500">الدواوين الموثقة</span>
              <p className="text-2xl sm:text-3xl font-bold text-[#7D302D] dark:text-[#F4EFE3] mt-1 tabular-nums font-mono">
                {collections.length}
              </p>
            </div>
          </div>

          {/* Quick poem list overview */}
          <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 shadow-xs space-y-4">
            <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D]">
              أحدث قصائدي وحالتها التحريرية
            </h3>
            {poems.length === 0 ? (
              <p className="text-xs text-stone-500">لم تقم بإضافة قصائد بعد.</p>
            ) : (
              <div className="divide-y divide-[#D9B56D]/15">
                {poems.slice(0, 5).map(p => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-amiri font-bold text-[#183C35] dark:text-[#F4EFE3] text-base">{p.title}</p>
                      <p className="text-xs text-stone-500">{p.categoryName} · {p.form}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        p.publicationStatus === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : p.publicationStatus === 'pending_review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {p.publicationStatus === 'approved' ? 'معتمدة ومنشورة' : p.publicationStatus === 'pending_review' ? 'قيد المراجعة' : 'مسودة'}
                      </span>
                      {p.publicationStatus === 'approved' && (
                        <button
                          onClick={() => onSelectPoem(p.slug)}
                          className="text-xs text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline"
                        >
                          عرض
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Poems List */}
      {activeTab === 'poems' && (
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9B56D]/15 pb-3">
            <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              قائمة جميع القصائد
            </h3>
            <button
              onClick={() => setActiveTab('new-poem')}
              className="text-xs font-bold text-[#183C35] dark:text-[#D9B56D] hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              <span>إضافة قصيدة</span>
            </button>
          </div>

          <div className="divide-y divide-[#D9B56D]/15">
            {poems.map(poem => (
              <div key={poem.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#F4EFE3]">{poem.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>{poem.categoryName}</span>
                    <span>·</span>
                    <span>شعر {poem.form}</span>
                    <span>·</span>
                    <span className="tabular-nums font-mono">{poem.viewsCount} قراءة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                    poem.publicationStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : poem.publicationStatus === 'pending_review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}>
                    {poem.publicationStatus === 'approved' ? 'منشورة معتمدة' : poem.publicationStatus === 'pending_review' ? 'قيد المراجعة' : 'مسودة'}
                  </span>

                  {poem.publicationStatus === 'approved' && (
                    <button
                      onClick={() => onSelectPoem(poem.slug)}
                      className="px-3 py-1 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
                    >
                      معاينة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: New Poem Editor */}
      {activeTab === 'new-poem' && (
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#D9B56D]/15 pb-3">
            <h3 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              محرر القصائد الفصيحة
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              أدخل نص القصيدة مع مراعاة الفصل بين الشطرين بـ (...) أو علامة فاصلة. تمر القصيدة بالمراجعة التحريرية قبل نشرها.
            </p>
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 rounded-xl text-xs font-bold">
              {feedbackMsg}
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  عنوان القصيدة *
                </label>
                <input
                  type="text"
                  value={poemTitle}
                  onChange={(e) => setPoemTitle(e.target.value)}
                  placeholder="مثال: ترنيمة النيل الخالد"
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-sm text-[#183C35] dark:text-[#F4EFE3] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  النمط الشعري *
                </label>
                <select
                  value={poemForm}
                  onChange={(e) => setPoemForm(e.target.value as PoemForm)}
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                >
                  <option value="عمودي">شعر عمودي مقفى (شطرين)</option>
                  <option value="تفعيلة">شعر تفعيلة</option>
                  <option value="حر">شعر حر فصيح</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  التصنيف الشعري *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  سنة النظم / الكتابة (اختياري)
                </label>
                <input
                  type="text"
                  value={writtenAt}
                  onChange={(e) => setWrittenAt(e.target.value)}
                  placeholder="مثال: 2024"
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                أبيات القصيدة (كل بيت في سطر، مع فصل الصدر عن العجز بـ ...) *
              </label>
              <textarea
                rows={10}
                value={versesText}
                onChange={(e) => setVersesText(e.target.value)}
                placeholder="الصدر الأول ... العجز الأول&#10;الصدر الثاني ... العجز الثاني"
                className="w-full p-4 rounded-xl border border-[#D9B56D]/30 bg-[#F4EFE3]/20 dark:bg-[#0D1D1A]/30 font-amiri text-base text-[#183C35] dark:text-[#F4EFE3] outline-none leading-loose text-center"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  مصدر القصيدة (ديوان أو مخطوطة)
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                  حقوق النشر الأدبية
                </label>
                <input
                  type="text"
                  value={copyrightStatus}
                  onChange={(e) => setCopyrightStatus(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D9B56D]/15">
              <button
                type="button"
                onClick={() => handleCreatePoem('draft')}
                className="px-5 py-2.5 rounded-xl border border-[#D9B56D]/40 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/15 font-bold text-xs flex items-center gap-1.5"
              >
                <Save size={15} />
                <span>حفظ كمسودة</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreatePoem('pending_review')}
                className="px-6 py-2.5 rounded-xl bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Send size={15} />
                <span>إرسال للمراجعة والاعتماد</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Collections / Dawaween */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          {/* Add collection form */}
          <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 shadow-xs space-y-4">
            <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D]">
              إضافة ديوان أو مؤلف شعري
            </h3>
            <form onSubmit={handleCreateCollection} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">عنوان الديوان *</label>
                  <input
                    type="text"
                    value={colTitle}
                    onChange={(e) => setColTitle(e.target.value)}
                    placeholder="عنوان الديوان المطبوع"
                    className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">سنة النشر</label>
                  <input
                    type="number"
                    value={colYear}
                    onChange={(e) => setColYear(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">وصف موجز للديوان</label>
                <textarea
                  rows={3}
                  value={colDesc}
                  onChange={(e) => setColDesc(e.target.value)}
                  placeholder="نبذة عن موضوعات وقصائد الديوان..."
                  className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#183C35] text-[#D9B56D] font-bold rounded-lg text-xs"
              >
                حفظ الديوان
              </button>
            </form>
          </div>

          {/* Existing collections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collections.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
                <h4 className="font-amiri font-bold text-base text-[#183C35] dark:text-[#D9B56D]">{c.title}</h4>
                <p className="text-xs text-stone-500">سنة النشر: {c.publicationYear} م</p>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
