# Golden Peak Trading Academy

Production-ready full-stack web app with:
- Landing page with About Us + live Gold/Silver charts
- User registration (pending admin approval)
- User login (email/password)
- User dashboard with market charts, progress chart, daily update CTA, ladder, toasts, and course iframe
- Admin panel for pending/approved/rejected users with approve/reject actions
- Automatic random 8-char password generation on approval
- Approval email dispatch via SMTP or Amazon SES (SMTP mode)
- Admin visibility into each user's progress chart

## Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT cookie sessions (`HttpOnly`)
- Recharts for progress chart
- TradingView widgets for real-time Gold/Silver charts

## Quick Start
1. Use Node LTS (`22.x`) and npm `10+`:
```bash
nvm use
```
2. Copy environment template:
```bash
cp .env.example .env
```
3. Update `.env` values (database, JWT secret, admin credentials, email provider).
4. Install dependencies:
```bash
npm install
```
5. Create DB schema:
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```
6. Start development:
```bash
npm run dev
```

## Production Run
```bash
npm run build
npm start
```

## Amazon SES Integration (Prepared)
The backend supports SES API (preferred) with SMTP fallback.
To enable SES API:
1. In `.env`, set `EMAIL_PROVIDER="ses"`.
2. Set `SES_REGION` (example: `us-east-1`).
3. Create IAM credentials with `ses:SendEmail` and set:
   - `SES_ACCESS_KEY_ID`
   - `SES_SECRET_ACCESS_KEY`
   - optional `SES_SESSION_TOKEN`
4. Keep `SMTP_FROM` as a verified SES identity (email or domain).
5. In AWS SES, complete:
   - sender/domain verification
   - DKIM + SPF (and recommended DMARC)
   - production access request (out of SES sandbox)

To use SES SMTP instead, set:
   - `SES_SMTP_USER`
   - `SES_SMTP_PASS`
   - optional `SES_SMTP_HOST` (if empty, app uses `email-smtp.<SES_REGION>.amazonaws.com`)

## Core Routes
- Public:
  - `/` landing
  - `/register`
  - `/login`
- User:
  - `/dashboard`
- Admin:
  - `/staff-portal`
  - Direct `/admin` access returns `404`

## Admin Approval Flow
1. User submits registration (`PENDING`).
2. Admin opens `/staff-portal` and approves.
3. System generates:
   - random 8-char password
4. System stores hashed password and emails credentials to user (if email provider is configured).

## Commercials (Typical Monthly)
- Domain (`goldenpeakacademy.com`): `$10-$25/year`
- Hosting (Vercel Pro or equivalent): `$20-$50/month`
- Managed PostgreSQL (Neon/Supabase/RDS small tier): `$15-$60/month`
- Transactional email (Resend/SendGrid/Postmark): `$0-$25/month` at low volume
- Monitoring/logging (Sentry + uptime): `$0-$30/month`

Expected starter production range: **~$40 to $165/month** (excluding custom support/dev work).

## Steepest Parts / Highest Risk Areas
- Email deliverability (SPF/DKIM/DMARC + inbox placement)
- Security hardening (rate limits, lockouts, audit logs, secret management)
- Operational reliability (DB backups, migration discipline, rollback plan)
- Compliance/privacy requirements as user base scales
- Real-time data dependency SLA for external chart providers

## Domain Recommendation
Use a brand-match domain such as:
- `goldenpeakacademy.com`
- `goldenpeaktradingacademy.com`
- `goldenpeaktrading.com`

Registrar options: Cloudflare Registrar, Namecheap, or GoDaddy.

## Security Notes Before Going Live
- Replace `JWT_SECRET` with a long random secret (32+ chars)
- Set strong `ADMIN_PASSWORD`
- Configure SMTP over TLS
- Add WAF/rate limiting at edge (Cloudflare / hosting provider)
- Enforce HTTPS only
