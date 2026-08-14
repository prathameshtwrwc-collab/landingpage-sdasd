# 10 — UAT Testing

**SDASD Sleep Chronotype & Wellness Platform**  
**Version:** 1.0  
**Date:** 2026-08-14

> **Testing Status Key:**
> - **PASS** — Verified working
> - **FAIL** — Verified broken
> - **NOT TESTED** — Not verified
> - **BLOCKED** — Cannot test due to dependency
> - **TO BE VERIFIED** — Needs confirmation

---

## 1. Registration / Authentication

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.1 | Member login with existing email | 1. Go to `/login`<br>2. Enter registered email<br>3. Click Continue | Redirected to `/dashboard` | TO BE VERIFIED |
| 1.2 | Member login with new email | 1. Go to `/login`<br>2. Enter unregistered email<br>3. Click Continue | "No account found" message; prompt to take assessment | TO BE VERIFIED |
| 1.3 | Admin login with existing email | 1. Go to `/login`<br>2. Enter admin email<br>3. Enter password | Redirected to `/admin/dashboard` | TO BE VERIFIED |
| 1.4 | Super Admin login | 1. Go to `/superadmin/login`<br>2. Enter superadmin email<br>3. Enter password | Redirected to `/superadmin/dashboard` | TO BE VERIFIED |
| 1.5 | Invalid email format | 1. Go to `/login`<br>2. Enter invalid email<br>3. Click Continue | Email validation error shown | TO BE VERIFIED |
| 1.6 | Empty email | 1. Go to `/login`<br>2. Leave email empty<br>3. Click Continue | No action / validation error | TO BE VERIFIED |
| 1.7 | Wrong password | 1. Go to `/login`<br>2. Enter admin email<br>3. Enter wrong password | "Invalid password" error | TO BE VERIFIED |
| 1.8 | Logout | 1. Log in as member<br>2. Click logout | Redirected to login page; session cleared | TO BE VERIFIED |
| 1.9 | Role-based redirect | 1. Log in as member → should go to `/dashboard`<br>2. Log in as admin → should go to `/admin/dashboard`<br>3. Log in as superadmin → should go to `/superadmin/dashboard` | Correct dashboard for each role | TO BE VERIFIED |
| 1.10 | Access denied for wrong role | 1. Log in as member<br>2. Navigate to `/admin/dashboard` | "Access denied" message | TO BE VERIFIED |
| 1.11 | Password visibility toggle | 1. Go to `/login`<br>2. Enter password<br>3. Click eye icon | Password toggles between visible/hidden | TO BE VERIFIED |
| 1.12 | Forgot password link | 1. Go to `/login`<br>2. Click "Forgot password?" | Clerk password reset flow triggered | TO BE VERIFIED |

---

## 2. Member Dashboard

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Dashboard loads with data | 1. Log in as member with completed assessment<br>2. Navigate to `/dashboard` | Chronotype, scores, reports, recommendations displayed | TO BE VERIFIED |
| 2.2 | Dashboard shows empty state | 1. Log in as new member (no assessment)<br>2. Navigate to `/dashboard` | "Ready to understand your sleep?" message | TO BE VERIFIED |
| 2.3 | Download PDF report | 1. Have completed assessment<br>2. Click "Download Report" | PDF file downloads with chronotype report | TO BE VERIFIED |
| 2.4 | Share result link | 1. Have completed assessment<br>2. Click "Share Result"<br>3. Paste link in new tab | Public result page displays chronotype result | TO BE VERIFIED |
| 2.5 | Copy referral link | 1. Have completed assessment<br>2. Click "Copy Link" on referral section | Link copied to clipboard; "Copied!" feedback shown | TO BE VERIFIED |
| 2.6 | Share referral via native share | 1. Have completed assessment<br>2. Click share icon on mobile device | Native share sheet opens with pre-filled message | TO BE VERIFIED |
| 2.7 | Book consultation | 1. Click "Consult" on dashboard<br>2. Fill/verify pre-filled form<br>3. Submit | Consultation lead submitted; confirmation shown | TO BE VERIFIED |
| 2.8 | Open donation modal | 1. Click "Donate" on dashboard | Donation modal opens | TO BE VERIFIED |
| 2.9 | Retake assessment | 1. Click "Take Test Again"<br>2. Complete assessment | New assessment created; new result displayed | TO BE VERIFIED |
| 2.10 | View reports list | 1. Have multiple assessments<br>2. Scroll reports section | All reports listed with date, chronotype, PDF/view buttons | TO BE VERIFIED |
| 2.11 | View specific report | 1. Click "View" on a report<br>2. Navigate to `/r/[assessmentId]` | Public result page displays that assessment's result | TO BE VERIFIED |
| 2.12 | Dashboard loading state | 1. Log in with slow network<br>2. Navigate to `/dashboard` | Skeleton/loading indicator shown while data loads | TO BE VERIFIED |
| 2.13 | Dashboard error state | 1. Simulate API error<br>2. Navigate to `/dashboard` | Error message displayed with retry option | TO BE VERIFIED |

