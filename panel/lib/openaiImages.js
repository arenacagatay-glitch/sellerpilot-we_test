// Referans urun fotografindan e-ticaret cekimleri uretir (gpt-image-1 / images.edits).
// Her aci icin ayri istek atilir ki 6-8 gorsel birbirinin kopyasi olmasin.

export const ANGLE_DIRECTIVES = [
  { key: 'on-cephe', text: 'Clean studio front view on a pure white seamless background, soft even lighting' },
  { key: 'aci-45', text: '45-degree angle studio shot with soft natural shadows, light gray gradient background' },
  { key: 'detay', text: 'Macro close-up detail shot focusing on the product label and texture' },
  { key: 'yasam', text: 'Lifestyle scene: the product placed naturally in a bright, modern home setting' },
  { key: 'flatlay', text: 'Top-down flat lay composition with minimal tasteful props around the product' },
  { key: 'elde', text: 'The product held in a hand at eye level, neutral soft-focus background' },
  { key: 'arka-yuz', text: 'Back side of the product packaging, straight-on studio shot, white background' },
  { key: 'podyum', text: 'The product on an elegant round podium with a soft beige gradient background and gentle rim light' },
];

const BASE_PROMPT =
  'Professional high-resolution e-commerce product photograph for a Turkish marketplace listing. ' +
  'Keep the product in the reference image EXACTLY identical: same packaging, same label text, same colors, same proportions. ' +
  'Do not invent or alter any text on the product. No watermarks, no overlay text, no logos added, photorealistic.';

async function editOnce({ apiKey, model, referenceBuffer, referenceMime, prompt, size, quality }) {
  const form = new FormData();
  form.append('model', model);
  form.append('prompt', prompt);
  form.append('n', '1');
  form.append('size', size);
  form.append('quality', quality);
  form.append('input_fidelity', 'high');
  form.append('image', new Blob([referenceBuffer], { type: referenceMime || 'image/png' }), 'reference.png');

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`OpenAI gorsel uretimi basarisiz (HTTP ${res.status}): ${data?.error?.message || 'bilinmeyen hata'}`);
  }
  return Buffer.from(data.data[0].b64_json, 'base64');
}

export async function generateProductImages({
  referenceBuffer,
  referenceMime,
  extraPrompt = '',
  count = 6,
  size = '1024x1536',
  quality = 'high',
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY tanimli degil (.env dosyasina ekleyin)');
  const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

  const n = Math.min(Math.max(Number(count) || 6, 1), ANGLE_DIRECTIVES.length);
  const directives = ANGLE_DIRECTIVES.slice(0, n);

  const results = await Promise.allSettled(
    directives.map((d) =>
      editOnce({
        apiKey,
        model,
        referenceBuffer,
        referenceMime,
        prompt: `${BASE_PROMPT} ${extraPrompt ? extraPrompt + '. ' : ''}Shot type: ${d.text}.`,
        size,
        quality,
      }).then((buffer) => ({ angle: d.key, buffer }))
    )
  );

  const images = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  const errors = results.filter((r) => r.status === 'rejected').map((r) => String(r.reason?.message || r.reason));
  if (images.length === 0) throw new Error(`Hicbir gorsel uretilemedi: ${errors[0] || 'bilinmeyen hata'}`);
  return { images, errors };
}
