"use client";

export function MinimalFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-muted">
        <p>
          This page has been designed by{" "}
          <a
            href="https://www.facebook.com/themartining"
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy hover:underline"
          >
            The Martining Invoation Studio
          </a>
        </p>
      </div>
    </footer>
  );
}
