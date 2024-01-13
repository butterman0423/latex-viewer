import type { Editor, TFile } from 'obsidian'
import { Plugin, MarkdownView} from 'obsidian';

export default class LatexViewerPlugin extends Plugin {
    clickRegistered: boolean

    async onload() {
        this.clickRegistered = false

        const workspace = this.app.workspace;

        // Load in ribbon icon
        const ribbonIcon = this.addRibbonIcon('dice', 'Latex Viewer', (evt: MouseEvent) => {
            // Open up the view
        });

        // Commands in separate file (if any)

        // Listen to user edits
        this.registerEvent( workspace.on('editor-change', this.onEditorChange) );

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

    onEditorChange(editor: Editor, info: MarkdownView) {
        //console.log(info.getViewData())
        //console.log(editor.getCursor())
        console.log('Changed!');
    }

    registerClickEvent(workEl: HTMLElement) {
        const clickEl: HTMLElement | null = workEl.querySelector<HTMLElement>('div.cm-content')

        if( clickEl == null ) {
            // Something has gone horribly wrong, abort
            return
        }

        this.registerDomEvent( clickEl as HTMLElement, 'click', (ev: MouseEvent) => {} )
    }
}