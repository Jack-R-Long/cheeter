import { useState } from 'react'
// @ts-ignore
import Turnstone from 'turnstone'
import styles from "./TwitterHandleSearch.module.css"



const TwitterHandleSearch = () => {
  const [errorText, setErrorText] = useState('')


  const listbox = {
    displayField: 'handles',
    data: async (query: string) => {
      const res = await fetch(`/api/handles?query=${query}`)

      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        const errorText = await res.text()
        setErrorText(errorText)
      }
    },
    searchType: 'startsWith',
  }

  return (
    <>
      <Turnstone
        autoFocus={true}
        typeahead={true}
        debounceWait={250}
        listbox={listbox}
        placeholder='Enter a Twitter handle'
        styles={styles}
      />
      <p className='errorText'>{errorText}</p>
    </>
  )
}
export default TwitterHandleSearch