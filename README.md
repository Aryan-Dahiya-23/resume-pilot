<div align="center">

# 🚀 ResumePilot

**AI-Powered Resume Reviewer & Job Application Tracker**

*Optimize your resumes for ATS and hiring managers with actionable AI critique, then track your entire job hunt in one streamlined workspace.*

---

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![Inngest](https://img.shields.io/badge/Inngest-Durable_Workflows-000000?style=for-the-badge&logo=inngest&logoColor=white)](https://www.inngest.com/)
[![DeepSeek](https://img.shields.io/badge/DeepSeek-AI_Engine-4D6BFE?style=for-the-badge&logo=openai&logoColor=white)](https://deepseek.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ResumePilot** bridges the gap between resume refinement and job pipeline tracking. Instead of relying on generic feedback and disjointed spreadsheets, ResumePilot provides:

1. **Intelligent Document Ingestion**: Upload PDF or DOCX resumes with automatic text parsing and structure extraction.
2. **Targeted AI Critique**: Deep evaluation powered by DeepSeek AI tailored to your target role and seniority level.
3. **Actionable Suggestions**: Specific bullet-point rewrites (before vs. after), missing high-impact keywords, and ATS readiness scores.
4. **Full Job Pipeline Tracking**: Keep track of job applications from `Saved` to `Applied`, `Interview`, `Offer`, and `Rejected` with interview rounds, notes, and contacts.
5. **Productivity Analytics**: Monitor interview conversion rates, weekly application goals, and score improvements across resume revisions.

---

## ✨ Key Features

### 📄 Smart Resume Parsing & Multi-Format Ingestion
- Upload `.pdf` and `.docx` files (up to 5MB).
- Binary files are safely stored in **Supabase Object Storage**.
- Server-side text extraction using `pdf-parse` and `mammoth` with intelligent regex normalization and section segmentation (Summary, Experience, Projects, Skills, Education).

### 🤖 Deep AI Critique & Scoring (DeepSeek AI)
- Evaluates your resume against ATS readability, keyword density, and role-specific impact.
- Generates:
  - **Overall Score (0-100)**: Transparent score calculating impact and alignment.
  - **Strengths & Weaknesses**: Clear pros and cons of current formatting and content.
  - **Missing Keywords**: Role-specific skills and tooling to increase match rates.
  - **Concrete Rewrite Suggestions**: Direct *before* vs. *after* transformations explaining *why* the revision works.
  - **Actionable Next Steps**: Prioritized checklist to level up the resume.

### 📊 Versioning & Iteration History
- Track multiple iterations of resumes over time.
- View historic scores and see how each revision improves your match rate.

### 💼 Job Pipeline & Application Management
- Track jobs with customizable stages: **Saved**, **Applied**, **Interview**, **Offer**, and **Rejected**.
- Manage multi-stage interview rounds (`Done`, `Upcoming`, `Pending`).
- Store contact names, emails, company links, location, and personal notes.
- Quick search, status filters, date range filters, and pagination.

### 📈 Real-Time Analytics Dashboard
- **Weekly Goal Tracker**: Stay accountable with weekly application targets and animated progress indicators.
- **Interview Conversion Rate**: Automatically calculates:
  $$\text{Conversion Rate} = \frac{\text{Interviews} + \text{Offers}}{\text{Total Submitted Applications}} \times 100$$
- **Score Delta**: Visual comparison showing improvement from your previous resume version.

### ⚡ Blazing Fast UX
- Built on **React 19** and **Next.js 16 App Router**.
- **TanStack React Query** for cached data, optimistic updates, and smart prefetching on hover.
- Responsive mobile drawer with native swipe gesture support.

---

## 🏗️ System Architecture

ResumePilot employs an event-driven, decoupled workflow to guarantee high responsiveness and resilience against timeouts:

```
[ User Uploads Resume (PDF / DOCX) ]
                 │
                 ▼
      [ Next.js API Route ]
  (/api/resumes/upload - Clerk Auth)
                 │
                 ├──▶ Upload to Supabase Storage Bucket
                 ├──▶ Create Resume Record in PostgreSQL (Prisma)
                 └──▶ Dispatch 'resume/uploaded' event to Inngest
                             │
                             ▼
                 [ Inngest Background Worker ]
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                   ▼
    [ Step 1: Parse File ]              [ Step 2: AI Evaluation ]
   • Download from Supabase             • Formulate role-aware prompt
   • Extract text (PDF/DOCX)           • Send to DeepSeek API
   • Normalize & structure             • Parse strict JSON critique
   • Upsert ResumeParse                • Upsert ResumeReview & History
           │                                   │
           └─────────────────┬─────────────────┘
                             ▼
                 [ Status: READY in DB ]
                             │
                             ▼
            [ Client Real-Time UI Update ]
             (React Query Polling / Cache)
```

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Full-stack React framework with server components and route handlers |
| **Frontend UI** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) | Modern UI layer with utility-first styling and custom animations |
| **Icons & UX** | [Lucide React](https://lucide.dev/) + [NextTopLoader](https://github.com/apal21/nextjs-toploader) | Consistent icons and route transition progress bar |
| **Authentication** | [Clerk](https://clerk.com/) | Secure user authentication, session management, and profile synchronization |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM 7](https://www.prisma.io/) | Relational database modeling with type-safe queries and migrations |
| **File Storage** | [Supabase Storage](https://supabase.com/storage) | Cloud object storage with signed secure URLs |
| **Background Queue** | [Inngest v4.5](https://www.inngest.com/) | Durable, multi-step asynchronous workflow orchestrator |
| **AI Engine** | [DeepSeek API](https://deepseek.com/) (`deepseek-v4-flash`) | Fast LLM inference generating structured JSON resume reviews |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) | Server state management, caching, and prefetching |
| **Document Parsers**| `pdf-parse` + `mammoth` | Server-side text and structure extraction for PDF and Word DOCX |
| **Validation** | [Zod](https://zod.dev/) | Strict runtime schema validation for API payloads |

---

## 🗄️ Database Schema

```mermaid
erDiagram
    USER ||--o{ RESUME : owns
    USER ||--o{ JOB : tracks
    RESUME ||--o| RESUME_PARSE : has
    RESUME ||--o| RESUME_REVIEW : has
    RESUME ||--o{ RESUME_REVIEW_HISTORY : contains

    USER {
        string id PK
        string clerkId UK
        string email UK
        string name
        datetime createdAt
    }

    RESUME {
        string id PK
        string userId FK
        string fileName
        string storageKey
        string mimeType
        int size
        string roleTarget
        string targetLevel
        enum status "UPLOADED | PARSING | REVIEWING | READY | FAILED"
        datetime createdAt
    }

    RESUME_PARSE {
        string id PK
        string resumeId FK
        string rawText
        json structuredJson
        string parserVersion
    }

    RESUME_REVIEW {
        string id PK
        string resumeId FK
        int score
        json summaryJson
        json missingKeywords
        json suggestionsJson
        string model
    }

    RESUME_REVIEW_HISTORY {
        string id PK
        string resumeId FK
        int score
        json summaryJson
        json missingKeywords
        json suggestionsJson
        string model
        datetime createdAt
    }

    JOB {
        string id PK
        string userId FK
        string company
        string role
        enum status "Saved | Applied | Interview | Offer | Rejected"
        string location
        string link
        json interviewRounds
        string notes
        string followUp
        datetime createdAt
    }
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v20.x or later
- **npm**, **pnpm**, or **yarn**
- Accounts and API keys for:
  - [Clerk](https://clerk.com/) (Auth)
  - [Supabase](https://supabase.com/) (PostgreSQL + Object Storage)
  - [Inngest](https://www.inngest.com/) (Background Jobs)
  - [DeepSeek](https://platform.deepseek.com/) (AI API)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Aryan-Dahiya-23/resume-pilot.git
   cd resume-pilot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your API credentials in `.env` (refer to the [Environment Variables](#environment-variables) section below).

4. **Initialize the Database with Prisma:**
   ```bash
   # Push schema to PostgreSQL
   npx prisma db push

   # Generate Prisma Client
   npm run prisma:generate
   ```

---

### 🔑 Environment Variables

Create a `.env` file in the root directory and configure the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# PostgreSQL Database (e.g. Supabase / Neon)
DATABASE_URL="postgresql://postgres.xxx:password@aws-pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Supabase Storage
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
SUPABASE_STORAGE_BUCKET=resumes

# Inngest Background Jobs
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="signkey-prod-..."
INNGEST_DEV=1

# DeepSeek AI Engine
DEEPSEEK_API_KEY="sk-..."
DEEPSEEK_MODEL="deepseek-v4-flash"
```

---

### 💻 Running the Application

To run the full stack locally with background processing:

1. **Start the Inngest local dev server** (Terminal 1):
   ```bash
   npm run inngest:dev
   ```
   *This starts the Inngest dashboard at [http://localhost:8288](http://localhost:8288) to monitor events and functions.*

2. **Start the Next.js development server** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```plaintext
ai-resume-reviewerp/
├── app/                           # Next.js App Router
│   ├── api/                       # API Route Handlers
│   │   ├── analytics/             # Analytics endpoints
│   │   ├── dashboard/             # Aggregated dashboard metrics
│   │   ├── inngest/               # Inngest webhook endpoint (/api/inngest)
│   │   ├── jobs/                  # Job CRUD & pagination (/api/jobs)
│   │   ├── me/                    # Current user identity endpoint (/api/me)
│   │   ├── resumes/               # Resume list & upload endpoints
│   │   ├── settings/              # User settings endpoints
│   │   └── webhooks/clerk/        # Clerk user sync webhooks
│   ├── dashboard/                 # Protected dashboard pages
│   │   ├── jobs/                  # Jobs management view & details
│   │   ├── resumes/               # Resume upload, list, & AI report views
│   │   ├── settings/              # Account & profile settings
│   │   ├── layout.tsx             # Dashboard layout
│   │   └── page.tsx               # Dashboard root
│   ├── sign-in/ & sign-up/        # Clerk authentication pages
│   ├── layout.tsx                 # Root application layout
│   └── page.tsx                   # Landing page
├── components/                    # Reusable React components
│   ├── dashboard/                 # Dashboard widgets, modals & sections
│   ├── landing/                   # Landing page marketing components
│   ├── layout/                    # Sidebar & shell navigation
│   ├── providers/                 # React Query & Toast providers
│   └── ui/                        # Core UI components (Buttons, Badges, Cards, etc.)
├── hooks/                         # Custom React hooks
│   └── queries/                   # TanStack React Query query & mutation hooks
├── lib/                           # Core utilities and business logic
│   ├── ai/                        # DeepSeek AI prompt formatting & review execution
│   ├── api/                       # Client-side Axios API wrappers
│   ├── db/                        # Database access layers (Prisma repositories)
│   ├── inngest/                   # Inngest client and step-function definitions
│   ├── react-query/               # Query key definitions & cache management
│   ├── validators/                # Zod schemas for request validation
│   ├── prisma.ts                  # Global Prisma client with pg-adapter
│   ├── resume-parser.ts           # PDF & DOCX text extraction & section parser
│   └── supabase-storage.ts        # Supabase Storage client (upload/download/sign)
├── prisma/                        # Database schema & migrations
│   └── schema.prisma              # Prisma schema definition
├── public/                        # Static assets
└── package.json                   # Project dependencies and scripts
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs ESLint to check for code quality issues |
| `npm run inngest:dev` | Starts the local Inngest Dev Server connecting to `/api/inngest` |
| `npm run prisma:generate`| Generates the Prisma Client |
| `npm run prisma:migrate:dev` | Runs database migrations in development |
| `npm run prisma:studio` | Opens Prisma Studio GUI at `http://localhost:5555` |

---

## 🔌 API Reference

### Resume Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resumes` | List user resumes with search (`q`), `status`, and `dateRange` filters |
| `POST` | `/api/resumes/upload` | Upload resume file (`multipart/form-data`) and trigger AI evaluation |
| `GET` | `/api/resumes/[id]` | Fetch detailed parse data, AI feedback report, and revision history |
| `DELETE`| `/api/resumes/[id]` | Delete resume record and associated storage file |

### Job Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Get paginated list of job applications with filters (`q`, `status`, `dateRange`) |
| `POST` | `/api/jobs` | Create a new job tracker record |
| `GET` | `/api/jobs/[id]` | Get single job details including interview rounds and notes |
| `PATCH` | `/api/jobs/[id]` | Update job stage, details, notes, or interview rounds |
| `DELETE`| `/api/jobs/[id]` | Remove job from tracker |

### Dashboard & Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/overview` | Composite metrics: latest score, score delta, conversion rate, weekly goals |
| `GET` | `/api/me` | Fetch synchronized database user record for current Clerk session |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ResumePilot:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by <a href="https://github.com/Aryan-Dahiya-23">Aryan Dahiya</a>
</div>
