import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from '../utils/getErrorMessage';
import { getApiBase } from './apiConfig';



// 📌 Fonction pour récupérer les Work Orders
  export const fetchWorkOrders = async (pageNumber = 1) => {
    try {
        // 🔹 Récupérer les données de connexion utilisateur
        const storedData = await AsyncStorage.getItem('userData');
        if (!storedData) {
            throw new Error(getErrorMessage("auth", "session_expired"));
        }

        const { username, password, sessionCookie } = JSON.parse(storedData);
        if (!username || !password) {
            throw new Error(getErrorMessage("auth", "missing_credentials"));
        }
        const apiBase = await getApiBase();

        // 🔹 Construire l'URL de l'API avec `workorderid` au lieu de `id`
        const url = `${apiBase}?oslc.where=woclass="WORKORDER"&oslc.select=workorderid,wonum,description,status,status_description,location,siteid,calcpriority,worktype,failurecode,problemcode,reportedby,assetnum,workorderid&oslc.pageSize=20&pageno=${pageNumber}&lean=1`;

        console.log("📡 Envoi de la requête GET vers :", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cookie': `JSESSIONID=${sessionCookie}`
            }
        });

        if (!response.ok) {
            throw new Error(getErrorMessage("work_orders", "fetch_error"));
        }

        const data = await response.json();
        console.log("📡 Données reçues avant nettoyage :", JSON.stringify(data, null, 2));

        let newWorkOrders = data["member"] || [];
        if (!Array.isArray(newWorkOrders)) {
            throw new Error(getErrorMessage("work_orders", "not_found"));
        }

        // 🔹 Supprimer l'attribut `id` de chaque Work Order
        newWorkOrders = newWorkOrders.map(wo => {
            const { id, ...cleanedWO } = wo;  // 🔥 On enlève `id`
            return cleanedWO;
        });

        console.log("📡 Données nettoyées (sans `id`) :", JSON.stringify(newWorkOrders, null, 2));

        return { success: true, workOrders: newWorkOrders, hasMore: newWorkOrders.length > 0 };

    } catch (error) {
        return { success: false, error: error.message };
    }
};



// Recherche un Work Order par WONUM
export const fetchWorkOrderByWonum = async (wonum) => {
    try {
      console.log("🔎 Début de fetchWorkOrderByWonum avec wonum:", wonum);
  
      // 🔹 Récupérer les données de connexion utilisateur
      const storedData = await AsyncStorage.getItem('userData');
      console.log("🗃️ storedData récupéré:", storedData);
      if (!storedData) {
        throw new Error(getErrorMessage("auth", "session_expired"));
      }
  
      const { username, password, sessionCookie } = JSON.parse(storedData);
      console.log("👤 Utilisateur:", username, "Session Cookie:", sessionCookie);
      if (!username || !password) {
        throw new Error(getErrorMessage("auth", "missing_credentials"));
      }
  
      // 🔹 Construire le filtre OSLC
      const filter = `woclass="WORKORDER" and wonum="${wonum}"`;
      console.log("🔍 Filtre OSLC non encodé:", filter);
      const encodedFilter = encodeURIComponent(filter);
      console.log("🔍 Filtre OSLC encodé:", encodedFilter);
      const apiBase = await getApiBase();

      // 🔹 Construire l'URL de l'API
      const url = `${apiBase}?oslc.where=${encodedFilter}&oslc.select=workorderid,wonum,description,status,status_description,location,siteid,schedstart,schedfinish,calpriority,failurecode, problemcode,worktype,reportedby,owner,actstart,actfinish,estdur,actlabhrs,actlabcost,plustmptype,assetnum,glaccount,woclass,wogroup,supervisor,workorderid&lean=1`;
      console.log("📡 URL de la requête:", url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cookie': `JSESSIONID=${sessionCookie}`
        }
      });
  
      console.log("📡 Statut de la réponse:", response.status);
      if (!response.ok) {
        throw new Error(getErrorMessage("work_orders", "fetch_error"));
      }
  
      const data = await response.json();
      console.log("📡 Données JSON brutes reçues :", JSON.stringify(data, null, 2));
  
      let workOrders = data.member || [];
      console.log("📡 Nombre de work orders récupérés :", workOrders.length);
      if (!Array.isArray(workOrders)) {
        throw new Error(getErrorMessage("work_orders", "not_found"));
      }
  
      // 🔹 Nettoyer chaque work order si nécessaire (par exemple, supprimer l'attribut id)
      workOrders = workOrders.map(wo => {
        const { id, ...cleanedWO } = wo;
        return cleanedWO;
      });
      console.log("📡 Work orders après nettoyage :", JSON.stringify(workOrders, null, 2));
  
      return { success: true, workOrders, hasMore: workOrders.length > 0 };
    } catch (error) {
      console.error("❌ Erreur lors de la recherche du Work Order:", error);
      return { success: false, error: error.message };
    }
  };













 /// 📌 Fonction pour ajouter wo
  
 export const createWorkOrder = async (workOrderData) => {
    try {
        const storedData = await AsyncStorage.getItem('userData');
        if (!storedData) {
            return { success: false, error: getErrorMessage("auth", "session_expired") };
        }

        const { sessionCookie } = JSON.parse(storedData);
        const apiBase = await getApiBase();

        const response = await fetch(`${apiBase}?lean=1`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cookie': `JSESSIONID=${sessionCookie}`
            },
            body: JSON.stringify(workOrderData)
        });

        const responseText = await response.text(); // 🔥 Lire la réponse brute

        if (response.ok && !responseText.trim()) {
            return { success: true, message: "Work Order ajouté avec succès (aucune réponse de l'API)." };
        }

        let errorMessage = getErrorMessage("work_orders", "creation_failed");

        if (!response.ok) {
            console.error("❌ Réponse API brute:", responseText);

            try {
                const jsonResponse = JSON.parse(responseText);

                // ✅ Vérifier si "Error" et "message" existent
                if (jsonResponse?.Error?.message) {
                    errorMessage = jsonResponse.Error.message; // ✅ Afficher le vrai message
                } else {
                    console.warn("⚠️ La réponse JSON ne contient pas d'erreur connue.");
                }
            } catch (parseError) {
                console.error("❌ Impossible de parser la réponse JSON :", parseError);
                errorMessage = getErrorMessage("work_orders", "server_error");
            }

            return { success: false, error: errorMessage };
        }

        try {
            const data = JSON.parse(responseText);
            return { success: true, workOrder: data };
        } catch (parseError) {
            console.error("❌ Impossible de parser la réponse JSON :", parseError);
            return { success: false, error: getErrorMessage("work_orders", "server_error") };
        }

    } catch (error) {
        console.error("❌ Erreur inattendue :", error);

        if (error.message.includes("Network request failed")) {
            return { success: false, error: getErrorMessage("api", "network_error") };
        } else if (error.message.includes("timeout")) {
            return { success: false, error: getErrorMessage("api", "timeout") };
        } else {
            return { success: false, error: getErrorMessage("work_orders", "server_error") };
        }
    }
};







