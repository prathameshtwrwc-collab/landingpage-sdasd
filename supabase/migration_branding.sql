-- Run in Supabase SQL Editor to add branding columns
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS branding_logo TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS branding_company VARCHAR(255);
ALTER TABLE organization_links ADD COLUMN IF NOT EXISTS branding_logo TEXT;
ALTER TABLE organization_links ADD COLUMN IF NOT EXISTS branding_company VARCHAR(255);
