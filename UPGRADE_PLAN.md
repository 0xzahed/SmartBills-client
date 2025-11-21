# SmartBills Upgrade Blueprint (November 21, 2025)

A forward-looking plan to evolve SmartBills from a solid bill-management portal into an intelligent, collaborative finance companion. This roadmap focuses on four pillars: **AI-powered assistance**, **automation & reminders**, **collaboration & transparency**, and **platform hardening**.

---

## 1. Guiding Objectives

- **Deliver proactive value**: anticipate user needs with insights, reminders, and recommendations.
- **Unlock automation**: reduce repetitive bill tasks via scheduling, document ingestion, and autopay.
- **Deepen trust**: reinforce security, auditability, and shared visibility for households.
- **Lay AI foundations**: leverage cost-effective LLMs (Groq-hosted Llama-3.1, Hugging Face Inference, or self-hosted Ollama) via a lightweight API gateway.

---

## 2. High-Level Roadmap

| #   | Upgrade                             | Type          | Primary Routes / Areas                                | Key Dependencies                                | Effort |
| --- | ----------------------------------- | ------------- | ----------------------------------------------------- | ----------------------------------------------- | ------ |
| 1   | AI Insights & Coach                 | AI/Data       | New `/insights`, `MyBills` sidebar                    | LLM proxy, aggregation API                      | High   |
| 2   | Smart Reminder Center               | Automation    | New `/notifications`, `Profile` tab, mobile push      | Queue/cron worker, email/SMS service            | Medium |
| 3   | Scheduled Payments & AutoPay        | Finance       | `BillDetails`, `MyBills`, backend `/payments`         | Stripe (test mode), webhook handler             | High   |
| 4   | Document Upload & OCR Intake        | Data Capture  | New `/upload`, `Header` CTA, Firebase Storage         | Tesseract.js worker, parsing microservice       | Medium |
| 5   | Shared Households & Roles           | Collaboration | New `/household`, Navbar menu                         | DB schema changes (members), RBAC middleware    | Medium |
| 6   | Analytics Dashboard                 | Visualization | New `/dashboard`, `Home` hero CTA                     | Chart library (Recharts), aggregation endpoints | Medium |
| 7   | AI Support Chatbot & Knowledge Base | AI/UX         | Floating widget, `/support` route                     | LLM proxy, FAQ index                            | Low    |
| 8   | PWA + Performance Hardening         | Platform      | `vite.config`, `public/manifest.json`, service worker | Workbox, Lighthouse budget                      | Medium |
| 9   | Quality & Security Foundation       | DevEx         | Tests, lint rules, .env hardening                     | Vitest, Playwright, Husky                       | Medium |

---

## 3. Feature Deep Dives

### 3.1 AI Spending Insights & Coach

**Goal:** Turn raw bill history into personalized guidance.

- **Placement & Routes:**

  - New protected route `src/Pages/Insights.jsx` at `/insights` (linked from navbar + Home CTA).
  - Optional mini-panel in `MyBills.jsx` summarizing key metrics with a "Ask AI" button.

- **Front-End Work:**

  - Create `Insights.jsx` with cards (monthly spend, category heatmap) plus chat-like panel for AI Q&A.
  - Add `AIInsightsPanel.jsx` component reused in `MyBills` sidebar.
  - Hook into new context (`InsightsContext`) to cache last analysis.

