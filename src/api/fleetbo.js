//src/api/fleetbo.js

import React from 'react';
let dataCallback = null;
const setDataCallback = (callback) => {
  dataCallback = callback;
  console.log("Callback de réception de données enregistré avec succès.");
};
const useLoadingTimeout = (loadingState, setLoadingState, setErrorState, timeoutMs = 15000) => {
  React.useEffect(() => {
    if (!loadingState) return;
    const failsafeTimeout = setTimeout(() => {
      if (loadingState) {
        console.warn("Délai d'attente dépassé. La connexion native a pris trop de temps.");
        setLoadingState(false);
        setErrorState("Délai d'attente dépassé. Veuillez réessayer.");
      }
    }, timeoutMs);
    return () => clearTimeout(failsafeTimeout);
  }, [loadingState, setLoadingState, setErrorState, timeoutMs]);
};
const waitForNativeInterface = (maxAttempts = 50, interval = 100) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkInterface = () => {
      attempts++;
      if (window.fleetbo) {
        console.log("Interface native détectée après", attempts, "tentatives");
        resolve(true);
      } else if (attempts >= maxAttempts) {
        console.error("Interface native non disponible après", attempts, "tentatives");
        reject(new Error("Interface native non disponible"));
      } else {
        setTimeout(checkInterface, interval);
      }
    };
    checkInterface();
  });
};
const Fleetbo = {
    execute: async (funcName, ...args) => {
        console.log(`Tentative d'exécution de: ${funcName}`, args);
        try {
            await waitForNativeInterface();
            if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
                console.log(`Exécution de window.fleetbo.${funcName}`);
                window.fleetbo[funcName](...args);
            } else {
                throw new Error(`Fonction ${funcName} non disponible`);
            }
        } catch (error) {
            console.error(`Erreur lors de l'exécution de ${funcName}:`, error);
            if (dataCallback) {
                dataCallback({
                    success: false,
                    error: true,
                    message: `Fonction native '${funcName}' introuvable: ${error.message}`
                });
            }
        }
    },
    executeSync: (funcName, ...args) => {
        console.log(`Exécution synchrone de: ${funcName}`, args);
        
        if (window.fleetbo && typeof window.fleetbo[funcName] === "function") {
            console.log(`Exécution immédiate de window.fleetbo.${funcName}`);
            window.fleetbo[funcName](...args);
        } else {
            console.error(`Erreur: window.fleetbo.${funcName} n'est pas disponible.`);
            if (dataCallback) {
                dataCallback({
                    success: false,
                    error: true,
                    message: `Fonction native '${funcName}' introuvable.`
                });
            }
        }
    },
    toHome: () => Fleetbo.execute("toHome"),
    c0074: () => Fleetbo.execute("c0074"),
    back: () => Fleetbo.execute("back"),
    openPage: (page) => Fleetbo.execute("openPage", page),
    openPageId: (page, id) => Fleetbo.execute("openPageId", page, id),
    openView: (theView, boolean) => Fleetbo.execute("openView", theView, boolean),
    openGalleryView: () => Fleetbo.execute("openGalleryView"),
    d0a13: () => Fleetbo.execute("d0a13"),
    o00011: () => Fleetbo.execute("o00011"),
    s0075: (fleetboDB, db, jsonData) => Fleetbo.execute("s0075", fleetboDB, db, jsonData),
    add: (fleetboDB, db, jsonData) => Fleetbo.execute("add", fleetboDB, db, jsonData),
    delete: (fleetboDB, db, id) => Fleetbo.execute("delete", fleetboDB, db, id),
    getAuthUser: (fleetboDB, db) => Fleetbo.execute("getAuthUser", fleetboDB, db),

    getDocsG: (fleetboDB, db) => {
        console.log(`=== APPEL getDocsG ===`);
        console.log(`fleetboDB: ${fleetboDB}`);
        console.log(`db: ${db}`);
        console.log(`window.fleetbo existe:`, !!window.fleetbo);
        console.log(`window.fleetbo.getDocsG existe:`, !!(window.fleetbo && window.fleetbo.getDocsG));
        
        return Fleetbo.execute("getDocsG", fleetboDB, db);
    },
    
    getDocsU: (fleetboDB, db) => Fleetbo.execute("getDocsU", fleetboDB, db),
    getDoc: (fleetboDB, db, id) => Fleetbo.execute("getDoc", fleetboDB, db, id),
    startNotification: (dataNotification) => Fleetbo.execute("startNotification", dataNotification),
    getToken: () => Fleetbo.execute("getToken"),

    setDataCallback: setDataCallback,
    useLoadingTimeout: useLoadingTimeout,

    testInterface: () => {
        console.log("=== TEST INTERFACE NATIVE ===");
        console.log("window.fleetbo:", window.fleetbo);
        console.log("window.fleetbo methods:", window.fleetbo ? Object.keys(window.fleetbo) : "Non disponible");
        
        if (window.fleetbo && window.fleetbo.getDocsG) {
            console.log("✅ getDocsG est disponible");
        } else {
            console.log("❌ getDocsG n'est PAS disponible");
        }
    }
};

window.getData = (jsonData) => {
  console.log("=== window.getData appelé ===");
  console.log("Type de données reçues:", typeof jsonData);
  console.log("Données brutes:", jsonData);
  
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    console.log("Données parsées:", parsedData);
    
    if (dataCallback) {
      console.log("✅ Transmission au callback React");
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback défini pour recevoir les données");
    }
  } catch (error) {
    console.error("❌ Erreur de parsing JSON:", error);
    console.error("Données problématiques:", jsonData);
    
    if (dataCallback) {
      dataCallback({ 
        success: false, 
        error: true,
        message: "Erreur de parsing JSON: " + error.message 
      });
    }
  }
};

window.getDataDocument = (jsonData) => {
  console.log("=== window.getDataDocument appelé ===");
  console.log("Données:", jsonData);
  
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (dataCallback) {
      console.log("✅ Données transmises via getDataDocument");
      dataCallback(parsedData);
    } else {
      console.error("❌ Aucun callback pour getDataDocument");
    }
  } catch (error) {
    console.error("❌ Erreur parsing getDataDocument:", error);
    if (dataCallback) {
      dataCallback({ 
        success: false, 
        error: true,
        message: "Erreur parsing getDataDocument: " + error.message 
      });
    }
  }
};

window.debugFleetbo = () => {
  Fleetbo.testInterface();
};

export default Fleetbo;
