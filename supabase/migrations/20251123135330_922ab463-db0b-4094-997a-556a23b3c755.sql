-- Add target_file_url column to ar_projects for MindAR compiled targets
ALTER TABLE ar_projects 
ADD COLUMN target_file_url text;

-- Add comment explaining the field
COMMENT ON COLUMN ar_projects.target_file_url IS 'URL to the compiled .mind target file for MindAR image tracking';
