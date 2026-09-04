// /api/gorusme — /kurumsal sayfasındaki görüşme formu.
// Google Apps Script ucu 3 Eyl 2026'da 403 vermeye başladı (anonim erişim kapalı); bu uç onun yerine.
// Ne yapar: JSON gövdeyi alır → iletisim@sellerpilot.cloud'a e-posta (Hostinger SMTP) + Telegram (radar botu) → {ok:true}
// Env (Vercel): SMTP_USER, SMTP_PASS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, hata: 'POST' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  const t = (x) => String(x || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200);
  const ad = t(b.ad), sirket = t(b.sirket), email = t(b.email), tel = t(b.tel), zaman = t(b.zaman), kaynak = t(b.kaynak || 'kurumsal');
  if (!ad || !sirket || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ ok: false, hata: 'eksik' });
  if (t(b.web)) return res.status(200).json({ ok: true }); // bal küpü alanı dolduysa bot

  const ts = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
  const metin = `Kurumsal görüşme talebi (${kaynak})\n\nAd: ${ad}\nŞirket: ${sirket}\nE-posta: ${email}\nTelefon: ${tel || '-'}\nUygun zaman: ${zaman || '-'}\nZaman: ${ts}\nIP: ${req.headers['x-forwarded-for'] || '-'}`;
  const sonuc = { mail: false, telegram: false };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const tr = nodemailer.createTransport({ host: 'smtp.hostinger.com', port: 465, secure: true, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await tr.sendMail({ from: `"SellerPilot Form" <${process.env.SMTP_USER}>`, to: process.env.SMTP_USER, replyTo: email,
        subject: `🔔 Kurumsal görüşme talebi: ${sirket} — ${ad}`, text: metin });
      sonuc.mail = true;
    } catch (e) { console.error('mail hata', e && e.message); }
  }
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: '📞 ' + metin }) });
      sonuc.telegram = r.ok;
    } catch (e) { console.error('telegram hata', e && e.message); }
  }
  if (!sonuc.mail && !sonuc.telegram) return res.status(500).json({ ok: false, hata: 'iletilemedi' });
  return res.status(200).json({ ok: true, ...sonuc });
}
