import React from 'react';
import { Card, CardActions, CardContent, CardMedia, IconButton, styled, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { API_URL } from '../../../constants';
import Grid from '@mui/material/Grid2';
import { User } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectDeletingPhoto, selectPublishingPhoto } from '../gallerySlice';
import { deletePhoto, fetchPhotos, togglePublished } from '../galleryThunks';
import { LoadingButton } from '@mui/lab';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


const ImageCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: '56.25%',
});

interface Props {
  id: string;
  title: string;
  image: string;
  isPublished: boolean;
  user: User | null;
  author: {
    _id: string;
    displayName: string;
  };
  showPhoto: VoidFunction;
}

const PhotoItem: React.FC<Props> = ({ id, title, author, image, isPublished, user, showPhoto}) => {
  const isPublishing = useAppSelector(selectPublishingPhoto);
  const isDeleting = useAppSelector(selectDeletingPhoto);
  const dispatch = useAppDispatch();

  const handleToggle = async () => {
    try {
      await dispatch(togglePublished(id)).unwrap();
      await dispatch(fetchPhotos()).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deletePhoto(id)).unwrap();
      await dispatch(fetchPhotos()).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Grid sx={{ width: '300px' }}>
      <Card sx={{ height: '100%' }}>
        <ImageCardMedia image={`${API_URL}/${image}`} title={title} onClick={showPhoto} />
        <CardContent>
          <Typography gutterBottom variant="h6" onClick={showPhoto}>{title}</Typography>
        </CardContent>
        <CardActions>
          <IconButton component={Link} to={`/user-gallery/${author._id}`}>
            Show {author.displayName}'s gallery
            <ArrowForwardIcon />
          </IconButton>
          <Grid>
            {user?.role === 'admin' && !isPublished && (
              <LoadingButton
                type="button"
                onClick={handleToggle}
                fullWidth
                color="primary"
                loading={isPublishing}
                loadingPosition="end"
                endIcon={<ArrowForwardIcon />}
                variant="contained"
              >
                <span>Publish</span>
              </LoadingButton>
            )}
            {(user?.role === 'admin' || user?._id === author._id) && (
              <LoadingButton
                type="button"
                onClick={handleDelete}
                fullWidth
                color="error"
                loading={isDeleting}
                loadingPosition="end"
                endIcon={<DeleteForeverIcon />}
                variant="outlined"
              >
                <span>delete Photo</span>
              </LoadingButton>
            )}
          </Grid>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PhotoItem;
