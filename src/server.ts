// How the extension starts the sysl language server. Kept free of the `vscode` module so the
// tests can start the very same process the extension does.

export interface ServerCommand {
    command: string
    args: string[]
}

export const DEFAULT_SERVER_PATH = "sysl"

// The command line that runs the language server on stdio.
export function serverCommand(configured: string | undefined): ServerCommand {
    const command = configured !== undefined && configured.trim() !== "" ? configured.trim() : DEFAULT_SERVER_PATH
    return { command, args: ["lsp", "--stdio"] }
}

// The message shown when the executable cannot be started.
export function missingServerMessage(command: string): string {
    return `Could not start the sysl language server: '${command}' was not found. ` +
        `Install sysl 0.3.6 or later, or set "sysl.server.path" to its location.`
}
