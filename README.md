## ID Card Automation System

Next.js 16 App Router project for automated student ID card generation with role-based dashboards, bulk student import, image enhancement, dynamic template layouts, and batch PDF export (A3 sheets).

### Tech stack

- **Framework**: Next.js App Router
- **UI**: Tailwind CSS, custom dashboard components
- **Auth**: NextAuth (credentials, role-based)
- **DB**: PostgreSQL + Prisma
- **Media**: Sharp (image processing), PDFKit (A3 batch PDFs)
- **Canvas**: Fabric.js (template editor)

### 1. Local setup

```bash
npm install
```

Create a `.env` file based on `.env.example`:

- `DATABASE_URL` – Postgres connection string.
- `NEXTAUTH_URL` – usually `http://localhost:3000` in dev.
- `NEXTAUTH_SECRET` – random string (e.g. `openssl rand -hex 32`).

Then run Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Seed at least one user manually (or via a small script) with a hashed password and role: `SUPERADMIN`, `ADMIN`, or `TEACHER`.

Start dev server:

```bash
npm run dev
```

Visit:

- `/login` – sign in with credentials.
- `/dashboard/super-admin`, `/dashboard/admin`, `/dashboard/teacher` – dashboards (guarded by middleware).

### 2. Core features

- **Dashboards**
  - Super Admin: high-level metrics (institutions, batches, print jobs).
  - Admin: templates and batch overview.
  - Teacher: recent batches and student photo tasks.

- **Student data entry**
  - Manual form under `teacher` dashboard using React Hook Form + Zod (`/dashboard/teacher/students/new`).
  - CSV bulk upload (`/dashboard/teacher/students/bulk-upload`) with preview and server-side validation/creation.

- **Image processing**
  - API: `POST /api/images/process` using Sharp (resize + brightness).
  - UI: student image editor with before/after preview and brightness slider.

- **Dynamic template engine**
  - Fabric.js canvas editor for template layouts (`/dashboard/admin/templates/[id]/edit`).
  - Drag-and-place fields like `name`, `registrationId`, `class`, `section`; positions saved to `Template.fieldsData`.

- **Batch PDF generation**
  - API: `POST /api/batches/[id]/pdf` builds A3 PDF using PDFKit.
  - Up to 100 cards per batch; 3×4 grid per page; cards display key student info.

### 3. Deploying to Vercel

1. Push the repo to GitHub/GitLab.
2. On Vercel:
   - Import the project.
   - Set environment variables (`DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
   - Attach a Postgres add-on or provide an external Postgres URL.
3. Run `prisma migrate deploy` via a post-deploy hook or manually in a one-off shell.
4. Ensure `public/uploads` and `public/pdfs` behavior fits your storage strategy; for production you should switch to object storage (S3/R2) and update the image/PDF routes accordingly.

