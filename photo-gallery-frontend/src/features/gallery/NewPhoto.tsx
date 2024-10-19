import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { PhotoMutation } from '../../types';
import { selectCreatingPhoto } from './gallerySlice';
import { createPhoto } from './galleryThunks';
import PhotoForm from './components/PhotoForm';

const NewPhoto = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectCreatingPhoto);

  const onFormSubmit = async (photoMutation: PhotoMutation) => {
    try {
      await dispatch(createPhoto(photoMutation)).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>New Photo</Typography>
      <PhotoForm
        onSubmit={onFormSubmit}
        isLoading={isCreating}
      />
    </>
  );
};

export default NewPhoto;