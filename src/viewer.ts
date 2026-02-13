import { FileView, TFile, WorkspaceLeaf, loadMermaid } from "obsidian";
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
		this.fileName = file.name;
		let fileContent = await file.vault.read(file);
		const container = this.contentEl;
		container.empty();
		const mermaid = await loadMermaid();
		mermaid.initialize({ theme: "dark" });

		let content = container.createDiv("graphDiv");
		const { svg } = await mermaid.render("graphDiv", fileContent);
		content.innerHTML = svg;
		content.style = "height:100%";

		let svgElement = content.getElementsByTagName("svg").item(0);
		if (svgElement !== null) {
			svgElement.style = "height:100%";
			let panZoomTiger = svgPanZoom(svgElement);
			panZoomTiger.fit();
		}
	}

	async onClose() {
		// Nothing to clean up.
	}
}
