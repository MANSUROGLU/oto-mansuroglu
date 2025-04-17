/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // CORS yapılandırması
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Görüntü yapılandırması
  images: {
    domains: [
      'localhost',
      'yedekparca.com',
      'cdn11.bigcommerce.com',
      'images.unsplash.com',
      'cdn.sanity.io',
      'files.stripe.com',
      'assets.vercel.com',
      'i.loli.net',
      'loremflickr.com',
      'picsum.photos',
      'ford.com.tr',
      'fordparts.com',
      'via.placeholder.com',
      'randomuser.me',
      'aws.amazon.com',
      'placehold.co',
      'supabase.co',
      '*.supabase.co',
      'dbplhqms9hlub.cloudfront.net',
      'rshbxohrqpufeupqaclg.supabase.co'
    ],
  },

  // Uygulama metadata
  env: {
    APP_NAME: 'Oto Mansuroglu - Ford Yedek Parça',
    APP_DESCRIPTION: 'Ford yedek parça satışı yapan e-ticaret platformu',
    APP_URL: 'https://oto-mansuroglu.vercel.app',
    APP_AUTHOR: 'Oto Mansuroglu',
    APP_KEYWORDS: 'ford, yedek parça, otomotiv, e-ticaret',
  },

  // Transpile yapılandırması
  transpilePackages: [
    '@supabase/auth-helpers-nextjs',
    '@supabase/auth-ui-react',
    '@supabase/auth-ui-shared',
    'lucide-react',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
  ],

  // Webpack yapılandırması
  webpack: (config, { isServer }) => {
    // Buffer polyfill
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: require.resolve('buffer'),
      };
    }

    return config;
  },

  // Experimental özellikler
  experimental: {
    serverActions: true,
    optimizeCss: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
  },

  // SWC derleme yapılandırması
  swcMinify: true,
};

module.exports = nextConfig;