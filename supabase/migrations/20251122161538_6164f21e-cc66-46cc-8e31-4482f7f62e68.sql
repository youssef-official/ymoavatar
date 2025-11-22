-- Drop old tables that aren't needed for AR app
DROP TABLE IF EXISTS public.withdrawals CASCADE;
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.rewards CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.uploads CASCADE;

-- Add new columns to ar_projects if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ar_projects' AND column_name = 'qr_code_url') THEN
    ALTER TABLE public.ar_projects ADD COLUMN qr_code_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ar_projects' AND column_name = 'view_count') THEN
    ALTER TABLE public.ar_projects ADD COLUMN view_count integer DEFAULT 0;
  END IF;
END $$;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public can view AR content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload AR content" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own AR content" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own AR content" ON storage.objects;

-- Create storage bucket policies for ar-content
CREATE POLICY "Public can view AR content"
ON storage.objects FOR SELECT
USING (bucket_id = 'ar-content');

CREATE POLICY "Authenticated users can upload AR content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ar-content' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own AR content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'ar-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own AR content"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ar-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);