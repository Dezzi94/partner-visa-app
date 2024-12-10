import { supabase, getFileUrl } from '../config/supabase';
import { Document } from '../types/supabase';

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
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const url = getFileUrl('documents', fileName);

    // Create document record in the documents table
    const documentData = {
      user_id: userId,
      document_name: file.name,
      document_url: url,
      status: 'Pending'
    };

    const { data, error: dbError } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (dbError) throw dbError;

    return {
      id: data.id,
      name: file.name,
      url,
      type,
      uploadDate: new Date().toISOString()
    };
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
    // Delete from Supabase Storage
    const filePath = document.url.split('/').slice(-3).join('/');
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from documents table
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('document_url', document.url)
      .eq('user_id', userId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}; 