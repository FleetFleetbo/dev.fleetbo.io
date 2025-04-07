const Fleetbo = {
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
window.getData = (json) => {
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


let onDataReceivedList = null; 
window.getData = (json) => {
  try {
    let parsed = json;
    if (typeof json === "string") {
      parsed = JSON.parse(json);
    }

    if (typeof onDataReceivedList === 'function') {
      onDataReceivedList(parsed); 
    }
  } catch (e) {
    console.error("❌ JSON invalide reçu par window.getData:", json, e);
  }
};
export const FleetboGetList = (callback) => {
    onDataReceivedList = callback; 
};
