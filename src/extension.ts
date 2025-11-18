import * as vscode from "vscode";
import { OpenAICustomChatModelProvider } from "./provider";
import { MODEL_CONFIG_FILE_PATH_KEY } from "./constants";

export function activate(context: vscode.ExtensionContext) {
  // Build a descriptive User-Agent to help quantify API usage
  const ext = vscode.extensions.getExtension("LijCoder.openai-custom-vscode-chat");
  const extVersion = ext?.packageJSON?.version ?? "unknown";
  const vscodeVersion = vscode.version;
  // Keep UA minimal: only extension version and VS Code version
  const ua = `openai-custom-vscode-chat/${extVersion} VSCode/${vscodeVersion}`;

  const provider = new OpenAICustomChatModelProvider(context.secrets, ua);
  // Register the OpenAI Custom provider under the vendor id used in package.json
  vscode.lm.registerLanguageModelChatProvider("openai-custom", provider);

  // Management command to configure API key
  context.subscriptions.push(
    vscode.commands.registerCommand("openai.custom.manage", async () => {
      const modelConfigExisting = await context.secrets.get(MODEL_CONFIG_FILE_PATH_KEY);
      const configPath = await vscode.window.showInputBox({
        title: "OpenAI custom model config",
        prompt: modelConfigExisting ? "Update your model config file path" : "Enter your model config file path",
        ignoreFocusOut: true,
        password: false,
        value: modelConfigExisting ?? "",
      });
      if (configPath === undefined) {
        return; // user canceled
      }
      if (!configPath.trim()) {
        await context.secrets.delete(MODEL_CONFIG_FILE_PATH_KEY);
        vscode.window.showInformationMessage("OpenAI Custom config cleared.");
        return;
      }
      await context.secrets.store(MODEL_CONFIG_FILE_PATH_KEY, configPath.trim());
      vscode.window.showInformationMessage("OpenAI Custom config saved.");
    })
  );
}

export function deactivate() {}
