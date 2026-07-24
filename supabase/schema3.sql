-- CHRONOTYPE Schema Part 3: 11-Question Seed Data
-- Run AFTER schema2.sql

-- ─── Assessment Version ───────────────────────────────────────────
INSERT INTO assessment_versions (name, description, version, status)
VALUES ('Sleep Chronotype Assessment', '11-question chronotype assessment v1', 1, 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Get the version ID
DO $$
DECLARE
  v_id UUID;
  existing_count INTEGER;
  q1_id UUID; q2_id UUID; q3_id UUID; q4_id UUID; q5_id UUID;
  q6_id UUID; q7_id UUID; q8_id UUID; q9_id UUID; q10_id UUID; q11_id UUID;
BEGIN
  SELECT id INTO v_id FROM assessment_versions WHERE name = 'Sleep Chronotype Assessment' AND version = 1;

  -- Skip seeding if questions already exist (makes this script idempotent)
  SELECT COUNT(*) INTO existing_count FROM questions WHERE assessment_version_id = v_id;
  IF existing_count > 0 THEN
    RAISE NOTICE 'Questions already seeded for this version. Skipping.';
    RETURN;
  END IF;

  -- ─── Question 1 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'What time do you usually wake up on a free day (no alarm, no obligations)?', 1, 'Wake Time')
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q1_id, 'Before 6:30 AM', 'A', 1, 3, 1, 0),
    (q1_id, 'Between 6:30 AM – 8:00 AM', 'B', 2, 1, 3, 1),
    (q1_id, 'After 8:00 AM', 'C', 3, 0, 1, 3);

  -- ─── Question 2 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'When do you usually go to bed on a free day (no need to wake early)?', 2, 'Bed Time')
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q2_id, 'Before 10:00 PM', 'A', 1, 3, 1, 0),
    (q2_id, 'Between 10:00 PM – 11:30 PM', 'B', 2, 1, 3, 1),
    (q2_id, 'After 11:30 PM or 9:00 AM', 'C', 3, 0, 1, 3);

  -- ─── Question 3 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'When do you feel most alert and productive?', 3, 'Peak Productivity')
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q3_id, 'Early morning (6:00 AM – 9:00 AM)', 'A', 1, 3, 1, 0),
    (q3_id, 'Midday to late afternoon (10:00 AM – 5:00 PM)', 'B', 2, 1, 3, 1),
    (q3_id, 'Evening / Night (6:00 PM – 12:00 AM)', 'C', 3, 0, 1, 3);

  -- ─── Question 4 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'If you could design your ideal work schedule, when would you start your day?', 4, 'Schedule Preference')
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q4_id, 'Before 8:00 AM', 'A', 1, 3, 1, 0),
    (q4_id, 'Between 8:00 AM – 10:00 AM', 'B', 2, 1, 3, 1),
    (q4_id, 'After 10:00 AM or after 12:00 noon', 'C', 3, 0, 1, 3);

  -- ─── Question 5 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'How easy is it for you to wake up in the morning without an alarm?', 5, 'Morning Ease')
  RETURNING id INTO q5_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q5_id, 'Very easy — I wake up on my own', 'A', 1, 3, 1, 0),
    (q5_id, 'Somewhat easy — I need a little push', 'B', 2, 1, 3, 1),
    (q5_id, 'Very difficult — I hit snooze several times', 'C', 3, 0, 1, 3);

  -- ─── Question 6 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'What time of day do you feel the most mentally clear and focused?', 6, 'Mental Clarity')
  RETURNING id INTO q6_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q6_id, 'Early morning (before 8:00 AM)', 'A', 1, 3, 1, 0),
    (q6_id, 'Midday (10:00 AM – 2:00 PM)', 'B', 2, 1, 3, 1),
    (q6_id, 'Late afternoon to night (after 2:00 PM)', 'C', 3, 0, 1, 3);

  -- ─── Question 7 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'What time of day do you prefer to exercise, if given the choice?', 7, 'Exercise Preference')
  RETURNING id INTO q7_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q7_id, 'Early morning (before 8:00 AM)', 'A', 1, 3, 1, 0),
    (q7_id, 'Midday to early evening (10:00 AM – 6:00 PM)', 'B', 2, 1, 3, 1),
    (q7_id, 'Evening (after 6:00 PM)', 'C', 3, 0, 1, 3);

  -- ─── Question 8 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'How do you typically feel in the first hour after waking?', 8, 'Morning State')
  RETURNING id INTO q8_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q8_id, 'Alert and ready to go', 'A', 1, 3, 1, 0),
    (q8_id, 'Slightly groggy but okay', 'B', 2, 1, 3, 1),
    (q8_id, 'Very sluggish or foggy', 'C', 3, 0, 1, 3);

  -- ─── Question 9 ──────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'How do you feel during evening social events, such as dinners or parties?', 9, 'Evening Social')
  RETURNING id INTO q9_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q9_id, 'Tired or withdrawn', 'A', 1, 3, 1, 0),
    (q9_id, 'Neutral or slightly energized', 'B', 2, 1, 3, 1),
    (q9_id, 'Most alive and sociable', 'C', 3, 0, 1, 3);

  -- ─── Question 10 ─────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'When do you naturally feel sleepy, not forced by your schedule?', 10, 'Natural Sleepiness')
  RETURNING id INTO q10_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q10_id, 'Before 9:30 PM', 'A', 1, 3, 1, 0),
    (q10_id, 'Between 9:30 PM – 11:00 PM', 'B', 2, 1, 3, 1),
    (q10_id, 'After 11:00 PM', 'C', 3, 0, 1, 3);

  -- ─── Question 11 ─────────────────────────────────────────────
  INSERT INTO questions (id, assessment_version_id, question_text, question_order, category)
  VALUES (gen_random_uuid(), v_id, 'Which best describes your current work or study schedule?', 11, 'Work Schedule')
  RETURNING id INTO q11_id;

  INSERT INTO question_options (question_id, option_text, option_value, option_order, lark_score, eagle_score, owl_score) VALUES
    (q11_id, 'Mostly morning — starts before 8:00 AM', 'A', 1, 3, 1, 0),
    (q11_id, 'Flexible or regular daytime — starts between 8:00 AM and 10:00 AM', 'B', 2, 1, 3, 1),
    (q11_id, 'Mostly evening/night shift or irregular schedule', 'C', 3, 0, 1, 3);

  -- ─── Scoring Rules ──────────────────────────────────────────────
  INSERT INTO scoring_rules (assessment_version_id, min_score, max_score, chronotype, rule_logic, is_active) VALUES
    (v_id, 24, 33, 'LARK', '{"label": "Early Bird", "description": "You naturally wake early and peak in the morning."}', true),
    (v_id, 18, 23, 'EAGLE', '{"label": "Balanced Type", "description": "You are flexible and adapt well to most schedules."}', true),
    (v_id, 11, 17, 'OWL', '{"label": "Night Owl", "description": "You naturally peak in the evening and prefer later schedules."}', true)
  ON CONFLICT DO NOTHING;

  -- ─── Recommendations ─────────────────────────────────────────
  INSERT INTO recommendations (chronotype, title, description, category, priority_order) VALUES
    ('LARK', 'Optimize Your Morning', 'Schedule your most important tasks before noon when your energy peaks.', 'Productivity', 1),
    ('LARK', 'Wind Down Early', 'Your body naturally winds down early. Aim for bedtime before 10:30 PM.', 'Sleep', 2),
    ('LARK', 'Afternoon Power Nap', 'A short 20-minute nap around 1-2 PM can recharge you for the evening.', 'Energy', 3),
    ('LARK', 'Morning Exercise', 'Exercise in the morning works best with your natural energy peak.', 'Fitness', 4),
    ('EAGLE', 'Keep a Consistent Schedule', 'Your flexibility is a strength. Maintain consistent wake and bed times for best results.', 'Routine', 1),
    ('EAGLE', 'Midday Focus Blocks', 'Your peak productivity window is midday. Block 10 AM - 2 PM for deep work.', 'Productivity', 2),
    ('EAGLE', 'Balance Social Energy', 'You adapt well to both morning and evening social events. Listen to your energy levels.', 'Social', 3),
    ('EAGLE', 'Flexible Exercise Window', 'You can exercise at various times. Choose what fits your daily schedule best.', 'Fitness', 4),
    ('OWL', 'Evening Creativity Sessions', 'Your creative peak is late evening. Schedule brainstorming and creative work after 8 PM.', 'Productivity', 1),
    ('OWL', 'Morning Light Exposure', 'Get bright light exposure within 30 minutes of waking to help regulate your body clock.', 'Circadian', 2),
    ('OWL', 'Limit Evening Screens', 'Reduce blue light 1 hour before your target bedtime to improve sleep quality.', 'Sleep', 3),
    ('OWL', 'Gradual Morning Routine', 'Give yourself 30-60 minutes to fully wake up. Avoid early morning high-stakes decisions.', 'Routine', 4)
  ON CONFLICT DO NOTHING;

END $$;