/**
 * Récupère l’objet WorkOrder (member[0]) depuis Maximo via OSLC.
 *
 * @param {number|string} workorderId   – L’ID du WorkOrder.
 * @param {string}       sessionCookies – La chaîne de cookies de session Maximo (ex. "JSESSIONID=…; other=…").
 * @returns {Promise<Object>}           – L’objet JS du WorkOrder.
 */
export async function fetchWorkOrderObject(workorderId, sessionCookies) {
    // 1) Construction de l’URL
    const apiBase = await getApiBase();  
    // ex. 'http://maxgps.smartech-tn.com:9876/maximo/oslc/os/mxwo'
    const url = `${apiBase}`
      + `?oslc.select=failurecode,problemcode,wopriority,asset{installdate,assetnum,status,assettype}`
      + `&lean=1`
      + `&oslc.where=workorderid=${workorderId}`;
  
    // 2) Appel GET
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cookie': sessionCookies
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Maximo API Error ${response.status} – ${response.statusText}`);
    }
  
    // 3) Transformation en JS object
    const data = await response.json();
  
    // 4) Extraction du premier membre
    return Array.isArray(data.member)
      ? data.member[0]
      : data;
  }
  
  /**
   * Transforme un WorkOrder JS en
   * le payload attendu par le modèle IA,
   * avec fréquence de panne par défaut à 2.
   *
   * @param {Object} workorderObj – L’objet JS retourné par fetchWorkOrderObject.
   * @returns {Object}            – Le JSON au format IA.
   */
  export function buildModelInput(workorderObj) {
    // 1) Récupère l’asset lié
    const asset = Array.isArray(workorderObj.asset)
      ? workorderObj.asset[0]
      : workorderObj.asset;
  
    // 2) Calcul de l’âge de l’équipement en années
    const installDate = new Date(asset.installdate);
    const now = new Date();
    let age = now.getFullYear() - installDate.getFullYear();
    if (
      now.getMonth()  < installDate.getMonth() ||
      (now.getMonth() === installDate.getMonth() && now.getDate() < installDate.getDate())
    ) {
      age--;
    }
  
    // 3) Construction du payload final, fréquence par défaut = 2
    return {
      ASSETTYPE:       asset.assettype,
      FAILURECODE:     workorderObj.failurecode,
      PROBLEMCODE:     workorderObj.problemcode,
      FREQUENCE_PANNE: 2,
      AGE_EQUIPMENT:   age,
      PRIORITY:        String(workorderObj.wopriority)
    };
  }
  