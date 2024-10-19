import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { API_URL } from '../../constants';
import { Photo } from '../../types';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface Props {
  isOpen: boolean;
  photo: Photo | null;
  onClose: () => void;
}

const ImageModal: React.FC<Props> = ({ isOpen, photo, onClose }) => {
  return (
    <>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Photo title: {photo?.title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container justifyContent="center" alignItems="center">
            <img height="700px" width="auto" src={`${API_URL}/${photo?.image}`} alt={photo?.title} />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            close X
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default ImageModal;