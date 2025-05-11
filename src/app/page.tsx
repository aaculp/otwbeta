"use client";

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import styled from "styled-components";
import Logo from '../../public/OTW.png';
import { useVenues } from '../hooks/useVenues';
import { useCheckin } from '../hooks/useCheckin';
import VenueTile from "@/components/VenueTile";

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
  addr: string;
  tags: string[];
  description: string;
  checkinCount?: number;
}

export default function Home() {
  const { getAllCheckins, postVenueCheckin } = useCheckin();
  const { getAllVenues, getVenueCheckinCount } = useVenues();

  const [flipValue, setFlipValue] = useState(0);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [selectedVenueData, setSelectedVenueData] = useState<Venue | null>(null);
  const [selectableVenues, setSelectableVenues] = useState<Venue[]>([]);
  const [venueCheckinMap, setVenueCheckinMap] = useState<Record<string, number>>({});
  const [checkinCount, setCheckinCount] = useState(0);
  useEffect(() => {
    const fetchVenues = async () => {
      const data = await getAllVenues();

      if (data.venues.length > 0) {
        const counts = await Promise.all(
          data.venues.map(async (venue) => {
            const count = await getVenueCheckinCount(venue.id);
            return { id: venue.id, count };
          })
        );

        const map = counts.reduce((acc, { id, count }) => {
          acc[id] = count;
          return acc;
        }, {});

        const venuesWithCounts = data.venues.map((venue) => ({
          ...venue,
          checkinCount: map[venue.id] ?? 0,
        }));

        setSelectableVenues(venuesWithCounts);
        setVenueCheckinMap(map);
      }
    };

    fetchVenues();
  }, []);


  useEffect(() => {
    const fetchTotalCheckins = async () => {
      const data = await getAllCheckins();
      if (data?.count) setCheckinCount(data.count);
    };

    fetchTotalCheckins();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlipValue(checkinCount);
    }, 500);

    return () => clearTimeout(timer);
  }, [checkinCount]);

  const handleCheckin = async () => {
    if (!selectedVenueData) {
      toast.warning("Please select a venue first.");
      return;
    }

    try {
      setIsCheckingIn(true);

      // Post the checkin
      await postVenueCheckin(selectedVenueData.id);

      // Update total checkins
      const newTotal = await getAllCheckins();
      if (newTotal?.count) setCheckinCount(newTotal.count);

      // Get updated checkin count for this venue
      const newCount = await getVenueCheckinCount(selectedVenueData.id);

      // Update checkin map
      setVenueCheckinMap((prev) => ({
        ...prev,
        [selectedVenueData.id]: newCount,
      }));

      // Update count in selectableVenues list
      setSelectableVenues((prevVenues) =>
        prevVenues.map((venue) =>
          venue.id === selectedVenueData.id
            ? { ...venue, checkinCount: newCount }
            : venue
        )
      );

      toast.success("Check-in successful!");
    } catch (err) {
      toast.error("🚨 Check-in failed. Try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-start text-center text-white gradient-custom-background-vertical">
      <div className="">
        <div className="flex flex-col justify-start items-center w-full">
          <Image src={Logo} width={100} alt="OTW" />
        </div>

        <div className="flex flex-col justify-start items-center w-full p-4 mb-[5em] opacity-80">
          <span className="text-3xl">Data You Wish You Knew</span>
          <span className="text-lg pt-8">
            OTW is a social media platform utilizing QR codes to deliver you real-time data you need before you begin your night out.
            By scanning the venues QR code you are updating data for other customers in real time. As more people checkin, the data becomes more accurate thus the app becomes more useful.
          </span>
        </div>
      </div>

      <div className="bg-white flex flex-col w-[95%] min-h-[100vh] rounded-tl-2xl rounded-tr-2xl p-8 mt-[-2em] text-black">
        <h1>
          <span className="text-3xl pb-4">All Time Checkins:</span>
          <Flipr value={flipValue} />
        </h1>

        <div className="flex flex-col items-center">
          <label className="flex flex-col items-center justify-around text-black text-2xl">
            Where you checking in from?
          </label>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5em' }}>
            {selectableVenues.map((venue) => {
              const count = venueCheckinMap[venue.id] ?? 0;
              const level = Math.min(count / 100, 1);

              return (
                <VenueTile
                  key={venue.id}
                  venue={venue}
                  setSelectedVenueData={setSelectedVenueData}
                  onCheckIn={handleCheckin}
                  busynessLevel={level}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}