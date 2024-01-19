import type { TFile } from 'obsidian'
import type { PluginSettings } from './settings';

import { MarkdownRenderer, Plugin } from 'obsidian';
import { loadSettings, matchSettings } from './settings';
import { LatexView, VIEW_TYPE } from './ext-view';

export default class LatexViewerPlugin extends Plugin {
    settings: PluginSettings

    clickRegistered: boolean
    mdContent: HTMLElement | null

    latexSpace: HTMLElement

    async onload() {
        await loadSettings(this);
        const workspace = this.app.workspace;

        this.clickRegistered = false
        this.latexSpace = this.createLatexSpace(workspace.containerEl);

        // Commands in separate file (if any)

        workspace.onLayoutReady(async () => {

        // Registering view
        this.registerView(VIEW_TYPE, (leaf) => new LatexView(leaf));

        // Listen to user edits
        this.registerEvent( workspace.on('editor-change', this.updateView) );

        // File to register click listener
        this.registerEvent( workspace.on('file-open', (file: TFile | null) => {
            if(file == null) { 
                this.clickRegistered = false;
                return;
            }

            if(this.clickRegistered) { return }
            if( (file as TFile).extension != 'md' ) { return }

            console.log('Registering click event');

            this.clickRegistered = true;
            this.registerClickEvent(workspace.containerEl);
        }) );

        // Show leaf
        const leaf = workspace.getRightLeaf(false);
        await leaf.setViewState({ type: VIEW_TYPE, active: true });
        });
    }

    async onunload() {
        // TODO: Figure out how to unregister a view
        LatexView.destroyAll(this.app.workspace);
    }

    registerClickEvent(workEl: HTMLElement) {
        const clickEl: HTMLElement | null = workEl.querySelector<HTMLElement>('div.cm-content')

        if( clickEl == null ) {
            // Something has gone wrong, abort
            return
        }

        this.mdContent = clickEl;
        this.registerDomEvent( this.mdContent as HTMLElement, 'click', this.updateView );
    }

    async updateView() {
        // TODO: There seems to be a bug where null is not being caught
        if(this.mdContent == null || this.mdContent == undefined) { return }

        const latexBlock: NodeList = this.mdContent.querySelectorAll('span.cm-math');
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