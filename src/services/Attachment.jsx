// services/attachmentService.js
import axios from 'axios';
import { getApiBase } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';


const adjustLocalRef = (url) => {
  const adjustedUrl = url.replace('http://localhost', 'http://maxgps.smartech-tn.com:9876');
  console.log("adjustLocalRef: adjustedUrl =", adjustedUrl);
  return adjustedUrl;
};

export const fetchAttachmentsByWorkorderId = async (workorderid, sessionCookie) => {
  try {
    console.log("fetchAttachmentsByWorkorderId: workorderid =", workorderid);
    const apiBase = await getApiBase();
    console.log("fetchAttachmentsByWorkorderId: apiBase =", apiBase);
    
    const url = `${apiBase}/${workorderid}/doclinks?lean=1`;
    console.log("fetchAttachmentsByWorkorderId: URL =", url);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Cookie': `JSESSIONID=${sessionCookie}`,
      }
    });
    console.log("fetchAttachmentsByWorkorderId: Response status =", response.status);
    console.log("fetchAttachmentsByWorkorderId: Response data:", response.data);
    
    if (!response.data) {
      console.error("fetchAttachmentsByWorkorderId: Response data is null or undefined");
      return [];
    }
    
    const members = response.data.member || [];
    console.log("fetchAttachmentsByWorkorderId: Nombre d'éléments dans member =", members.length);
    
    // Retourner l'objet complet de describedBy (pour avoir plus d'infos, par exemple fileName et description)
    const attachments = members
      .map(item => {
        console.log("fetchAttachmentsByWorkorderId: Processing item:", item);
        return item.describedBy ? { ...item.describedBy } : null;
      })
      .filter(item => item !== null);
    
    console.log("fetchAttachmentsByWorkorderId: Final attachments array:", attachments);
    return attachments;
  } catch (error) {
    console.error("fetchAttachmentsByWorkorderId: Erreur lors de la récupération des attachments:", error);
    return [];
  }
};



/**
 * Ajoute un attachement .txt à un Work Order dans Maximo.
 *
 * @param {number|string} workorderid - L'ID du Work Order.
 * @param {string} fileUri - L'URI du fichier sélectionné.
 * @param {string} fileName - Nom du fichier (ex: "maximo-sequence-drawio.txt").
 * @param {string} description - Description de l'attachement.
 * @returns {Promise<Object>} - La réponse de l'API.
 */
export const addAttachment = async (workorderid, fileUri, fileName, description) => {
  try {
    if (!workorderid || !fileUri || !fileName || !description) {
      throw new Error("❌ Erreur : Paramètres manquants.");
    }

    console.log("📌 Lecture du fichier :", fileUri);
    
    // Lire le fichier en Base64
    const fileData = await RNFS.readFile(fileUri, 'base64');
    console.log("📌 Base64 Data (Preview):", fileData.substring(0, 100)); // Vérifier les premiers caractères

    const storedData = await AsyncStorage.getItem('userData');
    const { sessionCookie } = JSON.parse(storedData) || {};

    if (!sessionCookie) {
      throw new Error("❌ Erreur : sessionCookie manquant.");
    }

    const apiBase = await getApiBase();
    const url = `${apiBase}/${workorderid}/doclinks?lean=1`;

    console.log("📌 Envoi du fichier avec metadata :", { fileName, description });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'x-document-meta': 'FILE/Attachments',
        'x-document-description': description,
        'slug': fileName,
        'Cookie': `JSESSIONID=${sessionCookie}`
      },
      body: fileData // 📌 Envoi du fichier en Base64
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      let errorMessage = "Erreur inconnue lors de l'ajout de l'attachement";
      if (errorData && errorData.Error && errorData.Error.message) {
        errorMessage = errorData.Error.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      throw new Error(`⛔ Maximo : ${errorMessage}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    console.log("✅ Réponse API Maximo reçue (attachement ajouté) :", data);
    return {
      success: true,
      message: 'Attachment ajouté avec succès',
      data
    };

  } catch (error) {
    console.error("🚨 Une erreur est survenue lors de l'ajout de l'attachement:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};





/**
 * Supprime un attachement pour un Work Order.
 * @param {number|string} workorderid - L'ID du Work Order.
 * @param {number|string} doclinkId - L'ID du doclink à supprimer.
 * @returns {Promise<Object>} - La réponse de l'API.
 */
export const deleteAttachment = async (workorderid, doclinkId) => {
  try {
    const apiBase = await getApiBase();

    const url = `${apiBase}/${workorderid}/doclinks/${doclinkId}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'attachment:', error);
    throw error;
  }
};
