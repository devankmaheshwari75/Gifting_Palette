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
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    price: '₹1,200',
    category: 'watches',
    featured: true,
  },
  {
    id: '2',
    name: 'Floral Garden Keyring',
    type: 'Resin Keyring',
    description: 'Elegant keyring with pressed flowers and glitter, making your keys look stylish and unique.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
    price: '₹150',
    category: 'keyrings',
    featured: true,
  },
  {
    id: '3',
    name: 'Mountain Landscape Frame',
    type: 'Resin Photo Frame',
    description: 'Stunning photo frame with mountain landscape design, perfect for displaying your precious memories.',
    image: 'https://drive.google.com/uc?export=view&id=1aIRMGmrq1iN7UJx8ycKtyU-AwlT61dUG',
    price: '₹800',
    category: 'photo-frames',
    featured: true,
  },
  {
    id: '4',
    name: 'Galaxy Watch',
    type: 'Resin Watch',
    description: 'Cosmic-inspired watch with galaxy design, featuring stars and nebula patterns in vibrant colors.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&h=500&fit=crop',
    price: '₹1,500',
    category: 'watches',
  },
  {
    id: '5',
    name: 'Butterfly Keyring',
    type: 'Resin Keyring',
    description: 'Delicate butterfly design with iridescent wings, adding a touch of nature to your everyday items.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    price: '₹180',
    category: 'keyrings',
  },
  {
    id: '6',
    name: 'Beach Sunset Frame',
    type: 'Resin Photo Frame',
    description: 'Beautiful frame with beach sunset design, perfect for vacation photos and coastal memories.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    price: '₹900',
    category: 'photo-frames',
  },
  {
    id: '7',
    name: 'Rose Gold Watch',
    type: 'Resin Watch',
    description: 'Elegant rose gold watch with marble effect, combining style and sophistication.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop',
    price: '₹1,800',
    category: 'watches',
  },
  {
    id: '8',
    name: 'Crystal Keyring',
    type: 'Resin Keyring',
    description: 'Sparkling crystal design with holographic effects, making your keys shine with elegance.',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
    price: '₹200',
    category: 'keyrings',
  },
  {
    id: '9',
    name: 'Forest Frame',
    type: 'Resin Photo Frame',
    description: 'Nature-inspired frame with forest design, bringing the outdoors into your home decor.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop',
    price: '₹750',
    category: 'photo-frames',
  },
  {
    id: '10',
    name: 'Neon Watch',
    type: 'Resin Watch',
    description: 'Bold neon-colored watch with geometric patterns, perfect for making a statement.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&h=500&fit=crop',
    price: '₹1,300',
    category: 'watches',
  },
  {
    id: '11',
    name: 'Heart Keyring',
    type: 'Resin Keyring',
    description: 'Romantic heart design with glitter and rose gold accents, perfect for gifts.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    price: '₹160',
    category: 'keyrings',
  },
  {
    id: '12',
    name: 'Vintage Frame',
    type: 'Resin Photo Frame',
    description: 'Classic vintage-style frame with antique finish, adding timeless elegance to your photos.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop',
    price: '₹850',
    category: 'photo-frames',
  },
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'watches', name: 'Watches', count: products.filter(p => p.category === 'watches').length },
  { id: 'keyrings', name: 'Keyrings', count: products.filter(p => p.category === 'keyrings').length },
  { id: 'photo-frames', name: 'Photo Frames', count: products.filter(p => p.category === 'photo-frames').length },
]; 