import React from 'react';

const Fleetbo = {

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

    toHome: () => {
        Fleetbo.execute("toHome");
    },

    c0074: () => {
        Fleetbo.execute("c0074");
    },

    s0075: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("s0075", fleetboDB, db, jsonData);
    },

    back: () => {
        Fleetbo.execute("back");
    },

    openPage: (page) => {
        Fleetbo.execute("openPage", page);
    },

    openView: (theView, boolean) => {
        Fleetbo.execute("openView", theView, boolean);
    },

    openGalleryView: () => {
        Fleetbo.execute("openGalleryView");
    },

    adn9991: (fleetboDB, db, jsonData) => {
        Fleetbo.execute("adn9991", fleetboDB, db, jsonData);
    },

    gdf37: (fleetboDB, db) => {
        Fleetbo.execute("gdf37", fleetboDB, db);
    },

    gdf37Auth: (fleetboDB, db) => {
        Fleetbo.execute("gdf37Auth", fleetboDB, db);
    },

    dd0769: (fleetboDB, db, id) => {
        Fleetbo.execute("dd0769", fleetboDB, db, id);
    },

    d0a13: () => {
        Fleetbo.execute("d0a13");
    }
};

export default Fleetbo;


export const useLoadingTimeout = (loadingState, setLoadingState, setErrorState, timeoutMs = 1500) => {
  React.useEffect(() => {
    if (!loadingState) return;
    
    const failsafeTimeout = setTimeout(() => {
      if (loadingState) {
        console.warn("Délai d'attente dépassé");
        setLoadingState(false);
        setErrorState("Délai d'attente dépassé. Veuillez réessayer.");
      }
    }, timeoutMs);

    return () => clearTimeout(failsafeTimeout);
  }, [loadingState, setLoadingState, setErrorState, timeoutMs]);
};


let onDataReceived = null; 
window.getDataDocument = (json) => {
  try {
    let parsed = json;
    if (typeof json === "string") {
      parsed = JSON.parse(json);
    }

    if (typeof onDataReceived === 'function') {
      onDataReceived(parsed);
    } else {
      console.error("❌ Aucun callback défini pour recevoir les données");
    }
  } catch (e) {
    console.error("❌ JSON invalide reçu par window.getDataDocument:", json, e);
    if (typeof onDataReceived === 'function') {
      onDataReceived({
        error: true,
        message: "Erreur de parsing JSON: " + e.message
      });
    }
  }
};
export const FleetboGet = (callback) => {
  onDataReceived = callback;
  console.log("Callback enregistré pour FleetboGet");
};




let dataCallback = null;
window.getData = (jsonData) => {
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    if (typeof dataCallback === 'function') {
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback défini pour recevoir les données");
    }
  } catch (error) {
    console.error("❌ Erreur de parsing JSON :", error);
    if (typeof dataCallback === 'function') {
      dataCallback({
        success: false,
        message: "Erreur de parsing JSON: " + error.message
      });
    }
  }
};
