import { useState, useEffect } from 'react'
import CurrencyConverter from './components/CurrencyConvertor'
import './App.css'

function App() {
  
  const [currencyList, setCurrencyList] = useState([])
  const [currencyListNames, setCurrencyListNames] = useState([])

  useEffect(() => {
    const currencyOption = async () => {
      try {
        let res = await fetch("https://api.frankfurter.app/currencies")
        let data = await res.json()
        setCurrencyList(Object.keys(data))
        setCurrencyListNames(Object.values(data))
      } catch (error) {
        console.error('error fetching currencies: ', error)
      }
    };
    currencyOption()
  }, [])

  return (
    <>
      <CurrencyConverter
        options={currencyList}
        optionsNames={currencyListNames}
        defaultCurr1="USD"
        defaultCurr2="INR"
      />
    </>
  )
}

export default App