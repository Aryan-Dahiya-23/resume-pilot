import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Terms</h1>
      <p className="mt-3 text-sm text-zinc-600">
        This is a placeholder terms page. Add your terms and conditions here.
      </p>
      <div className="mt-6">
        <Link href="/" className="text-sm font-medium text-zinc-900 hover:underline">
          Back to home
        </Link>
      </div>
    </main>
  );
}
