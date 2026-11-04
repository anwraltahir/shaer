import React from 'react';
import { SudaneseEmblem, NubianDivider } from '../components/SudaneseEmblem';
import { Feather, BookOpen, ShieldCheck, Heart, Award, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateToApply: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateHome, onNavigateToApply }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-right">
      {/* Hero Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B56D]/20 text-[#183C35] dark:text-[#D9B56D] text-xs font-bold">
          <SudaneseEmblem size={18} />
          <span>الوثيقة التعريفية للمنصة</span>
        </div>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#183C35] dark:text-[#D9B56D]">
          عن منصة «شعراء السودان»
        </h1>
        <p className="text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-sans-ar leading-relaxed">
          مشروع وطني ثقافي يهدف إلى تأسيس المرجع الرقمي الأشمل لتوثيق الشعر العربي الفصيح للشعراء السودانيين وحفظ الذاكرة الأدبية النيلية.
        </p>
        <div className="font-amiri text-lg text-[#D9B56D] font-bold">
          «قصائدنا.. ذاكرتنا.. حكايتنا»
        </div>
      </div>

      <NubianDivider className="my-6" />

      {/* Mission & Goals */}
      <div className="bg-white dark:bg-[#162E28] rounded-3xl border border-[#D9B56D]/40 p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/15 pb-2">
          رسالتنا وأهدافنا الأدبية
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 space-y-1.5">
            <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">1. المرجع الرقمي للفصحى:</h3>
            <p>إنشاء ديوان مرجعي رقمي موثق ومحقق لأشعار السودان الفصيحة، يسهل البحث والتصفح الأكاديمي والقرائي.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 space-y-1.5">
            <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">2. تخليد الذاكرة الشعرية:</h3>
            <p>توثيق سير شعراء السودان الراحلين وربط الأجيال الصاعدة بمدارس الأدب النيلي الأصيل.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 space-y-1.5">
            <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">3. فضاء مستقل للشاعر:</h3>
            <p>منح الشاعر السوداني المعتمد مساحة رقمية خاصة لإدارة قصائده ودواوينه والتفاعل مع قرائه.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4EFE3]/40 dark:bg-[#0D1D1A]/40 border border-[#D9B56D]/20 space-y-1.5">
            <h3 className="font-bold text-[#183C35] dark:text-[#D9B56D]">4. صون الحقوق والنسبة:</h3>
            <p>حماية الملكية الأدبية للشعراء ومنع انتحال النصوص أو تحريف نسبتها، بالاعتماد على مصادر محققة.</p>
          </div>
        </div>
      </div>

      {/* Strict Content Scope */}
      <div className="bg-[#183C35] text-[#F4EFE3] rounded-3xl p-8 sm:p-10 border border-[#D9B56D]/30 shadow-md space-y-6">
        <h2 className="font-amiri text-2xl font-bold text-[#D9B56D]">
          نطاق المحتوى والتخصص الحصري
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-[#F4EFE3]/90 font-sans-ar">
          المنصة متخصصة حصرياً في **الشعر العربي الفصيح** للشعراء السودانيين.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-[#D9B56D] text-base">ما تشمله المنصة:</h3>
            <ul className="list-disc list-inside space-y-1 text-[#F4EFE3]/85">
              <li>الشعر العربي العمودي المقفى.</li>
              <li>شعر التفعيلة العربي الحديث.</li>
              <li>قصيدة النثر والشعر الحر باللغة العربية الفصحى.</li>
              <li>الشعر الوجداني، الوطني، الفلسفي، الرثاء، والمدح.</li>
              <li>الشعراء الراحلون وأعمالهم المطبوعة والمخطوطة.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-red-300 text-base">ما لا تشمله المنصة (خارج النطاق):</h3>
            <ul className="list-disc list-inside space-y-1 text-[#F4EFE3]/75">
              <li>الشعر الشعبي والغناء العامي.</li>
              <li>الدوبيت والمربعات الدارجة.</li>
              <li>شعر الحقيبة والأغاني العامية.</li>
              <li>التسجيلات الصوتية والفيديوهات (المنصة نصية بصرية للقراءة الأدبية فقط).</li>
              <li>المقالات والنصوص النثرية غير الشعرية.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={onNavigateToApply}
          className="px-8 py-3.5 bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold text-sm sm:text-base rounded-xl transition-all shadow-md inline-flex items-center gap-2"
        >
          <Feather size={16} />
          <span>قدّم طلب الانضمام لديوان الشعراء</span>
        </button>
      </div>
    </div>
  );
};
