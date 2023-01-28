import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

type FileItem = {
  name: string,
  content: string
}

function App() {
  const [count, setCount] = useState(0)
  const [files, setFiles] = useState<FileItem[]>([])

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const newFiles: FileItem[] = []
    for (const file of e.dataTransfer.files) {
      
      const fileItem: FileItem = {
        name: file.name,
        content: ""
      }
      
      const fr = new FileReader()
      console.log("fr", fr)
      fr.onload = () => {
        // @ts-ignore
        fileItem.content = fr.result
        console.log("Result", typeof fr.result)
      }
      fr.readAsText(file)

      newFiles.push(fileItem)
    }

    setFiles(newFiles)
  }

  return (
    <>
      <div className="drop" onDragOver={handleDragOver} onDrop={handleDrop}>
        Drag file here.
      </div>

      <ul>
        { files.map((f) => (
          <li>
            <b>{f.name}</b>
            <pre>
              {f.content}
            </pre>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
