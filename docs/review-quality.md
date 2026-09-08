# Resume review quality and recovery

New reviews store findings in the existing review summary JSON. Each finding has a kind, observation, quoted resume excerpt, and suggested action. Excerpts and rewrite originals must occur in the extracted text after Unicode and whitespace normalization. Unsupported entries are removed; a response with no supported findings is retried. Matching a quote establishes its source, not the correctness of the model's interpretation. Users should still check suggested edits.

Older reviews remain readable and offer a new review to generate linked excerpts. No database migration is needed.

Processing keeps PARSING or REVIEWING status during temporary errors. Inngest retries failed steps three times, then the failure handler marks the resume FAILED. AI requests time out after 90 seconds. Review results, history, and READY status are committed in one transaction; the Inngest run ID prevents duplicate history entries when the save step is replayed.

Retry requests reject active work and use an atomic status/timestamp comparison to avoid concurrent queue submissions. Failed event delivery marks the file FAILED for retry. Queued work can be requeued after ten minutes. Work for a single resume is serialized. A delayed original event can still arrive after a manual requeue; serialization prevents simultaneous processing, but this is not an exactly-once event-delivery guarantee.

The details and resume-list queries poll during processing. Previously loaded details remain visible if a status refresh fails, with a manual refresh action. Previous reviews remain available during a rerun or failure.

## Validation

Run `npm test`, `npm run lint`, and `npm run build`. Regression tests mock the model, database, and queue boundaries; they do not require credentials or send resume data to external services.

For a deployment smoke test with Inngest connected:

1. Upload a selectable-text PDF or DOCX; watch queued, reading, reviewing, and completed states.
2. Open findings with the keyboard and compare their excerpts against the resume. Check the layout on a narrow mobile screen.
3. Rerun a review; confirm existing feedback stays available and the completed run adds one history entry.
4. Simulate a temporary provider failure in a test environment; confirm polling continues while the worker retries, then shows retry controls if attempts are exhausted.
5. Simulate queue unavailability; confirm the uploaded file is retained and can be retried.
6. Open an older review and confirm its feedback and version selection still work.
