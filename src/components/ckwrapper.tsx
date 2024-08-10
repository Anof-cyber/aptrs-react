import React, { useEffect, useRef } from 'react';
import { simpleUploadConfig } from '../lib/data/api';
import { CKEditor } from '@ckeditor/ckeditor5-react'

import {
    ClassicEditor,
    Essentials,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    Heading,
    
    Indent,
    Link,
    List,
    Paragraph,
    ImageInsertUI,
    CodeBlock,
        Code,
        ImageResizeEditing, ImageResizeHandles,
    
    Table,
    Image,
    TableToolbar,ImageUpload
    
   
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

class Editor extends ClassicEditor {
    static builtinPlugins = [
        Essentials,
        BlockQuote,
        Bold,
        Italic,
        Heading,
        Indent,
        Link,
        List,
        Paragraph,
        Table,
        Image,
        ImageUpload,
        ImageInsertUI,
        CodeBlock,
        Code,
        ImageResizeEditing, ImageResizeHandles,
        TableToolbar,
       
    ];

    static defaultConfig = {
        toolbar: {
            items: [
                '|', 'heading',
                '|', 'bold', 'italic',
                '|', 'link', 'insertTable', 'blockQuote',
                '|', 'bulletedList', 'numberedList', 'outdent', 'indent',
                '|', 'Code', 'CodeBlock',
                '|', 'ImageUpload', 'ImageResizeEditing', 'ImageResizeHandles' ,
                '|', 'toggleImageCaption',
                
            ]
        },
        resizeOptions: [
          {
              name: 'resizeImage:original',
              value: null,
              label: 'Original'
          },
          {
              name: 'resizeImage:25',
              value: '25',
              label: '25%'
          },
          {
              name: 'resizeImage:50',
              value: '50',
              label: '50%'
          },
          {
              name: 'resizeImage:75',
              value: '75',
              label: '75%'
          }
      ],
        image: {upload: {types: [ 'png', 'jpeg','gif' ]}},
        //simpleUpload: simpleUploadConfig(),
        
        language: 'en',
        getData: () => {return 'test'},
    setData: (data: string) => {return data}
    };



  }


  interface CKEditorProps {
    id: string;
    data: string;
    onChange: (event: any, editor: any) => void; // You should replace 'any' with the actual type of the event and editor
    onReady?: (editor: any) => void; // You should replace 'any' with the actual type of the editor
  }

    
  class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return new Promise((resolve, reject) => {
            // Get the file to be uploaded
            this.loader.file.then((file) => {
                const formData = new FormData();
                formData.append('upload', file); // Change 'image' to the field name your API expects

                // Perform the API request
                fetch('https://aptrsapi.souravkalal.tech/api/project/ckeditor/imageupload/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1ODg2ODY3LCJpYXQiOjE3MjMyOTQ4NjcsImp0aSI6IjUzMmVmMmY3NmVmMDRkMjQ4MTMzNWYyMDdmMmVhNDViIiwidXNlcl9pZCI6MX0.AGvyw2Y67dTjNKQFUCvr3woW3AEA-fAgrUwPtf8zusA`, // Include the authorization bearer token
                      // You can add any other headers if needed
                  }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Upload failed');
                    }
                    return response.json();
                })
                .then(data => {
                    // Assuming the API returns the URL of the uploaded image
                    const imgElement = `<img src="${data.url}" class="ck-small" alt="Uploaded Image">`;
                
                    resolve({
                        default: data.url // Change 'url' to the actual key returned by your API
                    });
                })
                .catch(error => {
                    reject(error);
                });
            });
        });
    }

    // Aborts the upload process.
    abort() {
        // Implement any necessary cleanup if the upload is aborted
    }
}


  export const CKWrapper = (props: CKEditorProps) => {
    const { id, data, onChange, onReady } = props;
    return (
      
      <CKEditor
        id={id}
        data = {data}
        editor={Editor   }
        onChange={(event, editor) => {
          onChange(String(id), editor.getData());
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
        }}
        onReady={ editor => {
              if (data) editor.setData(data)
          }}
        // I have no idea why this works. Lots of conflicting advice on stackoverflow  //
        // https://stackoverflow.com/questions/74559310/uncaught-syntaxerror-the-requested-module-ckeditor5-build-ckeditor-js-does-n 
        
        config={{
          simpleUpload: simpleUploadConfig(), 
          ckfinder: simpleUploadConfig(),
                  //image: {upload: {types: [ 'png', 'jpeg','gif' ]}},
                  //removePlugins: ['FileRepository', 'ImageUploadEditing']
                }}
                

      
        
      
      />
    )
  }

  export default CKWrapper;
