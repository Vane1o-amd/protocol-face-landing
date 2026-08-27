export interface Utm {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export function parseUtm(urlString: string): Utm {
  try {
    const url = new URL(urlString);
    const params = url.searchParams;
    return {
      source: params.get("utm_source") ?? undefined,
      medium: params.get("utm_medium") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined,
      content: params.get("utm_content") ?? undefined,
      term: params.get("utm_term") ?? undefined,
    };
  } catch {
    return {};
  }
}