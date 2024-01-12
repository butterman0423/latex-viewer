import type { View, WorkspaceLeaf } from 'obsidian'
import { Plugin } from 'obsidian';

export default class LatexViewerPlugin extends Plugin {
    async onload() {
        const workspace = this.app.workspace;

        // Load in ribbon icon
        const ribbonIcon = this.addRibbonIcon('dice', 'Latex Viewer', (evt: MouseEvent) => {
            // Open up the view
        });

        // Commands in separate file (if any)
    }

    async onunload() {
        
    }
}