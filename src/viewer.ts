import mermaid, { MermaidConfig } from "mermaid";
import { FileView, TFile, WorkspaceLeaf } from "obsidian";
import svgPanZoom from "svg-pan-zoom";

export const MMD_VIEWER = "mmd-viewer";

function isDarkMode() {
	return (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	);
}

export class MmdView extends FileView {
	fileName: string | null;
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return MMD_VIEWER;
	}

	getDisplayText() {
		return this.fileName ?? "Mmd viewer";
	}

	async onLoadFile(file: TFile) {
		this.fileName = file.name;
		let fileContent = await file.vault.read(file);
		const container = this.contentEl;
		container.empty();
		let mermaidConfiguration: MermaidConfig = isDarkMode()
			? { theme: "dark" }
			: {};
		mermaid.initialize(mermaidConfiguration);

		let content = container.createDiv("graph");
		const { svg } = await mermaid.render("graph", fileContent);

		// MermaidJS documentation recommends adding rendered svg to the DOM this way.
		// So disabling the rule.
		// eslint-disable-next-line @microsoft/sdl/no-inner-html
		content.innerHTML = svg;

		let svgElement = content.getElementsByTagName("svg").item(0);
		if (svgElement !== null) {
			svgElement.style = "height:100%";
			let panZoomTiger = svgPanZoom(svgElement);
			panZoomTiger.setZoomScaleSensitivity(0.4);
			panZoomTiger.fit();
		}
	}

	async onClose() {
		// Nothing to clean up.
	}
}
