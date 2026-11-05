import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { 
  PoetApplication, 
  Poem, 
  PoetProfile, 
  Category, 
  ContentReport, 
  AuditLog, 
  LiterarySchool 
} from '../types';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  FileCheck, 
  Layers, 
  AlertCircle, 
  History, 
  Check, 
  X, 
  Star, 
  Plus, 
  Trash2,
  Eye,
  MessageSquare,
  Sparkles,
  Pencil,
  Upload
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectPoem: (slug: string) => void;
  onSelectPoet: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectPoem,
  onSelectPoet
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'kpi' | 'applications' | 'poems' | 'poets' | 'categories' | 'reports' | 'logs'>('kpi');

  // Local state triggered refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const doRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Data
  const applications = StorageService.getApplications();
  const poems = StorageService.getPoems();
  const poets = StorageService.getPoets();
  const categories = StorageService.getCategories();
  const reports = StorageService.getReports();
  const auditLogs = StorageService.getAuditLogs();

  // Selected application to review
  const [selectedApp, setSelectedApp] = useState<PoetApplication | null>(null);
  const [adminNote, setAdminNote] = useState('');

  // Selected poem to review
  const [selectedPoemReview, setSelectedPoemReview] = useState<Poem | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Historical Poet Form State
  const [newPoetName, setNewPoetName] = useState('');
  const [newPoetFullName, setNewPoetFullName] = useState('');
  const [newPoetCity, setNewPoetCity] = useState('');
  const [newPoetBio, setNewPoetBio] = useState('');
  const [newPoetBirth, setNewPoetBirth] = useState('');
  const [newPoetDeath, setNewPoetDeath] = useState('');
  const [newPoetSchool, setNewPoetSchool] = useState<LiterarySchool>('كلاسيكي عمودي');
  const [newPoetSources, setNewPoetSources] = useState('');
  const [showNewPoetModal, setShowNewPoetModal] = useState(false);

  // Edit Poet Photo State
  const [editingPoet, setEditingPoet] = useState<PoetProfile | null>(null);
  const [editImageValue, setEditImageValue] = useState('');

  // KPIs
  const pendingApps = applications.filter(a => a.status === 'pending');
  const pendingPoems = poems.filter(p => p.publicationStatus === 'pending_review');
  const publishedPoems = poems.filter(p => p.publicationStatus === 'approved');
  const totalReads = publishedPoems.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const pendingReports = reports.filter(r => r.status === 'pending');

  // Handle Application Approval
  const handleApproveApplication = (app: PoetApplication) => {
    // 1. Update application status
    app.status = 'approved';
    app.adminNotes = adminNote.trim() || 'تمت الموافقة واعتماد الشاعر رسمياً بعد تدقيق نصوصه الأدبية.';
    app.reviewedBy = currentUser?.fullName || 'المدير العام';
    app.reviewedAt = new Date().toISOString();
    StorageService.saveApplication(app);

    // 2. Update user role
    const user = StorageService.getUserById(app.userId);
    if (user) {
      user.role = 'approved_poet';
      StorageService.saveUser(user);
    }

    // 3. Create or update PoetProfile
    const profileSlug = app.literaryName.replace(/\s+/g, '-').toLowerCase();
    const newProfile: PoetProfile = {
      id: `poet-${Date.now()}`,
      userId: app.userId,
      literaryName: app.literaryName,
      fullName: app.fullName,
      biography: app.biography,
      profileImage: app.profileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      birthYear: app.birthYear,
      city: app.city,
      literarySchool: app.literarySchool,
      verificationStatus: true,
      profileSlug,
      isHistorical: false,
      sources: 'ملف معتمد وموثق بواسطة هيئة تحرير منصة شعراء السودان',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    StorageService.savePoet(newProfile);

    // 4. Send Notification
    StorageService.addNotification(
      app.userId,
      'تم اعتمادك شاعراً رسمياً في الديوان',
      'تهانينا! تمت الموافقة على طلب انضمامك واعتمدت صفحتك في دليل شعراء السودان.',
      'success'
    );

    // 5. Add Audit Log
    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'موافقة على طلب انضمام شاعر',
      'poet_application',
      app.id,
      `تم اعتماد الشاعر ${app.literaryName} وتفعيل حسابه وصفحته الرسمية.`
    );

    alert(`تم اعتماد الشاعر ${app.literaryName} بنجاح وإنشاء صفحته الأدبية.`);
    setSelectedApp(null);
    setAdminNote('');
    doRefresh();
  };

  const handleRejectApplication = (app: PoetApplication) => {
    app.status = 'rejected';
    app.adminNotes = adminNote.trim() || 'نعتذر، لم يستوفِ الطلب المعايير التحريرية الحالية.';
    app.reviewedBy = currentUser?.fullName || 'المدير العام';
    app.reviewedAt = new Date().toISOString();
    StorageService.saveApplication(app);

    StorageService.addNotification(
      app.userId,
      'تحديث بخصوص طلب الانضمام',
      app.adminNotes,
      'alert'
    );

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'رفض طلب انضمام شاعر',
      'poet_application',
      app.id,
      `تم رفض طلب ${app.literaryName}: ${app.adminNotes}`
    );

    alert(`تم تحديث حالة طلب الشاعر إلى مرفوض.`);
    setSelectedApp(null);
    setAdminNote('');
    doRefresh();
  };

  const handleRequestRevision = (app: PoetApplication) => {
    app.status = 'needs_revision';
    app.adminNotes = adminNote.trim() || 'يرجى استكمال البيانات ونماذج القصائد الفصيحة.';
    app.reviewedBy = currentUser?.fullName || 'المدير العام';
    app.reviewedAt = new Date().toISOString();
    StorageService.saveApplication(app);

    StorageService.addNotification(
      app.userId,
      'طلب تعديلات على استمارة الشاعر',
      app.adminNotes,
      'warning'
    );

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'طلب تعديلات على طلب شاعر',
      'poet_application',
      app.id,
      `طُلب من الشاعر ${app.literaryName} إجراء تعديلات: ${app.adminNotes}`
    );

    alert(`تم إرسال طلب التعديلات إلى الشاعر.`);
    setSelectedApp(null);
    setAdminNote('');
    doRefresh();
  };

  // Poem Review Handlers
  const handleApprovePoem = (poem: Poem) => {
    poem.publicationStatus = 'approved';
    poem.approvedBy = currentUser?.fullName || 'المدير العام';
    poem.approvedAt = new Date().toISOString();
    StorageService.savePoem(poem);

    const poet = StorageService.getPoetById(poem.poetId);
    if (poet?.userId) {
      StorageService.addNotification(
        poet.userId,
        'تمت إجازة ونشر قصيدتك',
        `أجازت هيئة التحرير قصيدتك «${poem.title}» ونشرت رسمياً في المكتبة الشعرية.`,
        'success'
      );
    }

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'إجازة قصيدة ونشرها',
      'poem',
      poem.id,
      `تمت إجازة ونشر قصيدة «${poem.title}» للشاعر ${poem.poetName}.`
    );

    alert(`تمت إجازة ونشر قصيدة «${poem.title}» بنجاح.`);
    setSelectedPoemReview(null);
    doRefresh();
  };

  const handleRejectPoem = (poem: Poem) => {
    poem.publicationStatus = 'rejected';
    StorageService.savePoem(poem);

    const poet = StorageService.getPoetById(poem.poetId);
    if (poet?.userId) {
      StorageService.addNotification(
        poet.userId,
        'بشأن إجازة القصيدة',
        `نعتذر، لم تتم إجازة قصيدة «${poem.title}» في المراجعة التحريرية الحالية.`,
        'alert'
      );
    }

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'رفض قصيدة',
      'poem',
      poem.id,
      `تم رفض قصيدة «${poem.title}» للشاعر ${poem.poetName}.`
    );

    alert(`تم رفض نشر القصيدة.`);
    setSelectedPoemReview(null);
    doRefresh();
  };

  const handleSetPoemOfTheDay = (targetPoem: Poem) => {
    const all = StorageService.getPoems();
    all.forEach(p => {
      p.isPoemOfTheDay = p.id === targetPoem.id;
      StorageService.savePoem(p);
    });

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'تعيين قصيدة اليوم',
      'poem',
      targetPoem.id,
      `تم اختيار قصيدة «${targetPoem.title}» لتكون قصيدة اليوم في الصفحة الرئيسية.`
    );

    alert(`تم تعيين «${targetPoem.title}» كقصيدة اليوم.`);
    doRefresh();
  };

  // Categories Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    StorageService.saveCategory({
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatName.trim().replace(/\s+/g, '-').toLowerCase(),
      description: newCatDesc.trim() || 'تصنيف شعري معتمد في منصة شعراء السودان'
    });

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'إضافة تصنيف شعري',
      'category',
      newCatName,
      `أضيف التصنيف الشعري «${newCatName}».`
    );

    setNewCatName('');
    setNewCatDesc('');
    alert('تمت إضافة التصنيف بنجاح.');
    doRefresh();
  };

  // Add Historical Poet Manually
  const handleAddHistoricalPoet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoetName.trim() || !newPoetCity.trim() || !newPoetBio.trim()) {
      alert('يرجى ملء الحقول الإلزامية للشاعر.');
      return;
    }

    const slug = newPoetName.trim().replace(/\s+/g, '-').toLowerCase();
    const newPoet: PoetProfile = {
      id: `poet-${Date.now()}`,
      literaryName: newPoetName.trim(),
      fullName: newPoetFullName.trim() || newPoetName.trim(),
      biography: newPoetBio.trim(),
      profileImage: '/src/assets/images/poet_manuscript_ink_1793826079779.jpg',
      birthYear: newPoetBirth ? Number(newPoetBirth) : undefined,
      deathYear: newPoetDeath ? Number(newPoetDeath) : undefined,
      city: newPoetCity.trim(),
      literarySchool: newPoetSchool,
      verificationStatus: true,
      profileSlug: slug,
      isHistorical: true,
      sources: newPoetSources.trim() || 'طبعات محققة ودراسات توثيقية في الأدب السوداني',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.savePoet(newPoet);

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'إضافة شاعر تاريخي',
      'poet',
      newPoet.id,
      `تم توثيق الشاعر الراحل «${newPoet.literaryName}» وإضافته لسجل الذاكرة الشعرية.`
    );

    setShowNewPoetModal(false);
    setNewPoetName('');
    setNewPoetFullName('');
    setNewPoetBio('');
    setNewPoetCity('');
    alert(`تمت إضافة الشاعر «${newPoet.literaryName}» بنجاح.`);
    doRefresh();
  };

  // Edit Poet Photo Handlers
  const handleOpenEditPoetPhoto = (p: PoetProfile) => {
    setEditingPoet(p);
    setEditImageValue(p.profileImage);
  };

  const handleEditImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Downscale + compress before storing: uploaded photos are kept as
      // base64 inside localStorage (no backend), which caps out around
      // 5MB per origin — full-resolution uploads blow through that after
      // just one or two poets and silently fail to save.
      const img = new Image();
      img.onload = () => {
        const maxDim = 480;
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setEditImageValue(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        setEditImageValue(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePoetPhoto = () => {
    if (!editingPoet || !editImageValue.trim()) return;

    const updatedPoet: PoetProfile = { ...editingPoet, profileImage: editImageValue.trim() };
    StorageService.savePoet(updatedPoet);

    // localStorage writes fail silently when the quota is full, so verify
    // the change actually landed before telling the admin it worked.
    const verify = StorageService.getPoetById(updatedPoet.id);
    if (verify?.profileImage !== updatedPoet.profileImage) {
      alert('تعذر حفظ الصورة: مساحة التخزين المحلي في المتصفح ممتلئة. جرّب صورة أصغر، أو استخدم رابط صورة (URL) بدلاً من الرفع المباشر.');
      return;
    }

    StorageService.addAuditLog(
      currentUser?.id || 'admin',
      currentUser?.fullName || 'المدير العام',
      'تعديل صورة شاعر',
      'poet',
      updatedPoet.id,
      `تم تحديث الصورة الشخصية للشاعر «${updatedPoet.literaryName}».`
    );

    alert(`تم تحديث صورة الشاعر «${updatedPoet.literaryName}» بنجاح.`);
    setEditingPoet(null);
    setEditImageValue('');
    doRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[#183C35] text-[#F4EFE3] p-6 shadow-md border border-[#D9B56D]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#D9B56D] text-[#183C35] flex items-center justify-center font-bold">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-[#D9B56D]">
              لوحة الإدارة وهيئة التحرير
            </h1>
            <p className="text-xs text-[#F4EFE3]/80 mt-0.5">
              الإشراف على التوثيق، مراجعة طلبات الشعراء، إجازة القصائد، وإدارة الذاكرة الشعرية.
            </p>
          </div>
        </div>

        <div className="text-xs text-[#D9B56D] font-mono tabular-nums">
          المشرف: {currentUser?.fullName || 'المدير العام'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9B56D]/30 pb-1 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kpi'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Sparkles size={15} />
          <span>المؤشرات والأنشطة</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <FileCheck size={15} />
          <span>طلبات الشعراء ({pendingApps.length})</span>
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
          <span>إجازة القصائد ({pendingPoems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('poets')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'poets'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Users size={15} />
          <span>إدارة الشعراء ({poets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Layers size={15} />
          <span>التصنيفات ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <AlertCircle size={15} />
          <span>البلاغات ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2 px-3 sm:px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <History size={15} />
          <span>سجل العمليات ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab: Overview KPIs */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
              <span className="text-xs text-stone-500">طلبات الشعراء المعلقة</span>
              <p className="text-3xl font-bold text-amber-600 mt-1 tabular-nums font-mono">
                {pendingApps.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
              <span className="text-xs text-stone-500">قصائد تنتظر التدقيق</span>
              <p className="text-3xl font-bold text-amber-600 mt-1 tabular-nums font-mono">
                {pendingPoems.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
              <span className="text-xs text-stone-500">الشعراء المعتمدون</span>
              <p className="text-3xl font-bold text-[#183C35] dark:text-[#D9B56D] mt-1 tabular-nums font-mono">
                {poets.length}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
              <span className="text-xs text-stone-500">القصائد المنشورة</span>
              <p className="text-3xl font-bold text-emerald-600 mt-1 tabular-nums font-mono">
                {publishedPoems.length}
              </p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pending apps preview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 space-y-3">
              <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] flex items-center justify-between">
                <span>أحدث طلبات انضمام الشعراء</span>
                <button
                  onClick={() => setActiveTab('applications')}
                  className="text-xs text-[#D9B56D] hover:underline"
                >
                  عرض الكل
                </button>
              </h3>
              {pendingApps.length === 0 ? (
                <p className="text-xs text-stone-500">لا توجد طلبات معلقة حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {pendingApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => { setSelectedApp(app); setActiveTab('applications'); }}
                      className="p-3 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 cursor-pointer hover:border-[#D9B56D] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-[#183C35] dark:text-[#F4EFE3]">{app.literaryName}</p>
                        <p className="text-xs text-stone-500">{app.city} · {app.literarySchool}</p>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                        مراجعة
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending poems preview */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 space-y-3">
              <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] flex items-center justify-between">
                <span>قصائد تنتظر الإجازة التحريرية</span>
                <button
                  onClick={() => setActiveTab('poems')}
                  className="text-xs text-[#D9B56D] hover:underline"
                >
                  عرض الكل
                </button>
              </h3>
              {pendingPoems.length === 0 ? (
                <p className="text-xs text-stone-500">لا توجد قصائد قيد التدقيق حالياً.</p>
              ) : (
                <div className="space-y-2">
                  {pendingPoems.map(poem => (
                    <div
                      key={poem.id}
                      onClick={() => { setSelectedPoemReview(poem); setActiveTab('poems'); }}
                      className="p-3 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 cursor-pointer hover:border-[#D9B56D] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-[#183C35] dark:text-[#F4EFE3]">{poem.title}</p>
                        <p className="text-xs text-stone-500">للشاعر: {poem.poetName}</p>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                        تدقيق
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Applications Review */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="border-b border-[#D9B56D]/20 pb-3">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              مراجعة وتدقيق طلبات انضمام الشعراء
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              دراسة السيرة الأدبية ونماذج القصائد الفصيحة قبل منح صفة «شاعر معتمد» وتفعيل صفحته الرسمية.
            </p>
          </div>

          {selectedApp ? (
            /* Detailed Application Review Card */
            <div className="bg-white dark:bg-[#162E28] rounded-2xl border-2 border-[#D9B56D] p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-[#D9B56D]/20 pb-3">
                <div>
                  <h3 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                    مراجعة طلب: {selectedApp.literaryName}
                  </h3>
                  <p className="text-xs text-stone-500">الاسم الكامل: {selectedApp.fullName} · {selectedApp.userEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-xs rounded-lg"
                >
                  إغلاق المعاينة
                </button>
              </div>

              {/* Bio & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 p-4 rounded-xl">
                <div>
                  <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">المدينة / المنطقة: </span>
                  <span>{selectedApp.city}</span>
                </div>
                <div>
                  <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">المدرسة الشعرية: </span>
                  <span>{selectedApp.literarySchool}</span>
                </div>
                <div>
                  <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">سنة الميلاد: </span>
                  <span>{selectedApp.birthYear || 'غير محدد'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#183C35] dark:text-[#D9B56D] mb-1">السيرة الأدبية:</h4>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-[#F4EFE3]/20 dark:bg-[#0D1D1A]/20 p-3 rounded-lg font-sans-ar">
                  {selectedApp.biography}
                </p>
              </div>

              {/* Poem Samples */}
              <div className="space-y-4">
                <h4 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D]">
                  القصائد والنماذج الشعرية المرفقة ({selectedApp.literarySamples.length})
                </h4>
                {selectedApp.literarySamples.map((sample, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#D9B56D]/30 bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 text-center space-y-2">
                    <p className="font-amiri font-bold text-base text-[#183C35] dark:text-[#D9B56D]">«{sample.title}» ({sample.poemType})</p>
                    <div className="font-amiri text-xs sm:text-sm leading-loose whitespace-pre-line text-[#39352F] dark:text-[#F4EFE3]/90">
                      {sample.poemText}
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Note Input */}
              <div>
                <label className="block font-bold text-xs text-[#183C35] dark:text-[#D9B56D] mb-1">
                  الملاحظات الإدارية / سبب القرار:
                </label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="اكتب ملاحظات التحرير أو أسباب القبول / الرفض / طلب التعديلات..."
                  className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 text-xs text-[#183C35] dark:text-[#F4EFE3] bg-white dark:bg-[#162E28] outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#D9B56D]/20">
                <button
                  onClick={() => handleRejectApplication(selectedApp)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <X size={15} />
                  <span>رفض الطلب</span>
                </button>

                <button
                  onClick={() => handleRequestRevision(selectedApp)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <AlertCircle size={15} />
                  <span>طلب تعديلات من الشاعر</span>
                </button>

                <button
                  onClick={() => handleApproveApplication(selectedApp)}
                  className="px-5 py-2 bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Check size={15} />
                  <span>قبول واعتماد الشاعر رسمياً</span>
                </button>
              </div>
            </div>
          ) : (
            /* Applications Table */
            <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 overflow-hidden shadow-xs">
              <div className="divide-y divide-[#D9B56D]/15">
                {applications.map(app => (
                  <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-amiri font-bold text-lg text-[#183C35] dark:text-[#D9B56D]">{app.literaryName}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                          app.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status === 'approved' ? 'مقبول ومعتمد' : app.status === 'pending' ? 'قيد المراجعة' : 'مرفوض'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        الاسم: {app.fullName} · {app.city} · {app.literarySchool} · النماذج: {app.literarySamples.length}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-xl text-xs font-bold hover:bg-[#122e28] transition-colors"
                      >
                        معاينة واتخاذ قرار
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Poem Reviews */}
      {activeTab === 'poems' && (
        <div className="space-y-6">
          <div className="border-b border-[#D9B56D]/20 pb-3 flex items-center justify-between">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              إجازة القصائد وتعيين قصيدة اليوم
            </h2>
            <span className="text-xs text-stone-500">إجمالي القصائد: {poems.length}</span>
          </div>

          <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 overflow-hidden shadow-xs divide-y divide-[#D9B56D]/15">
            {poems.map(poem => (
              <div key={poem.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-amiri font-bold text-lg text-[#183C35] dark:text-[#F4EFE3]">{poem.title}</h3>
                    {poem.isPoemOfTheDay && (
                      <span className="text-[11px] bg-[#D9B56D] text-[#183C35] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Star size={11} className="fill-[#183C35]" />
                        <span>قصيدة اليوم</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    للشاعر: {poem.poetName} · {poem.categoryName} · {poem.form}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {poem.publicationStatus === 'pending_review' && (
                    <>
                      <button
                        onClick={() => handleApprovePoem(poem)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Check size={14} />
                        <span>إجازة ونشر</span>
                      </button>
                      <button
                        onClick={() => handleRejectPoem(poem)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <X size={14} />
                        <span>رفض</span>
                      </button>
                    </>
                  )}

                  {poem.publicationStatus === 'approved' && !poem.isPoemOfTheDay && (
                    <button
                      onClick={() => handleSetPoemOfTheDay(poem)}
                      className="px-3 py-1.5 border border-[#D9B56D]/40 text-[#183C35] dark:text-[#D9B56D] hover:bg-[#D9B56D]/15 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Star size={13} />
                      <span>تعيين كقصيدة اليوم</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectPoem(poem.slug)}
                    className="px-3 py-1.5 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
                  >
                    قراءة القصيدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Poets Management */}
      {activeTab === 'poets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9B56D]/20 pb-3 flex-wrap gap-3">
            <div>
              <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                إدارة دليل الشعراء
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                تعديل بيانات الشعراء، منح وإلغاء شارات التوثيق، وإضافة شعراء تاريخيين.
              </p>
            </div>
            <button
              onClick={() => setShowNewPoetModal(true)}
              className="px-4 py-2 bg-[#D9B56D] hover:bg-[#e2c17b] text-[#183C35] font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>إضافة شاعر تاريخي يدوياً</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {poets.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0 group">
                    <img
                      src={p.profileImage}
                      alt={p.literaryName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover border border-[#D9B56D]/40"
                    />
                    <button
                      onClick={() => handleOpenEditPoetPhoto(p)}
                      title="تعديل الصورة"
                      className="absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#183C35] text-[#D9B56D] border border-[#D9B56D]/60 flex items-center justify-center shadow-xs hover:bg-[#122e28]"
                    >
                      <Pencil size={11} />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-amiri font-bold text-base text-[#183C35] dark:text-[#D9B56D]">{p.literaryName}</h4>
                    <p className="text-xs text-stone-500">{p.city} · {p.literarySchool}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D9B56D]/15 text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                    p.verificationStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {p.verificationStatus ? 'موثق رسمياً' : 'غير موثق'}
                  </span>
                  <button
                    onClick={() => onSelectPoet(p.profileSlug)}
                    className="text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline"
                  >
                    زيارة الصفحة ←
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to add historical poet manually */}
          {showNewPoetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-lg bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 p-6 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#D9B56D]/20 pb-2">
                  <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                    إضافة شاعر تاريخي موثق
                  </h3>
                  <button onClick={() => setShowNewPoetModal(false)} className="text-stone-400">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddHistoricalPoet} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الاسم الأدبي للشاعر *</label>
                    <input
                      type="text"
                      value={newPoetName}
                      onChange={(e) => setNewPoetName(e.target.value)}
                      placeholder="مثال: الشاعر محمد المهدي المجذوب"
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الاسم الكامل (إن توفر)</label>
                    <input
                      type="text"
                      value={newPoetFullName}
                      onChange={(e) => setNewPoetFullName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">سنة الميلاد</label>
                      <input
                        type="number"
                        value={newPoetBirth}
                        onChange={(e) => setNewPoetBirth(e.target.value)}
                        placeholder="مثال: 1919"
                        className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">سنة الوفاة</label>
                      <input
                        type="number"
                        value={newPoetDeath}
                        onChange={(e) => setNewPoetDeath(e.target.value)}
                        placeholder="مثال: 1982"
                        className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">المدينة أو الإقليم *</label>
                      <input
                        type="text"
                        value={newPoetCity}
                        onChange={(e) => setNewPoetCity(e.target.value)}
                        placeholder="الدامر / الخرطوم"
                        className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">المدرسة الشعرية</label>
                      <select
                        value={newPoetSchool}
                        onChange={(e) => setNewPoetSchool(e.target.value as LiterarySchool)}
                        className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                      >
                        <option value="كلاسيكي عمودي">كلاسيكي عمودي</option>
                        <option value="رومانسي وجداني">رومانسي وجداني</option>
                        <option value="واقعي وتفعيلة">واقعي وتفعيلة</option>
                        <option value="فلسفي وصوفي">فلسفي وصوفي</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">السيرة الذاتية والأدبية الموثقة *</label>
                    <textarea
                      rows={4}
                      value={newPoetBio}
                      onChange={(e) => setNewPoetBio(e.target.value)}
                      placeholder="نبذة تاريخية محققة عن الشاعر وأبرز أعماله ومسيرته..."
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">المصادر والمراجع المعتمدة</label>
                    <input
                      type="text"
                      value={newPoetSources}
                      onChange={(e) => setNewPoetSources(e.target.value)}
                      placeholder="مثال: ديوان نار المجاذيب، دراسة د. عبد الله الطيب..."
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewPoetModal(false)}
                      className="px-3 py-1.5 rounded-lg text-stone-500"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#183C35] text-[#D9B56D] font-bold rounded-lg"
                    >
                      حفظ وتوثيق الشاعر
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal to edit an existing poet's photo */}
          {editingPoet && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 p-6 shadow-2xl text-right space-y-4">
                <div className="flex items-center justify-between border-b border-[#D9B56D]/20 pb-2">
                  <h3 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                    تعديل صورة: {editingPoet.literaryName}
                  </h3>
                  <button onClick={() => { setEditingPoet(null); setEditImageValue(''); }} className="text-stone-400">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex justify-center">
                  <img
                    src={editImageValue}
                    alt={editingPoet.literaryName}
                    referrerPolicy="no-referrer"
                    className="w-28 h-28 rounded-xl object-cover border-2 border-[#D9B56D]/50"
                  />
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                      رفع صورة من الجهاز
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full p-3 rounded-lg border-2 border-dashed border-[#D9B56D]/40 text-[#183C35] dark:text-[#D9B56D] cursor-pointer hover:bg-[#D9B56D]/10">
                      <Upload size={15} />
                      <span>اختر ملف صورة...</span>
                      <input type="file" accept="image/*" onChange={handleEditImageFile} className="hidden" />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-stone-400">
                    <div className="flex-1 h-px bg-[#D9B56D]/20" />
                    <span>أو</span>
                    <div className="flex-1 h-px bg-[#D9B56D]/20" />
                  </div>

                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                      رابط الصورة (URL)
                    </label>
                    <input
                      type="text"
                      value={editImageValue.startsWith('data:') ? '' : editImageValue}
                      onChange={(e) => setEditImageValue(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#D9B56D]/20">
                  <button
                    onClick={() => { setEditingPoet(null); setEditImageValue(''); }}
                    className="px-3 py-1.5 rounded-lg text-stone-500 text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSavePoetPhoto}
                    className="px-4 py-1.5 bg-[#183C35] text-[#D9B56D] font-bold rounded-lg text-xs"
                  >
                    حفظ الصورة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 shadow-xs space-y-4">
            <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D]">
              إضافة تصنيف شعري جديد
            </h3>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="مثال: شعر التأمل الإنساني"
                  className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">الوصف</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="وصف مختصر للغرض الشعري"
                  className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#183C35] text-[#D9B56D] font-bold rounded-lg"
                >
                  إضافة التصنيف
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map(cat => {
              const count = StorageService.getApprovedPoems().filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="p-4 rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-amiri font-bold text-base text-[#183C35] dark:text-[#D9B56D]">{cat.name}</h4>
                    <span className="text-xs text-stone-400 font-mono">{count} قصيدة</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/20 pb-2">
            بلاغات حقوق النشر وتصحيح الأخطاء
          </h2>
          {reports.length === 0 ? (
            <p className="text-xs text-stone-500">لا توجد بلاغات مسجلة.</p>
          ) : (
            <div className="space-y-3">
              {reports.map(rep => (
                <div key={rep.id} className="p-4 rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#183C35] dark:text-[#D9B56D]">{rep.contentTitle}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rep.status === 'resolved' ? 'تمت المعالجة' : 'قيد النظر'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">{rep.details}</p>
                  <p className="text-[11px] text-stone-400">المرسل: {rep.userEmail || 'زائر'} · التاريخ: {new Date(rep.createdAt).toLocaleDateString('ar-SD')}</p>
                  {rep.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        StorageService.updateReportStatus(rep.id, 'resolved');
                        alert('تم تحديد البلاغ كمعالج بنجاح.');
                        doRefresh();
                      }}
                      className="px-3 py-1 bg-emerald-700 text-white text-xs font-bold rounded-md"
                    >
                      تحديد كمعالج
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/20 pb-2">
            سجل العمليات الإدارية والتحريرية
          </h2>
          <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 divide-y divide-[#D9B56D]/15 overflow-hidden">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-[#183C35] dark:text-[#D9B56D]">{log.action}</p>
                  <p className="text-stone-600 dark:text-stone-300 mt-0.5">{log.details}</p>
                </div>
                <div className="text-left font-mono text-[11px] text-stone-400 shrink-0">
                  <p>{log.adminName}</p>
                  <p>{new Date(log.createdAt).toLocaleDateString('ar-SD')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
