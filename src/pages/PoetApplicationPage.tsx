import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LiterarySchool, PoemForm, PoemSample } from '../types';
import { SudaneseEmblem } from '../components/SudaneseEmblem';
import { Feather, Plus, Trash2, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';

interface PoetApplicationPageProps {
  onNavigateToStatus: () => void;
  onNavigateHome: () => void;
}

export const PoetApplicationPage: React.FC<PoetApplicationPageProps> = ({
  onNavigateToStatus,
  onNavigateHome
}) => {
  const { currentUser, submitPoetApplication } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [literaryName, setLiteraryName] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState('');
  const [birthYear, setBirthYear] = useState<number | undefined>(undefined);
  const [literarySchool, setLiterarySchool] = useState<LiterarySchool>('كلاسيكي عمودي');
  const [biography, setBiography] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [publishedWorksLinks, setPublishedWorksLinks] = useState('');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400');

  // Poem Samples
  const [samples, setSamples] = useState<PoemSample[]>([
    {
      title: '',
      poemText: '',
      poemType: 'عمودي',
      source: ''
    }
  ]);

  // Declarations
  const [agreedOriginality, setAgreedOriginality] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSample = () => {
    if (samples.length >= 3) {
      alert('الحد الأقصى لنماذج القصائد في مرحلة التقديم هو 3 نماذج.');
      return;
    }
    setSamples([
      ...samples,
      { title: '', poemText: '', poemType: 'عمودي', source: '' }
    ]);
  };

  const handleRemoveSample = (index: number) => {
    if (samples.length <= 1) return;
    setSamples(samples.filter((_, i) => i !== index));
  };

  const handleSampleChange = (index: number, field: keyof PoemSample, value: string) => {
    const updated = [...samples];
    updated[index] = { ...updated[index], [field]: value };
    setSamples(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !literaryName.trim() || !city.trim() || !biography.trim()) {
      setErrorMessage('يرجى استكمال جميع البيانات الأدبية والشخصية الإلزامية.');
      return;
    }

    // Check poem sample
    const validSamples = samples.filter(s => s.title.trim() && s.poemText.trim());
    if (validSamples.length === 0) {
      setErrorMessage('يرجى تقديم نموذج واحد على الأقل من قصائدك الفصيحة مع العنوان والأبيات.');
      return;
    }

    if (!agreedOriginality || !agreedTerms) {
      setErrorMessage('يجب الموافقة على إقرارات الملكية الفكرية وشروط المنصة للمتابعة.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitPoetApplication({
        fullName: fullName.trim(),
        literaryName: literaryName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        birthYear: birthYear ? Number(birthYear) : undefined,
        literarySchool,
        biography: biography.trim(),
        socialLinks: socialLinks.trim(),
        publishedWorksLinks: publishedWorksLinks.trim(),
        profileImage,
        literarySamples: validSamples,
        agreedToTerms: agreedTerms,
        agreedToOriginality: agreedOriginality
      });

      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('حدث خطأ غير متوقع أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-right space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h1 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          تم استلام طلبك بنجاح
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans-ar">
          {successMessage}
        </p>
        <div className="p-4 rounded-xl bg-[#F4EFE3] dark:bg-[#162E28] border border-[#D9B56D]/30 text-xs text-stone-600 dark:text-stone-300 space-y-2">
          <p className="font-bold text-[#183C35] dark:text-[#D9B56D]">خطوات المراجعة والاعتماد:</p>
          <p>1. تقوم هيئة التحرير بمراجعة صحة ونظامية النماذج الشعرية والتأكد من مطابقتها للشعر العربي الفصيح.</p>
          <p>2. يتم التحقق من بيانات التوثيق والسيرة الأدبية للشاعر.</p>
          <p>3. فور الاعتماد، تتفعل لوحة الشاعر تلقائياً وتظهر صفحتك في دليل الشعراء المعتمدين.</p>
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={onNavigateToStatus}
            className="px-5 py-2.5 bg-[#183C35] text-[#D9B56D] rounded-xl text-xs font-bold shadow-xs hover:bg-[#122e28]"
          >
            متابعة حالة الطلب
          </button>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 border border-[#D9B56D]/30 rounded-xl text-xs font-bold text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#D9B56D]/15"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      {/* Header */}
      <div className="border-b border-[#D9B56D]/30 pb-6 text-center sm:text-right space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B56D]/20 text-[#183C35] dark:text-[#D9B56D] text-xs font-bold">
          <Feather size={14} />
          <span>استمارة الانضمام للشعراء المعتمدين</span>
        </div>
        <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          انضم إلى ديوان الشعراء
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans-ar leading-relaxed">
          تستقبل المنصة طلبات الشعراء السودانيين الذين يكتبون الشعر العربي الفصيح (العمودي، التفعيلة، والحر). تخضع جميع الطلبات لمراجعة هيئة التحرير لضمان رصانة المحتوى الأدبي.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 text-xs flex items-center gap-2">
          <ShieldAlert size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Personal & Literary Details */}
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/15 pb-2">
            1. البيانات الشخصية والأدبية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                الاسم الكامل (حسب الوثائق) *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: محمد أحمد الحسن"
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                الاسم الأدبي / اسم الشهرة *
              </label>
              <input
                type="text"
                value={literaryName}
                onChange={(e) => setLiteraryName(e.target.value)}
                placeholder="الاسم الذي ينشر به شعرك"
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                المدينة أو المنطقة في السودان *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: الخرطوم، أم درمان، كسلا، الفاشر..."
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                سنة الميلاد (اختياري)
              </label>
              <input
                type="number"
                value={birthYear || ''}
                onChange={(e) => setBirthYear(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="مثال: 1985"
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                المدرسة الشعرية الأغلب على نتاجك *
              </label>
              <select
                value={literarySchool}
                onChange={(e) => setLiterarySchool(e.target.value as LiterarySchool)}
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none"
              >
                <option value="كلاسيكي عمودي">كلاسيكي عمودي</option>
                <option value="رومانسي وجداني">رومانسي وجداني</option>
                <option value="واقعي وتفعيلة">واقعي وتفعيلة</option>
                <option value="حر حديث">حر حديث</option>
                <option value="فلسفي وصوفي">فلسفي وصوفي</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                رقم الهاتف (للتواصل الإداري)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+249..."
                className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-[#183C35] dark:text-[#F4EFE3] outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
              نبذة عن الشاعر ومسيرته الأدبية *
            </label>
            <textarea
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="اكتب سيرة موجزة تتناول بداياتك الشعرية، مشاركاتك في المنتديات، وأبرز محطات مسيرتك..."
              className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-xs text-[#183C35] dark:text-[#F4EFE3] outline-none leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
              روابط لأعمال سابقة أو صفحات أدبية منشورة (اختياري)
            </label>
            <input
              type="text"
              value={publishedWorksLinks}
              onChange={(e) => setPublishedWorksLinks(e.target.value)}
              placeholder="روابط لمجلات، مقالات، أو دواوين منشورة..."
              className="w-full p-2.5 rounded-lg border border-[#D9B56D]/30 bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 text-xs text-[#183C35] dark:text-[#F4EFE3] outline-none"
            />
          </div>
        </div>

        {/* Step 2: Poem Samples */}
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9B56D]/15 pb-2">
            <div>
              <h2 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
                2. نماذج من القصائد الفصيحة
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                قدّم ما لا يقل عن قصيدة واحدة فصيحة لتقييمها من قِبل هيئة التحرير.
              </p>
            </div>
            {samples.length < 3 && (
              <button
                type="button"
                onClick={handleAddSample}
                className="px-3 py-1.5 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] text-xs font-bold text-[#183C35] dark:text-[#D9B56D] border border-[#D9B56D]/30 hover:border-[#D9B56D] flex items-center gap-1"
              >
                <Plus size={14} />
                <span>إضافة نموذج آخر</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {samples.map((sample, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl border border-[#D9B56D]/25 bg-[#F4EFE3]/20 dark:bg-[#0D1D1A]/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D9B56D]">نموذج القصيدة #{idx + 1}</span>
                  {samples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSample(idx)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>حذف النموذج</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                      عنوان القصيدة *
                    </label>
                    <input
                      type="text"
                      value={sample.title}
                      onChange={(e) => handleSampleChange(idx, 'title', e.target.value)}
                      placeholder="عنوان القصيدة"
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#162E28] text-[#183C35] dark:text-[#F4EFE3] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                      النمط الشعري *
                    </label>
                    <select
                      value={sample.poemType}
                      onChange={(e) => handleSampleChange(idx, 'poemType', e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#162E28] text-[#183C35] dark:text-[#F4EFE3] outline-none"
                    >
                      <option value="عمودي">شعر عمودي مقفى (شطرين)</option>
                      <option value="تفعيلة">شعر تفعيلة فصيح</option>
                      <option value="حر">شعر حر باللغة العربية الفصحى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                    نص القصيدة (مع الحفاظ على تنسيق الشطرين أو الأسطر) *
                  </label>
                  <textarea
                    rows={6}
                    value={sample.poemText}
                    onChange={(e) => handleSampleChange(idx, 'poemText', e.target.value)}
                    placeholder="اكتب أبيات القصيدة هنا..."
                    className="w-full p-3 rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#162E28] font-amiri text-sm sm:text-base text-[#183C35] dark:text-[#F4EFE3] outline-none leading-loose text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-1">
                    مصدر القصيدة (إن كانت منشورة في صحيفة، ديوان، أو موقع أدبي)
                  </label>
                  <input
                    type="text"
                    value={sample.source}
                    onChange={(e) => handleSampleChange(idx, 'source', e.target.value)}
                    placeholder="مثال: منشورة في صحيفة الأيام الثقافية 2023 / أو غير منشورة بعد"
                    className="w-full p-2 rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#162E28] text-xs text-[#183C35] dark:text-[#F4EFE3] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Declarations and Commitments */}
        <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/15 pb-2">
            3. الإقرارات والشروط الأدبية
          </h2>

          <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedOriginality}
                onChange={(e) => setAgreedOriginality(e.target.checked)}
                className="mt-0.5 rounded accent-[#183C35]"
                required
              />
              <span className="leading-relaxed">
                أقر بأن جميع الأعمال والنماذج المقدمة هي من تأليفي الشخصي باللغة العربية الفصحى وأتحمل كامل المسؤولية الأدبية والقانونية عن أصالتها.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded accent-[#183C35]"
                required
              />
              <span className="leading-relaxed">
                أوافق على خضوع الطلب والنصوص لمراجعة هيئة التحرير، وأقر بأن قبول الطلب لا يعني نقل ملكية حقوق القصائد للمنصة بل منح الإذن الأدبي بنشرها وعرضها.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-3.5 bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-sm sm:text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
          >
            <Feather size={16} />
            <span>{isSubmitting ? 'جارٍ إرسال الطلب...' : 'إرسال طلب الانضمام لهيئة التحرير'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
