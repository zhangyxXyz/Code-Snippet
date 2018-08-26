'use strict';
var vscode = require("vscode")
var editorHelpers = require("./editorHelpers");
var tables = require("./tables");

module.exports = {
    register: register
}

var _commands = [
    new Command('toggleStrikethrough', toggleStrikethrough, 'Strikethrough', '~~Strikethrough text~~', true),
    new Command('showCommandPalette', showCommandPalette),
    new Command('toggleBold', toggleBold, 'Bold', '**Bold text**', true),
    new Command('toggleItalic', toggleItalic, 'Italic', '_italic text_', true),
    new Command('toggleCodeBlock', toggleCodeBlock, 'Code block', '```Code block```', true),
    new Command('toggleInlineCode', toggleInlineCode, 'Inline code', '`Inline code`', true),
    new Command('toggleLink', toggleLink, 'Hyperlink', '[Link text](link_url)', true),
    new Command('toggleImage', toggleImage, 'Image', '![](image_url)', true),
    new Command('toggleBullets', toggleBullets, 'Bullet points', '* Bullet point', true),
    new Command('toggleOrderedList', toggleOrderedList, 'Number list', '1 Numbered list item', true),
    new Command('toggleCheckboxes', toggleCheckboxes, 'Checkboxes', '- [x] Checkbox item', true),
    new Command('toggleMathFormula', toggleMath, 'MathFormula', '$$ MathFormula Symbol', true),
    new Command('addTable', tables.addTable, 'Table', 'Tabular | values', true),
    new Command('addTableWithHeader', tables.addTableWithHeader, 'Table (with header)', 'Tabular | values', true)
]

function register(context) {

    _commands.map((cmd) => {
        context.subscriptions.push(vscode.commands.registerCommand('markdown.extension.' + cmd.command, cmd.callback))
    })
}

function showCommandPalette() {
    vscode.window.showQuickPick(_commands.filter((cmd) => cmd.showInCommandPalette), {
        matchOnDescription: true
    })
        .then((cmd) => {
            if (!cmd) return;

            cmd.callback();
        })
}

const wordMatch = '[A-Za-z\\u00C0-\\u017F]';

const toggleBoldPattern = new RegExp('\\*{2}' + wordMatch + '*\\*{2}|' + wordMatch + '+');
function toggleBold() {
    return editorHelpers.surroundSelection('**', '**', toggleBoldPattern);
}

const toggleItalicPattern = new RegExp('_?' + wordMatch + '*_?')
function toggleItalic() {
    return editorHelpers.surroundSelection('_', '_', toggleItalicPattern);
}

const toggleStrikethroughPattern = new RegExp('~{2}' + wordMatch + '*~{2}|' + wordMatch + '+');
function toggleStrikethrough() {
    return editorHelpers.surroundSelection('~~', '~~', toggleStrikethroughPattern);
}

var newLine = vscode.workspace.getConfiguration('files').get('eol', '\r\n');
var startingBlock = '```' + newLine;
var endingBlock = newLine + '```';
var codeBlockWordPattern = new RegExp(startingBlock + '.+' + endingBlock + '|.+', 'gm');
function toggleCodeBlock() {
    return editorHelpers.surroundBlockSelection(startingBlock, endingBlock, codeBlockWordPattern)
}

const toggleInlineCodePattern = new RegExp('`' + wordMatch + '*`|' + wordMatch + '+')
function toggleInlineCode() {
    return editorHelpers.surroundSelection('`', '`', toggleInlineCodePattern);
}

var HasBullets = /^(\s*)\* (.*)$/gm
var AddBullets = /^(\s*)(.+)$/gm
function toggleBullets() {

    if (!editorHelpers.isAnythingSelected()) {
        return editorHelpers.surroundSelection("* ", "", /\* .+|.+/);
    }

    if (editorHelpers.isMatch(HasBullets)) {
        return editorHelpers.replaceBlockSelection((text) => text.replace(HasBullets, "$1$2"))
    }
    else {
        return editorHelpers.replaceBlockSelection((text) => text.replace(AddBullets, "$1* $2"))
    }
}

var HasNumbers = /^(\s*)[0-9]\.+ (.*)$/gm
var AddNumbers = /^(\n?)(\s*)(.+)$/gm
function toggleOrderedList() {

    if (!editorHelpers.isAnythingSelected()) {
        editorHelpers.surroundSelection("1. ", "")
        return;
    }

    if (editorHelpers.isMatch(HasNumbers)) {
        editorHelpers.replaceBlockSelection((text) => text.replace(HasNumbers, "$1$2"))
    }
    else {
        var lineNums = {};
        editorHelpers.replaceBlockSelection((text) => text.replace(AddNumbers, (match, newline, whitespace, line) => {
            if (!lineNums[whitespace]) {
                lineNums[whitespace] = 1
            }
            return newline + whitespace + lineNums[whitespace]++ + ". " + line
        }))
    }
}

var HasCheckboxes = /^(\s*)- \[[ x]{1}\] (.*)$/gmi
var AddCheckboxes = /^(\s*)(.+)$/gm
function toggleCheckboxes() {

    if (!editorHelpers.isAnythingSelected()) {
        editorHelpers.surroundSelection("- [ ] ", "", /- \[[ x]{1}\] .+|.+/gi)
        return;
    }

    if (editorHelpers.isMatch(HasCheckboxes)) {
        editorHelpers.replaceBlockSelection((text) => text.replace(HasCheckboxes, "$1$2"))
    }
    else {
        editorHelpers.replaceBlockSelection((text) => text.replace(AddCheckboxes, "$1- [ ] $2"))
    }
}


