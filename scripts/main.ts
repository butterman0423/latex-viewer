import type { PluginSettings } from './settings';

import { Plugin, MarkdownView, finishRenderMath, renderMath } from 'obsidian';
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

            // let mdContent: HTMLElement | null | undefined = null;
            const viewObserver: MutationObserver = new MutationObserver((records, self) => {
                console.log(records);
            });

            this.registerEvent( workspace.on('file-open', (file) => {
                viewObserver.disconnect();
                if(file == null || file.extension != 'md') { return }

                const { contentEl }= workspace.getActiveViewOfType(MarkdownView) as MarkdownView;
                const linesEl = contentEl.querySelector<HTMLElement>('div.cm-content');

                
                if(linesEl == null) {
                    // Push out a notice about the error
                    
                    return;
                }
                
                viewObserver.observe(linesEl, { childList: true, subtree: true })
            }))

            /*
            // Listen to user edits
            this.registerEvent( workspace.on('editor-change', async (editor, _info) => {
                if(mdContent == null || mdContent == undefined) { return }
                if(editor == undefined || !editor.hasFocus()) { return }

                this.updateView(mdContent)
                    .then((el: HTMLElement) => {
                        //console.log(el);
                        finishRenderMath()
                    })
                    .catch(() => {})
            }) );

            // Listen to click events
            this.registerDomEvent( workspace.containerEl, 'click', async () => {
                const { containerEl, activeEditor } = workspace;
                const viewEl = containerEl.querySelector<HTMLElement>('div.cm-editor.cm-focused');

                mdContent = viewEl?.querySelector<HTMLElement>('div.cm-contentContainer');

                // PROBLEM: Triggers before HTML actually updates
                workspace.trigger('editor-change', activeEditor?.editor, activeEditor);
            });

            // "Initialization"
            workspace.containerEl.trigger('click');
            */
        });
    }

    async onunload() {
        LatexView.destroyAll(this.app.workspace);
    }

    async updateView(searchEl: HTMLElement): Promise<HTMLElement> {
        const latexBlock: NodeList = searchEl.querySelectorAll('span.cm-math:not(.cm-formatting-math)');
        let code = 'a + b = c';

        // cm-formatting-math-begin -end

        return renderMath(code, true);
    }

    createLatexSpace(el: HTMLElement): HTMLElement {
        return el.createEl('div', 
            { attr: {hidden: true} }
        );
    }
}