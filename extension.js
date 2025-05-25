const vscode = require("vscode");
const Typo = require("typo-js");
const path = require("path");
/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
  const dictPath = path.join(
    context.extensionPath,
    "node_modules",
    "typo-js",
    "dictionaries"
  );
  const dictionary = new Typo("en_US", null, null, {
    dictionaryPath: dictPath,
  });
  

  let disposable = vscode.commands.registerCommand(
    "spelling-check.spellingCheck",
    async function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
      } else {
        console.log("no text editor is selected");
      }

      vscode.window.showInformationMessage("Spelling Check Extension is activated!");
    }
  );

  let disposable2 = vscode.languages.registerHoverProvider({scheme:"*", language:"*"}, {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position);

      if (range) {
        const word = document.getText(range);
        if (!dictionary.check(word)) {
          const suggestion = dictionary.suggest(word);
          const suggestionText = suggestion.length ? `Did you mean:${suggestion.join(", ")}?` : "no suggestion available";
          return new vscode.Hover(`${word} is not correct ${suggestionText}`);
        } else {
          return new vscode.Hover(`${word} is correct word`);
        }
      }
      return null;
    },
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable);
}
function deactivate() { }
module.exports = {
  activate,
  deactivate,
};