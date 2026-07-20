# Future Plans — Sleep Wellness Landing → Full Stack Application

## Vision Overview

Transform the current static landing page into a comprehensive full-stack sleep wellness platform with user authentication, personalized dashboards, real-time data visualization, and professional-grade backend services.

---

## Phase 1: Mobile UI Refinement (Immediate)

### Current Status
- Mobile breakpoints defined in `RESPONSIVE_RULES.md` (320px–767px)
- Components use inline styles with media queries
- Some fixed widths need conversion to responsive units

### Mobile Fixes Required

#### 1. Navbar Mobile Adjustments
- **File:** `src/components/navbar/SiteNavbar.tsx`
- **Issues:**
  - Hamburger icon size: 44×44px may be too large for small screens
  - Mobile panel padding: 18px 20px 24px needs refinement for 320px viewport
  - Link touch targets: min-height 48px is correct but spacing needs adjustment

#### 2. Hero Section Mobile
- **File:** `src/components/hero/HeroSection.tsx`
- **Issues:**
  - Mobile visual background: `aspect-ratio: 16/10` may not fit all devices
  - Heading clamp: `clamp(40px, 10.3vw, 48px)` may overflow on narrow screens
  - Benefits grid: `repeat(3, minmax(0, 1fr))` creates 3 columns on 390px+ but needs single column below 390px

#### 3. Chronotype Introduction Mobile
- **File:** `src/components/chronotype/ChronotypeIntroductionSection.tsx`
- **Issues:**
  - Fixed `w-[410px]` image container needs `max-w-full` on mobile
  - Height `h-[320px]` should use `aspect-ratio: 4/3` instead
  - Padding `52px 48px` too wide for mobile, needs `px-18` or `px-20`

#### 4. All Sections Mobile
- Add `min-w-0` to all grid/flex children to prevent overflow
- Ensure `overflow-x-clip` on container elements
- Use `max-w-full` on all content containers
- Convert fixed heights to `aspect-ratio` or `min-h-[value]`

### Desktop Preservation Rule
**NEVER modify desktop (≥1024px) styles in this phase.** All changes must be in `@media (max-width: 767px)` blocks or use mobile-first Tailwind classes.

---

## Phase 2: Authentication System (Short-term)

### User Roles
1. **Member** - Basic user with test results and progress tracking
2. **Admin** - Platform management, user moderation, content updates
3. **Superadmin** - System configuration, database management, billing

### Authentication Architecture

#### Frontend (Next.js App Router)
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   └── dashboard/
│       ├── (member)/
│       │   ├── page.tsx
│       │   └── results/
│       │       └── page.tsx
│       ├── (admin)/
│       │   ├── users/
│       │   │   └── page.tsx
│       │   └── content/
│       │       └── page.tsx
│       └── (superadmin)/
│           ├── settings/
│           │   └── page.tsx
│           └── analytics/
│               └── page.tsx
└── lib/
    ├── auth/
    │   ├── providers.ts
    │   ├── middleware.ts
    │   └── guards.ts
    └── db/
        └── queries.ts
