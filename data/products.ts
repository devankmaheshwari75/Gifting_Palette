export interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  price?: string;
  category: 'watches' | 'keyrings' | 'photo-frames' | 'other';
  featured?: boolean;
}

export const products: Product[] = [
    {
    id: '1',
    name: 'Ocean Wave Watch',
    type: 'Resin Watch',
    description: 'Beautiful resin watch with ocean wave design, perfect for beach lovers. Features a durable strap and waterproof design.',
    image: '/images/watch1.jpeg',
    price: '₹1,200',
    category: 'watches',
    featured: true,
  },

  // Keyrings (12)
  {
    id: '2',
    name: 'Floral Keyring',
    type: 'Resin Keyring',
    description: 'Pressed flower keyring with clear resin finish.',
    image: '/images/keyring1.jpg',
    price: '₹150',
    category: 'keyrings',
    featured: true,
  },
  {
    id: '3',
    name: 'Galaxy Keyring',
    type: 'Resin Keyring',
    description: 'Galaxy-themed keyring with shimmering stars.',
    image: '/images/keyring2.jpeg',
    price: '₹180',
    category: 'keyrings',
  },
  {
    id: '4',
    name: 'Heart Keyring',
    type: 'Resin Keyring',
    description: 'Heart-shaped keyring with red glitter.',
    image: '/images/keyring3.jpeg',
    price: '₹160',
    category: 'keyrings',
    featured: true,
  },
  {
    id: '5',
    name: 'Butterfly Keyring',
    type: 'Resin Keyring',
    description: 'Colorful butterfly embedded in crystal resin.',
    image: '/images/keyring4.jpeg',
    price: '₹170',
    category: 'keyrings',
  },
  {
    id: '6',
    name: 'Ocean Keyring',
    type: 'Resin Keyring',
    description: 'Ocean blue swirls with mini shells inside.',
    image: '/images/keyring5.jpeg',
    price: '₹190',
    category: 'keyrings',
  },
  {
    id: '7',
    name: 'Leaf Keyring',
    type: 'Resin Keyring',
    description: 'Transparent resin with a real leaf.',
    image: '/images/keyring6.jpeg',
    price: '₹140',
    category: 'keyrings',
  },
  {
    id: '8',
    name: 'Rainbow Keyring',
    type: 'Resin Keyring',
    description: 'Rainbow colors blended beautifully in resin.',
    image: '/images/keyring7.jpeg',
    price: '₹160',
    category: 'keyrings',
    featured: true,
  },
  {
    id: '9',
    name: 'Glitter Keyring',
    type: 'Resin Keyring',
    description: 'Fully glittered keyring for glam lovers.',
    image: '/images/keyring8.jpeg',
    price: '₹150',
    category: 'keyrings',
  },
  {
    id: '10',
    name: 'Starry Keyring',
    type: 'Resin Keyring',
    description: 'Tiny stars suspended in resin.',
    image: '/images/keyring9.jpeg',
    price: '₹155',
    category: 'keyrings',
  },
  {
    id: '11',
    name: 'Marble Keyring',
    type: 'Resin Keyring',
    description: 'White and gold marble effect.',
    image: '/images/keyring10.jpeg',
    price: '₹165',
    category: 'keyrings',
  },
  {
    id: '12',
    name: 'Sunset Keyring',
    type: 'Resin Keyring',
    description: 'Sunset gradient with resin shine.',
    image: '/images/keyring11.jpeg',
    price: '₹170',
    category: 'keyrings',
  },
  {
    id: '13',
    name: 'Vintage Keyring',
    type: 'Resin Keyring',
    description: 'Old-school vibes in a modern look.',
    image: '/images/keyring12.jpeg',
    price: '₹160',
    category: 'keyrings',
  },

  // Frames (6)
  {
    id: '14',
    name: 'Forest Frame',
    type: 'Resin Photo Frame',
    description: 'Forest-themed frame with nature tones.',
    image: '/images/frame1.jpeg',
    price: '₹800',
    category: 'photo-frames',
  },
  {
    id: '15',
    name: 'Beach Frame',
    type: 'Resin Photo Frame',
    description: 'Beach sand and shells embedded in resin.',
    image: '/images/frame2.jpeg',
    price: '₹850',
    category: 'photo-frames',
    featured: true,
  },
  {
    id: '16',
    name: 'Mountain Frame',
    type: 'Resin Photo Frame',
    description: 'Snowy mountain landscape in background.',
    image: '/images/frame3.jpeg',
    price: '₹900',
    category: 'photo-frames',
  },
  {
    id: '17',
    name: 'Sunset Frame',
    type: 'Resin Photo Frame',
    description: 'Warm hues of a sunset captured in resin.',
    image: '/images/frame4.jpeg',
    price: '₹890',
    category: 'photo-frames',
    featured: true,
  },
  {
    id: '18',
    name: 'Minimalist Frame',
    type: 'Resin Photo Frame',
    description: 'Simple black and white marble frame.',
    image: '/images/frame5.jpeg',
    price: '₹870',
    category: 'photo-frames',
  },
  {
    id: '19',
    name: 'Golden Frame',
    type: 'Resin Photo Frame',
    description: 'Gold flakes and resin make this elegant.',
    image: '/images/frame6.jpeg',
    price: '₹950',
    category: 'photo-frames',
    
  },
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'watches', name: 'Watches', count: products.filter(p => p.category === 'watches').length },
  { id: 'keyrings', name: 'Keyrings', count: products.filter(p => p.category === 'keyrings').length },
  { id: 'photo-frames', name: 'Photo Frames', count: products.filter(p => p.category === 'photo-frames').length },
]; 