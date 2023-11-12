import * as vscode from "vscode";

type Item = { [key: string]: Item | string };

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration(
    "folder-structure.copyStructure"
  );

  let disposable = vscode.commands.registerCommand(
    "folder-structure.copyStructure",
    async (uri: vscode.Uri) => {
      // Get the folder uri the user right clicked on and executed the command
      // Read the directory contents based on the uri and crawl the whole folder
      // Process the results to a structure
      // Copy the structure to the clipboard

      const type: string | undefined = config.get("type") || "tree";
      const indentation: number = config.get("indentation") || 2;

      const structure = await listFiles(uri);

      if (type === "json") {
        const structureString = JSON.stringify(structure, null, indentation);
        vscode.env.clipboard.writeText(structureString);
      } else if (type === "tree") {
        const treeStructure = convertToTree(structure);
        const formattedTree = printTree(treeStructure, indentation);
        vscode.env.clipboard.writeText(formattedTree);
      }
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
        // Process files
        structure[name] = "File";
      }
    })
  );

  return structure;
}

function convertToTree(input: { [key: string]: string | Item }): Item {
  const result: Item = {};

  for (const key in input) {
    const value = input[key];

    if (typeof value === "string") {
      // It's a file
      result[key] = value;
    } else {
      // It's a directory (subfolder)
      const subtree = convertToTree(value);
      result[key] = subtree;
    }
  }

  return result;
}

function printTree(
  tree: Item,
  spaces: number,
  indentation: string = ""
): string {
  let result = "";

  for (const key in tree) {
    const value = tree[key];

    if (typeof value === "string") {
      // It's a file
      result += `${indentation}|-- ${key}\n`;
    } else {
      // It's a directory (subfolder)
      result += `${indentation}|-- ${key}\n${printTree(
        value,
        spaces,
        `${indentation}${" ".repeat(spaces)}`
      )}`;
    }
  }

  return result;
}

export function deactivate() {}
