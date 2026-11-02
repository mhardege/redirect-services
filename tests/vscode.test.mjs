import { test } from "node:test";
import assert from "node:assert/strict";
import { toVscodeUri, normalizePath, parentFolder, baseName, toRedirectLink } from "../site/vscode/redirect.js";

const BASE = "https://example.github.io/redirect-services/vscode/";

test("builds vscode URI from fragment", () => {
  assert.equal(
    toVscodeUri("#path=%2FUsers%2Fme%2Fnotes.md"),
    "vscode://file/Users/me/notes.md",
  );
});

test("encodes spaces and special characters per path segment", () => {
  assert.equal(
    toVscodeUri("#path=%2FUsers%2Fme%2FMy%20Notes%2Fa%23b.md"),
    "vscode://file/Users/me/My%20Notes/a%23b.md",
  );
});

test("opens a new window when requested", () => {
  assert.equal(
    toVscodeUri("#path=%2FUsers%2Fme&window=new"),
    "vscode://file/Users/me?windowId=_blank",
  );
});

test("adds window=new to folder links in converter", () => {
  assert.equal(
    toRedirectLink("/Users/me", BASE, { newWindow: true }),
    BASE + "#path=%2FUsers%2Fme&window=new",
  );
});

test("returns null for empty or relative path", () => {
  assert.equal(toVscodeUri(""), null);
  assert.equal(toVscodeUri("#path="), null);
  assert.equal(toVscodeUri("#path=notes.md"), null);
});

test("returns the containing folder", () => {
  assert.equal(parentFolder("/Users/me/notes.md"), "/Users/me");
  assert.equal(parentFolder("/Users/me/folder/"), "/Users/me");
  assert.equal(parentFolder("/notes.md"), "/");
});

test("strips whitespace and surrounding quotes from pasted paths", () => {
  assert.equal(normalizePath('  "/Users/me/My Notes.md" '), "/Users/me/My Notes.md");
  assert.equal(normalizePath("'/Users/me'"), "/Users/me");
  assert.equal(toRedirectLink('"/Users/me"', BASE), BASE + "#path=%2FUsers%2Fme");
});

test("returns the last path segment as display name", () => {
  assert.equal(baseName("/Users/me/notes.md"), "notes.md");
  assert.equal(baseName("/Users/me/"), "me");
  assert.equal(baseName("/"), "/");
});

test("rejects relative input in converter", () => {
  assert.equal(toRedirectLink("notes.md", BASE), null);
  assert.equal(toRedirectLink("", BASE), null);
});

test("round trip opens the original path", () => {
  const path = "/Users/me/projects/📤 Demo Project/My Notes.md";
  const link = toRedirectLink(path, BASE);
  assert.equal(
    toVscodeUri(new URL(link).hash),
    "vscode://file" + path.split("/").map(encodeURIComponent).join("/"),
  );
});
