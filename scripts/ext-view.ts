import { MarkdownView, Workspace, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE: string = "LATEX_VIEW";

export class LatexView extends MarkdownView {
    cmds: string

    static async getViewLeaf(workspace: Workspace): Promise<WorkspaceLeaf> {
        const leaves = workspace.getLeavesOfType(VIEW_TYPE);

        if(leaves.length > 0) {
            return leaves[0]
        }

        const leaf = workspace.getRightLeaf(false);
        await leaf.setViewState({ type: VIEW_TYPE, active: true });
        return leaf;
    }

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