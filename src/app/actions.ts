// Dosya Adı: src/app/actions.ts
// Görev: Tüm sunucu tarafı mantığını içerir: dosya listeleme, yükleme ve AI ile özetleme.
'use server';

/**
 * Cloudflare Pages bindings are exposed on the global scope when running in the
 * worker runtime. This helper mimics the API from
 * `cloudflare-pages-plugin-next-swr` so we don't rely on that package at build
 * time.
 */
function getCloudflarePagesContext(): { env: any } {
  if (typeof globalThis !== 'undefined') {
    return { env: globalThis as any };
  }
  return { env: {} };
}
import { revalidatePath } from 'next/cache';
import { Ai } from '@cloudflare/ai';
// Dosya tipini tanımla
export type File = {
  id: number;
  filename: string;
  file_type: string | null;
  stored_url: string;
  created_at: string;
  summary: string | null;
};
// Yüklenmiş dosyaları D1'den çeken fonksiyon
export async function getFiles(): Promise<File[]> {
  try {
    const { env } = getCloudflarePagesContext();
    const { results } = await env.DB.prepare("SELECT * FROM files ORDER BY created_at DESC").all<File>();
    return results || [];
  } catch (e) {
    console.error("Dosyalar çekilirken hata:", e);
    return [];
  }
}
// Dosya yükleme ve AI ile özetleme fonksiyonu
export async function uploadFile(formData: FormData) {
  try {
    const { env } = getCloudflarePagesContext();
    const file = formData.get('file') as File | null;
    if (!file) {
      throw new Error('Dosya bulunamadı.');
    }
    // Dosyayı R2'ye yükle
    const key = `${Date.now()}-${file.name}`;
    await env.R2_BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type }, });
    // İlk kaydı D1'e at
    const insertStmt = env.DB.prepare("INSERT INTO files (filename, file_type, stored_url) VALUES (?, ?, ?)");
    const { meta } = await insertStmt.bind(file.name, file.type, key).run();
    const insertedId = meta.last_row_id;
    if (!insertedId) {
      throw new Error("Veritabanı kaydı başarısız oldu.");
    }
    // AI ile özetleme işlemi
    try {
      const fileBuffer = await file.arrayBuffer();
      const fileContent = new TextDecoder().decode(fileBuffer);
      const ai = new Ai(env.AI);
      const messages = [
        { role: 'system', content: 'You are an expert assistant. Your task is to summarize documents concisely.' },
        { role: 'user', content: `Please summarize the following document in 3-4 sentences, highlighting the key takeaways: ${fileContent}` }
      ];
      const response = await ai.run('@cf/meta/llama-4-scout-17b-16e-instruct', { messages });
      let summaryText = "AI summary could not be generated.";
      if (typeof response.response === 'string') {
        summaryText = response.response;
      }
      // Özeti veritabanına güncelle
      const updateStmt = env.DB.prepare("UPDATE files SET summary = ? WHERE id = ?");
      await updateStmt.bind(summaryText, insertedId).run();
    } catch (aiError) {
      console.error("AI özetleme hatası:", aiError);
      // AI başarısız olsa bile ana işlem devam eder.
    }
    revalidatePath('/');
    return { success: true };
  } catch (e) {
    console.error('Yükleme hatası:', e);
    return { success: false, error: (e as Error).message };
  }
}
