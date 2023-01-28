import React, { DetailedHTMLProps, InputHTMLAttributes, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

type FileItem = {
  name: string,
  content: string,
  json?: any
}

type DragState = "none" | "allowed" | "invalid"

const readFile = (file: File): Promise<FileItem> => {
  return new Promise((res, rej) => {
    const fileItem: FileItem = {
      name: file.name,
      content: ""
    }

    const fr = new FileReader()

    fr.onload = () => {
      const result = fr.result
      if (typeof result == "string") {
        fileItem.content = result
        try {
          const json = JSON.parse(result)
          fileItem.json = json
        } catch (e) {
          console.log(`${file.name} is not JSON.`)
        }
      }

      res(fileItem)
    }

    fr.readAsText(file)
  })
} 

function App() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [dragState, setDragState] = useState<DragState>("none")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    e.dataTransfer.dropEffect = "copy"
  }

  const uploadFiles = (files: FileList) => {
    const fileList: Promise<FileItem>[] = []
    for (const f of files) {
      console.log("Test", f)
      fileList.push(readFile(f))
    }

    console.log("Here", fileList)

    Promise.all(fileList).then(e => {
      console.log("Foo", e)
      setFiles(e)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    console.log(e)

    uploadFiles(e.dataTransfer.files)

    setDragState("none")
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChanged = (e: any) => {
    console.log(e)
    uploadFiles(e.target.files)
  }

  return (
    <>
      <div className={`drop ${dragState}`} onDragOver={handleDragOver} onDrop={handleDrop}
          onDragEnter={() => setDragState("allowed")}
          onDragLeave={() => setDragState("none")}
          onClick={handleClick}>
        Drag file here.
      </div>

      <input type={"file"} ref={fileInputRef} hidden onChange={handleInputChanged} accept="application/json" multiple />

      <ul>
        { files.map((f, i) => (
          <li key={i}>
            <b>{f.name}</b>
            <pre>
              {f.content}
            </pre>
            {f.json && JSON.stringify(f.json) || "Not JSON."}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
