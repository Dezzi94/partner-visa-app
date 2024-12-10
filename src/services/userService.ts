import { supabase } from '@/config/supabase';
import { User } from '@/types/supabase';

/**
 * Fetches the current user's profile data
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Updates the user's profile information
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Uploads a profile picture to Supabase Storage and updates the user profile
 */
export const updateProfilePicture = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    // Update user profile with new picture URL
    await updateUserProfile(userId, {
      profile_picture: data.publicUrl,
      updated_at: new Date().toISOString()
    });

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}; 