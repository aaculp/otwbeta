import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

type Venue = {
  name: string;
  id: number;
  description: string;
  addr: string;
  tags: [string];
};

type Props = {
  venue: Venue;
  onCheckIn: (venueName: string) => void;
  setSelectedVenueData: (venue: Venue) => void;
  busynessLevel: number; // 0 to 1
};


export default function VenueTile({ venue, onCheckIn, setSelectedVenueData, busynessLevel = 0.6 }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  const handleCheckIn = async (venue: Venue) => {
    setCheckingIn(true);
    setSelectedVenueData(venue);
    await onCheckIn(venue.name);
    setCheckingIn(false);
    setFlipped(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flipped &&
        tileRef.current &&
        !tileRef.current.contains(event.target as Node)
      ) {
        setFlipped(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [flipped]);

  return (
    <TileWrapper ref={tileRef} onClick={() => setFlipped(!flipped)}>
      <TileContainer flipped={flipped}>
        {/* <Front>
          <AnimatedBackground />
          <h2>{venue.name}</h2>
          <TapHint>Tap to check in</TapHint>
        </Front> */}

        <Front>
          <BusynessBar level={busynessLevel} />
          <h2>{venue.name}</h2>
          <span>{venue?.checkinCount}</span>
          <TapHint>Tap to check in</TapHint>
        </Front>
        <Back onClick={() => setFlipped(false)}>
          {/* <AnimatedBackground /> */}
          <h3>Ready to check in?</h3>
          <CheckInButton
            onClick={(e) => {
              e.stopPropagation();
              handleCheckIn(venue);
            }}
            disabled={checkingIn}
          >
            {checkingIn ? "Checking in..." : "Check In"}
          </CheckInButton>
        </Back>
      </TileContainer>
    </TileWrapper>
  );
}

// ---------- Styled Components ----------

const TileWrapper = styled.div`
  width: 18rem;
  height: 12rem;
  perspective: 1000px;
  cursor: pointer;
`;

const TileContainer = styled.div<{ flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s;
  transform: ${({ flipped }) => (flipped ? "rotateY(180deg)" : "none")};
`;

const AnimatedBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background: linear-gradient(to top, #dc2626, #facc15, #22c55e);
  z-index: 0;
  border-radius: 1rem;
  animation: riseUp 1.2s ease-out forwards;

  @keyframes riseUp {
    to {
      height: 100%;
    }
  }
`;

const BusynessBar = styled.div<{ level: number }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: ${({ level }) => `${level * 100}%`};
  background-color: ${({ level }) =>
    level > 0.7 ? '#dc2626' : level > 0.4 ? '#facc15' : '#22c55e'};
  border-radius: 4px;
  transition: height 0.8s ease, background-color 0.4s ease;
  z-index: 2;
`;

const Face = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden;
  padding: 1rem;
  overflow: hidden; // important to clip the rising background
  z-index: 1;       // ensure content appears above the animated background
`;

const Front = styled(Face)`
  background: #ffffff;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    font-size: 0.9rem;
    color: #666;
  }
`;

const TapHint = styled.p`
  margin-top: 1.5rem;
  font-size: 0.75rem;
  font-style: italic;
  color: #aaa;
`;

const Back = styled(Face)`
  background: #1f2937;
  color: #ffffff;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;

const CheckInButton = styled.button`
  background: #22c55e;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #16a34a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
