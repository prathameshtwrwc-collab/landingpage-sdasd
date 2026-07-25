-- Run in Supabase SQL Editor to enable persistent platform settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow anon read (used by server client)
CREATE POLICY "anon_read_settings" ON platform_settings FOR SELECT USING (true);

-- Insert defaults
INSERT INTO platform_settings (key, value) VALUES
  ('platform', '{"name":"Chronotype","supportEmail":"support@chronotype.com","defaultOrgType":"Corporate","timezone":"UTC","currency":"USD"}'),
  ('scoring', '{"maxPossibleScore":40,"owlMin":0,"owlMax":13,"eagleMin":14,"eagleMax":26,"larkMin":27,"larkMax":40}'),
  ('assessment', '{"defaultQuestionsCount":11,"requireEmail":true,"allowAnonymous":true}'),
  ('notifications', '{"newOrgAlert":true,"newMemberAlert":true,"dailyDigest":false,"adminEmail":""}')
ON CONFLICT (key) DO NOTHING;
