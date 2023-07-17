const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log('Congratulations, your extension "code-typewriter-effect" is now active!');

	let disposable = vscode.commands.registerCommand("code-typewriter-effect.retype", function () {

		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		let currentPosition = 0;
		let text = editor.document.getText();

		editor.edit((editBuilder) => {
			editBuilder.delete(new vscode.Range(0, 0, editor.document.lineCount, 0));
		}).then(() => {
			type();
		});

		function type() {
			let line = text.split("\n")[currentPosition];
			let i = 0;

			function insertNextCharacter() {
				if (i <= line.length) {
					editor.edit((editBuilder) => {
						editBuilder.insert(new vscode.Position(currentPosition, i), line.charAt(i));
					}).then(() => {
						i++;
						setTimeout(insertNextCharacter, 5);
					});
				} else {
					currentPosition++;
					if (currentPosition < text.split("\n").length) {
						line = text.split("\n")[currentPosition];
						i = 0;
						setTimeout(insertNextCharacter, 0);
					}
				}
			}

			insertNextCharacter();
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
