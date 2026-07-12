import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  RefreshCw, Search, Phone, Mail, ArrowLeft, CheckCircle, Clock,
  MessageSquare, User, AlertTriangle, Inbox, ChevronRight, X
} from 'lucide-react';
import { GOOGLE_SHEETS_WEB_APP_URL, WHATSAPP_URL } from './constants';
import { Lead } from './types';

// ────────────────────────────────────────────────────────────────
// JSONP ile veri çek — Apps Script GET'te CORS engeline takılmamak
// için <script> etiketi enjekte edip callback'ten sonucu alıyoruz.
// ────────────────────────────────────────────────────────────────
let jsonpCounter = 0;
function fetchLeadsJSONP(timeoutMs = 15000): Promise<Lead[]> {
  return new Promise((resolve, reject) => {
    const cbName = `__spLeads${Date.now()}_${jsonpCounter++}`;
    const script = document.createElement('script');
    let done = false;

    const cleanup = () => {
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    const timer = window.setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      reject(new Error('Zaman aşımı. Bağlantınızı kontrol edin.'));
    }, timeoutMs);

    (window as any)[cbName] = (data: any) => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      cleanup();
      if (data && data.result === 'error') {
        reject(new Error(data.error || 'Sunucu hatası'));
      } else if (Array.isArray(data)) {
        resolve(data as Lead[]);
      } else {
        reject(new Error('Beklenmeyen veri biçimi'));
      }
    };

    script.onerror = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      cleanup();
      reject(new Error('Veriye ulaşılamadı. URL veya erişim izinlerini kontrol edin.'));
    };

    const sep = GOOGLE_SHEETS_WEB_APP_URL.includes('?') ? '&' : '?';
    script.src = `${GOOGLE_SHEETS_WEB_APP_URL}${sep}callback=${cbName}&t=${Date.now()}`;
    document.body.appendChild(script);
  });
}

// Bir talebi benzersiz tanımlamak için anahtar (telefon + tarih).
const leadKey = (l: Lead) => `${l.phone || ''}|${l.date || ''}|${l.email || ''}`;

// "İşlendi" durumunu telefonda yerel olarak sakla.
const HANDLED_STORAGE = 'sp_admin_handled_v1';
function loadHandled(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(HANDLED_STORAGE) || '{}');
  } catch {
    return {};
  }
}
function saveHandled(map: Record<string, boolean>) {
  try {
    localStorage.setItem(HANDLED_STORAGE, JSON.stringify(map));
  } catch {
    /* yoksay */
  }
}

// Telefon numarasını wa.me / tel: için normalize et.
function normalizePhone(raw: string): string {
  let p = (raw || '').replace(/[^\d+]/g, '');
  if (!p) return '';
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p.startsWith('+')) {
    if (p.startsWith('0')) p = '+9' + p; // 05xx -> +905xx
    else if (p.startsWith('5')) p = '+90' + p; // 5xx -> +905xx
    else p = '+' + p;
  }
  return p;
}

type Filter = 'all' | 'pending' | 'handled';

