-- ─── Consultation Leads Table ─────────────────────────────────────────
-- Run this in Supabase SQL Editor to store consult modal submissions.

CREATE TABLE IF NOT EXISTS consultation_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100) NOT NULL,
  age VARCHAR(20) NOT NULL,
  gender VARCHAR(20) NOT NULL,
  marital_status VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  schedule_date DATE NOT NULL,
  schedule_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  consulted_by VARCHAR(100),
  consult_notes TEXT,
  consulted_at TIMESTAMPTZ
);

-- For databases that already created the table without the consult-patient
-- columns (idempotent; safe to run even if the columns already exist):
ALTER TABLE consultation_leads
  ADD COLUMN IF NOT EXISTS consulted_by VARCHAR(100),
  ADD COLUMN IF NOT EXISTS consult_notes TEXT,
  ADD COLUMN IF NOT EXISTS consulted_at TIMESTAMPTZ;

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_consultation_leads_created ON consultation_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_leads_status ON consultation_leads(status);

-- RLS: permissive for development — auth enforced at API route level via Clerk
ALTER TABLE consultation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_consultation_leads" ON consultation_leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_consultation_leads" ON consultation_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
