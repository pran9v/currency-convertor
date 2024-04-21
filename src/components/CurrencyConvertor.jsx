import React, { useState, useEffect } from 'react';
import Icons from "./currencyIcon"

const CurrencyConverter = ({ options, optionsNames, defaultCurr1, defaultCurr2 }) => {
    
    const [currencyFrom, setCurrencyFrom] = useState(defaultCurr1)
    const [currencyTo, setCurrencyTo] = useState(defaultCurr2)
    const [inputAmount, setInputAmount] = useState("")
    const [convertedAmount, setConvertedAmount] = useState(0)
    const [convertedAmountwhenOne, setConvertedAmountwhenOne] = useState(0)
    const [isSwapped, setIsSwapped] = useState(false)
    const [icon, setIcon] = useState("₹")

    const conversion = async (amount) => {
        try {
            const from = isSwapped ? currencyTo : currencyFrom
            const to = isSwapped ? currencyFrom : currencyTo
            let res1 = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
            let res2 = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${from}&to=${to}`)
            if (!res1.ok) {
                throw new Error("response was not ok")
            }
            let data1 = await res1.json()
            const finalAmount1 = data1.rates[to];
            let data2 = await res2.json()
            const finalAmount2 = data2.rates[to];
            if (!finalAmount1 || typeof finalAmount1 !== 'number') {
                throw new Error(`Invalid or missing exchange rate for currency ${currencyTo}`);
            }
            setConvertedAmount(finalAmount1)
            setConvertedAmountwhenOne(finalAmount2)

        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        if (inputAmount) {
            conversion(inputAmount)
            const icon = Icons.find((item)=> item.currency === currencyTo)
            setIcon(icon)
        };
    }, [currencyFrom, currencyTo, inputAmount, isSwapped])

    const handleOnChange = async (e) => {
        setInputAmount(e.target.value)
        setConvertedAmount(convertedAmount)
    }

    const handleCurrencyFromChange = async (e) => {
        const currency = e.target.value;
        
        console.log(icon)
        setCurrencyFrom(currency)
        conversion(inputAmount)
    }

    const handleCurrencyToChange = async (e) => {
        const currency = e.target.value;
        const icon = Icons.find((item) => item.currency === currency) //looks for an object and assigns icon with that "searched" object
        setIcon(icon)
        setCurrencyTo(currency);
        conversion(inputAmount)
    }

    const handleSwap = () => {
        setIsSwapped(!isSwapped)
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-[#fce9c5] to-[#f0de68] animate-moveGradient animation-duration-[2s] animation-iteration-count-infinite animation-linear flex justify-center items-center flex-col">
            <div className="flex items-center justify-between mb-12 mt-10">
                <div className="flex items-center">
                    <select className="bg-[#ffffff]  text-gray-700 py-3 pl-4 rounded mr-6 text-3xl border-4 border-[#000000] focus:border-[#ffcc84]"
                        value={isSwapped ? currencyTo : currencyFrom}
                        onChange={isSwapped ? handleCurrencyToChange : handleCurrencyFromChange}
                    >
                        {
                            options.map((curr, index) =>
                                <option value={curr} key={curr}>{curr}: {optionsNames[index]}
                                </option>
                            )
                        }
                    </select>
                </div>
                <button className="bg-[#ffffff] text-gray-700 py-3 px-4 rounded mr-6 text-3xl border-4 border-[#000000]"
                    onClick={handleSwap}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                    </svg>
                </button>
                <div className="flex items-center">
                    <select className="bg-[#ffffff] text-gray-700 py-3 pl-4 rounded text-3xl border-[#000000] border-4 focus:border-[#ffcc84]"
                        value={isSwapped ? currencyFrom : currencyTo}
                        onChange={isSwapped ? handleCurrencyFromChange : handleCurrencyToChange}
                    >
                        {
                            options.map((curr, index) =>
                                <option value={curr} key={curr}>{curr}: {optionsNames[index]}
                                </option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-center mb-12">
                <input className="text-3xl p-3 text-center font-normal border-2 border-black bg-[#F5F6FA] text-black placeholder-[black] placeholder:font-thin"
                    placeholder='Enter the amount'
                    type='number'
                    value={inputAmount}
                    onChange={handleOnChange} />
            </div>
            <div className="flex items-center justify-center mb-12 text-xl p-2 bg-[#000000]">
                <span className="text-[#f2bd59] mr-4">Rate:</span>
                <span className="text-[#f2bd59]">
                    {convertedAmountwhenOne} {isSwapped ? currencyFrom : currencyTo}/
                    {isSwapped ? currencyTo : currencyFrom}
                </span>
            </div>
            <div className="flex justify-center mb-12">
                <div className="flex items-center justify-center w-[1000px] border-t-4 border-[#747474] pt-10 text-center">
                    <span className="text-4xl font-bold">{convertedAmount || 0} {icon.symbol}</span>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;