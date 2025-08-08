const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupCategories() {
  try {
    console.log('🚀 Setting up categories in Supabase...')

    // First, check if categories table exists
    const { data: existingTables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'categories')

    if (tableError) {
      console.log('📋 Creating categories table...')
      
      // Create the categories table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
          CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
          
          ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY IF NOT EXISTS "Allow public read access" ON categories
            FOR SELECT USING (true);
            
          CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert categories" ON categories
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
            
          CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete categories" ON categories
            FOR DELETE USING (auth.role() = 'authenticated');
        `
      })

      if (createError) {
        console.error('❌ Error creating categories table:', createError)
        return
      }
      
      console.log('✅ Categories table created successfully')
    } else {
      console.log('✅ Categories table already exists')
    }

    // Check if categories already exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')

    if (fetchError) {
      console.error('❌ Error fetching existing categories:', fetchError)
      return
    }

    if (existingCategories && existingCategories.length > 0) {
      console.log('✅ Categories already exist:', existingCategories.map(c => c.name))
      return
    }

    // Insert default categories
    const defaultCategories = [
      { name: 'Watches', slug: 'watches' },
      { name: 'Keyrings', slug: 'keyrings' },
      { name: 'Photo Frames', slug: 'photo-frames' },
      { name: 'Other', slug: 'other' }
    ]

    console.log('📝 Inserting default categories...')
    
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(defaultCategories)
      .select()

    if (insertError) {
      console.error('❌ Error inserting categories:', insertError)
      return
    }

    console.log('✅ Default categories inserted successfully:')
    insertedCategories.forEach(category => {
      console.log(`  - ${category.name} (${category.slug})`)
    })

    console.log('\n🎉 Categories setup completed successfully!')
    console.log('You can now use the category filters in your gallery page.')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Alternative approach using direct SQL if RPC doesn't work
async function setupCategoriesWithSQL() {
  try {
    console.log('🚀 Setting up categories using direct SQL...')

    // This would require running the SQL directly in Supabase SQL Editor
    console.log('📋 Please run the following SQL in your Supabase SQL Editor:')
    console.log(`
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Allow public read access" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, slug) VALUES
  ('Watches', 'watches'),
  ('Keyrings', 'keyrings'),
  ('Photo Frames', 'photo-frames'),
  ('Other', 'other')
ON CONFLICT (slug) DO NOTHING;
    `)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the setup
if (process.argv.includes('--sql')) {
  setupCategoriesWithSQL()
} else {
  setupCategories()
}
