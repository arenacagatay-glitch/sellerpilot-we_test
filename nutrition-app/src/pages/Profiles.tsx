import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Salad } from 'lucide-react';
import { useProfiles } from '../state/ProfileContext';
import { GOAL_LABELS } from '../lib/nutrition';
import { Button, Card } from '../components/ui';

export function Profiles() {
  const navigate = useNavigate();
  const { profiles, selectProfile, loading } = useProfiles();

  const pick = async (id: string) => {
    await selectProfile(id);
    navigate('/');
  };

  if (loading) return null;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-4 pb-10 pt-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white">
          <Salad size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink">KaloriKoç</h1>
        <p className="mt-1 text-sm text-muted">Kalori ve makro takibin cebinde.</p>
      </div>

      {profiles.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted">Profil seç</p>
          {profiles.map((p) => (
            <button key={p.id} onClick={() => pick(p.id)} className="w-full text-left">
              <Card className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="text-sm text-muted">
                    {GOAL_LABELS[p.goal]} · {p.targets.calories} kcal/gün
                  </p>
                </div>
                <ChevronRight className="text-muted" />
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <p className="text-ink">Henüz profil yok.</p>
          <p className="mt-1 text-sm text-muted">
            Sen ve sevdiklerin için ayrı profiller oluşturabilirsin.
          </p>
        </Card>
      )}

      <Button className="mt-6 w-full py-3" onClick={() => navigate('/onboarding')}>
        <Plus size={18} /> Yeni profil oluştur
      </Button>
    </div>
  );
}
