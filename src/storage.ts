import * as vscode from "vscode";
import * as constants from "./constants";

export class Storage {

    constructor(
        private readonly storage: vscode.Memento
    ) {}

    async setConfig(configPath: string): Promise<void> {
        await this.storage.update(constants.MODEL_CONFIG_FILE_PATH_KEY, configPath);
    }

    async getConfig(): Promise<string | undefined> {
        return this.storage.get<string>(constants.MODEL_CONFIG_FILE_PATH_KEY);
    }

    async clearConfig(): Promise<void> {
        await this.storage.update(constants.MODEL_CONFIG_FILE_PATH_KEY, undefined);
    }
}