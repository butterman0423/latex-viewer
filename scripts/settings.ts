import { PluginSettingTab, Setting, App } from 'obsidian';
import type LatexViewerPlugin from './main';

interface PlugSettings {

}

const DEFAULTS: PlugSettings = {

}

class SettingTab extends PluginSettingTab {
    plugin: LatexViewerPlugin

    constructor(app: App, plugin: LatexViewerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl);
    }
}

export type PluginSettings = PlugSettings
export const loadSettings = async (plugin: LatexViewerPlugin) => {

}