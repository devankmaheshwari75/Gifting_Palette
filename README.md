# Artisan Resin Creations - Handmade Resin Art Website

A beautiful, responsive website for showcasing handmade resin art products including watches, keyrings, and photo frames. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ✨ **Modern Design**: Clean, elegant design with beautiful animations
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🎨 **Product Gallery**: Showcase all products with filtering and search
- 💬 **WhatsApp Integration**: Direct messaging for orders and customization
- 🎯 **Custom Orders**: Easy customization request system
- ⚡ **Fast Performance**: Optimized for speed and SEO
- 🚀 **Vercel Ready**: Deploy-ready configuration

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resin-art-gallery
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── gallery/           # Gallery page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   ├── ProductCard.tsx   # Product card component
│   └── FloatingWhatsApp.tsx # WhatsApp button
├── data/                 # Data files
│   └── products.ts       # Product data
├── public/               # Static assets
└── tailwind.config.js    # Tailwind configuration
```

## Customization

### Adding Products

Edit `data/products.ts` to add or modify products:

```typescript
export const products: Product[] = [
  {
    id: 'unique-id',
    name: 'Product Name',
    type: 'Product Type',
    description: 'Product description',
    image: 'image-url',
    price: '₹1,200',
    category: 'watches', // or 'keyrings', 'photo-frames'
    featured: true, // optional
  },
  // ... more products
];
```

### Updating Contact Information

Update the contact information in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `components/FloatingWhatsApp.tsx`

### Changing Colors

Modify the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary colors
  },
  accent: {
    // Your accent colors
  },
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Features in Detail

### Product Gallery
- Filter by category (Watches, Keyrings, Photo Frames)
- Grid and list view options
- Responsive masonry layout
- Hover effects and animations

### WhatsApp Integration
- Floating WhatsApp button
- Pre-filled messages for customization
- Direct order placement
- Contact information

### Custom Orders
- Easy customization request system
- Product-specific customization forms
- Direct communication with artisan

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Fast loading times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact:
- Email: hello@artisanresin.com
- WhatsApp: +91 98765 43210

---

Built with ❤️ for showcasing beautiful handmade resin art. 