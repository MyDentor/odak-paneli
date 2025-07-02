// Dosya Adı: src/app/page.tsx
// Görev: Ana dashboard arayüzünü fonksiyonel hale getirir.
// Dosyaları listeler ve yükleme modal'ını yönetir.
import { getFiles } from "./actions";
import ClientPage from "./client-page";
export const revalidate = 0; // Sayfanın her zaman güncel kalmasını sağlar
export default async function HomePage() {
  const files = await getFiles();
  return <ClientPage initialFiles={files} />;
}
