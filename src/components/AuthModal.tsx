import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SudaneseEmblem } from './SudaneseEmblem';
import { X, Mail, Lock, User, Feather, ShieldCheck, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onNavigateToApplyPoet: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onNavigateToApplyPoet
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, registerReader, switchRoleDemo } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMsg('يرجى إدخال البريد الإلكتروني.');
        return;
      }
      const res = await login(email.trim());
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!fullName.trim() || !email.trim()) {
        setErrorMsg('يرجى ملء جميع الحقول المطلوبة.');
        return;
      }
      const res = await registerReader(fullName.trim(), email.trim(), password);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRoleDemo(role);
    setSuccessMsg(`تم تسجيل الدخول بنجاح بحساب ${role}.`);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/40 shadow-2xl overflow-hidden text-right p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D9B56D]/20">
          <div className="flex items-center gap-2">
            <SudaneseEmblem size={28} />
            <span className="font-amiri text-xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب قارئ'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Demo Switcher Strip for Reviewers */}
        <div className="my-4 p-3 bg-[#F4EFE3] dark:bg-[#0D1D1A] rounded-xl border border-[#D9B56D]/25">
          <p className="text-[11px] font-bold text-[#183C35] dark:text-[#D9B56D] mb-2">
            دخول فوري بحسابات الاختبار المجهزة:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 rounded-lg text-right hover:border-[#D9B56D] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-[#D9B56D] shrink-0" />
              <span className="font-medium text-[#183C35] dark:text-[#F4EFE3] truncate">المدير العام (Admin)</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('approved_poet')}
              className="py-1.5 px-2 bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 rounded-lg text-right hover:border-[#D9B56D] transition-colors flex items-center gap-1.5"
            >
              <Feather size={14} className="text-[#D9B56D] shrink-0" />
              <span className="font-medium text-[#183C35] dark:text-[#F4EFE3] truncate">شاعر معتمد (Poet)</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('pending_poet')}
              className="py-1.5 px-2 bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 rounded-lg text-right hover:border-[#D9B56D] transition-colors flex items-center gap-1.5"
            >
              <CheckCircle size={14} className="text-amber-500 shrink-0" />
              <span className="font-medium text-[#183C35] dark:text-[#F4EFE3] truncate">طلب معلق (Pending)</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('reader')}
              className="py-1.5 px-2 bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 rounded-lg text-right hover:border-[#D9B56D] transition-colors flex items-center gap-1.5"
            >
              <User size={14} className="text-blue-500 shrink-0" />
              <span className="font-medium text-[#183C35] dark:text-[#F4EFE3] truncate">حساب قارئ (Reader)</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs border border-emerald-200">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
                الاسم الكامل للقارئ
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد عبد الله المحجوب"
                  className="w-full bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 border border-[#D9B56D]/30 rounded-lg py-2 px-3 pl-8 text-sm text-[#183C35] dark:text-[#F4EFE3] focus:border-[#D9B56D] outline-none"
                />
                <User size={16} className="absolute left-2.5 top-2.5 text-stone-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 border border-[#D9B56D]/30 rounded-lg py-2 px-3 pl-8 text-sm text-[#183C35] dark:text-[#F4EFE3] focus:border-[#D9B56D] outline-none"
              />
              <Mail size={16} className="absolute left-2.5 top-2.5 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#183C35] dark:text-[#D9B56D] mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F4EFE3]/50 dark:bg-[#0D1D1A]/50 border border-[#D9B56D]/30 rounded-lg py-2 px-3 pl-8 text-sm text-[#183C35] dark:text-[#F4EFE3] focus:border-[#D9B56D] outline-none"
              />
              <Lock size={16} className="absolute left-2.5 top-2.5 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#183C35] hover:bg-[#122e28] text-[#D9B56D] font-bold rounded-lg text-sm transition-all shadow-xs"
          >
            {mode === 'login' ? 'دخول' : 'تأكيد إنشاء حساب قارئ'}
          </button>
        </form>

        {/* Toggle between login / register */}
        <div className="mt-5 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-[#D9B56D]/20 pt-4 space-y-2">
          {mode === 'login' ? (
            <p>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline"
              >
                إنشاء حساب قارئ
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline"
              >
                تسجيل الدخول
              </button>
            </p>
          )}

          {/* Poet Application Callout */}
          <div className="pt-2">
            <p className="text-[11px] text-stone-400">هل أنت شاعر فصيح وترغب في توثيق أعمالك؟</p>
            <button
              onClick={() => {
                onClose();
                onNavigateToApplyPoet();
              }}
              className="text-[#7D302D] dark:text-[#D9B56D] font-bold hover:underline flex items-center justify-center gap-1 mx-auto mt-1"
            >
              <Feather size={12} />
              <span>قدّم طلب الانضمام لديوان الشعراء المعتمدين</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
