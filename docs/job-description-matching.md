# Job-description matching

Paste an optional job description in either upload popup, or edit it in an existing resume's target panel. Save target changes before selecting Review again. Blank descriptions keep the general role-based review. Input is limited to 12,000 characters on the client and server.

The review assesses up to 12 requirements as supported, partial, or not evidenced. Every requirement must quote the posting; supported and partial matches also require a matching resume excerpt. Source matching normalizes Unicode and whitespace, but does not verify the model's interpretation. A not-evidenced result is an observation about the resume text, not proof the candidate lacks a qualification. Rewrites are prompted to remain faithful to the resume.

Each completed review stores its own job-description snapshot in summary JSON. Changing or clearing the saved target does not alter history. The UI notes when a selected review differs from the saved posting. Older reviews without job matching remain readable.

## Deployment

Apply the additive migration `20260909000000_resume_job_description` to the target database with `npx prisma migrate deploy` before deploying this version of the web app and worker. It adds one nullable TEXT column to Resume. Run `npm run prisma:generate` when preparing the application. Do not deploy the new Prisma client against an unmigrated database.

The migration is included in the branch; it has not been applied to the live database by this implementation task.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`. Tests cover dual-source verification, malformed and oversized inputs, optional uploads, target clearing versus omission, worker input forwarding, and historical snapshots. External services and database writes are mocked.

After migration, smoke-test an authenticated upload with a posting, expand the source excerpts on desktop and mobile, change the posting and rerun, and select the older review to verify its original posting. Also upload without a description and confirm the general review still works. Live provider and authenticated browser checks are still required.