```

#### Database Schema (`src/db/schema.ts`)
```typescript
import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { enum: ["member", "admin", "superadmin"] }).notNull().default("member"),
  name: varchar("name", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chronotypeResults = pgTable("chronotype_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  chronotype: varchar("chronotype", { length: 100 }),
  sleepPatterns: jsonb("sleep_patterns"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### Authentication Flow
1. **Signup:** Email verification via SendGrid/Resend
2. **Login:** JWT token stored in HTTP-only cookie
3. **Middleware:** `src/lib/auth/middleware.ts` protects routes by role
4. **Providers:** NextAuth.js or custom JWT implementation

---

## Phase 3: Backend API Layer (Short-term)

### API Endpoints (`src/app/api/`)

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   ├── forgot-password/route.ts
│   └── reset-password/route.ts
├── users/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── chronotypes/
│   ├── route.ts (POST result)
│   └── [userId]/route.ts (GET results)
├── dashboard/
│   └── stats/route.ts (aggregate data)
└── admin/
    ├── users/route.ts (admin actions)
    └── settings/route.ts (superadmin only)
```

### Backend Services

1. **Auth Service** - Password hashing, JWT generation, token validation
2. **Email Service** - SendGrid/Resend integration for verification, password reset
3. **Analytics Service** - Track user interactions, sleep patterns, engagement metrics
4. **Notification Service** - Email/SMS reminders for sleep schedules

---

## Phase 4: Dashboard & Visualizations (Medium-term)

### Member Dashboard Features
- Personal chronotype profile
- Sleep pattern trends (line charts)
- Activity recommendations
- Progress tracking over time
- Test history

### Admin Dashboard Features
- User management (list, search, suspend)
- Content management
- Analytics overview
- Support ticket system
- Feature flag management

### Superadmin Dashboard Features
- System health monitoring
- Database statistics
- User analytics (LTV, retention)
- Billing and subscription management
- API usage metrics

### Visualization Stack
- **Charting:** Chart.js or Recharts
- **Data Grid:** TanStack Table
- **UI Components:** Headless UI + Tailwind

---

## Phase 5: Database Integration (Medium-term)

### Current State
- PostgreSQL configured in `drizzle.config.json`
- Empty schema in `src/db/schema.ts`
- Connection pool in `src/db/index.ts`

### Database Migration Steps
1. Deploy PostgreSQL (local Docker or cloud - Supabase, Neon, Railway)
2. Run `npx drizzle-kit push` to create tables
3. Seed initial data (chronotype types, FAQ, sleep disorders)
4. Add indexes for query performance

### Data Models to Implement
```typescript
// Core models
- User (id, email, password_hash, role, name, created_at, updated_at)
- ChronotypeResult (id, user_id, data, created_at)
- SleepEntry (id, user_id, date, bedtime, wake_time, quality_score)
- Recommendation (id, user_id, type, content, created_at)

// Admin models
- Content (id, type, title, body, metadata)
- AuditLog (id, user_id, action, details, created_at)
- Notification (id, user_id, type, message, read, created_at)
```

---

## Phase 6: Professional Features (Long-term)

### Security
- HTTPS enforcement
- CSRF protection
- Rate limiting
- Input validation (Zod)
- Security headers (Helmet.js)
- CORS configuration

### Performance
- Redis caching for dashboard data
- API response compression
- Database connection pooling
- CDN for static assets
- Image optimization (Next.js Image)

### Testing
- Unit tests (Vitest/Jest)
- E2E tests (Playwright)
- Integration tests (supertest)
- Type checking (tsc --noEmit)

### DevOps
- CI/CD pipeline (GitHub Actions)
- Environment configs (.env.local, .env.production)
- Monitoring (Sentry, LogRocket)
- Error tracking
- Database backups

---

## Technical Debt & Improvements

### Current Issues
1. Placeholder images: Replace all `placehold.co` URLs with real assets
2. Inline styles: Migrate to CSS modules or Tailwind classes
3. Hard-coded content: Move to CMS (Contentful, Sanity, or local JSON)
4. Missing accessibility: Add ARIA labels, semantic HTML

### Code Quality
- Add ESLint and Prettier configs
- Implement Husky pre-commit hooks
- Add Storybook for component documentation
- Create component tests

---

## Timeline Estimate

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Mobile Refinement | 1-2 weeks | Responsive mobile UI, no desktop changes |
| Authentication | 2-3 weeks | Login, Register, Role-based access |
| Backend API | 2-3 weeks | REST/GraphQL endpoints, Database models |
| Dashboard | 3-4 weeks | Member/Admin/Superadmin dashboards |
| Visualizations | 2-3 weeks | Charts, analytics, data display |
| Professional Features | 4-6 weeks | Security, testing, CI/CD |

---

## Success Metrics

1. **Mobile Performance:** LCP < 2.5s on 3G networks
2. **Authentication:** 99.9% uptime, < 1s login response
3. **Dashboard:** 95% uptime, < 500ms data load
4. **Database:** < 100ms query response, 99.99% availability
5. **User Engagement:** 30% increase in session duration post-login

---

## Next Immediate Actions

1. **Fix mobile view issues** in components listed in Phase 1
2. **Set up database** with initial schema
3. **Create auth pages** (login, register)
4. **Implement role-based middleware**
5. **Build member dashboard shell**

---

*Document created: 2026-07-20*
*Next review: After mobile fixes complete*