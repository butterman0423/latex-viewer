import type { MarkdownFileInfo, TFile } from 'obsidian'
import type { PluginSettings } from './settings';

import { MarkdownRenderer, Plugin } from 'obsidian';
import { loadSettings, matchSettings } from './settings';
import { LatexView, VIEW_TYPE } from './ext-view';

export default class LatexViewerPlugin extends Plugin {
    settings: PluginSettings

    async onload() {
        await loadSettings(this);
        const workspace = this.app.workspace;

        // Commands in separate file (if any)

        // Registering view
        this.registerView(VIEW_TYPE, (leaf) => new LatexView(leaf));
        
        workspace.onLayoutReady(async () => {
            // Show leaf
            const leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });

            const mdContent = workspace.containerEl.querySelector<HTMLElement>('div.cm-content');
            const latexSpace = this.createLatexSpace(workspace.containerEl);

            // Listen to user edits
            this.registerEvent( workspace.on('editor-change', async (editor, _info) => {
                if(editor != undefined && editor.hasFocus()) {
                    
                }
            }) );

            // Listen to click events
            this.registerDomEvent( workspace.containerEl, 'click', async () => {
                const { activeEditor } = workspace;
                workspace.trigger('editor-change', activeEditor?.editor, activeEditor);
            })
        });

        
    }

    async onunload() {
        LatexView.destroyAll(this.app.workspace);
    }

    async updateView() {
        if(this.mdContent == null) { return }

        const latexBlock: NodeList = this.mdContent.querySelectorAll('span.cm-math:not(.cm-formatting-math)');
        let code: string = "";

        if( latexBlock.length > 0 && matchSettings(this.settings, latexBlock) ) {

            // Actual latex code in latexBlock[1:-2]
            const lastIdx: number = latexBlock.length - 1;

            for(let i = 1; i < lastIdx; i++) {
                code += (latexBlock[i] as Node).textContent;
            }

            const lastElem: Element = latexBlock[lastIdx] as Element;
            if( !lastElem.hasClass('cm-formatting-math-end') ) {
                code += lastElem.textContent;
            }

            return;
        } 

        // Render the latex code
        MarkdownRenderer.render(this.app, `$$${code}$$`, this.latexSpace, '', this);

        // TODO: Send to components
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE);
        
    }

    createLatexSpace(el: HTMLElement): HTMLElement {
        return el.createEl('div', 
            { attr: {hidden: true} }
        );
    }
}