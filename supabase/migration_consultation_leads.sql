-- ─── Consultation Leads Table ─────────────────────────────────────────
-- Run this in Supabase SQL Editor to store consult modal submissions

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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_consultation_leads_created ON consultation_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_leads_status ON consultation_leads(status);

-- RLS: allow anonymous inserts (for the consult modal), restrict reads to authenticated admins
ALTER TABLE consultation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_consultation_leads" ON consultation_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "service_select_consultation_leads" ON consultation_leads FOR SELECT TO service_role USING (true);
CREATE POLICY "service_update_consultation_leads" ON consultation_leads FOR UPDATE TO service_role USING (true);
