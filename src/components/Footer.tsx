import React from 'react';
import { SudaneseEmblem, NubianDivider } from './SudaneseEmblem';
import { ShieldCheck, Heart, Mail, Feather, BookOpen, AlertCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#183C35] text-[#F4EFE3] border-t border-[#D9B56D]/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-right">
          {/* Column 1: Identity & Motto */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <SudaneseEmblem size={44} />
              <div>
                <h3 className="font-amiri text-2xl font-bold text-[#D9B56D]">شعراء السودان</h3>
                <p className="text-xs text-[#F4EFE3]/70 font-sans-ar">Sudanese Poets · ديوان الفصحى</p>
              </div>
            </div>
            <p className="text-sm text-[#F4EFE3]/80 leading-relaxed font-sans-ar">
              منصة رقمية وطنية توثق الشعر العربي الفصيح للشعراء السودانيين، وتحفظ الذاكرة الأدبية النيلية للأجيال القادمة.
            </p>
            <div className="text-xs text-[#D9B56D] font-amiri italic tracking-wide">
              «قصائدنا.. ذاكرتنا.. حكايتنا»
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9B56D] tracking-wide border-b border-[#D9B56D]/20 pb-2">
              أقسام المنصة
            </h4>
            <ul className="space-y-2 text-sm text-[#F4EFE3]/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D9B56D] transition-colors">الرئيسية</button>
              </li>
              <li>
                <button onClick={() => onNavigate('poets')} className="hover:text-[#D9B56D] transition-colors">دليل الشعراء السودانيين</button>
              </li>
              <li>
                <button onClick={() => onNavigate('poems')} className="hover:text-[#D9B56D] transition-colors">مكتبة القصائد الفصيحة</button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-[#D9B56D] transition-colors">التصنيفات والبحور الشعرية</button>
              </li>
              <li>
                <button onClick={() => onNavigate('memory')} className="hover:text-[#D9B56D] transition-colors">ذاكرة الشعر السوداني</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Poet Services & Applications */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9B56D] tracking-wide border-b border-[#D9B56D]/20 pb-2">
              خدمات الشعراء والقراء
            </h4>
            <ul className="space-y-2 text-sm text-[#F4EFE3]/80">
              <li>
                <button onClick={() => onNavigate('apply-poet')} className="hover:text-[#D9B56D] transition-colors flex items-center gap-1.5">
                  <Feather size={14} className="text-[#D9B56D]" />
                  <span>انضم كشاعر إلى الديوان</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('application-status')} className="hover:text-[#D9B56D] transition-colors">متابعة حالة طلب الانضمام</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D9B56D] transition-colors">عن المنصة والأهداف</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D9B56D] transition-colors">اتصل بهيئة التحرير</button>
              </li>
              <li>
                <button onClick={() => onNavigate('report-content')} className="hover:text-[#D9B56D] transition-colors flex items-center gap-1.5 text-amber-200">
                  <AlertCircle size={14} />
                  <span>الإبلاغ عن محتوى أو تصحيح نسبة</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Policy & Scope Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9B56D] tracking-wide border-b border-[#D9B56D]/20 pb-2">
              التوثيق وحقوق النشر
            </h4>
            <p className="text-xs text-[#F4EFE3]/75 leading-relaxed">
              تلتزم المنصة بحفظ الحقوق الأدبية والفكرية لجميع الشعراء السودانيين. المحتوى مخصص حصراً للشعر العربي الفصيح (العمودي، التفعيلة، والحر).
            </p>
            <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#D9B56D]">
              <button onClick={() => onNavigate('legal-copyright')} className="hover:underline">حقوق النشر</button>
              <button onClick={() => onNavigate('legal-privacy')} className="hover:underline">سياسة الخصوصية</button>
              <button onClick={() => onNavigate('legal-terms')} className="hover:underline">شروط الاستخدام</button>
            </div>
          </div>
        </div>

        <NubianDivider className="my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4EFE3]/60 gap-4 text-center sm:text-right font-sans-ar">
          <p>
            شعراء السودان — منصة لحفظ الذاكرة الشعرية السودانية. جميع الحقوق الأدبية محفوظة لأصحابها.
          </p>
          <p className="text-[#D9B56D]/80">
            صُمم بأصالة الهوية السودانية والنوبية النيلية © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
