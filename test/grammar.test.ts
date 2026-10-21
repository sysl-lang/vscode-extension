import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import vsctm from "vscode-textmate"
import oniguruma from "vscode-oniguruma"

const require = createRequire(import.meta.url)
const wasm = readFileSync(require.resolve("vscode-oniguruma/release/onig.wasm"))
const grammarText = readFileSync(new URL("../syntaxes/sysl.tmLanguage.json", import.meta.url), "utf8")

const onig = oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength) as ArrayBuffer).then(() => ({
    createOnigScanner: (p: string[]) => new oniguruma.OnigScanner(p),
    createOnigString: (s: string) => new oniguruma.OnigString(s),
}))

const registry = new vsctm.Registry({
    onigLib: onig,
    loadGrammar: async scope => scope === "source.sysl" ? vsctm.parseRawGrammar(grammarText, "sysl.tmLanguage.json") : null,
})

// The scopes of the token covering `needle` on the one line `line`.
async function scopesOf(line: string, needle: string): Promise<string[]> {
    const grammar = await registry.loadGrammar("source.sysl")
    assert.ok(grammar, "grammar did not load")
    const { tokens } = grammar.tokenizeLine(line, vsctm.INITIAL)
    const at = line.indexOf(needle)
    assert.ok(at >= 0, `'${needle}' is not in the line`)
    const token = tokens.find(t => t.startIndex <= at && at < t.endIndex)
    assert.ok(token, "no token covers the needle")
    return token.scopes
}

test("a line comment is a comment", async () => {
    assert.ok((await scopesOf("val x = 1 // trailing note", "trailing")).includes("comment.line.double-slash.sysl"))
})

test("a string literal is a string", async () => {
    assert.ok((await scopesOf("val s = \"hello\"", "hello")).includes("string.quoted.double.sysl"))
})

test("an interpolated string is an interpolated string", async () => {
    assert.ok((await scopesOf("val s = s\"a ${x} b\"", " b")).includes("string.quoted.double.interpolated.sysl"))
})

test("a keyword is a keyword", async () => {
    assert.ok((await scopesOf("if x then y", "if")).includes("keyword.control.sysl"))
})

test("a number is a number", async () => {
    assert.ok((await scopesOf("val n = 12345", "12345")).includes("constant.numeric.integer.sysl"))
})

test("a keyword inside a string stays a string", async () => {
    const scopes = await scopesOf("val s = \"if then\"", "if")
    assert.ok(scopes.includes("string.quoted.double.sysl"))
    assert.ok(!scopes.includes("keyword.control.sysl"))
})
