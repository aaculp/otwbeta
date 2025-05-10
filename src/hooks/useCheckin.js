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

    return {
        getAllCheckins
    }
}