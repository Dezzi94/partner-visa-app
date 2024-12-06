import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref as databaseRef, update, get, child } from 'firebase/database';
import { storage, db, database } from '../config/firebase';

interface UploadedDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadDate: string;
}

export const uploadDocument = async (
  file: File,
  userId: string,
  type: string
): Promise<UploadedDocument> => {
  try {
    const timestamp = Date.now();
    const fileName = `${userId}/${type}/${timestamp}_${file.name}`;
    const fileRef = storageRef(storage, fileName);

    // Upload file to Storage
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // Create document metadata
    const documentData: UploadedDocument = {
      id: `${timestamp}`,
      name: file.name,
      url: downloadURL,
      type,
      uploadDate: new Date().toISOString()
    };

    // Update Firestore
    await updateDoc(doc(db, 'users', userId), {
      documents: arrayUnion(documentData)
    });

    // Update Realtime Database
    const userDocsRef = databaseRef(database, `users/${userId}/documents`);
    const userDocsSnapshot = await get(userDocsRef);
    const currentDocs = userDocsSnapshot.exists() ? userDocsSnapshot.val() : [];
    
    await update(databaseRef(database, `users/${userId}`), {
      documents: [...currentDocs, documentData]
    });

    return documentData;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const deleteDocument = async (
  userId: string,
  document: UploadedDocument
): Promise<void> => {
  try {
    // Delete from Storage
    const fileRef = storageRef(storage, document.url);
    await deleteObject(fileRef);

    // Remove from Firestore
    await updateDoc(doc(db, 'users', userId), {
      documents: arrayRemove(document)
    });

    // Remove from Realtime Database
    const userDocsRef = databaseRef(database, `users/${userId}/documents`);
    const userDocsSnapshot = await get(userDocsRef);
    const currentDocs = userDocsSnapshot.exists() ? userDocsSnapshot.val() : [];
    const updatedDocs = currentDocs.filter((doc: UploadedDocument) => doc.id !== document.id);

    await update(databaseRef(database, `users/${userId}`), {
      documents: updatedDocs
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}; 