---

## 3. Assessment Flow

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | Open assessment modal | 1. Click "Take Test Now" on landing page | Assessment modal opens | TO BE VERIFIED |
| 3.2 | Submit empty form | 1. Open assessment<br>2. Click "Start Assessment" without filling fields | Validation errors shown for required fields | TO BE VERIFIED |
| 3.3 | Invalid email in form | 1. Enter email without @<br>2. Click "Start Assessment" | "Please enter a valid email" error | TO BE VERIFIED |
| 3.4 | Invalid phone in form | 1. Enter non-numeric phone<br>2. Click "Start Assessment" | "Phone must contain only numbers" error | TO BE VERIFIED |
| 3.5 | Phone length validation | 1. Enter phone shorter/longer than country min/max<br>2. Click "Start Assessment" | Phone length error shown | TO BE VERIFIED |
| 3.6 | Answer question | 1. Progress to question 1<br>2. Select option A | Option highlighted; answer saved; can proceed | TO BE VERIFIED |
| 3.7 | Navigate back | 1. Answer question 2<br>2. Click back arrow | Returns to question 1 with previous answer preserved | TO BE VERIFIED |
| 3.8 | Progress bar updates | 1. Answer questions 1–5<br>2. Observe progress bar | Progress bar advances proportionally | TO BE VERIFIED |
| 3.9 | Submit all questions | 1. Answer all 11 questions<br>2. Click submit | Result view displayed with chronotype and scores | TO BE VERIFIED |
| 3.10 | Auto-save answers | 1. Answer question 3<br>2. Close modal<br>3. Reopen assessment | Answer to question 3 is preserved | TO BE VERIFIED |
| 3.11 | Resume in-progress assessment | 1. Start assessment, answer 3 questions<br>2. Close modal<br>3. Reopen | Resume prompt with "Resume" and "Start Over" options | TO BE VERIFIED |
| 3.12 | Resume completed assessment | 1. Complete assessment<br>2. Reopen assessment | Result view displayed directly (no questions) | TO BE VERIFIED |
| 3.13 | URL with referral code | 1. Visit `/?ref=ABC123`<br>2. Open assessment | Referral code "ABC123" auto-filled and locked | TO BE VERIFIED |
| 3.14 | URL with org code | 1. Visit `/ORG001`<br>2. Open assessment | Org code "ORG001" auto-filled and locked | TO BE VERIFIED |
| 3.15 | Terms modal | 1. Click terms link in assessment form | Terms modal opens with text | TO BE VERIFIED |
| 3.16 | Submit without agreeing to terms | 1. Fill form<br>2. Leave terms unchecked<br>3. Click "Start Assessment" | "You must agree to terms and privacy" error | TO BE VERIFIED |
| 3.17 | Language switching during assessment | 1. Open assessment in English<br>2. Switch to Hindi | Questions and options translated to Hindi | TO BE VERIFIED |
| 3.18 | TTS on question | 1. Navigate to any question<br>2. Click TTS button | Question text spoken aloud | TO BE VERIFIED |

