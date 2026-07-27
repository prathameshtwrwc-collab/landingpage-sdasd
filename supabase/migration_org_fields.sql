-- Add department, branch, pincode, city, state columns to organizations table
-- Run this in Supabase SQL Editor

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS department VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS branch VARCHAR(255) DEFAULT '',
  ADD COLUMN IF NOT EXISTS pincode VARCHAR(20) DEFAULT '',
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT '',
  ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT '';
