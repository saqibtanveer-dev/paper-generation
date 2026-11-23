import './App.css'
import QuestionsProvider from './providers/questions.provider'
import { useQuestionsContext } from './context/questions'
import RenderMyDoc from './components/render-my-doc'

function App() {

  return (
    <QuestionsProvider>
      <main style={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid red', gap: 10 }}>
        <RenderMyDoc />
        <div></div>
      </main>
    </QuestionsProvider>
  )
}

export default App
