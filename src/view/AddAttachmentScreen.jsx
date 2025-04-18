// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   TextInput, 
//   TouchableOpacity, 
//   ActivityIndicator, 
//   Alert 
// } from 'react-native';
// // import Header from '../components/Header';
// import { addAttachment } from '../services/Attachment';
// import DocumentPicker from 'react-native-document-picker';

// const AddAttachmentScreen = ({ route, navigation }) => {
//   const { workorderid } = route.params;
//   const [fileUri, setFileUri] = useState('');
//   const [fileName, setFileName] = useState('');
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChooseFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.plainText], // ✅ Sélectionne uniquement les fichiers .txt
//       });
//       const file = Array.isArray(res) ? res[0] : res;
//       setFileUri(file.uri);
//       setFileName(file.name);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled file selection');
//       } else {
//         Alert.alert('Erreur', 'Erreur lors de la sélection du fichier');
//       }
//     }
//   };

//   const handleAddAttachment = async () => {
//     if (!fileUri || !fileName || !description) {
//       Alert.alert('Erreur', 'Veuillez sélectionner un fichier et saisir une description.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await addAttachment(workorderid, fileUri, fileName, description);
//       if (response.success) {
//         Alert.alert('Succès', 'Fichier ajouté avec succès.');
//         navigation.goBack();
//       } else {
//         Alert.alert('Erreur', response.error);
//       }
//     } catch (error) {
//       Alert.alert('Erreur', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="Ajouter un Fichier .txt" navigation={navigation} />
//       <View style={styles.form}>
//         <TouchableOpacity style={styles.actionButton} onPress={handleChooseFile}>
//           <Text style={styles.actionButtonText}>Sélectionner un fichier .txt</Text>
//         </TouchableOpacity>

//         {fileName ? (
//           <View style={styles.fileNameContainer}>
//             <Text style={styles.fileNameLabel}>Fichier sélectionné :</Text>
//             <Text style={styles.fileNameText}>{fileName}</Text>
//           </View>
//         ) : null}

//         <TextInput
//           style={[styles.input, styles.multilineInput]}
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//         />

//         <TouchableOpacity 
//           style={styles.addButton} 
//           onPress={handleAddAttachment}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#FFF" />
//           ) : (
//             <Text style={styles.addButtonText}>Ajouter Fichier</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F2F5',
//   },
//   form: {
//     padding: 16,
//   },
//   actionButton: {
//     backgroundColor: '#007BFF',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   actionButtonText: {
//     color: '#FFF',
//     fontSize: 14,
//   },
//   fileNameContainer: {
//     marginBottom: 12,
//   },
//   fileNameLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   fileNameText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#CCC',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     fontSize: 16,
//   },
//   multilineInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   addButton: {
//     backgroundColor: '#007BFF',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//   },
// });

// export default AddAttachmentScreen;
