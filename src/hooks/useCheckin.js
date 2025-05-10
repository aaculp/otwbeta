export const useCheckin = () => {
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getAllCheckins = async () => {
        try {
            const response = await fetch(`${baseURL}/v1/checkins/count`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Failed to fetch venues");

            const data = await response.json();

            return { count: data?.count ?? [] };
        } catch (error) {
            console.error("Error inside getAllCheckins:", error);
            return { count: [] };
        }
    };

    const postVenueCheckin = async (id) => {
        try {
            const response = await fetch(`${baseURL}/v1/venues/${id}/checkin`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error("Failed to post venue check-in");

            const data = await response.json();

            return { count: data?.checkinCount ?? 0 };
        } catch (error) {
            console.error("Error inside postVenueCheckin:", error);
            return { count: 0 };
        }
    };

    return {
        getAllCheckins,
        postVenueCheckin
    }
}