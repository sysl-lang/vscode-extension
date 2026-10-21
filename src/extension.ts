import * as vscode from "vscode"
import { LanguageClient, type LanguageClientOptions, type ServerOptions, TransportKind } from "vscode-languageclient/node"
import { missingServerMessage, serverCommand } from "./server"

let client: LanguageClient | undefined

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const configured = vscode.workspace.getConfiguration("sysl").get<string>("server.path")
    const { command, args } = serverCommand(configured)

    const serverOptions: ServerOptions = {
        command,
        args,
        transport: TransportKind.stdio,
    }
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "sysl" }],
        outputChannelName: "SysL",
    }

    client = new LanguageClient("sysl", "SysL", serverOptions, clientOptions)
    try {
        await client.start()
    } catch (err) {
        client = undefined
        void vscode.window.showErrorMessage(`${missingServerMessage(command)} (${String(err)})`)
        return
    }
    context.subscriptions.push({ dispose: () => void client?.stop() })
}

export async function deactivate(): Promise<void> {
    await client?.stop()
}
