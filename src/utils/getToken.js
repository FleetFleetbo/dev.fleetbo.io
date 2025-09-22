import Fleetbo from 'api/fleetbo';

/**
 * Handles fetching the FCM token from Fleetbo and displays it in an alert.
 */
export const handleGetToken = async () => {
    try {
        // Use the Fleetbo API Promise
        const tokenResult = await Fleetbo.getToken();
        console.log("FCM Token received:", tokenResult.token);
        alert("Token reçu : " + tokenResult.token);
    } catch (error) {
        console.error("Failed to get token:", error);
        alert("Erreur lors de la récupération du token.");
    }
};
c
