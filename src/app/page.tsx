"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { Flipr } from '../components/Flip'
import SelectVenue from '../components/SelectVenue'
import Logo from '../../public/OTW.png'

const StyledButton = styled.button`
  &:active {
    cursor: pointer;
    opacity: 0.7;
  }

  // &:active {
  //   background-color: rgba(12,138,26,0.9);
  //   border: 1px solid black;
  //   opacity: 1;
  //   transition: background-color 500ms linear;
  //   -webkit-transition: background-color 500ms linear;
  //   -ms-transition: background-color 500ms linear;
  // }
`;

export default function Home() {
  const [flipValue, setFlipValue] = useState(0)

  useEffect(() => {
    let timer = setTimeout(() => {
      setFlipValue(34)
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
          <SelectVenue />

          <StyledButton
            className="border-[1px] gradient-red text-black mt-4 p-2 rounded w-[50%]"
            onClick={() => setFlipValue(flipValue + 1)}
          >
            Check In ✔
          </StyledButton>
        </div>
      </div>
    </main>
  );
}
