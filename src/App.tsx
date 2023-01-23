import { useState } from 'react'
import './App.css'
// @ts-ignore
import TwitterHandleSearch from './components/TwitterHandleSearch'

interface Tweet {
  id: string
  text: string
  edit_history_tweet_ids: string[]
}

function App() {
  const [phase, setPhase] = useState('Input Handle')
  const [handle, setHandle] = useState('GenCQBrownJR')
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [errorText, setErrorText] = useState('')
  const [tweetCompletion, setTweetCompletion] = useState('')

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
        setPhase('Input Text')

      } else {
        const errorText = await response.text()
        setErrorText(errorText)
      }
    }
  }

  async function submitText(e: React.KeyboardEvent<HTMLInputElement>) {
    // If the user presses enter, send the message
    if (e.key === 'Enter' && !loading) {
      setLoading(true)
      setTweetCompletion('')

      console.log(`Sending the following text to the worker: ${inputText}`)

      // Send the message to the worker
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          tweets: tweets,
        }),
      })


      if (response.ok) {
        // Get the response from the worker
        const textCompletion = await response.text()
        console.log(`Received the following response from the worker: ${textCompletion}`)
        setTweetCompletion(textCompletion)
        setLoading(false)
      } else {
        console.log("Error: " + response)
        setLoading(false)
      }
    }
  }

  return (
    <div className="App">
      {phase === 'Input Handle' && (
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
                <TwitterHandleSearch />
                <p className='errorText'>{errorText}</p>
              </>
            )}
          </div>
        </>
      )}

      {phase === 'Input Text' && (
        <>
          <h1>New Tweet</h1>
          <div className="inputContainer">
            {loading ? (
              <div className="lds-dual-ring"></div>
            ) : (
              <>
                <input type="text"
                  placeholder='Make a joke about @elonmusk'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={submitText}
                ></input>
                <p className='errorText'>{errorText}</p>
              </>
            )}
          </div>
          {tweetCompletion.length > 0 && (
            <div className="tweetCompletion">
              <p>{tweetCompletion}</p>
            </div>
          )}
          {tweets.length > 0 && (
            <div className="tweetsContainer">
              <h1>Last 10 Tweets</h1>
              {tweets.map((tweet: any) => (
                <div className="tweet">
                  <p>{tweet.text}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
