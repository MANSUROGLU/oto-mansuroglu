import { createClient } from '@supabase/supabase-js'
import { type Database } from '../types/supabase'

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Supabase istemci değişkeni (lazy initialization)
let supabaseClient: ReturnType<typeof createClient> | null = null

/**
 * Supabase istemcisini döndürür (singleton pattern)
 * İlk çağrıda oluşturur, sonraki çağrılarda aynı istemciyi döndürür
 */
export const getClient = () => {
  // Eğer istemci daha önce oluşturulmadıysa veya değişkenler güncellendiyse yeniden oluştur
  if (!supabaseClient) {
    if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
      // Öncelikle service key'i kullan, yoksa anon key'i kullan
      const apiKey = supabaseServiceKey || supabaseAnonKey
      console.log('Gerçek Supabase bağlantısı kullanılıyor')
      supabaseClient = createClient<Database>(supabaseUrl, apiKey)
    } else {
      console.warn('Supabase bağlantı bilgileri eksik, mock istemci kullanılıyor')
      supabaseClient = createMockClient()
    }
  }

  return supabaseClient
}

// Direkt erişim için client nesnesi
export const supabase = getClient()

/**
 * Mock Supabase istemcisi oluşturur
 * Geliştirme ortamında Supabase bağlantısı olmadığında kullanılır
 */
function createMockClient() {
  // Mock veri
  const mockData = {
    'products': generateMockProducts(20),
  };

  // Basit bir mock istemci
  return {
    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => ({
          single: () => {
            const items = (mockData[table] || []).filter((item: any) => item[column] === value);
            return Promise.resolve({ data: items[0] || null, error: null });
          },
          order: (orderColumn: string, { ascending = true } = {}) => ({
            limit: (limit: number) => {
              let items = (mockData[table] || []).filter((item: any) => item[column] === value);
              items = sortItems(items, orderColumn, ascending);
              items = items.slice(0, limit);
              return Promise.resolve({ data: items, error: null });
            }
          })
        }),
        order: (orderColumn: string, { ascending = true } = {}) => ({
          limit: (limit: number) => {
            let items = mockData[table] || [];
            items = sortItems(items, orderColumn, ascending);
            items = items.slice(0, limit);
            return Promise.resolve({ data: items, error: null });
          }
        }),
        range: (from: number, to: number) => {
          const items = (mockData[table] || []).slice(from, to + 1);
          return Promise.resolve({ data: items, error: null });
        },
      }),
      insert: (data: any) => {
        const newItem = {
          id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...data
        };
        if (!mockData[table]) mockData[table] = [];
        mockData[table].push(newItem);
        return Promise.resolve({ data: newItem, error: null });
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          if (!mockData[table]) return Promise.resolve({ data: null, error: null });
          const index = mockData[table].findIndex((item: any) => item[column] === value);
          if (index === -1) return Promise.resolve({ data: null, error: null });
          mockData[table][index] = {
            ...mockData[table][index],
            ...data,
            updated_at: new Date().toISOString()
          };
          return Promise.resolve({ data: mockData[table][index], error: null });
        }
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          if (!mockData[table]) return Promise.resolve({ data: null, error: null });
          const index = mockData[table].findIndex((item: any) => item[column] === value);
          if (index === -1) return Promise.resolve({ data: null, error: null });
          const deleted = mockData[table].splice(index, 1)[0];
          return Promise.resolve({ data: deleted, error: null });
        }
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  } as any;
}

/**
 * Mock ürünler oluşturur
 */
function generateMockProducts(count: number): any[] {
  return Array.from({ length: count }, (_, i) => {
    const price = 100 + Math.floor(Math.random() * 500);
    const discounted = Math.random() > 0.7;
    
    return {
      id: `product-${i + 1}`,
      name: `Ford ${['Fiesta', 'Focus', 'Mondeo', 'Transit'][i % 4]} ${['Filtre', 'Fren Balatası', 'Far', 'Amortisör'][i % 4]}`,
      slug: `ford-${['fiesta', 'focus', 'mondeo', 'transit'][i % 4]}-${['filtre', 'fren-balatasi', 'far', 'amortisör'][i % 4]}-${i + 1}`,
      description: `Ford araçları için yüksek kalitede yedek parça. Bu ürün tüm modellerle uyumludur.`,
      price: price,
      discounted_price: discounted ? Math.floor(price * 0.8) : null,
      stock_status: ['in_stock', 'low_stock', 'out_of_stock'][Math.floor(Math.random() * 3)],
      brand: 'Ford',
      category: ['Filtreler', 'Fren Sistemi', 'Aydınlatma', 'Süspansiyon'][i % 4],
      part_number: `F-${10000 + i}`,
      main_image: `https://picsum.photos/500/500?random=${i}`,
      additional_images: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      model_year: `${2010 + (i % 12)}`,
      part_type: ['OEM', 'Aftermarket'][i % 2],
      specifications: null,
      is_featured: i < 4,
      
      // Ek alanlar
      sku: `SKU-${10000 + i}`,
      image_url: `https://picsum.photos/500/500?random=${i}`,
      product_url: `#`,
      compatible_vehicles: ['Fiesta', 'Focus', 'Mondeo', 'Transit'],
    };
  });
}

/**
 * Array'i belirtilen sütuna göre sıralar
 */
function sortItems(items: any[], column: string, ascending: boolean) {
  return [...items].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    if (valueA instanceof Date && valueB instanceof Date) {
      return ascending
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }
    
    return ascending
      ? (valueA || 0) - (valueB || 0)
      : (valueB || 0) - (valueA || 0);
  });
}