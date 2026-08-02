# Database Schema

# Database Schema

## Database

Database Provider:

Supabase PostgreSQL

Primary Design Principles:

- Organization First
- Multi-Tenant Architecture
- White Label Ready
- Future Branch Support
- Assessment Versioning
- Referral Support
- Analytics Ready

---

# Table: organizations

Purpose:

Stores all organizations using the platform.

Examples:

- Corporates
- MNCs
- NGOs
- Hospitals
- Clinics
- Doctors
- Educational Institutions
- Wellness Organizations

Fields:

id UUID PK

name

organization_type

unique_code

status

contact_person

email

phone

address

created_at

updated_at

---

# Table: organization_admins

Purpose:

Stores organization administrators.

One organization may have multiple admins.

Fields:

id UUID PK

organization_id FK

clerk_user_id

first_name

last_name

email

phone

role

status

created_at

updated_at

---

# Table: members

Purpose:

Stores all end users.

Includes:

- Organization Members
- Direct Members
- Referral Members

Fields:

id UUID PK

organization_id FK NULLABLE

clerk_user_id NULLABLE

source_type

first_name

last_name

age (INT, CHECK 1-120)

gender

marital_status

country

city

pincode

occupation

department

location

email (UNIQUE)

phone

referral_code (UNIQUE NULLABLE)

preferences_json

created_at

updated_at

---

# Source Types

Possible values:

ORGANIZATION

DIRECT

REFERRAL

---

# Table: referrals

Purpose:

Tracks referral relationships.

Fields:

id UUID PK

referrer_member_id FK

referred_member_id FK NULLABLE

referral_code

status

created_at

---

# Important Rule

Referral members must not automatically inherit organization membership.

---

# Table: assessment_versions

Purpose:

Allows questionnaire updates without code changes.

Fields:

id UUID PK

name

version

description

status

created_at

---

# Table: questions

Purpose:

Stores assessment questions.

Fields:

id UUID PK

assessment_version_id FK

question_text

question_order

question_type (DEFAULT 'single_choice')

category

is_active

created_at

---

# Table: question_options

Purpose:

Stores question answer options with per-chronotype scores.

Fields:

id UUID PK

question_id FK

option_text

option_value

option_order

lark_score INTEGER DEFAULT 0

eagle_score INTEGER DEFAULT 0

owl_score INTEGER DEFAULT 0

created_at

---

# Table: scoring_rules

Purpose:

Stores chronotype scoring ranges for each assessment version.

Defines which total score ranges map to which chronotype.

IMPORTANT — Live schema (verified 2026-08-02):

The production table was created with the older `rule_logic jsonb` + `is_active` columns
and was later ALTERed to add `label VARCHAR(100)` and `description TEXT`.

Fields (live):

id UUID PK

assessment_version_id FK → assessment_versions

chronotype (chronotype_type enum)

min_score INTEGER

max_score INTEGER

rule_logic JSONB DEFAULT '{}'  (legacy — unused by app code)

is_active BOOLEAN DEFAULT true (legacy — unused by app code)

label VARCHAR(100)  (used by app)

description TEXT  (used by app)

created_at

App code reads/writes only: assessment_version_id, min_score, max_score, chronotype, label, description.
Keep the legacy columns in place; do not drop them.

Rules:
- Ranges must be non-overlapping and cover 0 → max possible score.
- Only one ACTIVE assessment_version at a time; publishing archives the previous.

---

# Table: assessments

Purpose:

Stores assessment attempts.

Fields:

id UUID PK

member_id FK

organization_id FK NULLABLE

assessment_version_id FK

status (assessment_status enum)

started_at

completed_at

ip_address

user_agent

time_taken_seconds

created_at

---

# Assessment Status

STARTED

COMPLETED

ABANDONED

---

# Table: assessment_answers

Purpose:

Stores user answers.

Fields:

id UUID PK

assessment_id FK

question_id FK

selected_option_id FK

answer_value

created_at

---

# Table: chronotype_results

Purpose:

Stores final chronotype outcome.

Fields:

id UUID PK

assessment_id FK

member_id FK

organization_id FK NULLABLE

chronotype

total_score

confidence_score

lark_score

eagle_score

owl_score

generated_at

---

# Chronotypes

LARK

EAGLE

OWL

---

# Table: recommendations

Purpose:

Stores recommendation library.

Fields:

id UUID PK

chronotype

title

description

category

is_active

created_at

---

# Table: member_recommendations

Purpose:

Stores recommendations assigned to members.

Fields:

id UUID PK

member_id FK

recommendation_id FK

assigned_at

---

# Table: reports

Purpose:

Stores generated reports.

Fields:

id UUID PK

member_id FK

assessment_id FK NULLABLE

report_type (DEFAULT 'CHRONOTYPE')

title

report_url

file_size

is_shared (DEFAULT false)

shared_at

generated_at

report_snapshot

result_id FK → chronotype_results

---

# Table: organization_links

Purpose:

Stores organization share links.

Fields:

id UUID PK

organization_id FK

unique_code

active

created_at

---

# Example

website.com/AB0001

website.com/TCS0001

---

# Table: login_audit

Purpose:

Tracks platform logins.

Fields:

id UUID PK

user_type

user_id

ip_address

login_at

---

# Table: activity_logs

Purpose:

Tracks important actions.

Fields:

id UUID PK

user_type

user_id

action

entity_type

entity_id

created_at

---

# Table: member_goals

Purpose:

Stores member-created goals (sleep / energy / routine).

Fields:

id UUID PK

member_id FK → members

title

description

category (DEFAULT 'sleep')

target_date

status (DEFAULT 'ACTIVE')

created_at

updated_at

---

# Table: consultation_leads

Purpose:

Stores consultation/booking leads from the Consult modal.

Fields:

id UUID PK

fname

lname

age

gender

marital_status

country

state

city

pincode

email

phone

schedule_date

schedule_time

status (DEFAULT 'PENDING')

notes

created_at

updated_at

---

# Future Table: branches

Not required for Version 1.

Reserved for future enterprise support.

Fields:

id UUID PK

organization_id FK

name

branch_code

city

country

status

created_at

---

# Relationships

Organization
↓
Organization Admins

Organization
↓
Members

Member
↓
Assessments

Assessment
↓
Answers

Assessment
↓
Chronotype Result

Chronotype Result
↓
Recommendations

Assessment
↓
Report

Member
↓
Referrals

---

# Row Level Security Strategy

Super Admin

Access:
All records

---

Admin

Access:
Only records where

organization_id = current_admin.organization_id

---

Member

Access:
Only records where

member_id = current_member.id

---

# Important Business Rules

Organization Members remain linked to organization permanently.

Direct Members have organization_id = NULL.

Referral Members have organization_id = NULL.

Assessment history must never be deleted.

Reports must remain accessible after generation.

Questionnaire versions must be preserved for historical reporting.

All analytics should be generated from assessment and chronotype data.
