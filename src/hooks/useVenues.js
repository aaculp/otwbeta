import { useState } from "react";
import config from '../../config';

export const useVenues = () => {
    const [venues, setVenues] = useState([])
    const [singleVenue, setSingleVenue] = useState([])

    const getAllVenues = async () => {
        try {
            const response = await fetch(`http://192.168.50.49:4000/venues`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const data = await response.json();
            return { venues: data }
        } catch (error) {
            console.log("Error inside getVenues:", error)
        }
    }

    const getVenueById = async ({ id }) => {
        try {
            const response = await fetch(`${config.BACKEND_API}/venues/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const data = response.json();
            console.log("data inside getVenues:", data)
            setSingleVenue(data)
        } catch (error) {
            console.log("Error inside getVenues:", error)
        }
    }

    const postVenues = async ({ obj }) => {
        try {
            const response = await fetch(`${config.BACKEND_API}/venues`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: obj.name, location: obj.location })
            })

            const data = response.json();
            console.log("data inside getVenues:", data)
        } catch (error) {
            console.log("Error inside getVenues:", error)
        }
    }

    return {
        singleVenue,
        venues,
        setVenues,
        getAllVenues,
        getVenueById,
        postVenues
    }
}