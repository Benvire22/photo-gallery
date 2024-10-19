import React, { useState } from 'react';
import { Alert, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import FileInput from '../../../UI/FileInput/FileInput';
import { useAppSelector } from '../../../app/hooks';
import { PhotoMutation } from '../../../types';
import { selectErrorCreatingPhoto } from '../gallerySlice';

interface Props {
  onSubmit: (photo: PhotoMutation) => void;
  isLoading: boolean;
}

const PostForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const error = useAppSelector(selectErrorCreatingPhoto);

  const [state, setState] = useState<PhotoMutation>({
    title: '',
    image: null,
  });

  const submitFormHandler = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit({ ...state });
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fileInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    const value = files && files[0] ? files[0] : null;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Grid container direction='column' spacing={2} component='form' onSubmit={submitFormHandler}>
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error.error}
        </Alert>
      )}
      <Grid>
        <TextField
          required
          label='Title'
          id='title'
          name='title'
          value={state.title}
          onChange={inputChangeHandler}
        />
      </Grid>
      <Grid>
        <FileInput
          label='Image'
          name='image'
          onChange={fileInputChangeHandler}
        />
      </Grid>
      <Grid>
        <LoadingButton
          type='submit'
          loading={isLoading}
          loadingPosition='start'
          startIcon={<SaveIcon />}
          variant='contained'
        >
          <span>create photo</span>
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default PostForm;
