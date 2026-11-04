import React, { useState } from 'react';
import { SudaneseEmblem, NubianDivider } from '../components/SudaneseEmblem';
import { ShieldCheck, Lock, FileText, AlertCircle, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'terms' | 'privacy' | 'copyright';
  onNavigateHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'copyright', onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'copyright'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      <div className="border-b border-[#D9B56D]/30 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            السياسات والوثائق القانونية والأدبية
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-sans-ar">
            تنظيم وحفظ الحقوق الفكرية والأدبية للشعراء والقراء في منصة شعراء السودان.
          </p>
        </div>
        <button
          onClick={onNavigateHome}
          className="text-xs text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline"
        >
          العودة للرئيسية ←
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9B56D]/30 pb-1 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('copyright')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'copyright'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <ShieldCheck size={15} />
          <span>حقوق النشر والملكية الأدبية</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'terms'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <FileText size={15} />
          <span>شروط الاستخدام</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`py-2 px-4 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'border-[#183C35] dark:border-[#D9B56D] text-[#183C35] dark:text-[#D9B56D] bg-white/50 dark:bg-[#162E28]/50'
              : 'border-transparent text-stone-500 hover:text-[#183C35]'
          }`}
        >
          <Lock size={15} />
          <span>سياسة الخصوصية</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-stone-300 font-sans-ar">
        {activeTab === 'copyright' && (
          <div className="space-y-4">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              وثيقة حقوق النشر والملكية الفكرية للشعراء
            </h2>
            <p>
              تؤمن منصة «شعراء السودان» بأن الحقوق الأدبية والفكرية للشاعر حق مقدس لا يمكن المساس به.
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">1. عدم ادعاء ملكية النصوص:</h3>
              <p>
                لا تدّعي المنصة أو الجهة المشرفة عليها أي ملكية حصرية لنصوص القصائد أو الدواوين المنشورة عبرها. يظل الشاعر أو ورثته الشرعيون هم الملاك الوحيدين لحقوق التأليف والنشر.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">2. ترخيص العرض غير الحصري:</h3>
              <p>
                يمنح الشاعر المعتمد عند إرسال قصيدته للمنصة ترخيصاً أدبياً غير حصري لعرض القصيدة وتوثيقها وفهرستها في المكتبة الرقمية وإتاحتها للقراء بالمجان دعماً للمشهد الثقافي.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">3. تراث الرواد والشعراء الراحلين:</h3>
              <p>
                تُدرج قصائد الشعراء الراحلين استناداً إلى الطبعات المطبوعة والكتب المحققة المعتمدة مع ذكر المصدر الكامل ودار النشر وسنة الطبع توثيقاً للأمانة العلمية.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">4. آلية التبليغ والتصحيح:</h3>
              <p>
                تتيح المنصة نظاماً سريعاً للإبلاغ عن أي خطأ في النسبة أو انتهاك لحقوق التأليف، وتقوم هيئة التحرير بالتحقق الفوري وحذف أو تصحيح أي مادة تخالف ذلك خلال 24 ساعة.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              شروط وأحكام استخدام المنصة
            </h2>
            <p>
              باستخدامك لمنصة «شعراء السودان»، فإنك توافق على الالتزام بالشروط والضوابط التالية:
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">1. معايير المحتوى الشعري:</h3>
              <p>
                تقتصر المنصة حصراً على الشعر العربي الفصيح (العمودي، التفعيلة، والحر). يُحظر نشر الشعر العامي أو المواد الخارجة عن الذوق الأدبي الرفيع.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">2. نظام اعتماد الشعراء:</h3>
              <p>
                لا يُسمح بالنشر المباشر دون موافقة الإدارة التحريرية، ويُشترط اجتياز مرحلة التدقيق والتحقق من النماذج وسيرة الشاعر.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">3. الاستخدام العادل للأبيات:</h3>
              <p>
                يحق للزوار والباحثين قراءة القصائد واقتباس الأبيات لأغراض أدبية وثقافية مع الإشارة الواضحة لاسم الشاعر ومنصة «شعراء السودان» كمصدر.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              سياسة الخصوصية وحماية البيانات
            </h2>
            <p>
              نحن نلتزم بحماية خصوصية كافة المستخدمين والشعراء المسجلين لدينا:
            </p>
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">1. البيانات المجمعة:</h3>
              <p>
                نجمع فقط البيانات الضرورية لتشغيل الحسابات الأدبية (الاسم، البريد الإلكتروني، المدينة، ونماذج القصائد). لا نقوم ببيع أو مشاركة أي بيانات شخصية مع أي جهات خارجية.
              </p>

              <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">2. أمان الحسابات:</h3>
              <p>
                نطبق معايير أمان مشددة لحماية حسابات الشعراء ومنع الوصول غير المصرح به إلى لوحات التحكم والتعديل.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
