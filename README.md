# Oto Mansuroğlu - Ford Yedek Parça Projesi

Modern bir e-ticaret platformu olarak Ford yedek parçaları için tasarlanmış web uygulaması. Next.js ve Supabase ile geliştirilmiştir.

## Proje Özellikleri

- **Gelişmiş Araç Bazlı Parça Arama**: Araç modeline göre uyumlu parçaları listeleyin
- **Detaylı Ürün Sayfaları**: Teknik özellikler, resimler ve uyumlu araç modelleri ile
- **Modern Sepet ve Ödeme Sistemi**: Kullanıcı dostu arayüz ve güvenli ödeme entegrasyonu
- **Kullanıcı Hesap Yönetimi**: Giriş, kayıt, profil ve sipariş takibi
- **Responsive Tasarım**: Tüm cihazlarda optimum kullanıcı deneyimi
- **Güvenli Ödeme Entegrasyonu**: İyzico ve diğer ödeme yöntemleri

## Kullanılan Teknolojiler

### Frontend
- **Next.js**: React framework
- **React**: UI bileşenleri için
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Stil ve tasarım

### Backend
- **Supabase**: Veritabanı, Auth ve Storage
- **API Routes**: Serverless functions

### Deployment
- **Vercel**: CI/CD ve hosting

## Proje Yapısı

Proje, modüler monolitik bir mimariye sahiptir:

### Core Modülü
- `src/modules/core`: Temel türler, Supabase istemcisi, ve yardımcı işlevler

### Auth Modülü
- `src/modules/auth`: Kimlik doğrulama ve kullanıcı yönetimi
- `src/app/auth`: Auth ilgili sayfalar (giriş, kayıt, vs.)

### Products Modülü
- `src/modules/products`: Ürün yönetimi
- `src/app/products`: Ürün sayfaları (liste, detay)

### Cart Modülü
- `src/modules/cart`: Sepet işlemleri
- `src/app/cart`: Sepet sayfası ve bileşenleri

### Shipping Modülü
- `src/modules/shipping`: Kargo takibi
- `src/app/kargo-takip`: Kargo takip sayfaları

### Orders Modülü
- `src/modules/orders`: Sipariş işlemleri
- `src/app/hesap/orders`: Sipariş sayfaları

### UI Modülü
- `src/modules/ui`: Paylaşılan UI bileşenleri
- `src/components`: Temel UI bileşenleri

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.