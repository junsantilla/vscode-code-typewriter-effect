const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log(
		'Congratulations, your extension "code-typewriter-effect" is now active!'
	);

	let disposable = vscode.commands.registerCommand(
		"code-typewriter-effect.retype",
		function () {
			// The code you place here will be executed every time your command is executed

			let editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			let currentPosition = 0;
			let text = editor.document.getText();

			editor.edit((editBuilder) => {
				editBuilder.delete(
					new vscode.Range(0, 0, editor.document.lineCount, 0)
				);
			});

			function type() {
				let line = text.split("\n")[currentPosition];
				let i = 0;

				function insertNextCharacter() {
					if (i < line.length) {
						editor
							.edit((editBuilder) => {
								editBuilder.insert(
									new vscode.Position(currentPosition, i),
									line.charAt(i)
								);
							})
							.then(() => {
								i++;
								setTimeout(insertNextCharacter, 5);
							});
					} else {
						currentPosition++;
						if (currentPosition < text.split("\n").length) {
							setTimeout(type, 0);
						}
					}
				}

				insertNextCharacter();
			}

			// Display a message box to the user
			// vscode.window.showInformationMessage("Retyping your code!");

			// Start the typewriter animation
			type();
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