- **Back-End & Services:**

  - New endpoint `POST /ai/insights` accepting `{ email, timeframe, questions[] }`.
  - Server aggregates bills (Mongo pipeline) before invoking the LLM => ensures no raw data leaves backend.
  - Introduce `aiService.ts` that talks to a free/low-cost provider (e.g., Groq's Llama-3.1-8B via API key) with guardrails & caching (Redis/upstash).

- **AI Integration Notes:**

  - Prompt template describing user's bill summary, categories, anomalies.
  - Add streaming response support for chat feel (Server-Sent Events).
  - Safety: redact PII before prompt; store limited history.

- **Dependencies:** Axios hooks, new server route, environment variables `AI_API_KEY`, optional Redis.

- **Acceptance Criteria:**
  - Users can request "Summarize last 90 days" and receive actionable tips under 3s.
  - Insight cards update with the same aggregation as used by AI.
  - All AI traffic proxied via SmartBills server (no keys in client).

---

### 3.2 Smart Reminder & Notification Center

**Goal:** Centralize due-date reminders, channel preferences, and AI-suggested schedules.

- **Placement & Routes:**

  - New protected route `/notifications` with tabs: Upcoming, History, Preferences.
  - Extend `Profile.jsx` with quick toggles (email, SMS, push, AI suggestions).

- **Front-End Work:**

  - Components: `ReminderList`, `PreferenceForm`, `ChannelBadge`.
  - Integrate toast + badge count on navbar bell icon.

- **Back-End & Infrastructure:**

  - DB collection `notifications`: `{ userEmail, billId, sendAt, channels[], status }`.
  - Queue worker (BullMQ + Redis or lightweight cron job) to process reminders.
  - Integrate email (Resend/SendGrid free tier) and optional SMS (Twilio trial) via feature flags.

- **AI Touchpoint:**

  - Offer "Generate smart schedule" button -> calls `/ai/reminders` to analyze past payments and suggest cadence (monthly, bi-monthly) with reason.

- **Implementation Notes:**

  - Add backend endpoints: `GET/POST /notifications`, `PATCH /notifications/:id`, `POST /notifications/preview`.
  - Consider Web Push via Firebase Cloud Messaging for free push notifications.

- **Acceptance Criteria:**
  - Dashboard shows countdown badges for next due bills.
  - Users can opt into AI suggested schedules and edit before saving.

---

### 3.3 Scheduled Payments & AutoPay

**Goal:** Let users authorize payment flows beyond manual pay-now.

- **Placement & Routes:**

  - Enhance `BillDetails.jsx` with "Schedule Payment" modal.
  - `MyBills.jsx` gains "Automation" tab showing upcoming schedules.

- **Front-End Work:**

  - Build `SchedulePaymentForm` with date picker, autopay toggle, funding source selector.
  - Display status chips (Scheduled, Processing, Paid) in tables.

- **Back-End Requirements:**

  - Integrate Stripe Billing (test mode) for tokenizing payment method; store customer + payment method IDs.
  - Webhook endpoint `/webhooks/stripe` updates bill status.
  - Scheduler service (e.g., Supabase Edge Functions cron or server cron) triggers `stripe.paymentIntents.create` on due date.

- **Data Model Changes:**

  - `scheduledPayments` collection: `{ billId, userEmail, amount, scheduleDate, autopay, status }`.

- **Acceptance Criteria:**

  - Users can queue a payment, receive confirmation email, and status auto-updates post-webhook.

- **Risks & Mitigations:**
  - PCI compliance: keep SmartBills server out of card data; rely on Stripe Elements or Payment Links.
  - Clear UI copy warning about beta/autopay.

---

### 3.4 Document Upload & OCR Intake

**Goal:** Import bills by uploading PDFs/photos, auto-populating bill entries.

- **Placement & Routes:**

  - New `UploadBill.jsx` at `/upload` with button in header hero.
  - Optional FAB (floating action button) on Bills page for quick upload.

- **Front-End Work:**

  - Drag-and-drop component with preview, progress, and extracted field review.
  - Form that lets user confirm extracted title, amount, due date, category.

- **Processing Pipeline:**

  - Upload to Firebase Storage.
  - Cloud Function triggers OCR (Tesseract.js for free tier) -> parse to JSON.
  - Optional AI summarizer `/ai/bill-parser` to classify vendor, category, and detect anomalies.

- **Back-End API:**

  - `POST /bills/import` to persist extracted bill (pending review status) tied to user.

- **Acceptance Criteria:**
  - Uploading a readable PDF fills at least title + amount automatically.
  - Users can edit fields before saving.
  - Error handling for low-confidence OCR.

---

### 3.5 Shared Households & Roles

**Goal:** Enable families/roommates to split visibility and responsibilities.

- **Placement & Routes:**

  - New protected route `/household` with sections: Members, Shared Bills, Permissions.
  - Navbar dropdown entry + indicator when invites pending.

- **Front-End Work:**

  - Components: `HouseholdCard`, `MemberRoleBadge`, `InviteModal`.
  - Update `BillDetails` to show ownership/assignees.

- **Back-End Changes:**

  - Collections: `households`, `householdMembers`, `sharedBills`.
  - Roles: Owner, Admin, Contributor, Viewer.
  - Middleware to ensure RBAC for new endpoints.

- **Features:**

  - Invite members via email (token link).
  - Assign bills to members, track contributions.
  - Activity log per household.

- **Acceptance Criteria:**
  - Owner can invite, set roles, and revoke access.
  - Members only see bills belonging to their household scope.

---

### 3.6 Analytics Dashboard

**Goal:** Provide a high-level financial snapshot.

- **Placement:** `/dashboard` route accessible from navbar & home CTA.

- **Front-End:**

  - Use Recharts or Victory for visualizations: spend trends, category distribution, payment punctuality, savings vs target.
  - KPI cards shared with home hero.

- **Back-End:**

  - Aggregation endpoints: `/analytics/overview`, `/analytics/trends?range=6m`.
  - Cache results per user (15 min TTL) to control cost.

- **AI Tie-In:**

  - Add "Explain this chart" action that reuses AI insights endpoint but scoped to chart dataset.

- **Acceptance Criteria:**
  - Dashboard loads <1.5s with cached data.
  - Charts responsive and accessible.

---

### 3.7 AI Support Chatbot & Knowledge Base

**Goal:** Offer contextual help without live agents.

- **Placement:** Floating widget on all routes + dedicated `/support` page.

- **Implementation:**

  - Front-end `SupportWidget.jsx` with minimized state persisted in context.
  - Backend `/ai/support` endpoint referencing FAQ knowledge base (JSON/Markdown) + bill-specific context (if user opts in).
  - Use retrieval-augmented generation: embed FAQs with sentence-transformers, store vectors (e.g., Pinecone lite, Supabase pgvector).

- **AI Stack:**

  - Free-tier LLM (Groq, Together, or Local) with short prompts.
  - Optionally switch to function calling for retrieving ticket IDs.

- **Acceptance Criteria:**
  - Users can ask setup questions and receive accurate answers referencing KB articles.

---

### 3.8 PWA & Performance Hardening

**Goal:** Improve reliability on mobile/low-connectivity.

- **Scope:**

  - Generate `manifest.json`, icons, and `service-worker.js` (Workbox) for offline shell.
  - Cache API responses for Bills list & categories (stale-while-revalidate).
  - Configure Vite to inlined critical CSS and code-split routes.
  - Add Lighthouse CI threshold (>90 Performance & PWA).

- **Implementation Steps:**
  - Install `@vite-pwa/plugin`.
  - Add `npm run analyze` script using `source-map-explorer`.
  - Prefetch AI endpoints only when necessary.

---

### 3.9 Quality, Security, and DevEx Enhancements

- **Automated Testing:**
  - Unit tests via Vitest for hooks/components.
  - Integration tests for routes (React Testing Library).
  - E2E via Playwright covering login, bill flow, payment scheduling.
- **Static Analysis:**
  - Enable ESLint stricter rules, Prettier formatting.
  - Add Husky pre-commit checks (lint + tests).
- **Secrets Management:**
  - Document `.env.example` for AI keys, Stripe, email service.
  - Use Vercel/Netlify secrets instead of inline config.
- **Monitoring:**
  - Add Sentry (free tier) for error tracking.
  - Add simple health endpoint for uptime monitors.

---

## 4. Suggested Implementation Order

1. **Foundations:** Refine API contracts, add testing harness, prepare .env.
2. **Analytics + Aggregations:** Build `/analytics` backend to unlock Insights, Dashboard, Reminders.
3. **AI Infrastructure:** Ship AI proxy service & insights page (Feature 3.1).
4. **Reminder Center:** Layer in notifications after analytics baseline.
5. **Scheduled Payments:** Integrate Stripe + scheduling service.
6. **Document OCR & Upload:** Provide ingestion path for new bills.
7. **Shared Households:** Expand data model once payment + reminders stable.
8. **Support Chatbot & PWA:** Polish UX and resiliency to close the loop.

This order ensures data correctness and infrastructure are solid before automating financial actions.

---

## 5. Resource Checklist

- **Front-End Libraries:** Recharts, Workbox, React Query (optional), React Hook Form, date-fns.
- **Back-End Services:** Stripe, Resend/Twilio, Redis (Upstash), vector DB (Supabase pgvector), Groq API.
- **DevOps:** Background worker environment (Railway cron, Cloudflare Workers, or self-hosted worker), monitoring (Sentry), feature flagging (LaunchDarkly-lite or simple env toggles).

---

## 6. Acceptance & Validation Strategy

- Define KPIs per feature (e.g., % of users receiving reminders, insight usage rate).
- Instrument events via PostHog to measure adoption.
- Conduct beta rollouts via feature flags focusing on internal/test accounts first.
- Run security and accessibility audits before public release.

---

## 7. Next Steps

1. Socialize this plan with backend team to align on data model changes.
2. Split features into GitHub Projects/epics with estimated timelines.
3. Prepare design mocks for new routes (`/dashboard`, `/notifications`, `/insights`, `/upload`, `/household`, `/support`).
4. Stand up AI proxy microservice with locked-down API keys.
5. Start with Analytics + AI Insights MVP to showcase value quickly.

---

This blueprint positions SmartBills as an intelligent, automation-first platform while grounding every enhancement in concrete routes, components, and infrastructure changes. Lets iterate collaboratively and deliver the future of bill management.
