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
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.onEnterKey', onEnterKey));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.onCtrlEnterKey', () => { onEnterKey('ctrl'); }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.onTabKey', onTabKey));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.onBackspaceKey', onBackspaceKey));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.checkTaskList', checkTaskList));
}
exports.activate = activate;
function isInFencedCodeBlock(doc, lineNum) {
    let textBefore = doc.getText(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(lineNum, 0)));
    let matches = textBefore.match(/```.*\r?\n/g);
    if (matches == null) {
        return false;
    }
    else {
        return matches.length % 2 != 0;
    }
}
function onEnterKey(modifiers) {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let cursorPos = editor.selection.active;
        let line = editor.document.lineAt(cursorPos.line);
        let textBeforeCursor = line.text.substr(0, cursorPos.character);
        let textAfterCursor = line.text.substr(cursorPos.character);
        let lineBreakPos = cursorPos;
        if (modifiers == 'ctrl') {
            lineBreakPos = line.range.end;
        }
        if (isInFencedCodeBlock(editor.document, cursorPos.line)) {
            // Normal behavior
            if (modifiers == 'ctrl') {
                return vscode.commands.executeCommand('editor.action.insertLineAfter');
            }
            else {
                return vscode.commands.executeCommand('type', { source: 'keyboard', text: '\n' });
            }
        }
        // If it's an empty list item, remove it
        if (/^([-+*]|[0-9]+[.)])(| \[[ x]\])$/.test(textBeforeCursor.trim()) && textAfterCursor.trim().length == 0) {
            return editor.edit(editBuilder => {
                editBuilder.delete(line.range);
                editBuilder.insert(line.range.end, '\n');
            });
        }
        let matches;
        if ((matches = /^(\s*[-+*] +(|\[[ x]\] +))[^\[\]]+$/.exec(textBeforeCursor)) !== null) {
            // Unordered list
            yield editor.edit(editBuilder => {
                editBuilder.insert(lineBreakPos, `\n${matches[1].replace('[x]', '[ ]')}`);
            });
            // Fix cursor position
            if (modifiers == 'ctrl' && !cursorPos.isEqual(lineBreakPos)) {
                let newCursorPos = cursorPos.with(line.lineNumber + 1, matches[1].length);
                editor.selection = new vscode.Selection(newCursorPos, newCursorPos);
            }
        }
        else if ((matches = /^(\s*)([0-9]+)([.)])( +)(|\[[ x]\] +)[^\[\]]+$/.exec(textBeforeCursor)) !== null) {
            // Ordered list
            //let config = vscode.workspace.getConfiguration('markdown.extension.orderedList').get('marker');
            let marker = '1';
            let leadingSpace = matches[1];
            let previousMarker = matches[2];
            let delimiter = matches[3];
            let trailingSpace = matches[4];
            let gfmCheckbox = matches[5].replace('[x]', '[ ]');
            let textIndent = (previousMarker + delimiter + trailingSpace).length;
            //if (config == 'ordered') {
            marker = String(Number(previousMarker) + 1);
            //}
            // Add enough trailing spaces so that the text is aligned with the previous list item, but always keep at least one space
            trailingSpace = " ".repeat(Math.max(1, textIndent - (marker + delimiter).length));
            yield editor.edit(editBuilder => {
                editBuilder.insert(lineBreakPos, `\n${leadingSpace + marker + delimiter + trailingSpace + gfmCheckbox}`);
            });
            // Fix cursor position
            if (modifiers == 'ctrl' && !cursorPos.isEqual(lineBreakPos)) {
                let newCursorPos = cursorPos.with(line.lineNumber + 1, (leadingSpace + marker + trailingSpace + gfmCheckbox).length);
                editor.selection = new vscode.Selection(newCursorPos, newCursorPos);
            }
        }
        else {
            // Normal behavior
            if (modifiers == 'ctrl') {
                return vscode.commands.executeCommand('editor.action.insertLineAfter');
            }
            else {
                return vscode.commands.executeCommand('type', { source: 'keyboard', text: '\n' });
            }
        }
    });
}
function onTabKey() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let cursorPos = editor.selection.active;
        let textBeforeCursor = editor.document.lineAt(cursorPos.line).text.substr(0, cursorPos.character);
        if (isInFencedCodeBlock(editor.document, cursorPos.line)) {
            // Normal behavior
            return vscode.commands.executeCommand('tab');
        }
        if (/^\s*([-+*]|[0-9]+[.)]) +(|\[[ x]\] +)$/.test(textBeforeCursor)) {
            return vscode.commands.executeCommand('editor.action.indentLines');
        }
        else {
            // Normal behavior
            return vscode.commands.executeCommand('tab');
        }
    });
}
function onBackspaceKey() {
    return __awaiter(this, void 0, void 0, function* () {
        let editor = vscode.window.activeTextEditor;
        let oldPosition = editor.selection.active; // Old cursor position
        // FIXME: Handle Vietnamese //
        // let isTypingVn = await handler.vnTest();
        let newPosition = editor.selection.active; // Current cursor position
        // if (isTypingVn == false && oldPosition.character == newPosition.character) { // Not typing Vietnamese
        let document = editor.document;
        let textBeforeCursor = document.lineAt(newPosition.line).text.substr(0, newPosition.character);
        if (isInFencedCodeBlock(document, newPosition.line)) {
            // Normal behavior
            return vscode.commands.executeCommand('deleteLeft');
        }
        if (/^\s+([-+*]|[0-9]+[.)]) (|\[[ x]\] )$/.test(textBeforeCursor)) {
            return vscode.commands.executeCommand('editor.action.outdentLines');
        }
        else if (/^([-+*]|[0-9]+[.)]) $/.test(textBeforeCursor)) {
            // e.g. textBeforeCursor == '- ', '1. '
            return deleteRange(editor, new vscode.Range(newPosition.with({ character: 0 }), newPosition));
        }
        else if (/^([-+*]|[0-9]+[.)]) (\[[ x]\] )$/.test(textBeforeCursor)) {
            // e.g. textBeforeCursor == '- [ ]', '1. [x]'
            return deleteRange(editor, new vscode.Range(newPosition.with({ character: textBeforeCursor.length - 4 }), newPosition));
        }
        else {
            // Normal behavior
            return vscode.commands.executeCommand('deleteLeft');
        }
        // } else {
        //     if (oldPosition.character == newPosition.character) {
        //         // Normal behavior
        //         return commands.executeCommand('deleteLeft');
        //     } else {
        //         let characterCount = newPosition.character - oldPosition.character;
        //         if (characterCount < 0) {
        //             return false;
        //         }
        //         return handler.handleUnikey(characterCount).then(result => {
        //             if (result == true) {
        //                 deleteRange(editor, new Range(newPosition.line, oldPosition.character - characterCount,
        //                     newPosition.line, oldPosition.character));
        //                 return true;
        //             } else {
        //                 return false;
        //             }
        //         });
        //     }
        // }
    });
}
function deleteRange(editor, range) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield editor.edit(editBuilder => {
            editBuilder.delete(range);
        });
    });
}
function checkTaskList() {
    let editor = vscode.window.activeTextEditor;
    let cursorPos = editor.selection.active;
    let line = editor.document.lineAt(cursorPos.line).text;
    let matches;
    if (matches = /^(\s*([-+*]|[0-9]+[.)]) \[) \]/.exec(line)) {
        return editor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(cursorPos.with({ character: matches[1].length }), cursorPos.with({ character: matches[1].length + 1 })), 'x');
        });
    }
    else if (matches = /^(\s*([-+*]|[0-9]+[.)]) \[)x\]/.exec(line)) {
        return editor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(cursorPos.with({ character: matches[1].length }), cursorPos.with({ character: matches[1].length + 1 })), ' ');
        });
    }
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=listEditing.js.map