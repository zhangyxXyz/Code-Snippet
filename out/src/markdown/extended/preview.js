'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Modified from https://github.com/hnw/vscode-auto-open-markdown-preview
 */
const vscode = require("vscode");
let currentDoc;
function activate(context) {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        autoPreviewToSide(editor);
    });
    // Try preview when this extension is activated the first time
    autoPreviewToSide(vscode.window.activeTextEditor);
    // Override default preview keybindings (from 'open preview' to 'toggle preview' i.e. 'open/close preview')
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.togglePreview', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
        else if (editor.document.languageId === 'markdown') {
            vscode.commands.executeCommand('markdown.showPreview');
        }
    }), vscode.commands.registerCommand('markdown.extension.togglePreviewToSide', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        }
        else if (editor.document.languageId === 'markdown') {
            vscode.commands.executeCommand('markdown.showPreviewToSide');
        }
    }));
}
exports.activate = activate;
function autoPreviewToSide(editor) {
    if (!vscode.workspace.getConfiguration('markdown.extension.preview').get('autoShowPreviewToSide'))
        return;
    if (!editor || editor.document.languageId !== 'markdown')
        return;
    let doc = editor.document;
    if (doc != currentDoc) {
        vscode.commands.executeCommand('markdown.showPreviewToSide')
            .then(() => { vscode.commands.executeCommand('workbench.action.navigateBack'); });
        currentDoc = doc;
    }
}
//# sourceMappingURL=preview.js.map