import React from 'react';
import { Award, CheckCircle2, Flame } from 'lucide-react';

interface TodayProgressProps {
  total: number;
  completed: number;
  streakDays?: number;
}

export const TodayProgress: React.FC<TodayProgressProps> = ({
  total,
  completed,
  streakDays = 3,
}) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getEncouragement = () => {
    if (total === 0) return 'Henüz ilaç tanımlanmadı.';
    if (completed === 0) return 'Günün ilk ilacıyla kendine iyi bakmaya başla 🌸';
    if (completed < total) return `Harika gidiyorsun! Son ${total - completed} ilaç kaldı ✨`;
    return 'Tebrikler prensesim! Bugünün tüm ilaçlarını aldın 💖';
  };

  return (
    <div className="px-5 mb-5">
      <div className="rounded-3xl bg-white p-4 border border-rose-100/70 shadow-sm shadow-rose-100/40">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
              Bugünkü İlerlemen
            </span>
            {streakDays > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {streakDays} Günlük Seri!
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm font-bold text-stone-700">
            <span className="text-rose-500">{completed}</span>
            <span className="text-stone-300">/</span>
            <span>{total}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-rose-50 rounded-full overflow-hidden p-0.5 border border-rose-100/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-1 text-xs">
          <p className="text-stone-500 font-medium flex items-center gap-1.5">
            {completed === total && total > 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Award className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="truncate">{getEncouragement()}</span>
          </p>

          <span className="font-bold text-rose-500 shrink-0">
            %{percentage}
          </span>
        </div>
      </div>
    </div>
  );
};
