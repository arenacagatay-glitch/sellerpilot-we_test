import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ClipboardList } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { useDayLog } from '../state/useDayLog';
import { Ring } from '../components/Ring';
import { Button, Card } from '../components/ui';
import { formatDateTR } from '../lib/date';
import { MEAL_LABELS } from '../lib/mealPlanner';

function MacroProgress({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-muted">{label}</span>
        <span className="font-semibold text-ink">
          {Math.round(value)} / {max}g
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { activeProfile } = useProfiles();
  const { logs, totals } = useDayLog(activeProfile?.id);

  if (!activeProfile) return null;
  const t = activeProfile.targets;
  const remaining = Math.max(0, t.calories - totals.kcal);

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium text-muted">{formatDateTR()}</p>
        <h1 className="font-display text-2xl font-bold text-ink">Merhaba {activeProfile.name} 👋</h1>
      </div>

      <Card className="flex flex-col items-center">
        <Ring value={totals.kcal} max={t.calories}>
          <span className="text-3xl font-bold text-ink">{remaining}</span>
          <span className="text-xs text-muted">kcal kaldı</span>
        </Ring>
        <div className="mt-3 flex w-full justify-around text-center text-sm">
          <div>
            <p className="font-semibold text-ink">{t.calories}</p>
            <p className="text-xs text-muted">Hedef</p>
          </div>
          <div>
            <p className="font-semibold text-brand">{Math.round(totals.kcal)}</p>
            <p className="text-xs text-muted">Alınan</p>
          </div>
          <div>
            <p className="font-semibold text-ink">{remaining}</p>
            <p className="text-xs text-muted">Kalan</p>
          </div>
        </div>
      </Card>

      <Card className="mt-4 space-y-3">
        <p className="text-sm font-semibold text-ink">Makrolar</p>
        <MacroProgress label="Protein" value={totals.protein} max={t.protein} color="#3B82F6" />
        <MacroProgress label="Karbonhidrat" value={totals.carbs} max={t.carbs} color="#F59E0B" />
        <MacroProgress label="Yağ" value={totals.fat} max={t.fat} color="#EF4444" />
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="primary" className="py-3" onClick={() => navigate('/plan')}>
          <UtensilsCrossed size={18} /> Programım
        </Button>
        <Button variant="ghost" className="py-3" onClick={() => navigate('/diary')}>
          <ClipboardList size={18} /> Yemek ekle
        </Button>
      </div>

      <Card className="mt-4">
        <p className="mb-2 text-sm font-semibold text-ink">Bugün yediklerin</p>
        {logs.length === 0 ? (
          <p className="text-sm text-muted">Henüz bir şey eklemedin. "Yemek ekle" ile başla.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink">
                  {l.name} <span className="text-muted">· {l.quantityG}g · {MEAL_LABELS[l.mealType]}</span>
                </span>
                <span className="font-semibold text-ink">{l.kcal} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