---

## 4. Results & Recommendations

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1 | Result displays chronotype | 1. Complete assessment | Result shows Lark, Eagle, or Owl with correct label | TO BE VERIFIED |
| 4.2 | Result displays scores | 1. Complete assessment | lark_score, eagle_score, owl_score, total_score displayed | TO BE VERIFIED |
| 4.3 | Result displays confidence | 1. Complete assessment | confidence_score shown as percentage | TO BE VERIFIED |
| 4.4 | Result displays schedule | 1. Complete assessment | wakeTime, bedtime, peakFocus displayed | TO BE VERIFIED |
| 4.5 | Recommendations displayed | 1. Complete assessment<br>2. View dashboard | Recommendations list populated | TO BE VERIFIED |
| 4.6 | Result color coding | 1. Get Lark result → orange theme<br>2. Get Eagle result → indigo theme<br>3. Get Owl result → purple theme | Correct color theme applied | TO BE VERIFIED |

---

## 5. PDF Report

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1 | Generate PDF | 1. Have completed assessment<br>2. Click "Download Report" | PDF file downloads successfully | TO BE VERIFIED |
| 5.2 | PDF contains correct data | 1. Generate PDF<br>2. Open in PDF viewer | Name, chronotype, scores, schedule, recommendations present | TO BE VERIFIED |
| 5.3 | PDF multi-page | 1. Generate PDF with gallery images<br>2. Check page count | Multiple A4 pages (hero + gallery + recommendations) | TO BE VERIFIED |
| 5.4 | PDF disclaimer | 1. Generate PDF<br>2. Check each page | "Wellness guidance only — not a medical diagnosis." present on every page | TO BE VERIFIED |
| 5.5 | PDF org branding | 1. Member belongs to org with logo<br>2. Generate PDF | Org name and logo appear in PDF header | TO BE VERIFIED |
| 5.6 | PDF download from report list | 1. Navigate to reports list<br>2. Click PDF button on specific report | That report's PDF downloads | TO BE VERIFIED |

---

## 6. Admin Functionality

### Organization Admin

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1 | Admin dashboard loads | 1. Log in as org admin<br>2. Navigate to `/admin/dashboard` | Stats, charts, org link displayed | TO BE VERIFIED |
| 6.2 | View participants | 1. Navigate to `/admin/dashboard/participants` | Paginated member list with search | TO BE VERIFIED |
| 6.3 | Search participants | 1. Enter name/email in search<br>2. Press Enter | Filtered results shown | TO BE VERIFIED |
| 6.4 | View participant info | 1. Click info icon on participant | Info modal with demographics and last assessment | TO BE VERIFIED |
| 6.5 | Copy org link | 1. Click copy on org link<br>2. Paste elsewhere | Org unique code copied | TO BE VERIFIED |
| 6.6 | Toggle org link | 1. Click toggle on org link<br>2. Confirm | Link status changes (Active ↔ Paused) | TO BE VERIFIED |
| 6.7 | Update org settings | 1. Navigate to settings<br>2. Update org name/type<br>3. Save | Settings updated; reflected in dashboard | TO BE VERIFIED |

