// Gorseller Supabase Storage'daki public bucket'a yuklenir;
// Trendyol gorselleri bu public URL'lerden ceker.

function cfg() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || 'urun-gorselleri';
  if (!url || !key) throw new Error('Supabase ayarlari eksik (.env: SUPABASE_URL / SUPABASE_KEY)');
  return { url: url.replace(/\/$/, ''), key, bucket };
}

export function isConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
}

export function publicUrl(objectPath) {
  const { url, bucket } = cfg();
  return `${url}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function uploadImage(buffer, objectPath, contentType = 'image/png') {
  const { url, key, bucket } = cfg();
  const res = await fetch(`${url}/storage/v1/object/${bucket}/${objectPath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase yukleme hatasi (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }
  return publicUrl(objectPath);
}
