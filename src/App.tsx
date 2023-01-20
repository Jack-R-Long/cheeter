import { useState } from 'react'
import './App.css'

function App() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')


  async function submitText(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // If the user presses enter, send the message
    if (e.key === 'Enter' && !loading) {
      e.preventDefault()
      setLoading(true)

      console.log(`Sending the following text to the worker: ${inputText}`)

      // Send the message to the worker
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      })


      if (response.ok) {
        // Get the response from the worker
        const textCompletion = await response.text()
        console.log(`Received the following response from the worker: ${textCompletion}`)
        setLoading(false)
      } else {
        console.log("Error: " + response)
        setLoading(false)
      }
    }
  }


  return (
    <div className="App">
        <>
          <h1>Cheeter 🐦</h1>
          <div className="inputContainer">
            {loading ? (
              <div className="lds-dual-ring"></div>
            ) : (
              <input type="text"
                placeholder='@GenCQBrownJr'
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              ></input>
            )}
          </div>
        </>
    </div>
  )
}

export default App
