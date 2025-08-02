# Resin Art Gallery - Admin Panel

A beautiful, responsive website for showcasing handmade resin art products with a complete admin panel for product management.

## Features

### Customer-Facing Features
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Product Gallery**: Browse all products with category filtering
- **Featured Products**: Highlight special products on the homepage
- **Contact Integration**: Direct WhatsApp/Instagram integration for orders
- **Modern UI**: Beautiful animations and elegant design

### Admin Panel Features
- **Secure Authentication**: Supabase authentication system
- **Product Management**: Add, edit, delete products
- **Image Upload**: Automatic image upload to Supabase storage
- **Real-time Updates**: Changes reflect immediately on the website
- **Dashboard Analytics**: View total products, featured count, and total value
- **AI Content Enhancement**: Automatically improve product titles and descriptions using Google's Gemini AI

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database + Storage + Authentication)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd resin-art-gallery
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Sign up and create a new project
   - Note down your project URL and anon key

2. **Create Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Set Up Database**:
   In your Supabase dashboard, go to SQL Editor and run this query:
   ```sql
   -- Create products table
   CREATE TABLE products (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR NOT NULL,
     type VARCHAR NOT NULL,
     description TEXT NOT NULL,
     image VARCHAR NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     category VARCHAR NOT NULL,
     featured BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow public read access
   CREATE POLICY "Allow public read access" ON products
     FOR SELECT USING (true);

   -- Create policy to allow authenticated users to insert
   CREATE POLICY "Allow authenticated insert" ON products
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   -- Create policy to allow authenticated users to update
   CREATE POLICY "Allow authenticated update" ON products
     FOR UPDATE USING (auth.role() = 'authenticated');

   -- Create policy to allow authenticated users to delete
   CREATE POLICY "Allow authenticated delete" ON products
     FOR DELETE USING (auth.role() = 'authenticated');
   ```

4. **Set Up Storage**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `product-images`
   - Set it to public
   - Create this policy for the bucket:
   ```sql
   CREATE POLICY "Allow public read access" ON storage.objects
     FOR SELECT USING (bucket_id = 'product-images');

   CREATE POLICY "Allow authenticated uploads" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
   ```

### 3. Create Admin User

1. **Enable Email Auth**:
   - Go to Authentication > Settings in Supabase
   - Enable Email provider
   - Disable "Confirm email" if you want immediate access

2. **Create Admin Account**:
   - Go to Authentication > Users
   - Click "Add User"
   - Enter admin email and password
   - This will be your login credentials for the admin panel

### 4. Set Up AI Enhancement (Optional)

To enable the AI content enhancement feature:

1. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env.local` file as `GEMINI_API_KEY`

2. **How it Works**:
   - In the admin product form, type a rough title and description
   - Click the "Enhance with AI" button
   - The AI will improve both fields with better, more engaging content
   - Perfect for creating compelling product descriptions quickly

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Admin Panel Access

- **URL**: `http://localhost:3000/admin`
- **Login**: Use the email and password you created in Supabase
- **Features**:
  - Add new products with images
  - Edit existing products
  - Delete products
  - Mark products as featured
  - View dashboard statistics

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard
│   ├── gallery/         # Product gallery page
│   ├── about/           # About page
│   ├── contact/         # Contact page
│   └── page.tsx         # Homepage
├── components/
│   ├── AdminLogin.tsx   # Admin authentication
│   ├── ProductForm.tsx  # Product add/edit form
│   ├── ProductCard.tsx  # Product display component
│   ├── Navbar.tsx       # Navigation
│   ├── Footer.tsx       # Footer
│   └── FloatingWhatsApp.tsx # Floating contact button
├── lib/
│   └── supabase.ts      # Supabase configuration and functions
├── data/
│   └── products.ts      # Static product data (fallback)
└── public/              # Static assets
```

## Customization

### Colors and Styling
- Edit `tailwind.config.js` to customize colors and fonts
- Modify `app/globals.css` for global styles

### Product Categories
- Update the category options in `components/ProductForm.tsx`
- Categories are automatically generated from existing products

### Contact Information
- Update WhatsApp number in components
- Update Instagram links throughout the site

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
Make sure to add these to your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` (optional, for AI enhancement feature)

## Security Features

- **Row Level Security**: Database policies ensure data protection
- **Authentication**: Secure admin login system
- **Image Validation**: Only image files can be uploaded
- **Input Validation**: Form validation on both client and server

## Support

For issues or questions:
1. Check the Supabase documentation
2. Review the console for error messages
3. Ensure all environment variables are set correctly

## License

This project is open source and available under the MIT License.

