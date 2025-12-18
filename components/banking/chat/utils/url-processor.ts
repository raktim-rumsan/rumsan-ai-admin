/**
 * Utility function to convert plain URLs in text to clickable markdown links
 * Handles URLs with protocols, www prefixes, and plain domain names
 */
export function processMessageContent(content: string): string {
  // Regex to match URLs including:
  // - URLs with protocol (http://, https://)
  // - URLs with www.
  // - Plain domain names (e.g., chatgpt.com, example.com, subdomain.example.com)
  const urlRegex =
    /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s<>"']*)?)/g;

  const matches: Array<{ url: string; index: number }> = [];
  let match;

  // Collect all matches with their indices
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1];
    const index = match.index;

    // Skip if it's part of an email address (check if @ appears before this match)
    const beforeMatch = content.substring(Math.max(0, index - 50), index);
    if (!beforeMatch.includes("@") || url.startsWith("http")) {
      matches.push({ url, index });
    }
  }

  // Replace matches in reverse order to maintain correct indices
  let result = content;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { url, index } = matches[i];
    let fullUrl = url.startsWith("http") ? url : `https://${url}`;
    // Remove trailing period if present
    if (fullUrl.endsWith(".")) {
      fullUrl = fullUrl.slice(0, -1);
    }
    const replacement = `[${url}](${fullUrl})`;
    result =
      result.substring(0, index) +
      replacement +
      result.substring(index + url.length);
  }
  return result;
}
