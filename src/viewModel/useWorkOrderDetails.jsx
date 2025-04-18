// src/viewmodels/useWorkOrderDetailsViewModel.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { fetchAttachments, addAttachment } from '../services/Attachment';
import { readFileFromContentUri } from '../utils/readFileFromContentUri';

export const useWorkOrderDetailsViewModel = (workOrder) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Charger les attachments au montage (et si workOrderID change)
  useEffect(() => {
    loadAttachments();
  }, [workOrder?.workorderid]);

  // --- Fonction pour récupérer la liste des attachments ---
  const loadAttachments = async () => {
    setLoading(true);
    try {
      const files = await fetchAttachments(workOrder.workorderid);
      setAttachments(files);
    } catch (error) {
      console.error("Erreur lors du chargement des attachments :", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Fonction pour ajouter un nouvel attachment ---
  const handleAddAttachment = async () => {
    try {
      setAdding(true);
      // Ouvrir le sélecteur de fichier
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      // Lire le contenu du fichier sélectionné en base64
      const fileContent = await readFileFromContentUri(res.uri);

      // Métadonnées à envoyer
      const metadata = {
        fileName: res.name,
        description: 'Attachment ajouté depuis mobile',
      };

      // Appel à l'API pour ajouter l’attachment
      await addAttachment(workOrder.workorderid, fileContent, metadata);

      Alert.alert('Succès', 'Attachment ajouté avec succès !');
      // Recharger la liste des attachments
      await loadAttachments();
    } catch (err) {
      // Vérifier si l’utilisateur a annulé
      if (!DocumentPicker.isCancel(err)) {
        console.error("Erreur lors de l'ajout de l'attachement :", err);
        Alert.alert("Erreur", "Erreur lors de l'ajout de l'attachement");
      }
    } finally {
      setAdding(false);
    }
  };

  // On renvoie tout ce dont la View a besoin
  return {
    attachments,
    loading,
    adding,
    handleAddAttachment,
  };
};
