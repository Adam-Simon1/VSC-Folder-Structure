# VSC-Folder-Structure

This is a VS Code extension that allows you to copy a folder structure just by right clicking on it.

## Usage

<img src='./assets/preview.png'/>

Once you click on the Copy Folder Structure, in the clipboard there is going to be the folder structure. Either as a json object or a tree kind format. You can choose those in the settings. The default is tree.

### Json:

```
{
  "errors.rs": "File",
  "main.rs": "File",
  "settings.rs": "File",
  "fileactions": {
    "compression.rs": "File",
    "files_manipulation.rs": "File",
    "mod.rs": "File"
  },
  "filesystem": {
    "caching.rs": "File",
    "disks.rs": "File",
    "file_system.rs": "File",
    "mod.rs": "File"
  }
}
```

### Tree:

```
|-- errors.rs
|-- main.rs
|-- settings.rs
|-- fileactions
   |-- compression.rs
   |-- files_manipulation.rs
   |-- mod.rs
|-- filesystem
   |-- caching.rs
   |-- disks.rs
   |-- file_system.rs
   |-- mod.rs
```

## Extension Settings

This extension contributes the following settings:

- `folder-structure.copyStructure.indentation`: The number of spaces to use for indentation.
- `folder-structure.copyStructure.type`: The type of the structure, both of which are shown above.

## Change Log

Check the [Change Log](./CHANGELOG.md) for any version changes.
