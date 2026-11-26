import './App.css'
import QuestionsProvider from './providers/questions.provider'
import RenderMyDoc from './components/render-my-doc'
import QuestionsFrom from './components/questions-form'
import { useState } from 'react'
import QuestionsForm from './components/questions-form'
import MetaDataContext from './context/metadata'
import MetaDataProvider from './providers/metadata.provider'

function App() {
  const [tab, setTab] = useState("preview")

  function changeTab(){
    setTab((pre) => {
      return pre === "form" ? "preview" : "form";
    })
  }

  return (
    <MetaDataProvider>
    <QuestionsProvider>
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-2.5">

        {/* switch b/w form and preview */}
        <div className="flex gap-2 bg-gray-600 py-2 px-4 rounded-lg m-2 fixed top-1">
          <span onClick={changeTab} className={`px-3 py-1 rounded-md text-white ${tab === "form" ? 'bg-gray-500' : ''}`}>Form</span>
          <span onClick={changeTab} className={`px-3 py-1 rounded-md text-white ${tab === "preview" ? 'bg-gray-500' : ''}`}>Preview</span>
        </div>

        {
          tab === "form" ? <QuestionsForm /> : <RenderMyDoc />
        }

      </main>
    </QuestionsProvider>
    </MetaDataProvider>
  )
}

export default App
