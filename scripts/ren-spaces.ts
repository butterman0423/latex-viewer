import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

interface LatexSpace {
    update(rendered: HTMLElement | null): Promise<void>;
    clear(): void;
}

export class LatexView extends ItemView implements LatexSpace {
    static VIEW_TYPE: string = "LATEX_VIEW";
    latexNode: Node | null;
    emptyNode: Node;

    static async destroyAll(workspace: Workspace) {
        workspace.getLeavesOfType(LatexView.VIEW_TYPE)
            .forEach((leaf: WorkspaceLeaf) => leaf.detach());
    }

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);

        this.latexNode = null;
        this.emptyNode = this.createEmptyNode();
    }

    async update(rendered: HTMLElement | null): Promise<void> {
        this.clear();

        if(rendered == null) {
            console.warn('Rendered Mathjax provided is null');
            return;
        }

        this.latexNode = rendered.cloneNode(true);
        this.contentEl.appendChild(this.latexNode);
    }

    clear(addEmpty?: boolean) {
        const { contentEl } = this;
        while(contentEl.lastChild) {
            contentEl.removeChild(contentEl.lastChild);
        }

        this.latexNode = null;
        if(addEmpty) {
            contentEl.appendChild(this.emptyNode);
        }
    }

    async onOpen() {
        this.clear(true);
    }

    private createEmptyNode(): Node {
        return createDiv(undefined, (self) => {
            self.appendChild( createEl('p', {text: "Hello World!"}) );
        });
    }

    getViewType(): string {
        return LatexView.VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.contentEl.innerText;
    }
}