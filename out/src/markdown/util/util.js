'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdDocSelector = [{ language: 'markdown', scheme: 'file' }, { language: 'markdown', scheme: 'untitled' }];
function isMdEditor(editor) {
    return editor && editor.document && editor.document.languageId === 'markdown';
}
exports.isMdEditor = isMdEditor;
//# sourceMappingURL=util.js.map