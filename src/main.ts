import { Plugin } from "obsidian";
import { MMD_VIEWER, MmdView } from "viewer";

export default class MmdViewer extends Plugin {
	async onload() {
		this.registerExtensions(["mmd"], "mmd-viewer");
		this.registerView(MMD_VIEWER, (leaf) => new MmdView(leaf));
	}

	onunload() {}
}
