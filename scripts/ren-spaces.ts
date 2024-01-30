import { ItemView, Workspace, WorkspaceLeaf } from "obsidian";

const CONTAINER_CLASS = "latview-container"
const EMPTY_CLASS = "latview-empty-container";
const RENDER_CLASS = "latview-render-container";

interface LatexSpace {
    update(rendered: HTMLElement | null): Promise<void>;
    clear(): void;
}

export class LatexView extends ItemView implements LatexSpace {
    static VIEW_TYPE: string = "LATEX_VIEW";

    static async destroyAll(workspace: Workspace) {
        workspace.getLeavesOfType(LatexView.VIEW_TYPE)
            .forEach((leaf: WorkspaceLeaf) => leaf.detach());
    }

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    // Hangs on active update, might not be function fault
    // could be that mutation observer is not detecting the change
    async update(rendered: HTMLElement | null): Promise<void> {
        this.clear();

        if(rendered == null) {
            console.warn('Rendered Mathjax provided is null');
            return;
        }

        const renBlock = this.contentEl.querySelector(`.${CONTAINER_CLASS}`) as HTMLElement;

        (renBlock.querySelector(`.${EMPTY_CLASS}`) as HTMLElement).setAttr('hidden', true);
        renBlock.createDiv(
            {cls: RENDER_CLASS}, 
            (el) => el.appendChild( rendered.cloneNode(true) )
        );
    }

    clear() {
        const { contentEl } = this;

        contentEl.querySelector(`.${RENDER_CLASS}`)?.remove();
        contentEl.querySelector(`.${EMPTY_CLASS}`)?.setAttr('hidden', null);
    }

    async onOpen() {
        this.clear();
        const { contentEl } = this;

        // Header block
        contentEl.createDiv({cls: "inline-title", text: "Latex View"})
        
        // Render Content block
        const renBlock = contentEl.createDiv({cls: CONTAINER_CLASS});
        renBlock.createDiv({cls: EMPTY_CLASS}, (el) => {
            el.createDiv({text: "No Active Latex Found"})
            el.createDiv({text: "Your latex codeblock will render here once it is selected"})
        });
    }

    getViewType(): string {
        return LatexView.VIEW_TYPE;
    }

    getDisplayText(): string {
        return this.contentEl.innerText;
    }
}