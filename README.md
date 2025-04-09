# Libresoft Lexical Editor 


## Installation

### npm
```bash
npm install Libresoft-UK/lexical-editor-ui
```

Configure your tailwind.config.js file to include the paths for this package:
```tailwind.config.js
module.exports = {
    content: [
        ...
        './node_modules/lexical-editor-ui/**/*.{js,jsx,ts,tsx}'
    ],
};
```
This ensures that Tailwind CSS can find the classes used in this package and include them in the final build.

## Usage
```tsx
'use client';
import { LexicalEditor as _LexicalEditor} from 'lexical-editor-ui';
import {useDebouncedCallback} from "use-debounce";
export default function LexicalEditor() {

    const handleEditorChange = useDebouncedCallback((json, html) => {
        console.log('Editor content changed:', json, html);
    }, 1000);

    return (
        <_LexicalEditor onChange={handleEditorChange} />
    )
}
```
We recommend the `useDebouncedCallback` hook to debounce the editor change event. This is useful for performance reasons, as it prevents the event from firing too frequently when saving the state to your backend.

## Development
### Dependencies
To run the development server, you will need to run the following command:
```bash
npm install
```
To start the development server, run:
```bash
npm run dev
```
This uses nodemon to watch for changes in the `src` directory and automatically rebuild the project. The output will be in the `dist` directory.

### Parallel Development
To include this local development package in a parallel project, you can use `npm link` from within this project:
```bash
npm link
```
This will create a symlink to the package in your global node_modules directory. 

You can then use `npm link <package>` in your parallel project to use this local development of the package:
```bash
npm link lexical-editor-ui
```
This will allow you to use the development package in your project as if it were installed from npm.

to unlink the package from the parallel project, you can use `npm unlink <package>` from the parallel project:
```bash
npm unlink lexical-editor-ui
```
This will remove the symlink from your project, restoring the original `node_modules`.

To remove the symlink from the global node_modules directory, you can use `npm unlink` from this project directory:
```bash
npm unlink
```

When you push changes to this package, you will then need to install the latest package in your parallel projects to get the latest commit:
```bash
npm install Libresoft-UK/lexical-editor-ui
```
This will install the package from GitHub, and you can then use it in your project as normal.