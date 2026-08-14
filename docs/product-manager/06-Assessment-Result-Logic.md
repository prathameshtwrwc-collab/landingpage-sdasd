# 06 — Assessment & Result Logic

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

> **Important:** This document describes only what is visible in the current codebase. The actual scoring algorithm is calculated server-side and is NOT visible in the frontend code. Scoring logic is marked **"To Be Confirmed"** where it cannot be determined.

---

## 1. Assessment Overview

The assessment is a modal-based questionnaire that collects:
1. **Personal details** (Step 0): Demographics and contact information
2. **Sleep habit questions** (Steps 1–11): Multiple-choice questions about sleep patterns, energy levels, and lifestyle

The assessment is available in **10 languages**: English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Punjabi, Oriya.

---

## 2. Question Structure

### Personal Details Form (Step 0)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| First Name | Text | Yes | Non-empty |
| Last Name | Text | Yes | Non-empty |
| Age | Number | Yes | 1–100 |
| Gender | Select | Yes | Male, Female, Other |
| Marital Status | Select | Yes | Single, Married, Divorced, Widowed |
| Department | Text | No | — |
| Country | Text | Yes | Non-empty |
| City | Text | Yes | Non-empty |
| Pincode | Text | Yes | Non-empty |
| Occupation | Select | Yes | Student, Homemaker, Salaried, Working Professional, Business Owner, Healthcare Professional, Retired, Other |
| Email | Email | Yes | Valid email format |
| Phone | Tel | Yes | Numeric, length varies by country code |
| State/Location | Text | Yes | Non-empty |
| Organization Code | Text | No | Auto-detected from URL if present |
| Referral Code | Text | No | Auto-detected from URL if present |
| Terms Agreement | Checkbox | Yes | Must be checked |

### Assessment Questions (Steps 1–11)

| # | Category | Topic |
|---|----------|-------|
| 1 | sleep | Wake time on days off |
| 2 | sleep | Bedtime on days off |
| 3 | energy | Peak alertness/productivity time |
| 4 | routine | Ideal day start time |
| 5 | sleep | Ease of waking without alarm |
| 6 | energy | Mental clarity peak time |
| 7 | routine | Preferred exercise time |
| 8 | energy | Feeling in first hour after waking |
| 9 | lifestyle | Energy at evening social events |
| 10 | sleep | Natural bedtime (without schedule pressure) |
| 11 | sleep | Sleep quality description |

**Question format:**
- Each question has 3 multiple-choice options (A, B, C)
- Options are ordered by sleep timing preference (early → late)
- Questions are loaded from the database and translated client-side
- Category badges are color-coded: sleep (green), routine (indigo), energy (orange), focus (red), health (purple), lifestyle (pink)

---

## 3. Answer Process

### Answer Selection
- User clicks an option → answer saved to local state
- Answer auto-saved to server via `/api` (non-blocking)
- Selected option visually highlighted with purple border + light purple background
- User can change answer before moving to next question

### Navigation
- Back button returns to previous question
- Forward button (or auto-advance) moves to next question
- Progress bar and step dots show advancement
- User cannot skip questions (must select an option to proceed)

### Auto-Save
- Each answer is saved to the server immediately upon selection
- If user closes modal and returns, previous answers are restored
- In-progress assessments are detected and resume options offered

---

## 4. Validation

### Personal Details Form Validation

| Rule | Error Message |
|------|---------------|
| First name empty | "First name is required" |
| Last name empty | "Last name is required" |
| Age empty | "Age is required" |
| Age out of range (1–100) | Blocked by input sanitization |
| Gender empty | "Gender is required" |
| Marital status empty | "Marital status is required" |
| Country empty | "Country is required" |
| City empty | "City is required" |
| Pincode empty | "Pincode is required" |
| Location empty | "Location is required" |
| Occupation empty | "Occupation is required" |
| Email empty | "Email is required" |
| Email invalid | "Please enter a valid email" |
| Phone empty | "Phone is required" |
| Phone non-numeric | "Phone must contain only numbers" |
| Phone length | Varies by country (min/max per `COUNTRY_CODES`) |
| Terms not agreed | "You must agree to terms and privacy" |

### Assessment Questions
- No explicit validation — user must select an option to proceed
- Server-side validation on submission

---

## 5. Submission

