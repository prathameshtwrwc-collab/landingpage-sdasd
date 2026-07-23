-- CHRONOTYPE Schema Part 2: Full Schema
-- Run AFTER schema.sql

-- ─── Organizations ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(100) DEFAULT 'Corporate',
  unique_code VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  country VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Organization Admins ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organization_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  clerk_user_id VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Members ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  age VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  department VARCHAR(100),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  pincode VARCHAR(20),
  occupation VARCHAR(100),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  source_type member_source_type DEFAULT 'DIRECT',
  referral_code VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Referrals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  referred_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Assessment Versions ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  version INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Questions ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Question Options ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_value VARCHAR(50),
  option_order INTEGER NOT NULL,
  lark_score INTEGER DEFAULT 0,
  eagle_score INTEGER DEFAULT 0,
  owl_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Scoring Rules ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id) ON DELETE CASCADE,
  min_score INTEGER,
  max_score INTEGER,
  chronotype chronotype_type NOT NULL,
  label VARCHAR(100),
  description TEXT
);

-- ─── Assessments ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  assessment_version_id UUID NOT NULL REFERENCES assessment_versions(id),
  status assessment_status DEFAULT 'STARTED',
  ip_address VARCHAR(45),
  user_agent TEXT,
  time_taken_seconds INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ─── Assessment Answers ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_id UUID NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Chronotype Results ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chronotype_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  chronotype chronotype_type NOT NULL,
  total_score INTEGER,
  confidence_score INTEGER,
  lark_score INTEGER DEFAULT 0,
  eagle_score INTEGER DEFAULT 0,
  owl_score INTEGER DEFAULT 0,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Recommendations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chronotype chronotype_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  priority_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Member Recommendations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS member_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reports ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  result_id UUID REFERENCES chronotype_results(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Organization Links ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organization_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  unique_code VARCHAR(20) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Member Goals ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS member_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  goal_type VARCHAR(50),
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Activity Logs ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Login Audit ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS login_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  email VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  success BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- ─── RLS Policies (Permissive for Development) ────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronotype_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

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
