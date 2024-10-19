import { createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryAuthor, GlobalError, Photo, PhotoMutation } from '../../types';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';

export const getGalleryAuthor = createAsyncThunk<GalleryAuthor | null, string>(
  'gallery/getGalleryAuthor',
  async (id) => {
    const { data: author } = await axiosApi.get<GalleryAuthor>(`/users/${id}`);

    return author;
  },
);

export const fetchPhotos = createAsyncThunk<Photo[], string | undefined>('gallery/fetchPhotos', async (userId = '') => {
  const { data: photos } = await axiosApi.get<Photo[]>(`/photos?user=${userId}`);

  if (!photos) {
    return [];
  }

  return photos;
});

export const createPhoto = createAsyncThunk<void, PhotoMutation, {
  rejectValue: GlobalError
}>('gallery/create', async (photoMutation, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append('title', photoMutation.title);

    if (photoMutation.image) {
      formData.append('image', photoMutation.image);
    }

    await axiosApi.post(`/photos/`, formData);
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 401) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});

export const deletePhoto = createAsyncThunk<void, string>('gallery/delete', async (photoId) => {
  try {
    await axiosApi.delete(`/photos/${photoId}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
});