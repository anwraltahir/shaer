/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SmartSearchModal } from './components/SmartSearchModal';
import { AuthModal } from './components/AuthModal';
import { ReportModal } from './components/ReportModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PoetsPage } from './pages/PoetsPage';
import { PoetDetailPage } from './pages/PoetDetailPage';
import { PoemsPage } from './pages/PoemsPage';
import { PoemDetailPage } from './pages/PoemDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { MemoryPage } from './pages/MemoryPage';
import { PoetApplicationPage } from './pages/PoetApplicationPage';
import { ApplicationStatusPage } from './pages/ApplicationStatusPage';
import { PoetDashboard } from './pages/PoetDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotificationsPage } from './pages/NotificationsPage';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [tabParam, setTabParam] = useState<string | undefined>(undefined);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab, tabParam]);

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'auth') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    setTabParam(param);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EFE3] dark:bg-[#0D1D1A] text-[#39352F] dark:text-[#F4EFE3] font-sans-ar selection:bg-[#D9B56D]/30 selection:text-[#183C35] transition-colors duration-200">
      {/* Top Header strictly conforming to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenReport={() => setReportModalOpen(true)}
          />
        )}

        {currentTab === 'poets' && (
          <PoetsPage
            onSelectPoet={(slug) => handleNavigate('poet-detail', slug)}
          />
        )}

        {currentTab === 'poet-detail' && tabParam && (
          <PoetDetailPage
            poetSlug={tabParam}
            onNavigateBack={() => handleNavigate('poets')}
            onSelectPoem={(poemSlug) => handleNavigate('poem-detail', poemSlug)}
            onNavigateToNewPoem={() => handleNavigate('poet-dashboard')}
          />
        )}

        {currentTab === 'poems' && (
          <PoemsPage
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(poetSlug) => handleNavigate('poet-detail', poetSlug)}
          />
        )}

        {currentTab === 'poem-detail' && tabParam && (
          <PoemDetailPage
            poemSlug={tabParam}
            onNavigateBack={() => handleNavigate('poems')}
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(poetSlug) => handleNavigate('poet-detail', poetSlug)}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(poetSlug) => handleNavigate('poet-detail', poetSlug)}
          />
        )}

        {currentTab === 'category-detail' && tabParam && (
          <PoemsPage
            initialCategorySlug={tabParam}
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(poetSlug) => handleNavigate('poet-detail', poetSlug)}
          />
        )}

        {currentTab === 'memory' && (
          <MemoryPage
            onSelectPoet={(slug) => handleNavigate('poet-detail', slug)}
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
          />
        )}

        {currentTab === 'apply-poet' && (
          <PoetApplicationPage
            onNavigateToStatus={() => handleNavigate('application-status')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'application-status' && (
          <ApplicationStatusPage
            onNavigateToPoetDashboard={() => handleNavigate('poet-dashboard')}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'poet-dashboard' && (
          <PoetDashboard
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(slug) => handleNavigate('poet-detail', slug)}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToApply={() => handleNavigate('apply-poet')}
          />
        )}

        {currentTab === 'contact' && <ContactPage />}

        {currentTab === 'favorites' && (
          <FavoritesPage
            onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
            onSelectPoet={(slug) => handleNavigate('poet-detail', slug)}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'notifications' && (
          <NotificationsPage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'legal-terms' && (
          <LegalPage
            initialTab="terms"
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'legal-privacy' && (
          <LegalPage
            initialTab="privacy"
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'legal-copyright' && (
          <LegalPage
            initialTab="copyright"
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentTab === 'report-content' && (
          <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
            <h2 className="font-amiri text-2xl font-bold text-[#183C35] dark:text-[#D9B56D]">
              نموذج الإبلاغ عن انتهاك حقوق أو تصحيح نسبة
            </h2>
            <p className="text-xs text-stone-500">
              انقر أدناه لفتح استمارة الإبلاغ وإرسال التفاصيل مباشرة لهيئة التحرير.
            </p>
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-6 py-2.5 bg-[#7D302D] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              فتح استمارة الإبلاغ
            </button>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <SmartSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectPoet={(slug) => handleNavigate('poet-detail', slug)}
        onSelectPoem={(slug) => handleNavigate('poem-detail', slug)}
        onSelectCategory={(slug) => handleNavigate('category-detail', slug)}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onNavigateToApplyPoet={() => handleNavigate('apply-poet')}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