// ────────────────────────────────────────────────────────────────
// Tek talep kartı (liste görünümü)
// ────────────────────────────────────────────────────────────────
const LeadCard: React.FC<{ lead: Lead; handled: boolean; onOpen: () => void }> = ({ lead, handled, onOpen }) => (
  <button
    onClick={onOpen}
    className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-[0.99] transition-transform p-4 flex items-center gap-3"
  >
    <div
      className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold"
      style={{ background: handled ? '#9CA3AF' : 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}
    >
      {(lead.name || '?').trim().charAt(0).toUpperCase()}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-dark truncate">{lead.name || 'İsimsiz'}</p>
        {handled ? (
          <span className="shrink-0 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">İşlendi</span>
        ) : (
          <span className="shrink-0 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Yeni</span>
        )}
      </div>
      <p className="text-sm text-dark-gray truncate">{lead.phone || lead.email || '—'}</p>
      {lead.date && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{lead.date}</p>}
    </div>
    <ChevronRight size={20} className="text-gray-300 shrink-0" />
  </button>
);

// ────────────────────────────────────────────────────────────────
// Talep detayı — burada "işlem" yapılır (ara / WhatsApp / e-posta)
// ────────────────────────────────────────────────────────────────
const LeadDetail: React.FC<{
  lead: Lead;
  handled: boolean;
  onBack: () => void;
  onToggleHandled: () => void;
}> = ({ lead, handled, onBack, onToggleHandled }) => {
  const phone = normalizePhone(lead.phone);
  const waNumber = phone.replace('+', '');
  const waText = encodeURIComponent(
    `Merhaba ${lead.name || ''}, SellerPilot demo talebiniz için ulaşıyorum.`
  );

  return (
    <div className="min-h-screen bg-light">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} aria-label="Geri" className="p-1 -ml-1 text-dark-gray active:text-primary">
          <ArrowLeft size={22} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-dark truncate">{lead.name || 'İsimsiz'}</p>
          <p className="text-[11px] text-gray-400 truncate">{lead.date || 'Talep detayı'}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Durum bandı */}
        <div
          className={`rounded-2xl p-4 flex items-center gap-3 ${
            handled ? 'bg-green-50 border border-green-100' : 'bg-orange-50 border border-orange-100'
          }`}
        >
          {handled ? <CheckCircle className="text-green-600" size={22} /> : <Clock className="text-orange-500" size={22} />}
          <div>
            <p className={`font-bold text-sm ${handled ? 'text-green-700' : 'text-orange-700'}`}>
              {handled ? 'Bu talep işlendi' : 'İşlem bekliyor'}
            </p>
            {lead.status && <p className="text-[11px] text-dark-gray mt-0.5">Sunucu durumu: {lead.status}</p>}
          </div>
        </div>

        {/* İletişim bilgileri */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          <div className="flex items-center gap-3 p-4">
            <User size={18} className="text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">İsim</p>
              <p className="text-dark font-medium truncate">{lead.name || 'İsimsiz'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Phone size={18} className="text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Telefon</p>
              <p className="text-dark font-medium truncate">{lead.phone || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4">
            <Mail size={18} className="text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">E-posta</p>
              <p className="text-dark font-medium truncate">{lead.email || '—'}</p>
            </div>
          </div>
        </div>

        {/* İşlem butonları */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={phone ? `tel:${phone}` : undefined}
            aria-disabled={!phone}
            className={`flex flex-col items-center gap-1.5 rounded-2xl py-4 font-semibold text-sm ${
              phone ? 'bg-dark text-white active:scale-95' : 'bg-gray-100 text-gray-300 pointer-events-none'
            } transition-transform`}
          >
            <Phone size={20} />
            Ara
          </a>
          <a
            href={waNumber ? `https://wa.me/${waNumber}?text=${waText}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!waNumber}
            className={`flex flex-col items-center gap-1.5 rounded-2xl py-4 font-semibold text-sm text-white ${
              waNumber ? 'active:scale-95' : 'pointer-events-none opacity-40'
            } transition-transform`}
            style={{ background: '#25D366' }}
          >
            <MessageSquare size={20} />
            WhatsApp
          </a>
          <a
            href={lead.email ? `mailto:${lead.email}?subject=${encodeURIComponent('SellerPilot Demo')}` : undefined}
            aria-disabled={!lead.email}
            className={`flex flex-col items-center gap-1.5 rounded-2xl py-4 font-semibold text-sm text-white ${
              lead.email ? 'active:scale-95' : 'pointer-events-none opacity-40'
            } transition-transform`}
            style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}
          >
            <Mail size={20} />
            E-posta
          </a>
        </div>

        {/* İşlendi işaretle */}
        <button
          onClick={onToggleHandled}
          className={`w-full rounded-2xl py-3.5 font-bold text-sm border-2 transition-colors ${
            handled
              ? 'border-gray-200 text-dark-gray bg-white'
              : 'border-green-500 text-green-600 bg-green-50'
          }`}
        >
          {handled ? 'İşlenmedi olarak geri al' : 'İşlendi olarak işaretle'}
        </button>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Ana Admin Paneli
// ────────────────────────────────────────────────────────────────
const AdminPanel: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [handledMap, setHandledMap] = useState<Record<string, boolean>>(() => loadHandled());
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeadsJSONP();
      setLeads(data);
    } catch (e: any) {
      setError(e?.message || 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHandled = useCallback((lead: Lead) => {
    setHandledMap((prev) => {
      const key = leadKey(lead);
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) delete next[key];
      saveHandled(next);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const isHandled = !!handledMap[leadKey(l)];
      if (filter === 'pending' && isHandled) return false;
      if (filter === 'handled' && !isHandled) return false;
      if (!q) return true;
      return (
        (l.name || '').toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q)
      );
    });
  }, [leads, query, filter, handledMap]);

  const pendingCount = useMemo(
    () => leads.filter((l) => !handledMap[leadKey(l)]).length,
    [leads, handledMap]
  );

  // Detay ekranı açıksa onu göster
  if (selected) {
    const key = leadKey(selected);
    return (
      <LeadDetail
        lead={selected}
        handled={!!handledMap[key]}
        onBack={() => setSelected(null)}
        onToggleHandled={() => toggleHandled(selected)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Başlık */}
      <header className="sticky top-0 z-10 text-white" style={{ background: '#0a0a13' }}>
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}
            >
              <Inbox size={18} />
            </div>
            <div>
              <p className="font-display font-bold leading-tight">Admin Gelen Kutusu</p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {loading ? 'Yükleniyor…' : `${pendingCount} bekleyen · ${leads.length} toplam`}
              </p>
            </div>
          </div>
          <button
            onClick={load}
            aria-label="Yenile"
            className="p-2.5 rounded-xl bg-white/10 active:bg-white/20 transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Arama */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İsim, telefon veya e-posta ara"
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:bg-white/15"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Temizle"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filtre sekmeleri */}
        <div className="max-w-lg mx-auto px-4 pb-3 flex gap-2">
          {([
            ['all', 'Tümü'],
            ['pending', 'Bekleyen'],
            ['handled', 'İşlenen'],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f ? 'bg-white text-dark' : 'bg-white/10 text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* İçerik */}
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-100 p-6 text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-3" size={32} />
            <p className="font-bold text-dark mb-1">Talepler yüklenemedi</p>
            <p className="text-sm text-dark-gray mb-4">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg,#FF6B35,#FFBE5C)' }}
            >
              <RefreshCw size={16} /> Tekrar dene
            </button>
            <p className="text-[11px] text-gray-400 mt-4">
              İpucu: Apps Script dağıtımında erişimin “Anyone / Herkes” olduğundan emin olun.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Inbox className="mx-auto text-gray-300 mb-3" size={36} />
            <p className="font-bold text-dark mb-1">
              {leads.length === 0 ? 'Henüz talep yok' : 'Sonuç bulunamadı'}
            </p>
            <p className="text-sm text-dark-gray">
              {leads.length === 0
                ? 'Yeni demo talepleri geldiğinde burada görünecek.'
                : 'Arama veya filtreyi değiştirip tekrar deneyin.'}
            </p>
          </div>
        )}

        {!loading && !error &&
          filtered.map((lead) => (
            <LeadCard
              key={leadKey(lead)}
              lead={lead}
              handled={!!handledMap[leadKey(lead)]}
              onOpen={() => setSelected(lead)}
            />
          ))}
      </main>

      <footer className="max-w-lg mx-auto px-4 pb-8 pt-2 text-center">
        <p className="text-[11px] text-gray-400">
          SellerPilot Admin · Talepler her yenilemede güncellenir
        </p>
        <a href="#" className="text-[11px] text-primary font-semibold">← Siteye dön</a>
      </footer>
    </div>
  );
};

export default AdminPanel;
