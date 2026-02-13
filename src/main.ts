import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MmdSettings } from "./settings";
import { MMD_VIEWER, MmdView } from "viewer";

export default class MmdViewer extends Plugin {
	settings: MmdSettings;

	async onload() {
		await this.loadSettings();

		this.registerExtensions(["mmd"], "mmd-viewer");
		this.registerView(MMD_VIEWER, (leaf) => new MmdView(leaf));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MmdSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
