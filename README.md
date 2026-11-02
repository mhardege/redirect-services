# redirect-services

Static https endpoints that forward to custom URI schemes.

Some apps (for example Notion) only make `https://` links clickable. These pages
accept an https link and immediately forward the browser to the target app.

## Services

### Obsidian

Opens a note via `obsidian://open`.

```
https://mhardege.github.io/redirect-services/obsidian/#vault=<vault>&file=<path>
```

- The note reference is passed in the URL fragment (`#...`). Browsers do not send
  the fragment to the server, so vault and note names are not logged by the host.
- Only `vault`, `file` and `path` are forwarded; the target is always `obsidian://open`.
- Opening the page without a fragment shows a converter: paste an
  `obsidian://open?...` link (Obsidian: *Copy Obsidian URL*) and copy the https link.

### VS Code

Opens a local file or folder via `vscode://file`.

```
https://mhardege.github.io/redirect-services/vscode/#path=<absolute path>
```

- Opening the page without a fragment shows a converter: paste an absolute path
  and copy either the file link or the link to its containing folder.
- Folder links add `window=new` to open a new VS Code window instead of
  replacing the current workspace.

## Development

Requires Node.js 22 or later.

```sh
npm test
```

Pushes to `main` run the tests and deploy `site/` to GitHub Pages via
[GitHub Actions](.github/workflows/deploy.yml).

## License

[MIT](LICENSE)
