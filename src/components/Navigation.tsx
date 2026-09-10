import React from 'react';
import { Pill, Activity, Calendar, Heart } from 'lucide-react';

export type NavTab = 'medications' | 'blood_pressure' | 'appointments' | 'notes';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingAppointmentsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingAppointmentsCount = 0,
}) => {
  const tabs = [
    {
      id: 'medications' as NavTab,
      label: 'İlaçlarım',
      icon: Pill,
    },
    {
      id: 'blood_pressure' as NavTab,
      label: 'Tansiyon',
      icon: Activity,
    },
    {
      id: 'appointments' as NavTab,
      label: 'Randevular',
      icon: Calendar,
      badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : undefined,
    },
    {
      id: 'notes' as NavTab,
      label: 'Sevgi & Profil',
      icon: Heart,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-rose-100/80 px-3 py-2 z-40 shadow-lg shadow-rose-100/40">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? 'text-rose-500 font-bold bg-pink-50/70 shadow-2xs'
                  : 'text-stone-400 font-semibold hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-rose-500' : 'text-stone-400'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
