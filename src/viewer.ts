import mermaid, { MermaidConfig } from "mermaid";
import { FileView, TFile, WorkspaceLeaf } from "obsidian";
import svgPanZoom from "svg-pan-zoom";

export const MMD_VIEWER = "mmd-viewer";

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
		const { app } = this;
		this.fileName = file.name;
		let fileContent = await file.vault.read(file);
		const container = this.contentEl;
		container.empty();
		let mermaidConfiguration: MermaidConfig = app.isDarkMode()
			? { theme: "dark" }
			: {};
		mermaid.initialize(mermaidConfiguration);

		let content = container.createDiv("graph");
		const { svg } = await mermaid.render("graph", fileContent);

		content.setHTMLUnsafe(svg);

		let svgElement = content.getElementsByTagName("svg").item(0);
		if (svgElement !== null) {
			svgElement.style = "height:100%";
			const panZoomTiger = svgPanZoom(svgElement);
			panZoomTiger.setZoomScaleSensitivity(0.4);
			panZoomTiger.fit();
		}
	}

	onClose(): Promise<void> {
		const container = this.contentEl;

		let svgElement = container.getElementsByTagName("svg").item(0);
		if (svgElement !== null) {
			const panZoomTiger = svgPanZoom(svgElement);
			panZoomTiger.destroy();
		}
		return Promise.resolve();
	}
}
