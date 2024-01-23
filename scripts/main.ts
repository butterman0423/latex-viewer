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

            // ISSUE: Triggers when app first load, causes an error to occur
            // User needs to reopen the file again
            this.registerEvent( workspace.on('file-open', (file) => {
                mdContent = null;
                viewObserver.disconnect();

                if(file == null || file.extension != 'md') { return }
                
                // Band-aid fix for ISSUE
                const mdview = workspace.getActiveViewOfType(MarkdownView);
                if(mdview == null) {
                    // Push out a warning or something
                    return
                }

                const { contentEl } = mdview;
                const lineEls = contentEl.querySelector<HTMLElement>('div.cm-content');
                
                if(lineEls == null) {
                    // Push out a notice about the error
                    
                    return;
                }
                
                mdContent = lineEls;
                viewObserver.observe(lineEls, { childList: true, subtree: true })
            }) );
        });
    }

    async onunload() {
        LatexView.destroyAll(this.app.workspace);
    }
}