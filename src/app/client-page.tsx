// Dosya Adı: src/app/client-page.tsx
// Görev: İstemci tarafı etkileşimlerini yönetir (modal açma/kapama).
'use client';
import { useState } from "react";
import UploadModal from "@/components/UploadModal";
import type { File } from "./actions";
export default function ClientPage({ initialFiles }: { initialFiles: File[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <main className="flex h-screen p-4 gap-4">
        {/* Sol Kenar Çubuğu */}
        <nav className="w-64 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Kategoriler</h2>
          <ul>
            <li className="mb-2 p-2 rounded hover:bg-gray-700 cursor-pointer">Marka</li>
            <li className="mb-2 p-2 rounded hover:bg-gray-700 cursor-pointer">Analizler</li>
            <li className="mb-2 p-2 rounded hover:bg-gray-700 cursor-pointer">İçerikler</li>
          </ul>
        </nav>
        <div className="flex-1 flex gap-4">
          {/* Orta Panel */}
          <section className="w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dokümanlar</h2>
              <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
                Dosya Yükle
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {initialFiles.length > 0 ? (
                <ul>
                  {initialFiles.map((file) => (
                    <li key={file.id} className="p-2 border-b border-gray-700 hover:bg-gray-700 rounded cursor-pointer">
                      {file.filename}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">Henüz doküman yüklenmedi.</p>
              )}
            </div>
          </section>
          {/* Sağ Panel */}
          <section className="w-2/3 bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Lütfen bir doküman seçin.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
