import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { PoetApplication } from '../types';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Feather, ArrowLeft, BookOpen } from 'lucide-react';

interface ApplicationStatusPageProps {
  onNavigateToPoetDashboard: () => void;
  onNavigateHome: () => void;
}

export const ApplicationStatusPage: React.FC<ApplicationStatusPageProps> = ({
  onNavigateToPoetDashboard,
  onNavigateHome
}) => {
  const { currentUser } = useAuth();

  // Find applicant's application
  const app = currentUser 
    ? StorageService.getApplicationByUserId(currentUser.id) 
    : StorageService.getApplications()[0]; // Fallback to demo pending application

  if (!app) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4 text-right">
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">لا يوجد طلب انضمام نشط</h2>
        <p className="text-sm text-stone-500 font-sans-ar">لم تقم بتقديم طلب انضمام كشاعر بعد.</p>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 bg-[#183C35] text-[#D9B56D] rounded-lg text-xs font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (app.status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-300">
            <CheckCircle2 size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-sm">تم قبول طلبك واعتمادك كشاعر رسمي</p>
              <p className="text-xs mt-0.5">مرحباً بك في ديوان شعراء السودان، يمكنك الآن البدء في نشر وإدارة قصائدك.</p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 p-3 rounded-xl border border-red-300">
            <XCircle size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-sm">تم رفض الطلب</p>
              <p className="text-xs mt-0.5">{app.adminNotes || 'الطلب لا يستوفي معايير النشر الحالية للشعر العربي الفصيح.'}</p>
            </div>
          </div>
        );
      case 'needs_revision':
        return (
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-300">
            <AlertTriangle size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-sm">الطلب بحاجة إلى تعديلات أو استكمال بيانات</p>
              <p className="text-xs mt-0.5">{app.adminNotes || 'يرجى مراجعة الملاحظات وتحديث النماذج المقدمة.'}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 p-3 rounded-xl border border-sky-300">
            <Clock size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-sm">الطلب قيد المراجعة والتدقيق التحريري</p>
              <p className="text-xs mt-0.5">يقوم فريق هيئة التحرير بمراجعة نصوصك ونماذجك الشعرية وسيرتك الأدبية.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-right">
      <div className="border-b border-[#D9B56D]/30 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            حالة طلب الانضمام كشاعر
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-sans-ar">
            تاريخ التقديم: {new Date(app.createdAt).toLocaleDateString('ar-SD')}
          </p>
        </div>

        {app.status === 'approved' && (
          <button
            onClick={onNavigateToPoetDashboard}
            className="px-4 py-2 bg-[#183C35] text-[#D9B56D] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Feather size={14} />
            <span>الانتقال إلى لوحة الشاعر</span>
          </button>
        )}
      </div>

      {/* Status banner */}
      {getStatusBadge()}

      {/* Submitted Details Review */}
      <div className="bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D] border-b border-[#D9B56D]/15 pb-2">
          البيانات الأدبية المقدمة
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">الاسم الكامل: </span>
            <span>{app.fullName}</span>
          </div>
          <div>
            <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">الاسم الأدبي: </span>
            <span>{app.literaryName}</span>
          </div>
          <div>
            <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">المدينة / المنطقة: </span>
            <span>{app.city}</span>
          </div>
          <div>
            <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">المدرسة الشعرية: </span>
            <span>{app.literarySchool}</span>
          </div>
        </div>

        <div>
          <p className="font-bold text-xs text-[#183C35] dark:text-[#D9B56D] mb-1">السيرة الذاتية والأدبية:</p>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans-ar bg-[#F4EFE3]/30 dark:bg-[#0D1D1A]/30 p-3 rounded-lg">
            {app.biography}
          </p>
        </div>

        {/* Submitted samples */}
        <div>
          <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] mb-3">
            نماذج القصائد المرفقة ({app.literarySamples.length})
          </h3>
          <div className="space-y-4">
            {app.literarySamples.map((sample, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#D9B56D]/20 bg-[#F4EFE3]/20 dark:bg-[#0D1D1A]/20 space-y-2 text-right"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-amiri text-base font-bold text-[#183C35] dark:text-[#D9B56D]">
                    «{sample.title}»
                  </h4>
                  <span className="text-[11px] text-stone-500">شعر {sample.poemType}</span>
                </div>
                <div className="font-amiri text-xs sm:text-sm text-center leading-loose whitespace-pre-line text-[#39352F] dark:text-[#F4EFE3]/90 py-2">
                  {sample.poemText}
                </div>
                {sample.source && (
                  <p className="text-[11px] text-stone-400">المصدر: {sample.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
