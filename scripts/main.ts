import type { View, WorkspaceLeaf } from 'obsidian'
import { Plugin } from 'obsidian';

export default class LatexViewerPlugin extends Plugin {
    target: HTMLElement | null

    async onload() {
        const workspace = this.app.workspace;

        // Load in ribbon icon
        const ribbonIcon = this.addRibbonIcon('dice', 'Latex Viewer', (evt: MouseEvent) => {
            // Open up the view
        });

        // Commands in separate file (if any)

        this.registerEvent(workspace.on('active-leaf-change', (leaf: WorkspaceLeaf) => {
            if(leaf == null) { return; }
            this.setTargetView(leaf.view);
        }))
    }

    async onunload() {
        if(this.target != null) {
            this.target.removeEventListener('click', this.clickCallback);
        }
    }

    setTargetView(view: View) {
        if(this.target != null) {
            this.target.removeEventListener('click', this.clickCallback);
        }
        if(view.getViewType() != 'markdown') {
            this.target = null;
            return;
        }

        this.target = view.containerEl;
        view.registerDomEvent(view.containerEl, 'click', this.clickCallback);
    }

    clickCallback(evt: MouseEvent) {
        console.log("I have been clicked!");
    }
}