import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common/Toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

interface UserProfile {
  displayName: string;
  photoURL: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setDisplayName(userData.displayName || '');
          setPhotoURL(userData.photoURL || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showToast('Failed to load profile', 'error');
      }
    };

    fetchUserProfile();
  }, [user, showToast]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    setUploadLoading(true);
    setError('');

    try {
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL
      });

      setPhotoURL(downloadURL);
      showToast('Profile photo updated successfully', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
      showToast('Failed to upload photo', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim()
      });

      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            p: 4,
            mb: 4
          }}
        >
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Avatar
              src={photoURL || undefined}
              alt={displayName || user.email || ''}
              sx={{
                width: 120,
                height: 120,
                mb: 2
              }}
            />
            <input
              accept="image/*"
              type="file"
              id="photo-upload"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              disabled={uploadLoading}
            />
            <label htmlFor="photo-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  right: -8,
                  bottom: 16,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                disabled={uploadLoading}
              >
                {uploadLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <PhotoCameraIcon />
                )}
              </IconButton>
            </label>
          </Box>

          <TextField
            fullWidth
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            onClick={handleUpdateProfile}
            disabled={loading || !displayName.trim()}
            sx={{ minWidth: 200 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Update Profile'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfilePage; 