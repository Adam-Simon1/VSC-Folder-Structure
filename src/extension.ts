import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "folder-structure.copyStructure",
    (uri: vscode.Uri) => {
      // Get the folder uri the user right clicked on and executed the command
      // Read the directory contents based on the uri and crawl the whole folder
      // Process the results to a structure
      // Copy the structure to the clipboard

      listFiles(uri);
    }
  );

  context.subscriptions.push(disposable);
}

async function listFiles(uri: vscode.Uri) {
  const result = await vscode.workspace.fs.readDirectory(uri);

  result.forEach(([name, type]) => {
	if (type === 2) {
		listFiles(vscode.Uri.joinPath(uri, name));
	}
  });

  console.log(result);
}

export function deactivate() {}
