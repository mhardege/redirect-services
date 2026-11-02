// Translates between the public https link and the vscode://file URI.
// The local path travels in the URL fragment (#...), which browsers
// never send to the server, so the path stays on the client.

/**
 * Builds a vscode://file URI from a URL fragment such as
 * "#path=%2FUsers%2Fme%2Fnotes.md". Returns null for empty or relative paths.
 * Adds windowId=_blank when the fragment contains window=new.
 */
export function toVscodeUri(hash) {
  const raw = (hash || "").replace(/^#/, "");
  const params = new URLSearchParams(raw);
  const path = params.get("path");
  if (!path || !path.startsWith("/")) return null;

  const uri = "vscode://file" + path.split("/").map(encodeURIComponent).join("/");
  return params.get("window") === "new" ? uri + "?windowId=_blank" : uri;
}

/**
 * Trims whitespace and surrounding quotes from a pasted path.
 */
export function normalizePath(path) {
  return (path || "").trim().replace(/^(["'])(.*)\1$/, "$2").trim();
}

/**
 * Returns the folder that contains the given absolute path.
 */
export function parentFolder(path) {
  const trimmed = path.replace(/\/+$/, "");
  const index = trimmed.lastIndexOf("/");
  return index > 0 ? trimmed.slice(0, index) : "/";
}

/**
 * Returns the last segment of a path, used as display name.
 */
export function baseName(path) {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed.slice(trimmed.lastIndexOf("/") + 1) || "/";
}

/**
 * Converts an absolute local path into the https redirect link.
 * Returns null if the input is not an absolute path.
 */
export function toRedirectLink(path, baseUrl, { newWindow = false } = {}) {
  const trimmed = normalizePath(path);
  if (!trimmed.startsWith("/")) return null;
  const params = new URLSearchParams({ path: trimmed });
  if (newWindow) params.set("window", "new");
  const fragment = params.toString().replace(/\+/g, "%20");
  return baseUrl.replace(/#.*$/, "") + "#" + fragment;
}
