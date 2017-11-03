'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const prefix = 'markdown.extension.';
function activate(context) {
    const cmds = [
        { command: 'toggleHeadingUp', callback: toggleHeadingUp },
        { command: 'toggleHeadingDown', callback: toggleHeadingDown }
    ].map(cmd => {
        cmd.command = prefix + cmd.command;
        return cmd;
    });
    cmds.forEach(cmd => {
        context.subscriptions.push(vscode.commands.registerCommand(cmd.command, cmd.callback));
    });
}
exports.activate = activate;
// Return Promise because need to chain operations in unit tests
function toggleHeadingUp() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let lineIndex = editor.selection.active.line;
        let lineText = editor.document.lineAt(lineIndex).text;
        return yield editor.edit((editBuilder) => {
            if (!lineText.startsWith('#')) {
                editBuilder.insert(new vscode.Position(lineIndex, 0), '# ');
            }
            else if (!lineText.startsWith('######')) {
                editBuilder.insert(new vscode.Position(lineIndex, 0), '#');
            }
        });
    });
}
function toggleHeadingDown() {
    let editor = vscode.window.activeTextEditor;
    let lineIndex = editor.selection.active.line;
    let lineText = editor.document.lineAt(lineIndex).text;
    editor.edit((editBuilder) => {
        if (lineText.startsWith('# ')) {
            editBuilder.delete(new vscode.Range(new vscode.Position(lineIndex, 0), new vscode.Position(lineIndex, 2)));
        }
        else if (lineText.startsWith('#')) {
            editBuilder.delete(new vscode.Range(new vscode.Position(lineIndex, 0), new vscode.Position(lineIndex, 1)));
        }
    });
}
//# sourceMappingURL=formatting.js.map