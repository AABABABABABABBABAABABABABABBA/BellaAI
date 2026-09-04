import type { FormattedSearchResult } from "./perplexity";

export interface SearxngSearchResult {
  title: string;
  url: string;
  content?: string;
  publishedDate?: string | null;
}

export interface SearxngSearchResponse {
  query: string;
  results: SearxngSearchResult[];
}

export class SearxngApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly retryable: boolean;

  constructor({
    status,
    statusText,
    retryable,
  }: {
    status: number;
    statusText: string;
    retryable: boolean;
  }) {
    const statusLabel = statusText ? `${status} ${statusText}` : `${status}`;
    super(`SearXNG API error ${statusLabel}`);
    this.name = "SearxngApiError";
    this.status = status;
    this.statusText = statusText;
    this.retryable = retryable;
  }
}

const RETRYABLE_SEARXNG_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

export const isRetryableSearxngStatus = (status: number): boolean =>
  RETRYABLE_SEARXNG_STATUSES.has(status);

/** Runs one SearXNG query and maps its results onto the shared search-result shape. */
export const fetchSearxngResults = async (
  baseUrl: string,
  query: string,
  maxResults: number,
  abortSignal?: AbortSignal,
): Promise<FormattedSearchResult[]> => {
  const url = new URL("/search", baseUrl);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");

  const response = await fetch(url, { signal: abortSignal });

  if (!response.ok) {
    throw new SearxngApiError({
      status: response.status,
      statusText: response.statusText,
      retryable: isRetryableSearxngStatus(response.status),
    });
  }

  const data: SearxngSearchResponse = await response.json();

  return data.results.slice(0, maxResults).map((result) => ({
    title: result.title,
    url: result.url,
    content: result.content ?? "",
    date: result.publishedDate ?? null,
    lastUpdated: null,
  }));
};
