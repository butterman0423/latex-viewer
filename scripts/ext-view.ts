import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

interface LatexSpace {
    update(rendered: HTMLElement): Promise<void>;
}

export class LatexView extends ItemView implements LatexSpace {
    static VIEW_TYPE: string = "LATEX_VIEW";
    cmds: string

    static async destroyAll(workspace: Workspace) {
        workspace.getLeavesOfType(LatexView.VIEW_TYPE)
            .forEach((leaf: WorkspaceLeaf) => leaf.detach());
    }

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.cmds = "";
    }

    getViewType(): string {
        return LatexView.VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.cmds;
    }

    async onOpen() {
        
    }

    async onClose() {
        
    }

    async update(rendered: HTMLElement): Promise<void> {
        
    }
}