### Super Admin

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.8 | Super Admin dashboard loads | 1. Log in as superadmin<br>2. Navigate to `/superadmin/dashboard` | Platform stats, charts, quick links displayed | TO BE VERIFIED |
| 6.9 | Create organization | 1. Navigate to Organizations<br>2. Fill form<br>3. Submit | New org created with unique code | TO BE VERIFIED |
| 6.10 | Edit organization | 1. Click edit on org<br>2. Modify fields<br>3. Save | Org updated | TO BE VERIFIED |
| 6.11 | Delete organization | 1. Click delete on org<br>2. Confirm | Org deleted with confirmation dialog | TO BE VERIFIED |
| 6.12 | Toggle org link | 1. Click power button on org<br>2. Confirm | Link toggled active/paused | TO BE VERIFIED |
| 6.13 | Create admin | 1. Navigate to Users<br>2. Fill admin form<br>3. Submit | New admin created; can log in | TO BE VERIFIED |
| 6.14 | Edit admin | 1. Click edit on admin<br>2. Modify fields<br>3. Save | Admin updated | TO BE VERIFIED |
| 6.15 | Delete admin | 1. Click delete on admin<br>2. Confirm | Admin deleted | TO BE VERIFIED |
| 6.16 | View member info | 1. Click eye icon on member<br>2. View modal | Member details + last assessment answers shown | TO BE VERIFIED |
| 6.17 | Edit member | 1. Click edit on member<br>2. Modify fields<br>3. Save | Member updated | TO BE VERIFIED |
| 6.18 | Delete member | 1. Click delete on member<br>2. Confirm | Member deleted | TO BE VERIFIED |
| 6.19 | Search admins | 1. Enter name in admin search<br>2. Press Enter | Filtered admin list shown | TO BE VERIFIED |
| 6.20 | Filter members by org/source | 1. Select org filter<br>2. Select source filter | Filtered member list shown | TO BE VERIFIED |
| 6.21 | CSV export (full) | 1. Select "Full Details"<br>2. Click CSV | CSV file downloads with all columns | TO BE VERIFIED |
| 6.22 | CSV export (contacts) | 1. Select "Contacts Only"<br>2. Click CSV | CSV file downloads with contact fields only | TO BE VERIFIED |
| 6.23 | Pagination | 1. Navigate to page 2<br>2. Click next page | Correct page of results shown | TO BE VERIFIED |

---

## 7. Role Restrictions

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 7.1 | Member cannot access admin dashboard | 1. Log in as member<br>2. Navigate to `/admin/dashboard` | "Access denied" message | TO BE VERIFIED |
| 7.2 | Member cannot access superadmin dashboard | 1. Log in as member<br>2. Navigate to `/superadmin/dashboard` | "Access denied" message | TO BE VERIFIED |
| 7.3 | Admin cannot access superadmin dashboard | 1. Log in as org admin<br>2. Navigate to `/superadmin/dashboard` | "Access denied" message | TO BE VERIFIED |
| 7.4 | Admin cannot create organizations | 1. Log in as org admin<br>2. Navigate to org creation | "Access denied" or no create button | TO BE VERIFIED |
| 7.5 | Admin cannot manage other orgs | 1. Log in as org admin for Org A<br>2. Try to access Org B data | Data not accessible | TO BE VERIFIED |
| 7.6 | Unauthenticated cannot access dashboards | 1. Visit `/dashboard` without login<br>2. Visit `/admin/dashboard` without login | Redirect to login or "Please log in" message | TO BE VERIFIED |

---

## 8. Responsive Behavior

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.1 | Mobile landing page | 1. Open on mobile viewport (375px)<br>2. Scroll through sections | Content readable, no horizontal overflow, CTAs accessible | TO BE VERIFIED |
| 8.2 | Tablet landing page | 1. Open on tablet viewport (768px)<br>2. Scroll through sections | 2-column grids where applicable, readable typography | TO BE VERIFIED |
| 8.3 | Desktop landing page | 1. Open on desktop (1440px)<br>2. Scroll through sections | Full layout with max-width containers, all sections visible | TO BE VERIFIED |
| 8.4 | Mobile assessment modal | 1. Open assessment on mobile<br>2. Answer questions | Full-width modal, readable text, large touch targets | TO BE VERIFIED |
| 8.5 | Mobile dashboard | 1. Log in on mobile<br>2. View dashboard | Single-column cards, stacked layout, all actions accessible | TO BE VERIFIED |
| 8.6 | Mobile admin dashboard | 1. Log in as admin on mobile<br>2. View dashboard | Cards stack vertically, charts readable, tables scrollable | TO BE VERIFIED |
| 8.7 | Hamburger menu (mobile) | 1. Open landing page on mobile<br>2. Click hamburger | Mobile menu opens with all nav links | TO BE VERIFIED |
| 8.8 | No horizontal overflow | 1. Test all pages at 320px width | No horizontal scroll; all content fits viewport | TO BE VERIFIED |