### Submission Flow
1. User answers all 11 questions
2. Clicks "Submit Assessment" (or auto-submit if resuming completed assessment)
3. Frontend sends POST request with:
   - `assessmentId`
   - Array of `{ question_id, selected_option_id }` pairs
4. Server processes:
   - Calculates chronotype scores
   - Determines chronotype classification
   - Generates recommendations
   - Creates schedule (wake time, bedtime, peak focus)
   - Stores result in `chronotype_results` table
5. Frontend receives result:
   - `chronotype`: "LARK", "EAGLE", or "OWL"
   - `lark_score`, `eagle_score`, `owl_score`: numeric scores
   - `total_score`: numeric
   - `confidence_score`: percentage (0–100)
   - `schedule`: `{ wakeTime, bedtime, peakFocus }`
   - `recommendations`: array of `{ title, description }`
   - `memberName`, `referralCode`, `generatedAt`

### Submission States
- Submitting → "Analyzing..." loader
- Success → Result view displayed
- Error → Error message shown, user can retry

---

## 6. Scoring / Calculation

### What is Visible in the Code

The frontend receives these values from the server:
- `chronotype`: string — "LARK", "EAGLE", or "OWL"
- `lark_score`: number
- `eagle_score`: number
- `owl_score`: number
- `total_score`: number
- `confidence_score`: number (0–100)

The frontend also uses these pre-defined templates:
- `ENERGY_TEMPLATES`: 12-point energy curves for each archetype
- `CHRONOTYPE_PEAK_TIMES`: predefined peak focus/creative/sleep times per chronotype
- `CHRONOTYPE_BLUEPRINT`: sleep window, need, and cycle length per chronotype

### Energy Curve Generation

```typescript
// Personalized 24h energy curve from member's actual scores
function generatePersonalizedEnergyCurve(
  chronotype: Chronotype,
  larkScore: number,
  eagleScore: number,
  owlScore: number,
  confidenceScore: number
): number[] {
  // 1. Weighted blend of all three archetype templates
  const blended = weighted_average(ENERGY_TEMPLATES.LARK, ENERGY_TEMPLATES.EAGLE, ENERGY_TEMPLATES.OWL, by_scores);
  
  // 2. Pull toward winning archetype proportional to confidence
  // At 0 confidence: keep blended profile
  // At 100 confidence: ~80% toward pure archetype
  const shaped = blend(blended, winner_template, confidence);
  
  return normalize(shaped, 95);
}
```

### Scoring Logic: To Be Confirmed

**The following are NOT visible in the frontend code and require confirmation from the Product/Business Team:**

1. **How are `lark_score`, `eagle_score`, `owl_score` calculated from the 11 questions?**
   - What is the weight of each question?
   - Are all questions scored equally?
   - Do demographic factors (age, gender) affect scoring?

2. **How is `total_score` calculated?**
   - Is it the sum of lark + eagle + owl scores?
   - Is it normalized to a specific range (e.g., 0–100)?

3. **How is `confidence_score` calculated?**
   - What determines high vs. low confidence?
   - Is it based on score distribution (dominance of one archetype)?
   - What is the threshold for "strong" vs. "moderate" vs. "weak" classification?

4. **How is the final `chronotype` determined?**
   - Is it the archetype with the highest score?
   - Are there minimum thresholds?
   - What happens in tie-breaking scenarios?

5. **How are `wakeTime`, `bedtime`, `peakFocus` derived?**
   - Are they mapped from specific question answers (e.g., Q1 → wake time, Q2 → bedtime, Q3 → peak focus)?
   - Or are they calculated from the chronotype classification?

6. **How are recommendations generated?**
   - Are they static per chronotype, or dynamically generated?
   - What determines which recommendations are shown?

---

## 7. Chronotype Classification

### Three Archetypes

| Chronotype | Label | Tagline | Focus Peak | Creative Peak | Sleep Window | Sleep Need | Cycle Length |
|------------|-------|---------|------------|---------------|--------------|------------|--------------|
| **LARK** | Morning Type | "Early to bed, early to rise — you own the morning." | 6:00–9:00 AM | 4:00–6:00 PM | 9:30 PM – 5:30 AM | 7h 30m | ~90 min |
| **EAGLE** | Intermediate | "Balanced and adaptable — you thrive at any hour." | 9:00–11:00 AM | 5:00–7:00 PM | 10:45 PM – 6:30 AM | 7h 45m | ~96 min |
| **OWL** | Evening Type | "The night is your kingdom — you come alive after dark." | 2:00–5:00 PM | 10:00 PM – 1:00 AM | 12:30 AM – 8:30 AM | 8h 00m | ~100 min |

