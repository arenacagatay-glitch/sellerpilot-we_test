import { useNavigate } from 'react-router-dom';
import { Pencil, Users, Plus, Trash2, LogOut } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { store } from '../lib/storage';
import {
  ACTIVITY_LABELS,
  GENDER_LABELS,
  GOAL_LABELS,
} from '../lib/nutrition';
import { currentYear } from '../lib/date';
import { Button, Card, MacroPills, PageTitle } from '../components/ui';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-canvas px-3 py-2 text-center">
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { activeProfile, profiles, reload, clearActive, selectProfile } = useProfiles();

  if (!activeProfile) return null;
  const p = activeProfile;
  const t = p.targets;
  const age = currentYear() - p.birthYear;

  const handleDelete = async () => {
    if (!confirm(`"${p.name}" profilini ve tüm kayıtlarını silmek istediğine emin misin?`)) return;
    await store.deleteProfile(p.id);
    await reload();
    navigate('/welcome');
  };

  const switchTo = async (id: string) => {
    await selectProfile(id);
    await reload();
  };

  return (
    <div>
      <PageTitle title="Profil" />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-bold text-ink">{p.name}</p>
            <p className="text-sm text-muted">
              {GENDER_LABELS[p.gender]} · {age} yaş · {p.heightCm} cm · {p.weightKg} kg
              {p.bodyFatPct != null ? ` · %${p.bodyFatPct} yağ` : ''}
            </p>
          </div>
          <button
            onClick={() => navigate(`/onboarding/${p.id}`)}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-ink"
          >
            <Pencil size={14} /> Düzenle
          </button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="BMR" value={t.bmr} />
          <Stat label="TDEE" value={t.tdee} />
          <Stat label="Hedef kcal" value={t.calories} />
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
          <span className="text-sm font-medium text-muted">Günlük makro hedefi</span>
          <MacroPills protein={t.protein} carbs={t.carbs} fat={t.fat} />
        </div>

        <p className="mt-3 text-sm text-muted">
          Hedef: <span className="font-semibold text-ink">{GOAL_LABELS[p.goal]}</span> ·{' '}
          {ACTIVITY_LABELS[p.activityLevel]}
        </p>
      </Card>

      {/* Profil değiştirme */}
      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink">
          <Users size={16} /> Profiller
        </p>
        <div className="space-y-2">
          {profiles.map((other) => (
            <button
              key={other.id}
              onClick={() => switchTo(other.id)}
              disabled={other.id === p.id}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${
                other.id === p.id
                  ? 'border-brand bg-brand-soft font-semibold text-brand-dark'
                  : 'border-slate-200 bg-white text-ink'
              }`}
            >
              {other.name}
              {other.id === p.id && <span className="ml-2 text-xs">(aktif)</span>}
            </button>
          ))}
        </div>
        <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate('/onboarding')}>
          <Plus size={16} /> Yeni profil
        </Button>
      </div>

      <div className="mt-6 space-y-2">
        <Button variant="ghost" className="w-full" onClick={async () => { await clearActive(); navigate('/welcome'); }}>
          <LogOut size={16} /> Profil ekranına dön
        </Button>
        <Button variant="danger" className="w-full" onClick={handleDelete}>
          <Trash2 size={16} /> Bu profili sil
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Veriler şu an sadece bu cihazda saklanıyor. Bulut senkron ileride eklenecek.
      </p>
    </div>
  );
}
