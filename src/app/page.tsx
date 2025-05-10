"use client"

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Logo from '../../public/OTW.png'
import { useVenues } from '../hooks/useVenues';
import { useCheckin } from '../hooks/useCheckin';

const Flipr = dynamic(() => import('../components/Flip').then(mod => mod.Flipr), {
  ssr: false
});

const StyledButton = styled.button`
  &:active, &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &:active {
    background-color: rgba(12,138,26,0.9);
    border: 1px solid black;
    opacity: 1;
    transition: background-color 250ms linear;
    -webkit-transition: background-color 250ms linear;
    -ms-transition: background-color 250ms linear;
  }
`;

interface Venue {
  id: string;
  name: string;
  location: string;
}

export default function Home() {
  const { getAllVenues } = useVenues()
  const { getAllCheckins } = useCheckin()
  const [flipValue, setFlipValue] = useState(0)
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectableVenues, setSelectableVenues] = useState<Venue[]>([])
  const [checkinCount, setCheckinCount] = useState(0)

  const handleGetVenues = useCallback(async () => {
    const data = await getAllVenues();

    if (data.venues.length > 0)
      setSelectableVenues(data?.venues || [])
  }, [])

  const handleGetCheckins = useCallback(async () => {
    const data = await getAllCheckins()
    if (data?.count) setCheckinCount(data.count)
  }, [])

  useEffect(() => {
    handleGetVenues()
  }, [handleGetVenues])

  useEffect(() => {
    handleGetCheckins()
  }, [handleGetCheckins])

  // Simulating getting all time checkins
  useEffect(() => {
    let timer = setTimeout(() => {
      setFlipValue(34)
      // setFlipValue(checkinCount)
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

      <div className="bg-white flex flex-col w-[95%] min-h-[100vh] rounded-tl-2xl rounded-tr-2xl p-8 mt-[-2em] text-black">
        <h1>
          <span className="text-3xl pb-4">All Time Checkins:</span>
          <Flipr value={flipValue} />
        </h1>
        <div className="flex flex-col items-center">
          <div>
            <label className="flex flex-col items-center justify-around text-black text-2xl">
              Where you checking in from?
            </label>
            <select
              className="text-black border-[1px] border-black border-solid mt-4 p-2 w-full"
              name="venueSelect"
              value={selectedVenue}
              onChange={e => setSelectedVenue(e.target.value)}
            >
              <option value="" disabled defaultValue="Select A Venue">Select a venue!</option>
              {selectableVenues.map(venue => <option key={venue.id} value={venue.id}>{venue.addr}</option>)}
            </select>
          </div>

          <StyledButton
            className="border-[1px] gradient-red text-black mt-4 p-2 rounded w-[50%]"
            onClick={() => {
              setFlipValue(flipValue + 1)
            }}
          >
            Check In ✔
          </StyledButton>
        </div>
      </div>
    </main>
  );
}
