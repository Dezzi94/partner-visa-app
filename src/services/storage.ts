import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export const uploadDocument = async (
  userId: string,
  file: File,
  type: string
): Promise<UploadedDocument> => {
  try {
    // Create a unique file name
    const fileName = `${userId}/${type}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const url = await getDownloadURL(storageRef);

    // Create document metadata
    const documentData: UploadedDocument = {
      id: fileName,
      name: file.name,
      type,
      url,
      uploadedAt: new Date().toISOString()
    };

    // Update user's documents array in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      documents: arrayUnion(documentData)
    });

    return documentData;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const deleteDocument = async (
  userId: string,
  document: UploadedDocument
): Promise<void> => {
  try {
    // Delete from Storage
    const storageRef = ref(storage, document.id);
    await deleteObject(storageRef);

    // Remove from user's documents array in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      documents: arrayRemove(document)
    });
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}; 