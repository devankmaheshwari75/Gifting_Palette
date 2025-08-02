# Database Setup Guide

## Supabase Database Configuration

### 1. Check Current Database Schema

First, let's check what's already in your database. Run this SQL in your Supabase SQL editor:

```sql
-- Check if products table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check if there are any products in the table
SELECT COUNT(*) as product_count FROM products;

-- Check a few sample products
SELECT id, name, type, category FROM products LIMIT 5;
```

### 2. If Products Table Doesn't Exist

If the table doesn't exist, run this SQL:

```sql
-- Create the products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of additional image URLs
  price DECIMAL(10,2),
  category VARCHAR(50) NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3. If Products Table Exists But Needs Updates

If the table exists but you need to add the `images` column for multiple images support:

```sql
-- Add images column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'images'
    ) THEN
        ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Update existing products to have empty images array
UPDATE products SET images = '{}' WHERE images IS NULL;
```

### 4. Create Storage Bucket for Product Images

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket called `product-images`
4. Set the bucket to public
5. Configure the following storage policies:

```sql
-- Allow public read access to product images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Allow authenticated users to update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 5. Environment Variables

Make sure your `.env.local` file has these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 6. Test the Setup

1. Start your development server
2. Visit `/test-env` to check environment variables
3. Visit `/test-products` to check if products are loading
4. Go to the admin panel and try adding a product with multiple images
5. Check that the images are uploaded to Supabase storage
6. Verify that the product detail page shows all images

## Troubleshooting

### "relation 'products' already exists"
This means the table was already created. Run the schema check SQL above to see the current structure.

### "No products found"
If you have a table but no products, you can:
1. Add products through the admin panel
2. Or insert sample data:

```sql
-- Insert sample products (optional)
INSERT INTO products (name, type, description, image, price, category, featured) VALUES
('Ocean Wave Watch', 'Resin Watch', 'Beautiful resin watch with ocean wave design', '/images/watch1.jpeg', 1200, 'watches', true),
('Floral Keyring', 'Resin Keyring', 'Pressed flower keyring with clear resin finish', '/images/keyring1.jpg', 150, 'keyrings', true);
```

### "Storage bucket not found"
1. Create the `product-images` bucket in Supabase Storage
2. Set it to public
3. Configure the storage policies

## Features Implemented

✅ **Multiple Image Upload**: Admin can upload multiple images per product
✅ **Drag & Drop**: Support for drag and drop image uploads
✅ **Image Gallery**: Product detail page shows all images with navigation
✅ **Related Products**: Shows products from the same category
✅ **Supabase Integration**: All data is stored in Supabase
✅ **Image Management**: Ability to remove individual images
✅ **Responsive Design**: Works on all screen sizes

## Next Steps

1. Check your current database schema
2. Add the `images` column if needed
3. Test the admin panel with multiple image uploads
4. Verify the product detail pages display correctly
5. Check that related products are showing properly
6. Test the image gallery navigation
7. Ensure all images are being stored in Supabase storage

The implementation is now complete with full multiple image support! 🎉 