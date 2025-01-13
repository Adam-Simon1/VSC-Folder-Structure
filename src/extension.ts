import * as vscode from "vscode";
import { minimatch } from 'minimatch';

type Item = { [key: string]: Item | string };

export function activate(context: vscode.ExtensionContext) {
   const config = vscode.workspace.getConfiguration("folder-structure.copyStructure");

   let copyStructureSimple = vscode.commands.registerCommand(
      "folder-structure.copyStructure",
      async (uri: vscode.Uri) => {
         const type: string = config.get("type") || "tree";
         const indentation: number = config.get("indentation") || 2;

         const structure = await listFiles(uri);

         if (type === "json") {
            const structureString = JSON.stringify(structure, null, indentation);
            vscode.env.clipboard.writeText(structureString);
         } else if (type === "tree" || type === "tabs") {
            const treeStructure = convertToTree(structure);
            const formattedTree = printTree(treeStructure, indentation, type);
            vscode.env.clipboard.writeText(formattedTree);
         }

         vscode.window.showInformationMessage('Structure copied to clipboard!');
      }
   );

   let copyStructureAdvanced = vscode.commands.registerCommand(
      "folder-structure.copyStructureAdvanced",
      async (uri: vscode.Uri) => {
         const type: string = config.get("type") || "tree";
         const indentation: number = config.get("indentation") || 2;
         const ignorePatterns: string[] = config.get("ignorePatterns") || ["node_modules", "*.log"];

         const structure = await listFiles(uri, ignorePatterns);

         if (type === "json") {
            const structureString = JSON.stringify(structure, null, indentation);
            vscode.env.clipboard.writeText(structureString);
         } else if (type === "tree" || type === "tabs") {
            const treeStructure = convertToTree(structure);
            const formattedTree = printTree(treeStructure, indentation, type);
            vscode.env.clipboard.writeText(formattedTree);
         }

         vscode.window.showInformationMessage('Structure (with ignored patterns) copied to clipboard!');
      }
   );

   context.subscriptions.push(copyStructureSimple, copyStructureAdvanced);
}

async function listFiles(uri: vscode.Uri, ignorePatterns?: string[]): Promise<Record<string, any>> {
   const result = await vscode.workspace.fs.readDirectory(uri);
   let structure: Record<string, any> = {};

   await Promise.all(
      result.map(async ([name, type]) => {
         // Si des patterns d'ignorance sont fournis, vérifier si le fichier/dossier doit être ignoré
         if (ignorePatterns) {
            const relativePath = name;
            const shouldIgnore = ignorePatterns.some(pattern =>
               minimatch(relativePath, pattern, { matchBase: true })
            );
            if (shouldIgnore) {
               return;
            }
         }

         if (type === vscode.FileType.Directory) {
            const path = vscode.Uri.joinPath(uri, name);
            structure[name] = await listFiles(path, ignorePatterns);
         } else {
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
         result[key] = value;
      } else {
         const subtree = convertToTree(value);
         result[key] = subtree;
      }
   }

   return result;
}

function printTree(
   tree: Item,
   spaces: number,
   type: string,
   indentation: string = ""
): string {
   let result = "";

   for (const key in tree) {
      const value = tree[key];
      if (typeof value === "string") {
         if (type === "tabs") {
            result += `${indentation}${key}\n`;
         } else {
            result += `${indentation}|-- ${key}\n`;
         }
      } else {
         if (type === "tabs") {
            result += `${indentation}${key}\n${printTree(
               value,
               spaces,
               type,
               `${indentation}${" ".repeat(spaces)}`
            )}`;
         } else {
            result += `${indentation}|-- ${key}\n${printTree(
               value,
               spaces,
               type,
               `${indentation}${" ".repeat(spaces)}`
            )}`;
         }
      }
   }

   return result;
}

export function deactivate() { }