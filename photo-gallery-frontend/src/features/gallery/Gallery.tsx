import { Alert, Button, CircularProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { Link, useParams } from 'react-router-dom';
import { selectFetchingGalleryAuthor, selectFetchingPhotos, selectGalleryAuthor, selectPhotos } from './gallerySlice';
import { fetchPhotos, getGalleryAuthor } from './galleryThunks';
import PhotoItem from './components/PhotoItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageModal from '../../UI/ImageModal/ImageModal';
import { Photo } from '../../types';

const Gallery = () => {
  const user = useAppSelector(selectUser);
  const photos = useAppSelector(selectPhotos);
  const isFetching = useAppSelector(selectFetchingPhotos);
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const galleryAuthor = useAppSelector(selectGalleryAuthor);
  const fetchingAuthor = useAppSelector(selectFetchingGalleryAuthor);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    try {
      if (userId) {
        void dispatch(fetchPhotos(userId)).unwrap();
        void dispatch(getGalleryAuthor(userId));
      } else {
        void dispatch(fetchPhotos()).unwrap();
      }
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, userId]);

  const handleClose = () => {
    setOpenModal(false);
    setPhoto(null);
  };
  const handelOpen = () => setOpenModal(true);

  const showPhoto = (photo: Photo) => {
    setPhoto(photo);
    handelOpen();
  };

  let content: React.ReactNode = (
    <Alert severity="info" sx={{ width: '100%' }}>
      There are no Photos in this gallery!
    </Alert>
  );

  if (isFetching) {
    content = (
      <Grid container size={12} direction="column" alignItems="center" justifyContent="center" spacing={2}>
        <CircularProgress />
      </Grid>
    );
  } else if (photos.length > 0) {
    content = photos.map((photo) => (
      <PhotoItem
        key={photo._id}
        id={photo._id}
        title={photo.title}
        image={photo.image}
        author={photo.user}
        showPhoto={() => showPhoto(photo)}
        user={user}
      />
    ));
  }

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid container direction="column" spacing={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              {userId && fetchingAuthor ? (
                <CircularProgress />
              ) : (
                <Typography variant="h3">
                  {galleryAuthor && userId ? `${galleryAuthor.displayName}'s gallery` : 'Photo Gallery'}
                </Typography>
              )}
            </Grid>
            {userId && (
              <Button variant="text" startIcon={<ArrowBackIcon />} component={Link} to="/">
                Back to all galleries
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          {content}
        </Grid>
      </Grid>
      <ImageModal isOpen={openModal} photo={photo} onClose={handleClose} />
    </>
  );
};

export default Gallery;
