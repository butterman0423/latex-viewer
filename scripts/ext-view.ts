import { MarkdownView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE: string = "LATEX_VIEW";

export class LatexView extends MarkdownView {
    cmds: string

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.cmds = "";
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.cmds;
    }

    async onOpen() {
        
    }

    async onClose() {

    }

    async update() {

    }
}