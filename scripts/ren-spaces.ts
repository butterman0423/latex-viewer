import { ItemView, Workspace, WorkspaceLeaf, MarkdownRenderer, Plugin } from "obsidian";

const CONTAINER_CLASS = "latview-container"
const EMPTY_CLASS = "latview-empty-container";
const RENDER_CLASS = "latview-render-container";

interface LatexSpace {
    update(plugin: Plugin, code: string): Promise<void>;
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

    async update(plugin: Plugin, code: string): Promise<void> {
        this.clear();

        if(code === "$$$$") {
            console.warn('Latex Provided is empty');
            return;
        }

        const renBlock = this.contentEl.querySelector(`.${CONTAINER_CLASS}`) as HTMLElement;

        (renBlock.querySelector(`.${EMPTY_CLASS}`) as HTMLElement).setAttr('hidden', true);
        renBlock.createDiv(
            {cls: RENDER_CLASS}, 
            async el => await MarkdownRenderer.render(plugin.app, code, el, "", plugin)
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