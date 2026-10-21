import { test } from "node:test"
import assert from "node:assert/strict"
import { DEFAULT_SERVER_PATH, missingServerMessage, serverCommand } from "../src/server.ts"

test("the server command defaults to sysl lsp --stdio", () => {
    assert.deepEqual(serverCommand(undefined), { command: DEFAULT_SERVER_PATH, args: ["lsp", "--stdio"] })
    assert.deepEqual(serverCommand("  "), { command: "sysl", args: ["lsp", "--stdio"] })
})

test("a configured path is used", () => {
    assert.equal(serverCommand("/opt/x/sysl").command, "/opt/x/sysl")
})

test("the missing-binary message names the binary and the setting", () => {
    const m = missingServerMessage("nosuch")
    assert.match(m, /'nosuch'/)
    assert.match(m, /sysl\.server\.path/)
})
