"use client"

import Image from "next/image";
import { useEffect, useState } from "react";

import { Flipr } from '../components/Flip'
import Logo from '../../public/OTW.png'

export default function Home() {
  const [selectedVenue, setSelectedVenue] = useState('buffaloWildWings');
  const [flipValue, setFlipValue] = useState(0)

  useEffect(() => {
    let timer = setTimeout(() => {
      setFlipValue(183)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start text-center text-white gradient-custom-background-vertical">
      <div className="">
        <div className="flex flex-col justify-start items-center w-full">
          <Image
            src={Logo}
            width={100}
            alt="OTW"
          />
        </div>

        <div className="flex flex-col justify-start items-center w-full p-4 mb-[5em] opacity-80">
          <span className="text-3xl">Data You Wish You Knew</span>
          <span className="text-lg pt-8">OTW is a social media platform utilizing QR codes to deliver you real-time data you need before you begin your night out. By scanning the venues QR code you are updating data for other customers in real time.</span>
        </div>
      </div>

      <div className="bg-white flex flex-col w-[95%] min-h-[100vh] rounded-tl-2xl rounded-tr-2xl p-8 mt-[-2em]">
        <h1>
          <Flipr value={flipValue} />
        </h1>
        <div className="flex flex-col items-center">
          <label className="flex flex-col items-center justify-around text-black text-2xl">
            Where you checking in from?
          </label>
          <select
            className="text-black border-[1px] border-black border-solid mt-4 p-2 w-[90%]"
            name="venueSelect"
            value={selectedVenue}
            onChange={e => setSelectedVenue(e.target.value)}
          >
            <option value="buffaloWildWings">Buffalo Wild Wings -- Melbourne</option>
            <option value="AppleBees">Apple Bees - Palm Bay Road</option>
            <option value="Mainstree">Mainstreet Pub</option>
            <option value="Debauchery">Debauchery</option>
          </select>

          <button
            className="border-[1px] gradient-red text-black mt-4 p-2 rounded w-[50%]"
            onClick={() => {
              console.log("logging this", flipValue)
              setFlipValue(flipValue + 1)
            }}
          >
            Check In ✔
          </button>
        </div>
      </div>
    </main>
  );
}
