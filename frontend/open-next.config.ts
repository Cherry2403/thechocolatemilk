import type { OpenNextConfig } from "@opennextjs/cloudflare";

// OpenNext adapter config for THE CHOCOLATE MILK — deployed on Cloudflare Workers
// Worker name: thechocolatemilk (matches wrangler.jsonc)
// All pages are static (feed, chat, connections, profile) — no ISR or PPR needed

const config: OpenNextConfig = {
  default: {
    override: {
      // Run as a standard Node.js-compatible Cloudflare Worker (not edge)
      // Required because we use Next.js App Router with server components
      wrapper: "cloudflare-node",

      // Use the edge converter — handles request/response format for Cloudflare
      converter: "edge",

      // Use native fetch for any proxied external requests
      proxyExternalRequest: "fetch",

      // No incremental caching needed — all pages are statically prerendered
      // (feed, chat, connections, profile are all marked ○ Static in the build output)
      incrementalCache: "dummy",

      // No tag-based cache invalidation — no dynamic routes or ISR
      tagCache: "dummy",

      // No background revalidation queue — static site, nothing to revalidate
      queue: "dummy",
    },
  },

  // Make node:crypto available to the edge middleware runtime
  edgeExternals: ["node:crypto"],

  middleware: {
    // Run middleware as a separate edge worker for performance
    // Handles redirects (/ → /feed) before the main worker is invoked
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
