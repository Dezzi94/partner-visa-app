import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Container,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/supabase';
import { getUserProfile, updateUserProfile, updateProfilePicture } from '@/services/userService';

const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser) {
        try {
          setLoading(true);
          const profileData = await getUserProfile(authUser.uid);
          setProfile(profileData);
          setName(profileData?.name || '');
        } catch (err) {
          setError('Failed to load profile');
          console.error('Error loading profile:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [authUser]);

  const handleNameChange = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await updateUserProfile(authUser.uid, {
        name: name.trim(),
        updated_at: new Date().toISOString()
      });
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!authUser || !event.target.files?.[0]) return;

    try {
      setLoading(true);
      setError(null);
      const file = event.target.files[0];
      const photoURL = await updateProfilePicture(authUser.uid, file);
      setProfile((prev: User | null) => prev ? { ...prev, profile_picture: photoURL } : null);
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={profile?.profile_picture || undefined}
                alt={profile?.name || authUser.email || ''}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoUpload}
                disabled={loading}
              />
              <label htmlFor="photo-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 0,
                    backgroundColor: 'background.paper',
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PhotoCameraIcon />
                  )}
                </IconButton>
              </label>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {authUser.email}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              {editMode ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    variant="contained"
                    onClick={handleNameChange}
                    disabled={loading || !name.trim()}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setName(profile?.name || '');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography>
                    {profile?.name || 'No name set'}
                  </Typography>
                  <IconButton
                    onClick={() => setEditMode(true)}
                    disabled={loading}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 