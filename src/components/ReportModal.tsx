import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';
import { ContentReport, Poem } from '../types';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  poem?: Poem | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, poem, onClose }) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState<ContentReport['reason']>('typo_error');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    StorageService.saveReport({
      id: `rep-${Date.now()}`,
      userId: currentUser?.id,
      userEmail: email || currentUser?.email,
      contentType: 'poem',
      contentId: poem?.id || 'general',
      contentTitle: poem?.title || 'بلاغ عام',
      reason,
      details: details.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 p-6 text-right shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9B56D]/20 mb-4">
          <div className="flex items-center gap-2 text-[#7D302D] dark:text-[#D9B56D]">
            <AlertCircle size={20} />
            <h3 className="font-amiri text-xl font-bold">إبلاغ عن محتوى أو تصحيح نسبة</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle size={36} className="mx-auto text-emerald-600" />
            <p className="font-bold text-sm text-[#183C35] dark:text-[#D9B56D]">تم إرسال البلاغ بنجاح</p>
            <p className="text-xs text-stone-500">شكراً لحرصكم على دقة التوثيق الأدبي في منصة شعراء السودان.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {poem && (
              <div className="p-2.5 rounded-lg bg-[#F4EFE3] dark:bg-[#0D1D1A] text-xs">
                <span className="font-bold text-[#183C35] dark:text-[#D9B56D]">القصيدة: </span>
                <span>{poem.title} (للشاعر {poem.poetName})</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                سبب البلاغ
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#162E28] text-[#183C35] dark:text-[#F4EFE3] outline-none"
              >
                <option value="typo_error">خطأ في تشكيل بيت أو كلمة أو طباعة</option>
                <option value="misattribution">خطأ في نسبة القصيدة أو الشاعر</option>
                <option value="copyright">انتهاك حقوق ملكية فكرية أو أدبية</option>
                <option value="inappropriate">محتوى غير مطابق لمعايير الشعر العربي الفصيح</option>
                <option value="other">سبب آخر</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                التفاصيل والمصدر المعتمد (إن وجد)
              </label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="يرجى توضيح موضع الخطأ، وذكر الطبعة أو المصدر التوثيقي المعتمد..."
                className="w-full p-2.5 text-xs rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#0D1D1A] text-[#183C35] dark:text-[#F4EFE3] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                البريد الإلكتروني للتواصل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full p-2 text-xs rounded-lg border border-[#D9B56D]/30 bg-white dark:bg-[#0D1D1A] text-[#183C35] dark:text-[#F4EFE3] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#7D302D] hover:bg-[#682725] text-white rounded-lg transition-colors"
              >
                إرسال البلاغ للتحرير
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
