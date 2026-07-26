// ═══════════════════════════════════════════════════════════════════
// SellerPilot Blog — Ink & Ember dilinde liste + yazı sayfaları.
// İçerik: blogContent1/2.ts (markdown-lite: ##, ###, -, **kalın**).
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { V2Styles, V2Nav, V2Footer } from './LandingV2';
import { POSTS_1 } from './blogContent1';
import { POSTS_2 } from './blogContent2';
import type { BlogPost } from './blogContent1';
import { APP_URL } from './constants';

export const ALL_POSTS: BlogPost[] = [...POSTS_1, ...POSTS_2]
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

// ── Markdown-lite → React (##, ###, -, **kalın**, paragraf) ──
const Inline = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} className="font-semibold" style={{ color: 'var(--text)' }}>{p.slice(2, -2)}</strong>
          : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </>
  );
};

const Markdown = ({ content }: { content: string }) => {
  const blocks = content.split(/\n\n+/);
  return (
    <>
      {blocks.map((b, i) => {
        const t = b.trim();
        if (!t) return null;
        if (t.startsWith('### ')) return <h3 key={i} className="display h3 mt-10 mb-3">{t.slice(4)}</h3>;
        if (t.startsWith('## ')) return <h2 key={i} className="display mt-14 mb-4" style={{ fontSize: 'clamp(1.5rem,1.2rem+1.2vw,2rem)', fontWeight: 600, letterSpacing: '-0.025em' }}>{t.slice(3)}</h2>;
        if (t.split('\n').every(l => l.trim().startsWith('- '))) {
          return (
            <ul key={i} className="my-5 space-y-2.5 pl-1">
              {t.split('\n').map((l, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[1rem] leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                  <span className="mt-[.65em] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ember)' }} />
                  <span><Inline text={l.trim().slice(2)} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i} className="my-5 text-[1.02rem] leading-[1.8]" style={{ color: 'var(--text-mid)' }}><Inline text={t.replace(/\n/g, ' ')} /></p>;
      })}
    </>
  );
};

// ── Liste sayfası ──
export const BlogListPage = () => {
  useEffect(() => {
    document.title = 'Blog — Trendyol Satıcıları İçin Rehberler | SellerPilot';
    return () => { document.title = 'SellerPilot — Trendyol satıcıları için yapay zekâ asistanı'; };
  }, []);
  return (
    <div className="v2">
      <V2Styles />
      <V2Nav />
      <main>
        <section className="band-ink pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
          <span className="glow" style={{ width: 640, height: 640, top: -280, left: '50%', transform: 'translateX(-50%)' }} />
          <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
            <p className="eyebrow justify-center mb-5"><span className="num">Blog</span></p>
            <h1 className="display h2 mb-5" style={{ color: 'var(--ink-text)' }}>
              Satıcıdan satıcıya<br /><span style={{ color: 'var(--ember-2)' }}>Trendyol rehberleri</span>
            </h1>
            <p className="lede mx-auto">Soru-cevap, mağaza puanı, iade ve satış üzerine — kendi mağazalarımızda yaşayarak öğrendiklerimiz.</p>
          </div>
        </section>
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {ALL_POSTS.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="card p-6 sm:p-7 flex flex-col group">
                  <div className="flex items-center justify-between mb-5">
                    <span className="chip">{p.category}</span>
                    <span className="text-[.7rem]" style={{ color: 'var(--text-low)' }}>{fmtDate(p.date)}</span>
                  </div>
                  <h2 className="display h3 mb-3 group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: 'var(--ember)' }}>{p.title}</h2>
                  <p className="text-[.9rem] leading-relaxed mb-6" style={{ color: 'var(--text-mid)' }}>{p.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                    <span className="inline-flex items-center gap-1.5 text-[.75rem]" style={{ color: 'var(--text-low)' }}><Clock size={13} /> {p.minutes} dk okuma</span>
                    <span className="inline-flex items-center gap-1 text-[.8rem] font-semibold ember">Oku <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </div>
  );
};

// ── Yazı sayfası ──
export const BlogPostPage = () => {
  const { slug } = useParams();
  const post = ALL_POSTS.find(p => p.slug === slug);
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | SellerPilot Blog`;
    const m = document.createElement('meta');
    m.name = 'description';
    m.content = post.description;
    document.head.appendChild(m);
    return () => {
      m.remove();
      document.title = 'SellerPilot — Trendyol satıcıları için yapay zekâ asistanı';
    };
  }, [post]);
  if (!post) return <Navigate to="/blog" replace />;
  return (
    <div className="v2">
      <V2Styles />
      <V2Nav />
      <main>
        <section className="band-ink pt-32 pb-14 sm:pt-40 sm:pb-16">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-[.85rem] mb-8" style={{ color: 'var(--ink-mid)' }}>
              <ArrowLeft size={15} /> Tüm yazılar
            </Link>
            <div className="flex items-center gap-3 mb-5 text-[.75rem]" style={{ color: 'var(--ink-mid)' }}>
              <span className="font-bold uppercase tracking-wider" style={{ color: 'var(--ember-2)' }}>{post.category}</span>
              <span>·</span><span>{fmtDate(post.date)}</span>
              <span>·</span><span>{post.minutes} dk okuma</span>
            </div>
            <h1 className="display mb-2" style={{ color: 'var(--ink-text)', fontSize: 'clamp(1.9rem,1.3rem+2.6vw,3rem)', lineHeight: 1.08 }}>{post.title}</h1>
          </div>
        </section>
        <article className="py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <Markdown content={post.content} />
            <div className="mt-14 rounded-2xl p-7 sm:p-9 text-center" style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}>
              <h2 className="display h3 mb-3">Sorulara bakmayı bırakın, satışa bakın</h2>
              <p className="text-[.92rem] mb-6 max-w-md mx-auto" style={{ color: 'var(--text-mid)' }}>
                SellerPilot gelen soruları sizin sesinizle cevaplar, emin olamadığını size iletir. 30 gün ücretsiz, kredi kartı gerekmez.
              </p>
              <a href={APP_URL} className="btn btn-ember">Ücretsiz deneyin <ArrowRight size={16} /></a>
            </div>
            <div className="mt-12">
              <p className="eyebrow mb-5">Diğer yazılar</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_POSTS.filter(p => p.slug !== post.slug).slice(0, 2).map(p => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="card p-5 group">
                    <p className="text-[.7rem] mb-2" style={{ color: 'var(--text-low)' }}>{p.category} · {p.minutes} dk</p>
                    <p className="font-semibold text-[.95rem] leading-snug group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: 'var(--ember)' }}>{p.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <V2Footer />
    </div>
  );
};
