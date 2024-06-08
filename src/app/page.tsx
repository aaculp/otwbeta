"use client"
import Image from "next/image";
import Logo from '../../public/OTW.png'
import { useState } from "react";
import styled from "styled-components";


export default function Home() {
  const [selectedVenue, setSelectedVenue] = useState('buffaloWildWings');

  return (
    <main className="flex min-h-screen flex-col items-center justify-start text-center text-white gradient-custom-background-vertical">
      <div className="">
        <div className="flex flex-col justify-start items-center w-full">
          <Image
            src={Logo}
            width={100}
            height={100}
            alt="OTW"
          />
        </div>

        <div className="flex flex-col justify-start items-center w-full p-4 mb-[5em] opacity-80">
          <span className="text-3xl">Data You Wish You Knew</span>
          <span className="text-lg pt-8">OTW is a social media platform utilizing QR codes to deliver you real-time data you need before you begin your night out. By scanning the venues QR code you are updating data for other customers in real time.</span>
        </div>
      </div>

      <div className="bg-white flex flex-col w-[95%] min-h-[100vh] rounded-tl-2xl rounded-tr-2xl p-8 mt-[-2em]">
        <label className="flex flex-col items-center justify-around text-black text-2xl">
          Where you checking in from?
        </label>
        <select
          className="text-black border-[1px] border-black border-solid mt-4"
          name="venueSelect"
          value={selectedVenue}
          onChange={e => setSelectedVenue(e.target.value)}
        >
          <option value="buffaloWildWings">Buffalo Wild Wings -- Melbourne</option>
          <option value="AppleBees">Apple Bees - Palm Bay Road</option>
          <option value="Mainstree">Mainstreet Pub</option>
          <option value="Debauchery">Debauchery</option>
        </select>
      </div>
    </main>
  );
}
