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
        this.clickRegistered = false

        const workspace = this.app.workspace;

        console.log(workspace.containerEl)
        this.latexSpace = this.createLatexSpace(workspace.containerEl);
        console.log(this.latexSpace)

        this.registerView(VIEW_TYPE, (leaf) => new LatexView(leaf));

        // Load in ribbon icon
        const ribbonIcon = this.addRibbonIcon('dice', 'Latex Viewer', (evt: MouseEvent) => {
            // Open up the view
        });

        // Commands in separate file (if any)

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
    }

    async onunload() {
        
    }

    registerClickEvent(workEl: HTMLElement) {
        const clickEl: HTMLElement | null = workEl.querySelector<HTMLElement>('div.cm-content')

        if( clickEl == null ) {
            // Something has gone wrong, abort
            return
        }

        this.mdContent = clickEl
        this.registerDomEvent( this.mdContent as HTMLElement, 'click', this.updateView )
    }

    async updateView() {
        if(this.mdContent == null) { return }

        const latexBlock: NodeList = this.mdContent.querySelectorAll('span.cm-math');
        let code: string = "";

        if( matchSettings(this.settings, latexBlock) ) {

            // Actual latex code in latexBlock[1:-2]
            const lastIdx: number = latexBlock.length - 1;

            for(let i = 1; i < lastIdx; i++) {
                code += (latexBlock[1] as Node).textContent;
            }

            const lastElem: Element = latexBlock[lastIdx] as Element;
            if( !lastElem.hasClass('cm-formatting-math-end') ) {
                code += lastElem.textContent;
            }

            return;
        } 
        
        // TODO: Update view

    }

    createLatexSpace(el: HTMLElement): HTMLElement {
        return el.createEl('div', 
            { attr: {hidden: true} }
        );
    }

    render(code: string) {

    }
}