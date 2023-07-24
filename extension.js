const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	console.log('Congratulations, your extension "code-typewriter-effect" is now active!');

	let typingProcessRunning = false; // Variable to track if the typing process is running

	let disposableType = vscode.commands.registerCommand("code-typewriter-effect.retype", function () {
		if (typingProcessRunning) {
			return; // If the typing process is already running, do nothing
		}

		typingProcessRunning = true; // Mark that the typing process has started

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
			if (!typingProcessRunning) {
				return; // If the typing process is stopped, exit the function
			}

			let line = text.split("\n")[currentPosition];
			let i = 0;

			function insertNextCharacter() {
				if (!typingProcessRunning) {
					return; // If the typing process is stopped, exit the function
				}

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
					} else {
						typingProcessRunning = false; // Typing process is complete, reset the variable
					}
				}
			}

			insertNextCharacter();
		}
	});

	let disposableStop = vscode.commands.registerCommand("code-typewriter-effect.stop", function () {
		typingProcessRunning = false; // When the "code-typewriter-effect.stop" command is executed, stop the typing process
	});

	context.subscriptions.push(disposableType, disposableStop);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
