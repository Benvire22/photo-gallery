import React from 'react';
import { Card, CardActions, CardContent, CardMedia, IconButton, styled, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { API_URL } from '../../../constants';
import Grid from '@mui/material/Grid2';
import { User } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectDeletingPhoto } from '../gallerySlice';
import { deletePhoto, fetchPhotos } from '../galleryThunks';
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
  user: User | null;
  author: {
    _id: string;
    displayName: string;
  };
  showPhoto: VoidFunction;
}

const PhotoItem: React.FC<Props> = ({ id, title, author, image, user, showPhoto }) => {
  const isDeleting = useAppSelector(selectDeletingPhoto);
  const dispatch = useAppDispatch();
  const { userId } = useParams();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete Photo?')) {
      try {
        await dispatch(deletePhoto(id)).unwrap();
        await dispatch(fetchPhotos()).unwrap();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Grid sx={{ width: '300px' }}>
      <Card sx={{ height: '100%', pb: 2 }}>
        <ImageCardMedia sx={{ cursor: 'pointer' }} image={`${API_URL}/${image}`} title={title} onClick={showPhoto} />
        <CardContent>
          <Typography sx={{ cursor: 'pointer' }} gutterBottom variant="h6" onClick={showPhoto}>{title}</Typography>
        </CardContent>
        <CardActions>
          <Grid container spacing={2}>
            {author._id !== userId && (
              <IconButton
                sx={{ fontSize: 13, borderRadius: '20px', width: '100%', border: '1px solid lightblue' }}
                component={Link}
                color="primary"
                to={`/user-gallery/${author._id}`}
              >
                <span>Show {author.displayName}'s gallery</span>
                <ArrowForwardIcon />
              </IconButton>
            )}
            {(user?.role === 'admin' || user?._id === author._id) && (
              <LoadingButton
                type="button"
                sx={{ fontSize: 14, borderRadius: '20px', width: '100%' }}
                onClick={handleDelete}
                color="error"
                loading={isDeleting}
                loadingPosition="end"
                endIcon={<DeleteForeverIcon />}
                variant="contained"
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
