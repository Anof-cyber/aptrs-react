import React, { useEffect, useRef } from 'react';
import {
    ClassicEditor,
    Essentials,
    CKFinderUploadAdapter,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    Heading,
    Indent,
    Link,
    List,
    Paragraph,
    Table
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

class Editor extends ClassicEditor {
    static builtinPlugins = [
        Essentials,
        CKFinderUploadAdapter,
        Autoformat,
        Bold,
        Italic,
        BlockQuote,
        Heading,
        Indent,
        Link,
        List,
        Paragraph,
        Table
    ];

    static defaultConfig = {
        toolbar: {
            items: [
                'undo', 'redo',
                '|', 'heading',
                '|', 'bold', 'italic',
                '|', 'link', 'insertTable', 'blockQuote',
                '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
            ]
        },
        language: 'en'
    };
}

const CKWrapper = ({ name, initialData, onChange }) => {
    const editorRef = useRef(null);
    const editorInstance = useRef(null); // Create a ref to hold the editor instance

    useEffect(() => {
        const initializeEditor = async () => {
            if (editorRef.current && !editorInstance.current) { // Check if instance already exists
                try {
                    editorInstance.current = await Editor.create(editorRef.current);
                    if (initialData) {
                        editorInstance.current.setData(initialData);
                    }

                    editorInstance.current.model.document.on('change:data', () => {
                        const data = editorInstance.current.getData();
                        onChange(name, data); // Call the onChange handler with name
                    });
                } catch (error) {
                    console.error('There was a problem initializing the editor.', error);
                }
            }
        };

        initializeEditor();

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy(); // Cleanup the editor instance on unmount
                editorInstance.current = null; // Clear the reference
            }
        };
    }, [initialData, onChange, name]);

    return <div ref={editorRef} id={name}></div>;
};

export default CKWrapper;
