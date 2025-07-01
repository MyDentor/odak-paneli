// Dosya Adı: src/components/UploadModal.tsx
// Görev: Dosya yükleme işleminin yapılacağı popup (modal) penceresi.
'use client';
import { uploadFile } from "@/app/actions";
import { useRef } from "react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export default function UploadModal({ isOpen, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      await uploadFile(formData);
      formRef.current.reset();
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Yeni Doküman Yükle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <input type="file" name="file" required className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4" />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              İptal
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Yükle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
