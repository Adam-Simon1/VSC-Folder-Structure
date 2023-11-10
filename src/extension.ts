import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "folder-structure.copyStructure",
    async (uri: vscode.Uri) => {
      // Get the folder uri the user right clicked on and executed the command
      // Read the directory contents based on the uri and crawl the whole folder
      // Process the results to a structure
      // Copy the structure to the clipboard

      const structure = await listFiles(uri);
      const structureString = JSON.stringify(structure, null, 2);
      vscode.env.clipboard.writeText(structureString);
    }
  );

  context.subscriptions.push(disposable);
}

async function listFiles(uri: vscode.Uri): Promise<Record<string, any>> {
  const result = await vscode.workspace.fs.readDirectory(uri);
  let structure: Record<string, any> = {};

  await Promise.all(
    result.map(async ([name, type]) => {
      if (type === vscode.FileType.Directory) {
        const path = vscode.Uri.joinPath(uri, name);

        // Recursively process subdirectories
        structure[name] = await listFiles(path);
      } else {
        structure[name] = "File";
      }
    })
  );

  return structure;
}

export function deactivate() {}
