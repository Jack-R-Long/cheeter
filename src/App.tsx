import { useState } from 'react'
import './App.css'

function App() {
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [tweets, setTweets] = useState([])
  const [errorText, setErrorText] = useState('')

  async function getTweets(e: React.KeyboardEvent<HTMLInputElement>) {
    setErrorText('')

    // If the user presses enter, send the message
    if (e.key === 'Enter' && !loading) {
      console.log(`Sending the following handle to the worker: ${handle}`)

      // Send handle to the worker
      const response = await fetch("/api/getTweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: handle,
        }),
      })
      if (response.ok) {
        // Get the response from the worker
        const tweets = await response.json()
        console.log(`Received the following response from the worker: ${JSON.stringify(tweets)}`)
        setTweets(tweets)

      } else {
        const errorText = await response.text()
        setErrorText(errorText)
      }
    }
  }


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
            <>
              <input type="text"
                placeholder='@GenCQBrownJr'
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={getTweets}
              ></input>
              <p>{errorText}</p>
            </>
          )}
        </div>
        {tweets.length > 0 && (
          <div className="tweetsContainer">
            {tweets.map((tweet: any) => (
              <div className="tweet">
                <p>{tweet.text}</p>
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  )
}

export default App
