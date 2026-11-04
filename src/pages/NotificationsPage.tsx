import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storage';
import { Bell, CheckCircle2, AlertCircle, Info, Check } from 'lucide-react';

interface NotificationsPageProps {
  onNavigateHome: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateHome }) => {
  const { currentUser, refreshUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4 text-right">
        <Bell size={36} className="mx-auto text-[#D9B56D]" />
        <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">مركز الإشعارات</h2>
        <p className="text-xs text-stone-500">يرجى تسجيل الدخول لعرض الإشعارات الخاصة بحسابك.</p>
      </div>
    );
  }

  const notifications = StorageService.getNotifications(currentUser.id);

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      StorageService.markNotificationRead(n.id);
    });
    refreshUser();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-right">
      <div className="border-b border-[#D9B56D]/30 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-amiri text-3xl font-bold text-[#183C35] dark:text-[#D9B56D]">
            مركز الإشعارات والتنبيهات
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            تنبيهات حالة طلب الشاعر، إجازة القصائد، والرسائل الإدارية.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-[#183C35] dark:text-[#D9B56D] font-bold hover:underline flex items-center gap-1"
          >
            <Check size={14} />
            <span>تحديد الكل كمقروء</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#162E28] rounded-2xl border border-[#D9B56D]/30 space-y-2">
          <Bell size={32} className="mx-auto text-stone-400" />
          <p className="text-sm font-bold text-[#183C35] dark:text-[#D9B56D]">لا توجد إشعارات حالياً</p>
          <p className="text-xs text-stone-500">ستظهر هنا تحديثات اعتماد طلبك أو إجازة قصائدك الجديدة.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.isRead) {
                  StorageService.markNotificationRead(notif.id);
                  refreshUser();
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white/60 dark:bg-[#162E28]/60 border-[#D9B56D]/20 opacity-80'
                  : 'bg-white dark:bg-[#162E28] border-[#D9B56D]/50 shadow-xs'
              }`}
            >
              <div className="mt-1 shrink-0">
                {notif.type === 'success' ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : notif.type === 'alert' ? (
                  <AlertCircle size={18} className="text-red-500" />
                ) : (
                  <Info size={18} className="text-[#D9B56D]" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#183C35] dark:text-[#D9B56D]">{notif.title}</h4>
                  <span className="text-[11px] text-stone-400 tabular-nums font-mono">
                    {new Date(notif.createdAt).toLocaleDateString('ar-SD')}
                  </span>
                </div>
                <p className="text-xs text-[#39352F]/85 dark:text-[#F4EFE3]/85 leading-relaxed font-sans-ar">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