function toggleMath() {
    let editor = vscode.window.activeTextEditor;
    if (!editor.selection.isEmpty)
        return;
    let cursor = editor.selection.active;
    if (getContext('$') === '$|$') {
        return editor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(cursor.line, cursor.character - 1, cursor.line, cursor.character + 1), '$$  $$');
        }).then(() => {
            let pos = cursor.with({ character: cursor.character + 2 });
            editor.selection = new vscode.Selection(pos, pos);
        });
    }
    else if (getContext('$$ ', ' $$') === '$$ | $$') {
        return editor.edit(editBuilder => {
            editBuilder.delete(new vscode.Range(cursor.line, cursor.character - 3, cursor.line, cursor.character + 3));
        });
    }
    else {
        return vscode.commands.executeCommand('editor.action.insertSnippet', { snippet: '$$0$' });
    }
}
function getContext(startPattern, endPattern) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    let position = selection.active;
    let startPositionCharacter = position.character - startPattern.length;
    let endPositionCharacter = position.character + endPattern.length;
    if (startPositionCharacter < 0) {
        startPositionCharacter = 0;
    }
    let leftText = editor.document.getText(selection.with({ start: position.with({ character: startPositionCharacter }) }));
    let rightText = editor.document.getText(selection.with({ end: position.with({ character: endPositionCharacter }) }));
    if (rightText == endPattern) {
        if (leftText == startPattern) {
            return `${startPattern}|${endPattern}`;
        }
        else {
            return `${startPattern}text|${endPattern}`;
        }
    }
    return '|';
}

const MarkdownLinkRegex = /^\[.+\]\(.+\)$/;
const UrlRegex = /^(http[s]?:\/\/.+|<http[s]?:\/\/.+>)$/;
const MarkdownLinkWordPattern = new RegExp('[.+\]\(.+\)|' + wordMatch + '+');
function toggleLink() {

    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;

    if (!editorHelpers.isAnythingSelected()) {
        var withSurroundingWord = editorHelpers.getSurroundingWord(editor, selection, MarkdownLinkWordPattern);

        if (withSurroundingWord != null) {
            selection = editor.selection = withSurroundingWord;
        }
    }

    if (editorHelpers.isAnythingSelected()) {
        if (editorHelpers.isMatch(MarkdownLinkRegex)) {
            //Selection is a MD link, replace it with the link text
            editorHelpers.replaceSelection((text) => text.match(/\[(.+)\]/)[1])
            return;
        }

        if (editorHelpers.isMatch(UrlRegex)) {
            //Selection is a URL, surround it with angle brackets
            editorHelpers.surroundSelection('<', '>');
            return;
        }
    }

    return getLinkText()
        .then(getLinkUrl)
        .then(addTags);

    function getLinkText() {
        if (selection.isEmpty) {
            return vscode.window.showInputBox({
                prompt: "Link text"
            })
        }

        return Promise.resolve("")
    }

    function getLinkUrl(linkText) {
        if (linkText == null || linkText == undefined) return;

        return vscode.window.showInputBox({
            prompt: "Link URL"
        })
            .then((url) => {
                return { text: linkText, url: url }
            })
    }

    function addTags(options) {
        if (!options || !options.url) return;

        editorHelpers.surroundSelection("[" + options.text, "](" + options.url + ")")
    }
}


const MarkdownImageRegex = /!\[.*\]\((.+)\)/;
function toggleImage() {

    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;

    if (editorHelpers.isAnythingSelected()) {
        if (editorHelpers.isMatch(MarkdownImageRegex)) {
            //Selection is a MD link, replace it with the link text
            editorHelpers.replaceSelection((text) => text.match(MarkdownImageRegex)[1])
            return;
        }

        if (editorHelpers.isMatch(UrlRegex)) {
            return vscode.window.showInputBox({
                prompt: "Image alt text"
            })
                .then(text => {
                    if (text == null) return;
                    editorHelpers.replaceSelection((url) => "![" + text + "](" + url + ")");
                });
        }
    }

    var editor = vscode.window.activeTextEditor;
    var selection = editor.selection;

    return getLinkText()
        .then(getLinkUrl)
        .then(addTags);

    function getLinkText() {
        if (selection.isEmpty) {
            return vscode.window.showInputBox({
                prompt: "Image alt text"
            })
        }

        return Promise.resolve("")
    }

    function getLinkUrl(linkText) {
        if (linkText == null || linkText == undefined) return;

        return vscode.window.showInputBox({
            prompt: "Image URL"
        })
            .then((url) => {
                return { text: linkText, url: url }
            })
    }

    function addTags(options) {
        if (!options || !options.url) return;

        editorHelpers.surroundSelection("![" + options.text, "](" + options.url + ")")
    }
}


function Command(command, callback, label, description, showInCommandPalette) {
    this.command = command;
    this.callback = callback;
    this.label = label;
    this.description = description;
    this.showInCommandPalette = showInCommandPalette ? showInCommandPalette : false;
}