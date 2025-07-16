// frontend/src/components/Notification.tsx
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

interface NotificationProps {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  severity = 'error',
  onClose 
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};