# Libresoft Lexical Editor 


## Installation

### npm
```bash
npm install Libresoft-UK/lexical-editor-ui
```

Configure your tailwind.config.js file to include the paths to your content:
```tailwind.config.js
module.exports = {
    content: [
        ...
        './node_modules/lexical-editor-ui/**/*.{js,jsx,ts,tsx}'
    ],
};
```

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