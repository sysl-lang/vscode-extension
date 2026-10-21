# SysL for Visual Studio Code

Syntax highlighting and language-server support for [sysl](https://sysl.sh) in Visual Studio Code.
Files ending in `.sysl` get highlighting, bracket and comment handling, and, through `sysl lsp`,
the compiler's own diagnostics as you type, hover and go-to-definition.

*An independent sysl extension for Visual Studio Code. It is not affiliated with or endorsed by Microsoft or the Visual Studio Code project.*

## Requirements

`sysl` 0.3.6 or later on your `PATH` (`brew install sysl-lang/tap/sysl`). The extension runs
`sysl lsp --stdio`.

## Install

Download `sysl-<version>.vsix` from the [releases page](https://github.com/sysl-lang/vscode-extension/releases),
then:

```
code --install-extension sysl-0.1.0.vsix
```

or use *Extensions: Install from VSIX...* in the command palette. The extension is not published to
the Marketplace.

## Settings

| setting | default | meaning |
|---|---|---|
| `sysl.server.path` | `sysl` | the sysl executable; run as `<path> lsp --stdio` |
| `sysl.trace.server` | `off` | `messages` or `verbose` traces the protocol in the *SysL* output channel |

If the executable cannot be started, the extension says so and names this setting.

## Not in 0.1.0

Tasks, a test explorer, debugging and Marketplace publishing. The language features are whatever
`sysl lsp` implements: diagnostics, hover and definition.

## Grammar

`syntaxes/sysl.tmLanguage.json` is copied from the texish project
(`texish/grammars/sysl.tmLanguage.json`, last changed in commit
`56fe178af9fedad33f3778a1ecc6710be350f2b7`). It highlights line comments, strings (including the
`s`, `f`, `raw` and `c` prefixes), numbers, keywords, types and declarations. It does not yet
tokenize nested `/* */` block comments or tripled (`"""`) text blocks.

## Development

```
npm install
npm run typecheck
npm test
npm run build
npm run package
```

`npm test` runs without a window: it starts `sysl lsp --stdio` through the same command-line code
the extension uses, and tokenizes samples with `vscode-textmate`. Set `SYSL_SERVER_PATH` to test a
different `sysl`.

## License

ISC, see `LICENSE`.
