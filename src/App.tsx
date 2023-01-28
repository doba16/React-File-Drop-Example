import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

type FileItem = {
  name: string,
  content: string,
  json?: any
}

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
  const [count, setCount] = useState(0)
  const [files, setFiles] = useState<FileItem[]>([])

  const handleDragOver = (e: any) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    console.log(e)

    const fileList: Promise<FileItem>[] = []
    for (const f of e.dataTransfer.files) {
      console.log("Test", f)
      fileList.push(readFile(f))
    }

    console.log("Here", fileList)

    Promise.all(fileList).then(e => {
      console.log("Foo", e)
      setFiles(e)
    })
  }

  return (
    <>
      <div className="drop" onDragOver={handleDragOver} onDrop={handleDrop}>
        Drag file here.
      </div>

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
