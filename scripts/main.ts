import type { Editor, TFile } from 'obsidian'
import { Plugin, MarkdownView} from 'obsidian';

export default class LatexViewerPlugin extends Plugin {
    clickRegistered: boolean
    mdContent: HTMLElement | null

    async onload() {
        this.clickRegistered = false

        const workspace = this.app.workspace;

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

            console.log('Registering click event')

            this.clickRegistered = true
            this.registerClickEvent(workspace.containerEl)
        }) );
    }

    async onunload() {
        
    }

    registerClickEvent(workEl: HTMLElement) {
        const clickEl: HTMLElement | null = workEl.querySelector<HTMLElement>('div.cm-content')

        if( clickEl == null ) {
            // Something has gone horribly wrong, abort
            return
        }

        this.mdContent = clickEl
        this.registerDomEvent( this.mdContent as HTMLElement, 'click', this.updateView )
    }

    async updateView() {
        if(this.mdContent == null) { return }

        const activeEl = this.mdContent.querySelector<HTMLElement>('div.cm-active');
        if(activeEl == null) { return }

        const latexBlock: NodeList = activeEl.querySelectorAll('span.cm-math');
        
        if( latexBlock.length == 1 ) {
            // This is a $$ on the screen, where the cursor 
            // is at the end, setting maybe???
        }

        // Otherwise the length will always be 3

        // TODO: Run a settings check using latexBlock

        // Actual latex code in idx 1
        const latexCmds: Node = latexBlock.item(1) as Node;
        console.log(latexCmds.textContent);
    }
}