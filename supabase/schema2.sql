-- CHRONOTYPE Schema Part 2: Full Schema
-- Run AFTER schema.sql
-- Mirrors the live production schema (verified 2026-08-04).

-- ─── Organizations ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL DEFAULT 'Corporate',
  unique_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  country TEXT,
  logo_url TEXT,
  settings_json JSONB NOT NULL DEFAULT '{}',
  share_message_template TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  branding_logo TEXT,
  branding_company VARCHAR(255),
  department VARCHAR(255) DEFAULT '',
  branch VARCHAR(255) DEFAULT '',
  pincode VARCHAR(20) DEFAULT '',
  city VARCHAR(100) DEFAULT '',
  state VARCHAR(100) DEFAULT ''
);

-- ─── Organization Admins ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organization_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  clerk_user_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Members ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  clerk_user_id TEXT,
  source_type member_source_type NOT NULL DEFAULT 'DIRECT',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 1 AND age <= 120),
  gender TEXT,
  marital_status TEXT,
  country TEXT,
  city TEXT,
  pincode TEXT,
  occupation TEXT,
  department TEXT,
  location TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  preferences_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Referrals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_member_id UUID REFERENCES members(id),
  referred_member_id UUID REFERENCES members(id),
  referrer_organization_id UUID REFERENCES organizations(id),
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'CREATED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Assessment Versions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Questions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id),
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice',
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Question Options ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id),
  option_text TEXT NOT NULL,
  option_value TEXT NOT NULL,
  option_order INTEGER NOT NULL,
  lark_score INTEGER NOT NULL DEFAULT 0,
  eagle_score INTEGER NOT NULL DEFAULT 0,
  owl_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Scoring Rules ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id),
  chronotype chronotype_type NOT NULL,
  min_score INTEGER,
  max_score INTEGER,
  rule_logic JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  label VARCHAR(100),
  description TEXT
);

-- ─── Assessments ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  organization_id UUID REFERENCES organizations(id),
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id),
  status assessment_status NOT NULL DEFAULT 'STARTED',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Assessment Answers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  selected_option_id UUID REFERENCES question_options(id),
  answer_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Chronotype Results ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chronotype_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL UNIQUE REFERENCES assessments(id),
  member_id UUID NOT NULL REFERENCES members(id),
  organization_id UUID REFERENCES organizations(id),
  chronotype chronotype_type NOT NULL,
  total_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  lark_score INTEGER NOT NULL,
  eagle_score INTEGER NOT NULL,
  owl_score INTEGER NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Recommendations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronotype chronotype_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  priority_order INTEGER NOT NULL DEFAULT 0,
  action_items JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Member Recommendations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS member_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reports ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  assessment_id UUID REFERENCES assessments(id),
  report_type TEXT NOT NULL DEFAULT 'CHRONOTYPE',
  title TEXT,
  report_url TEXT,
  file_size BIGINT,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  shared_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  report_snapshot JSONB DEFAULT '{}',
  result_id UUID REFERENCES chronotype_results(id)
);

-- ─── Email Verifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);

-- ─── Organization Links ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organization_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  unique_code TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  branding_logo TEXT,
  branding_company VARCHAR(255)
);

-- ─── Member Goals ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS member_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'sleep',
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Activity Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  ip_address TEXT,
  details_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Login Audit ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL,
  user_id UUID,
  organization_id UUID REFERENCES organizations(id),
  clerk_session_id TEXT,
  ip_address TEXT,
  login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Consultation Leads ───────────────────────────────────────────
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

-- ─── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_organization ON members(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_member ON assessments(member_id);
CREATE INDEX IF NOT EXISTS idx_assessments_org ON assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_results_member ON chronotype_results(member_id);
CREATE INDEX IF NOT EXISTS idx_results_assessment ON chronotype_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_version ON questions(assessment_version_id);
CREATE INDEX IF NOT EXISTS idx_options_question ON question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_org_links_code ON organization_links(unique_code);
CREATE INDEX IF NOT EXISTS idx_org_admins_clerk ON organization_admins(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_leads_created ON consultation_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_leads_status ON consultation_leads(status);

-- ─── Support Tickets ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''::text,
  request_callback BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open'::text,
  raised_by TEXT NOT NULL,
  raised_by_role TEXT NOT NULL CHECK (raised_by_role = ANY (ARRAY['member'::text, 'admin'::text, 'superadmin'::text])),
  assigned_to TEXT,
  organization_id UUID,
  member_id UUID,
  forwarded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_org ON support_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_raised_by ON support_tickets(raised_by, raised_by_role);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- ─── RLS Policies (Permissive for Development) ────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronotype_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_members" ON members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_members" ON members FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_members" ON members FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_insert_assessments" ON assessments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_assessments" ON assessments FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_assessments" ON assessments FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_insert_answers" ON assessment_answers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_answers" ON assessment_answers FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_results" ON chronotype_results FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_results" ON chronotype_results FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_recommendations" ON member_recommendations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_recommendations" ON member_recommendations FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_reports" ON reports FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_all_consultation_leads" ON consultation_leads FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_consultation_leads" ON consultation_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_tickets" ON support_tickets FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_tickets" ON support_tickets FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_tickets" ON support_tickets FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_tickets" ON support_tickets FOR DELETE TO anon USING (true);

-- Public read access for reference tables
CREATE POLICY "anon_select_questions" ON questions FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_options" ON question_options FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_recommendations_ref" ON recommendations FOR SELECT TO anon USING (true);
CREATE POLICY "anon_select_versions" ON assessment_versions FOR SELECT TO anon USING (true);

-- ─── Seed Organizations ───────────────────────────────────────────
INSERT INTO organizations (name, organization_type, unique_code, email, country) VALUES
  ('WelcomeCure Health', 'Healthcare', 'ORG-WC001', 'admin@welcomecure.com', 'India'),
  ('Demo Corp', 'Corporate', 'ORG-DEMO1', 'demo@example.com', 'United States')
ON CONFLICT (unique_code) DO NOTHING;
