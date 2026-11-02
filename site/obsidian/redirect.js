// Translates between the public https link and the obsidian:// URI.
// The note reference travels in the URL fragment (#...), which browsers
// never send to the server, so vault and note names stay on the client.

const ALLOWED_PARAMS = ["vault", "file", "path"];

/**
 * Builds an obsidian://open URI from a URL fragment such as
 * "#vault=Work&file=Inbox%2FNote". Returns null for empty or invalid input.
 */
export function toObsidianUri(hash) {
  const raw = (hash || "").replace(/^#/, "");
  if (!raw) return null;

  const input = new URLSearchParams(raw);
  const output = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    const value = input.get(key);
    if (value) output.set(key, value);
  }
  if (!output.has("vault") && !output.has("path")) return null;

  return "obsidian://open?" + output.toString().replace(/\+/g, "%20");
}

/**
 * Converts an obsidian://open URI into the https redirect link.
 * Returns null if the input is not an obsidian://open URI.
 */
export function toRedirectLink(obsidianUri, baseUrl) {
  const match = /^obsidian:\/\/open\?(.+)$/.exec((obsidianUri || "").trim());
  if (!match) return null;
  if (!toObsidianUri(match[1])) return null;
  return baseUrl.replace(/#.*$/, "") + "#" + match[1];
}