### Description Text
- **Lark:** "Larks naturally wake early and peak in the morning. You're most productive before noon and tend to wind down in the evening. Schedule important tasks early and use afternoons for lighter work."
- **Eagle:** "Eagles have a flexible rhythm that adapts well to most schedules. Your energy peaks midday, making you ideal for standard 9-to-5 routines. You can handle both morning meetings and evening social events with ease."
- **Owl:** "Owls naturally peak in the evening and prefer later schedules. Your creativity and focus surge at night. You thrive with flexible schedules that allow you to sleep in and work when you're most alert."

---

## 8. Result Generation

### Result Data Structure

```typescript
{
  chronotype: "LARK" | "EAGLE" | "OWL",
  lark_score: number,
  eagle_score: number,
  owl_score: number,
  total_score: number,
  confidence_score: number, // 0–100
  schedule: {
    wakeTime: string | null,  // Derived from Q1 answer text
    bedtime: string | null,   // Derived from Q2 or Q10 answer text
    peakFocus: string | null  // Derived from Q3 answer text
  },
  recommendations: Array<{
    title: string,
    description: string
  }>,
  sourceType: string | null,
  orgName: string | null,
  orgLogoUrl: string | null,
  memberName: string,
  referralCode: string,
  generatedAt: string
}
```

### Schedule Derivation
The frontend derives schedule times from the user's actual answers:
- **Q1 (wake time):** Maps to `wakeTime`
- **Q2 (bedtime):** Maps to `bedtime`
- **Q3 (peak productivity):** Maps to `peakFocus`
- **Q10 (natural sleepiness):** Fallback for `bedtime` if Q2 not answered

---

## 9. Recommendations

### Display
- **Dashboard:** Shown in recommendations panel (`/dashboard/recommendations`)
- **PDF:** Up to 6 recommendations displayed in 2-column layout
- **Assessment modal:** Shown in result view

### Content
- Each recommendation has a `title` and `description`
- Recommendations are chronotype-specific
- Source: `member_recommendations` table linked to member ID

### Recommendation Logic: To Be Confirmed
The mapping from chronotype/scores to specific recommendations is server-side and not visible in the frontend.

---

## 10. Retakes & History

### Retake Flow
1. User clicks "Take Test Again" on dashboard
2. `createMemberAndStartAssessment` called with existing `member_id`
3. System checks for in-progress assessment
4. If found: Resume/Start Over prompt
5. If not found: Fresh assessment begins immediately
6. Previous result remains in history

### History
- Members can view list of reports on dashboard
- Each report shows: chronotype, date, PDF download button, view result button
- Reports linked to assessment IDs
- Detailed score comparison over time: **Not implemented**

---

## 11. PDF Report

### Generation
- **Method:** Client-side using `@react-pdf/renderer`
- **Trigger:** "Download Report" button on dashboard or assessment result
- **File format:** PDF (A4 pages)

### Report Contents
1. **Header:** Brand mark + organization name
2. **Metadata:** Prepared for, Assessment date, Report ID
3. **Hero:** Chronotype name, subtitle, description, peak focus
4. **Schedule:** Ideal wake time, best focus window, ideal bedtime
5. **Strengths & Watch-outs:** Two-column panel
6. **Next Steps:** 3 numbered steps
7. **Gallery Pages:** Chronotype imagery (one per page)
8. **Recommendations:** Up to 6 items in 2 columns
9. **Footer:** Disclaimer + report ID + page number

### Disclaimer
> "Wellness guidance only — not a medical diagnosis. This report reflects your sleep-wake preferences based on your assessment responses. It is not a medical diagnosis. Always consult your physician before making changes to your sleep or health routine."

---

## 12. Important Disclaimers

1. **This is NOT a medical diagnostic tool.** The assessment provides wellness guidance based on sleep-wake preferences. It does not diagnose sleep disorders or medical conditions.

2. **Scoring algorithm is proprietary.** The exact formula for converting answers into chronotype scores is server-side and not documented in the frontend code.

3. **Results are indicative, not prescriptive.** The platform provides general wellness guidance. Users with persistent sleep concerns should seek professional medical advice.

---

*This document is based on the current codebase. Scoring logic marked "To Be Confirmed" requires validation from the Product/Business/Data Science team.*
