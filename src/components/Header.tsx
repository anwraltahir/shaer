import React, { useState } from 'react';
import { SudaneseEmblem } from './SudaneseEmblem';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Sun, 
  Moon, 
  User as UserIcon, 
  Menu, 
  X, 
  Feather, 
  ShieldCheck, 
  BookOpen, 
  Bookmark, 
  Bell, 
  LogOut,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenAuth
}) => {
  const { currentUser, logout, switchRoleDemo, unreadNotifsCount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'poets', label: 'الشعراء' },
    { id: 'poems', label: 'القصائد' },
    { id: 'categories', label: 'التصنيفات' },
    { id: 'memory', label: 'ذاكرة الشعر' },
    { id: 'about', label: 'عن المنصة' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  const getRoleBadgeLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'المدير العام';
      case 'editor': return 'محرر أدبي';
      case 'approved_poet': return 'شاعر معتمد';
      case 'pending_poet': return 'طلب شاعر معلق';
      case 'reader': return 'قارئ';
      default: return 'زائر';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4EFE3]/95 dark:bg-[#0D1D1A]/95 backdrop-blur-md border-b border-[#D9B56D]/30 transition-colors duration-200">
      {/* Role Testing Strip - allows instant previewing across Admin, Poet, Pending, and Reader */}
      <div className="bg-[#183C35] text-[#D9B56D] text-xs py-1 px-4 sm:px-8 border-b border-[#D9B56D]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#F4EFE3]/90">وضع المعاينة للأدوار:</span>
          <div className="hidden sm:flex items-center gap-1.5">
            {(['admin', 'approved_poet', 'pending_poet', 'reader'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRoleDemo(r)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  currentUser?.role === r 
                    ? 'bg-[#D9B56D] text-[#183C35] font-bold shadow-xs' 
                    : 'text-[#F4EFE3]/80 hover:bg-[#D9B56D]/20 hover:text-[#D9B56D]'
                }`}
              >
                {getRoleBadgeLabel(r)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#F4EFE3]/70">
          <span>شعارنا: «قصائدنا.. ذاكرتنا.. حكايتنا»</span>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand), Zone 2 (Nav Links), Zone 3 (Action Controls) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Nubian Emblem */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-right group whitespace-nowrap shrink-0 focus-visible:outline-hidden"
        >
          <div className="relative">
            <SudaneseEmblem size={38} />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-amiri text-2xl font-bold tracking-tight text-[#183C35] dark:text-[#D9B56D] group-hover:text-[#7D302D] dark:group-hover:text-white transition-colors">
              شعراء السودان
            </span>
            <span className="text-[10px] tracking-widest text-[#39352F]/70 dark:text-[#F4EFE3]/60 uppercase font-sans-ar -mt-1">
              Sudanese Poets · ديوان الفصحى
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#39352F]/90 dark:text-[#F4EFE3]/85 whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors py-1 relative hover:text-[#183C35] dark:hover:text-[#D9B56D] ${
                  isActive 
                    ? 'text-[#183C35] dark:text-[#D9B56D] font-bold' 
                    : 'text-[#39352F]/80 dark:text-[#F4EFE3]/80'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#D9B56D]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#39352F]/80 dark:text-[#F4EFE3]/80 hover:text-[#183C35] dark:hover:text-[#D9B56D] hover:bg-[#D9B56D]/15 rounded-lg transition-colors"
            title="البحث الذكي في القصائد والشعراء"
            aria-label="بحث"
          >
            <Search size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[#39352F]/80 dark:text-[#F4EFE3]/80 hover:text-[#183C35] dark:hover:text-[#D9B56D] hover:bg-[#D9B56D]/15 rounded-lg transition-colors"
            title={theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Authenticated State vs Public */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-[#D9B56D]/40 bg-white/70 dark:bg-[#162E28] hover:bg-white dark:hover:bg-[#1A3831] text-[#183C35] dark:text-[#F4EFE3] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#183C35] dark:bg-[#D9B56D] text-[#D9B56D] dark:text-[#183C35] flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{currentUser.fullName}</span>
                  <span className="text-[10px] text-[#D9B56D] font-medium leading-tight">
                    {getRoleBadgeLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown size={14} className="opacity-70" />
                {unreadNotifsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#7D302D] absolute top-1 right-1" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 rounded-xl shadow-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 py-2 z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#D9B56D]/15">
                    <p className="text-xs text-stone-500 dark:text-stone-400">مسجل كـ</p>
                    <p className="text-sm font-bold text-[#183C35] dark:text-[#D9B56D]">{currentUser.fullName}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="w-full px-4 py-2 text-sm text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#F4EFE3] dark:hover:bg-[#1D3B33] flex items-center gap-2.5 font-medium"
                    >
                      <ShieldCheck size={16} className="text-[#D9B56D]" />
                      <span>لوحة الإدارة والتحرير</span>
                    </button>
                  )}

                  {currentUser.role === 'approved_poet' && (
                    <button
                      onClick={() => handleNavClick('poet-dashboard')}
                      className="w-full px-4 py-2 text-sm text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#F4EFE3] dark:hover:bg-[#1D3B33] flex items-center gap-2.5 font-medium"
                    >
                      <Feather size={16} className="text-[#D9B56D]" />
                      <span>لوحة الشاعر وديواني</span>
                    </button>
                  )}

                  {currentUser.role === 'pending_poet' && (
                    <button
                      onClick={() => handleNavClick('application-status')}
                      className="w-full px-4 py-2 text-sm text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#F4EFE3] dark:hover:bg-[#1D3B33] flex items-center gap-2.5 font-medium"
                    >
                      <CheckCircle2 size={16} className="text-[#D9B56D]" />
                      <span>متابعة حالة طلب الانضمام</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNavClick('favorites')}
                    className="w-full px-4 py-2 text-sm text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#F4EFE3] dark:hover:bg-[#1D3B33] flex items-center gap-2.5"
                  >
                    <Bookmark size={16} className="text-[#D9B56D]" />
                    <span>المفضلة والشعراء المتابعون</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('notifications')}
                    className="w-full px-4 py-2 text-sm text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#F4EFE3] dark:hover:bg-[#1D3B33] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell size={16} className="text-[#D9B56D]" />
                      <span>الإشعارات</span>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <span className="text-[11px] bg-[#7D302D] text-white px-1.5 py-0.2 rounded-full font-bold">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  <div className="border-t border-[#D9B56D]/15 my-1" />

                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-[#7D302D] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                  >
                    <LogOut size={16} />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-[#183C35] dark:text-[#F4EFE3] hover:bg-[#D9B56D]/15 rounded-lg transition-colors whitespace-nowrap"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => handleNavClick('apply-poet')}
                className="px-4 py-2 text-xs font-bold text-[#183C35] bg-[#D9B56D] hover:bg-[#e4c27a] rounded-lg transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <Feather size={14} />
                <span>انضم إلى الديوان</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#39352F] dark:text-[#F4EFE3] hover:bg-[#D9B56D]/15 rounded-lg"
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4EFE3] dark:bg-[#0D1D1A] border-b border-[#D9B56D]/30 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-right py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-[#183C35] text-[#D9B56D] font-bold'
                  : 'text-[#39352F] dark:text-[#F4EFE3] hover:bg-[#D9B56D]/15'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#D9B56D]/20 flex flex-col gap-2">
            {!currentUser && (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                  className="w-full py-2 text-sm text-center text-[#183C35] dark:text-[#D9B56D] border border-[#D9B56D]/40 rounded-lg"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleNavClick('apply-poet'); }}
                  className="w-full py-2 text-sm font-bold text-center bg-[#D9B56D] text-[#183C35] rounded-lg shadow-xs flex items-center justify-center gap-2"
                >
                  <Feather size={15} />
                  <span>انضم كشاعر إلى الديوان</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
