import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { EmergencyModal } from '../common/EmergencyModal';
import { useLanguage } from '../../contexts/LanguageContext';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen overflow-x-clip bg-surface text-on-surface flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
      />

      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenEmergency={() => {
          setEmergencyModalOpen(true);
          setMobileMenuOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className={`flex-1 pt-16 pb-20 lg:pb-8 ${lang === 'ar' ? 'lg:pr-64' : 'lg:pl-64'}`}>
        <main className="w-full min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* 24/7 Emergency Modal */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};