---

## 9. Error Handling

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 9.1 | Network error on data fetch | 1. Disable network<br>2. Navigate to dashboard | "Network error" message displayed | TO BE VERIFIED |
| 9.2 | Database error | 1. Simulate DB connection failure<br>2. Navigate to dashboard | Error message with setup instructions if applicable | TO BE VERIFIED |
| 9.3 | Assessment submission error | 1. Complete assessment<br>2. Simulate server error on submit | Error message shown; user can retry | TO BE VERIFIED |
| 9.4 | PDF download error | 1. Click "Download Report"<br>2. Simulate error | Button re-enables; non-blocking | TO BE VERIFIED |
| 9.5 | 404 for invalid result link | 1. Visit `/r/invalid-id` | "Result Not Found" page | TO BE VERIFIED |
| 9.6 | Unauthorized API access | 1. Call `/api/admin` without auth | 401 JSON error response | TO BE VERIFIED |

---

## 10. Accessibility

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 10.1 | Keyboard navigation | 1. Navigate using Tab key only<br>2. Use Enter to activate | All interactive elements reachable and activatable | TO BE VERIFIED |
| 10.2 | Screen reader labels | 1. Use screen reader on landing page<br>2. Navigate sections | Content read with proper headings and labels | TO BE VERIFIED |
| 10.3 | Focus visible | 1. Tab through interactive elements<br>2. Observe focus indicators | Focus outline visible on all focusable elements | TO BE VERIFIED |
| 10.4 | Reduced motion | 1. Enable "prefers-reduced-motion"<br>2. Interact with UI | Animations disabled or minimized | TO BE VERIFIED |
| 10.5 | Language attribute | 1. Switch language to Hindi<br>2. Inspect HTML | `lang="hi"` and `dir` attribute set correctly | TO BE VERIFIED |

---

## 11. Performance

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 11.1 | Landing page load time | 1. Load `/` on 3G connection<br>2. Measure time to interactive | < 5 seconds | TO BE VERIFIED |
| 11.2 | Dashboard load time | 1. Log in and navigate to dashboard<br>2. Measure load time | < 3 seconds | TO BE VERIFIED |
| 11.3 | Assessment modal open time | 1. Click "Take Test Now"<br>2. Measure time to visible | < 1 second | TO BE VERIFIED |
| 11.4 | PDF generation time | 1. Click "Download Report"<br>2. Measure time to download start | < 5 seconds | TO BE VERIFIED |
| 11.5 | Image optimization | 1. Inspect network tab<br>2. Check image formats | WebP/AVIF used where supported; appropriate sizing | TO BE VERIFIED |

---

## 12. Data Integrity

| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 12.1 | Assessment answers saved | 1. Complete assessment<br>2. Check database | All 11 answers stored with correct question/option IDs | TO BE VERIFIED |
| 12.2 | Result linked to assessment | 1. Complete assessment<br>2. Check database | `chronotype_results.assessment_id` matches assessment | TO BE VERIFIED |
| 12.3 | Member linked to org | 1. Take assessment with org code<br>2. Check database | `members.organization_id` set correctly | TO BE VERIFIED |
| 12.4 | Referral tracking | 1. Take assessment with referral code<br>2. Check database | `members.referral_code` set correctly | TO BE VERIFIED |
| 12.5 | Report linked to result | 1. Generate PDF report<br>2. Check database | `reports.result_id` matches chronotype result | TO BE VERIFIED |

---

## Test Execution Notes

- Tests marked **TO BE VERIFIED** require execution in a test environment
- Tests requiring specific user roles need test accounts for Member, Organization Admin, and Super Admin
- Network simulation tests should be run with browser DevTools throttling
- Accessibility tests should use both automated tools (axe) and manual verification
- Performance tests should use Lighthouse and WebPageTest

---

*This UAT test plan covers the current implemented features. Proposed/future features require separate test planning.*
