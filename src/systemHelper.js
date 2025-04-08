const Fleetbo = {

    // Fonction pour définir le callback à utiliser quand des données sont reçues
    setDataCallback: (callback) => {
      dataCallback = callback;
    },

    execute: (funcName, ...args) => {
        if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
            window.fleetbo[funcName](...args);
        } else {
            console.error(`Erreur: window.fleetbo.${funcName} n'est pas disponible.`);
        }
    },

    // Go to Home
    toHome: () => {
        Fleetbo.execute("toHome");
    },

    // Connexion / login
    c0074: () => {
        Fleetbo.execute("c0074");
    },

    // Register
    s0075: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("s0075", fleetboDB, db, jsonData);
    },

    // Back 
    back: () => {
        Fleetbo.execute("back");
    },

    // Open page 
    openPage: (page) => {
        Fleetbo.execute("openPage", page);
    },

    // Open View Tab 
    openView: (theView, boolean) => {
        Fleetbo.execute("openView", theView, boolean);
    },

    // Open specific view 
    openGalleryView: () => {
        Fleetbo.execute("openGalleryView");
    },

    // Add document
    adn9991: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("adn9991", fleetboDB, db, jsonData);
    },

    // Get documents from database
    gdf37: (fleetboDB, db) => {
        Fleetbo.execute("gdf37", fleetboDB, db);
    },

    // Get specific document (user) from database
    gdf37Auth: (fleetboDB, db) => {
        Fleetbo.execute("gdf37Auth", fleetboDB, db);
    },

     // Delete document
    dd0769: (fleetboDB, db, id) => {
        Fleetbo.execute("dd0769", fleetboDB, db, id);
    },

     // Leave app (Test mode)
    d0a13: () => {
        Fleetbo.execute("d0a13");
    }
};

export default Fleetbo;


let onDataReceived = null; 
window.getDataDocument = (json) => {
  try {
    let parsed = json;
    if (typeof json === "string") {
      parsed = JSON.parse(json);
    }

    if (typeof onDataReceived === 'function') {
      onDataReceived(parsed); 
    }
  } catch (e) {
    console.error("❌ JSON invalide reçu par window.getData:", json, e);
  }
};
export const FleetboGet = (callback) => {
  onDataReceived = callback; 
};



// Variable pour stocker le callback
let dataCallback = null;
// Fonction interne qui sera exposée sur window pour le pont Kotlin
window.getData = (jsonData) => {
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Appeler le callback enregistré par setDataCallback
    if (typeof dataCallback === 'function') {
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback défini pour recevoir les données");
    }
  } catch (error) {
    console.error("❌ Erreur de parsing JSON :", error);
    // Même en cas d'erreur, on essaie de notifier avec un message d'erreur
    if (typeof dataCallback === 'function') {
      dataCallback({
        success: false,
        message: "Erreur de parsing JSON: " + error.message
      });
    }
  }
};
