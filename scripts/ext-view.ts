import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

interface LatexSpace {
    update(rendered: HTMLElement): Promise<void>;
}

export const VIEW_TYPE: string = "LATEX_VIEW";

export class LatexView extends ItemView implements LatexSpace {
    cmds: string

    static async destroyAll(workspace: Workspace) {
        workspace.getLeavesOfType(VIEW_TYPE)
            .forEach((leaf: WorkspaceLeaf) => leaf.detach());
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

    async update(rendered: HTMLElement): Promise<void> {
        
    }
}