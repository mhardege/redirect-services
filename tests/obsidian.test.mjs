import { test } from "node:test";
import assert from "node:assert/strict";
import { toObsidianUri, toRedirectLink } from "../site/obsidian/redirect.js";

const BASE = "https://example.github.io/redirect-services/obsidian/";

test("builds obsidian URI from fragment", () => {
  assert.equal(
    toObsidianUri("#vault=Work&file=00-Inbox%2FNote"),
    "obsidian://open?vault=Work&file=00-Inbox%2FNote",
  );
});

test("encodes spaces as %20", () => {
  assert.equal(
    toObsidianUri("#vault=Work&file=My%20Note"),
    "obsidian://open?vault=Work&file=My%20Note",
  );
});

test("drops unknown parameters", () => {
  assert.equal(
    toObsidianUri("#vault=Work&file=Note&evil=1"),
    "obsidian://open?vault=Work&file=Note",
  );
});

test("returns null for empty or incomplete fragment", () => {
  assert.equal(toObsidianUri(""), null);
  assert.equal(toObsidianUri("#"), null);
  assert.equal(toObsidianUri("#file=Note"), null);
});

test("converts obsidian URI into redirect link", () => {
  assert.equal(
    toRedirectLink("obsidian://open?vault=Work&file=00-Inbox%2FNote", BASE),
    BASE + "#vault=Work&file=00-Inbox%2FNote",
  );
});

test("rejects non-obsidian input", () => {
  assert.equal(toRedirectLink("https://example.com", BASE), null);
  assert.equal(toRedirectLink("obsidian://open?file=Note", BASE), null);
});

test("round trip returns the original URI", () => {
  const uri = "obsidian://open?vault=Work&file=Inbox%2FMy%20Note";
  const link = toRedirectLink(uri, BASE);
  assert.equal(toObsidianUri(new URL(link).hash), uri);
});
