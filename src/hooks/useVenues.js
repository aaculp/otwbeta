import { useState } from "react";

export const useVenues = () => {
    const [venues, setVenues] = useState([]);
    const [singleVenue, setSingleVenue] = useState(null);
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getAllVenues = async () => {
        try {
            const response = await fetch(`${baseURL}/v1/venues`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Failed to fetch venues");

            const data = await response.json();
            return { venues: data?.venues ?? [] };
        } catch (error) {
            console.error("Error inside getAllVenues:", error);
            return { venues: [] };
        }
    };

    const getVenueById = async (params = {}) => {
        const { id } = params;
        if (!id) return;

        try {
            const response = await fetch(`${baseURL}/v1/venues/${id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Failed to fetch venue");

            const data = await response.json();
            setSingleVenue(data?.venue ?? null);
        } catch (error) {
            console.error("Error inside getVenueById:", error);
        }
    };

    const getVenueCheckinCount = async (id) => {
        if (!id) return 0;

        try {
            const response = await fetch(`${baseURL}/v1/venues/${id}/checkin`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Failed to fetch checkin count");

            const data = await response.json();
            return data?.checkinCount ?? 0;
        } catch (error) {
            console.error("Error inside getVenueCheckinCount:", error);
            return 0;
        }
    };

    const postVenues = async ({ obj }) => {
        if (!obj?.name || !obj?.location) return;

        try {
            const response = await fetch(`${baseURL}/v1/venues`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: obj.name, location: obj.location })
            });

            const data = await response.json();
            console.log("Venue posted:", data);
        } catch (error) {
            console.error("Error inside postVenues:", error);
        }
    };

    return {
        singleVenue,
        venues,
        setVenues,
        getAllVenues,
        getVenueById,
        getVenueCheckinCount,
        postVenues
    };
};
