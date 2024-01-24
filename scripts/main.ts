import type { PluginSettings } from './settings';

import { Plugin, MarkdownView, finishRenderMath, renderMath } from 'obsidian';
import { loadSettings, matchSettings } from './settings';
import { LatexView } from './ren-spaces';

export default class LatexViewerPlugin extends Plugin {
    settings: PluginSettings
    viewObserver: MutationObserver

    async onload() {
        await loadSettings(this);
        const { workspace } = this.app;

        // Commands in separate file (if any)

        // Registering view
        this.registerView( LatexView.VIEW_TYPE, (leaf) => new LatexView(leaf) );

        let mdContent: HTMLElement | null = null;
        this.viewObserver = new MutationObserver(async () => {
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
            this.viewObserver.disconnect();

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
            this.viewObserver.observe(lineEls, { childList: true, subtree: true })
        }) );

        workspace.onLayoutReady(async () => {
            // Show leaf
            const leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: LatexView.VIEW_TYPE, active: true });
        });
    }

    async onunload() {
        this.viewObserver.disconnect();
        LatexView.destroyAll(this.app.workspace);
    }
}