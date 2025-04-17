'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde loading durumunu değiştir
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Oto Mansuroglu Ford Yedek Parça</h1>

        {/* Araç Arama Bileşeni */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Aracınıza Göre Parça Arayın</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Araç Markası */}
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
              <select
                id="make"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="">Marka Seçin</option>
                <option value="ford">Ford</option>
              </select>
            </div>
            
            {/* Araç Modeli */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                id="model"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="">Model Seçin</option>
                <option value="fiesta">Fiesta</option>
                <option value="focus">Focus</option>
                <option value="mondeo">Mondeo</option>
              </select>
            </div>
            
            {/* Araç Yılı */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Yıl
              </label>
              <select
                id="year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                defaultValue=""
              >
                <option value="">Yıl Seçin</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="button"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Parça Ara
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-lg text-gray-700">Yükleniyor...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`https://picsum.photos/500/300?random=${index}`}
                    alt={`Örnek Ürün ${index + 1}`}
                    className="object-cover w-full h-48"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{`Ford Fiesta Yakıt Filtresi ${index + 1}`}</h2>
                  <p className="text-xl font-bold text-blue-600 mb-2">
                    {`${(Math.random() * 1000 + 100).toFixed(2)} TL`}
                  </p>
                  <p className={`text-sm ${
                    Math.random() > 0.3 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.random() > 0.3 ? 'Stokta var' : 'Stokta yok'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Marka: Ford</p>
                  <p className="text-sm text-gray-600">Kategori: Filtreler</p>
                  <a
                    href="#"
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Detayları Gör
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}