import { supabase } from '@/config/supabase';
import { Document } from '@/types/supabase';

/**
 * Fetches all documents for the current user
 */
export const getUserDocuments = async (userId: string): Promise<Document[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error('Failed to fetch documents');
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user documents:', error);
    throw error;
  }
};

/**
 * Uploads a document file and creates a document record
 */
export const uploadDocument = async (
  userId: string,
  file: File,
  documentName: string
): Promise<Document> => {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}_${documentName}.${fileExt}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const documentData = {
      user_id: userId,
      document_name: documentName,
      document_url: urlData.publicUrl,
      status: 'Pending'
    };

    const { data, error: insertError } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Deletes a document and its associated file
 */
export const deleteDocument = async (document: Document): Promise<void> => {
  try {
    // Extract file path from URL
    const url = new URL(document.document_url);
    const filePath = url.pathname.split('/').slice(-2).join('/');

    // Delete from Storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}; 