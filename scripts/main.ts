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

        let mdContent: HTMLElement | null = null;
        const viewObserver: MutationObserver = new MutationObserver(async () => {
            if(mdContent == null) { return }

            const mathEls = mdContent.querySelectorAll('div.cm-active span.cm-math:not(.cm-formatting-math)')
            let rendered: HTMLElement | null = null

            if(mathEls.length > 0) {
                let code = '';
                mathEls.forEach((el) => code + el.getText());

                rendered = renderMath(code, true);
                finishRenderMath();
            }

            // Push update to views
            console.log(rendered);
        });

        this.registerEvent( workspace.on('active-leaf-change', (leaf) => {
            mdContent = null;
            viewObserver.disconnect();

            if(leaf == null) { return }

            const { view } = leaf;
            if( leaf.view.getViewType() != 'markdown') { return }

            const { contentEl } = view as MarkdownView;
            const lineEls = contentEl.querySelector<HTMLElement>('div.cm-content');
            
            if(lineEls == null) {
                // Push out a notice about the error
                return;
            }
            
            mdContent = lineEls;
            viewObserver.observe(lineEls, { childList: true, subtree: true })
        }) );

        workspace.onLayoutReady(async () => {
            // Show leaf
            const leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        });
    }

    async onunload() {
        LatexView.destroyAll(this.app.workspace);
    }
}