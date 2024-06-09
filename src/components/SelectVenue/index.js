import { useState, useEffect, useCallback } from "react";
import { useVenues } from '../../hooks/useVenues';

const SelectVenue = () => {
    const { getAllVenues } = useVenues()
    const [selectedVenue, setSelectedVenue] = useState('');
    const [selectableVenues, setSelectableVenues] = useState([])

    const handleGetVenues = useCallback(async () => {
        const data = await getAllVenues();
        setSelectableVenues([...data.venues])
    }, [getAllVenues])

    useEffect(() => {
        if (selectableVenues.length === 0) {
            handleGetVenues()
        }
    }, [selectableVenues, handleGetVenues])

    return (
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
                {selectableVenues.map(venue => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
            </select>
        </div>
    )
}

export default SelectVenue