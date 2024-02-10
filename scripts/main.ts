import type { PluginSettings } from './settings';

import { Plugin, MarkdownView, Notice, finishRenderMath, renderMath } from 'obsidian';
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

            const mathEls = mdContent.querySelectorAll('span.cm-math:not(.cm-formatting-math)')
            let code = '';
            mathEls.forEach( (el) => code = code + el.getText() );
            code = `$$${code}$$`;

            // Push update to views
            workspace.getLeavesOfType(LatexView.VIEW_TYPE)
                .forEach((leaf) => {
                    (leaf.view as LatexView).update(this, code);
                });
        });

        this.registerEvent( workspace.on('active-leaf-change', (leaf) => {
            mdContent = null;
            this.viewObserver.disconnect();

            if(leaf == null) { return }

            const { view } = leaf;
            if( leaf.view.getViewType() != 'markdown') { return }

            const { contentEl } = view as MarkdownView;
            const lineEls = contentEl.querySelector<HTMLElement>('div.cm-content');
            
            if(true || lineEls == null) {
                // Push out a notice about the error
                new Notice("Latex Viewer ran into a problem.", 10000);
                throw new Error("FATAL ERROR: Issue starting plugin: div.cm-content is not found");
            }
            
            /*
            mdContent = lineEls;
            this.viewObserver.observe(lineEls, { childList: true, characterData: true, subtree: true })
            */
        }) );

        workspace.onLayoutReady(async () => {
            // Show leaf if not already there

            const activeLeaves = workspace.getLeavesOfType(LatexView.VIEW_TYPE);
            if(activeLeaves.length > 0) {
                console.log("View with type found, using that");
                workspace.revealLeaf(activeLeaves[0]);
                return;
            }

            console.log("No view of type found, creating...")
            const leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: LatexView.VIEW_TYPE, active: true });
        });
    }

    async onunload() {
        this.viewObserver.disconnect();
        LatexView.destroyAll(this.app.workspace);
    }
}