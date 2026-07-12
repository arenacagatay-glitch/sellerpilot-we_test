import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ActivityLevel, Gender, Goal, Profile } from '../types';
import {
  ACTIVITY_LABELS,
  GENDER_LABELS,
  GOAL_LABELS,
  calcTargets,
} from '../lib/nutrition';
import { newId, store } from '../lib/storage';
import { currentYear } from '../lib/date';
import { useProfiles } from '../state/ProfileContext';
import { Button, Card } from '../components/ui';

interface FormState {
  name: string;
  gender: Gender;
  age: string;
  heightCm: string;
  weightKg: string;
  bodyFatPct: string;
  activityLevel: ActivityLevel;
  goal: Goal;
}

const EMPTY: FormState = {
  name: '',
  gender: 'male',
  age: '',
  heightCm: '',
  weightKg: '',
  bodyFatPct: '',
  activityLevel: 'moderate',
  goal: 'fat_loss',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

export function Onboarding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, reload, selectProfile } = useProfiles();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState('');
  const editing = Boolean(id);

  useEffect(() => {
    if (!id) return;
    const p = profiles.find((x) => x.id === id);
    if (p) {
      setForm({
        name: p.name,
        gender: p.gender,
        age: String(currentYear() - p.birthYear),
        heightCm: String(p.heightCm),
        weightKg: String(p.weightKg),
        bodyFatPct: p.bodyFatPct != null ? String(p.bodyFatPct) : '',
        activityLevel: p.activityLevel,
        goal: p.goal,
      });
    }
  }, [id, profiles]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);
    const bodyFatPct = form.bodyFatPct.trim() ? Number(form.bodyFatPct) : undefined;

    if (!form.name.trim()) return setError('Lütfen bir isim gir.');
    if (!(age >= 14 && age <= 100)) return setError('Yaş 14-100 arasında olmalı.');
    if (!(heightCm >= 120 && heightCm <= 230)) return setError('Boy 120-230 cm arasında olmalı.');
    if (!(weightKg >= 35 && weightKg <= 300)) return setError('Kilo 35-300 kg arasında olmalı.');
    if (bodyFatPct != null && !(bodyFatPct >= 3 && bodyFatPct <= 60))
      return setError('Yağ oranı 3-60 arasında olmalı (ya da boş bırak).');

    const year = currentYear();
    const birthYear = year - age;
    const base = {
      gender: form.gender,
      birthYear,
      heightCm,
      weightKg,
      bodyFatPct,
      activityLevel: form.activityLevel,
      goal: form.goal,
    };
    const targets = calcTargets(base, year);
    const now = new Date().toISOString();

    const existing = id ? profiles.find((x) => x.id === id) : undefined;
    const profile: Profile = {
      id: existing?.id ?? newId(),
      name: form.name.trim(),
      ...base,
      targets,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await store.saveProfile(profile);
    await selectProfile(profile.id);
    await reload();
    navigate('/');
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted"
      >
        <ArrowLeft size={18} /> Geri
      </button>

      <h1 className="mb-1 font-display text-2xl font-bold text-ink">
        {editing ? 'Profili düzenle' : 'Profil oluştur'}
      </h1>
      <p className="mb-5 text-sm text-muted">
        Bilgilerine göre günlük kalori ve makro hedefini hesaplayalım.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="space-y-4">
          <Field label="İsim">
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Örn. Çağatay"
            />
          </Field>

          <Field label="Cinsiyet">
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                    form.gender === g
                      ? 'border-brand bg-brand-soft text-brand-dark'
                      : 'border-slate-200 text-muted'
                  }`}
                >
                  {GENDER_LABELS[g]}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Yaş">
              <input className={inputCls} inputMode="numeric" value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="28" />
            </Field>
            <Field label="Boy (cm)">
              <input className={inputCls} inputMode="numeric" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} placeholder="180" />
            </Field>
            <Field label="Kilo (kg)">
              <input className={inputCls} inputMode="decimal" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} placeholder="80" />
            </Field>
          </div>

          <Field label="Yağ oranı % (opsiyonel — daha doğru hesap)">
            <input
              className={inputCls}
              inputMode="decimal"
              value={form.bodyFatPct}
              onChange={(e) => set('bodyFatPct', e.target.value)}
              placeholder="15"
            />
          </Field>
        </Card>

        <Card className="space-y-4">
          <Field label="Aktivite seviyesi">
            <select
              className={inputCls}
              value={form.activityLevel}
              onChange={(e) => set('activityLevel', e.target.value as ActivityLevel)}
            >
              {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((a) => (
                <option key={a} value={a}>
                  {ACTIVITY_LABELS[a]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Hedef">
            <div className="grid grid-cols-3 gap-2">
              {(['fat_loss', 'maintain', 'muscle_gain'] as Goal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('goal', g)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold ${
                    form.goal === g
                      ? 'border-brand bg-brand-soft text-brand-dark'
                      : 'border-slate-200 text-muted'
                  }`}
                >
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </Field>
        </Card>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full py-3">
          {editing ? 'Kaydet' : 'Hesapla ve başla'}
        </Button>
      </form>
    </div>
  );
}
