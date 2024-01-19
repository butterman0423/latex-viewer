import type { MarkdownFileInfo, TFile } from 'obsidian'
import type { PluginSettings } from './settings';

import { MarkdownRenderer, Plugin } from 'obsidian';
import { loadSettings, matchSettings } from './settings';
import { LatexView, VIEW_TYPE } from './ext-view';

export default class LatexViewerPlugin extends Plugin {
    settings: PluginSettings

    async onload() {
        await loadSettings(this);
        const { workspace } = this.app;

        // Commands in separate file (if any)

        // Registering view
        this.registerView(VIEW_TYPE, (leaf) => new LatexView(leaf));
        
        workspace.onLayoutReady(async () => {
            // Show leaf
            const leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });

            let mdContent: HTMLElement | null | undefined = null;

            // Listen to user edits
            this.registerEvent( workspace.on('editor-change', async (editor, _info) => {
                if(mdContent == null || mdContent == undefined) { return }
                if(editor != undefined && editor.hasFocus()) {
                    const latexSpace = this.createLatexSpace(workspace.containerEl);
                    this.updateView(mdContent, latexSpace);
                }
            }) );

            // Listen to click events
            this.registerDomEvent( workspace.containerEl, 'click', async () => {
                const { containerEl, activeEditor } = workspace;
                const viewEl = containerEl.querySelector<HTMLElement>('div.cm-editor.cm-focused');

                mdContent = viewEl?.querySelector<HTMLElement>('div.cm-contentContainer');
                workspace.trigger('editor-change', activeEditor?.editor, activeEditor);
            })

            // "Initialization"
            workspace.containerEl.trigger('click');
        });
    }

    async onunload() {
        LatexView.destroyAll(this.app.workspace);
    }

    async updateView(searchEl: HTMLElement, modEl: HTMLElement) {
        const latexBlock: NodeList = searchEl.querySelectorAll('span.cm-math:not(.cm-formatting-math)');
        let code = 'a + b = c';

        // cm-formatting-math-begin -end

        MarkdownRenderer.render(this.app, `$$${code}$$`, modEl, '', this);

        console.log(modEl);
    }

    reset() {

    }

    createLatexSpace(el: HTMLElement): HTMLElement {
        return el.createEl('div', 
            { attr: {hidden: true} }
        );
    }
}