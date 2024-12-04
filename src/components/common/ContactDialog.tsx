import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const ContactDialog: React.FC<ContactDialogProps> = ({ open, onClose }) => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = () => {
    // In a real application, this would send the message to a backend
    console.log('Contact form submitted:', { email, message });
    // Reset form and close dialog
    setEmail('');
    setMessage('');
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>Contact Support</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          Please fill out the form below and we'll get back to you as soon as possible.
        </DialogContentText>
        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!email || !message}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog; 