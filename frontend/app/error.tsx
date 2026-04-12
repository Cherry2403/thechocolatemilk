"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root error boundary — catches runtime errors for all routes.
 * Individual routes can override with their own error.tsx if needed.
 */
export default function RouteError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-dark-brown font-serif text-lg font-light tracking-wide">
        Something went wrong
      </h2>
      <p className="text-grey/60 max-w-sm text-sm">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-dark-brown/10 text-dark-brown hover:bg-dark-brown/20 rounded-full px-5 py-2 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
