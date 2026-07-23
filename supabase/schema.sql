-- CHRONOTYPE Schema Part 1: Enums & Extensions
-- Run this FIRST in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE member_source_type AS ENUM ('ORGANIZATION', 'DIRECT', 'REFERRAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE assessment_status AS ENUM ('STARTED', 'COMPLETED', 'ABANDONED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE chronotype_type AS ENUM ('LARK', 'EAGLE', 'OWL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
