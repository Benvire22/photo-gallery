import { GalleryAuthor, GlobalError, Photo } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createPhoto, deletePhoto, fetchPhotos, getGalleryAuthor } from './galleryThunks';

export interface GalleryState {
  photos: Photo[];
  fetchingPhotos: boolean;
  errorFetchingPhotos: boolean;
  galleryAuthor: GalleryAuthor | null;
  fetchAuthor: boolean;
  isCreating: boolean;
  errorCreating: null | GlobalError;
  isDeleting: boolean;
}

export const initialState: GalleryState = {
  photos: [],
  fetchingPhotos: false,
  errorFetchingPhotos: false,
  galleryAuthor: null,
  fetchAuthor: false,
  isCreating: false,
  errorCreating: null,
  isDeleting: false,
};

export const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.fetchingPhotos = true;
        state.errorFetchingPhotos = false;
      })
      .addCase(fetchPhotos.fulfilled, (state, { payload: photos }) => {
        state.photos = photos;
        state.fetchingPhotos = false;
      })
      .addCase(fetchPhotos.rejected, (state) => {
        state.fetchingPhotos = false;
        state.errorFetchingPhotos = true;
      });

    builder
      .addCase(getGalleryAuthor.pending, (state) => {
        state.fetchAuthor = true;
      })
      .addCase(getGalleryAuthor.fulfilled, (state, { payload: author }) => {
        state.galleryAuthor = author;
        state.fetchAuthor = false;
      })
      .addCase(getGalleryAuthor.rejected, (state) => {
        state.fetchAuthor = false;
      });

    builder
      .addCase(createPhoto.pending, (state) => {
        state.isCreating = true;
        state.errorCreating = null;
      })
      .addCase(createPhoto.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createPhoto.rejected, (state, { payload: error }) => {
        state.isCreating = false;
        state.errorCreating = error || null;
      });

    builder
      .addCase(deletePhoto.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deletePhoto.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deletePhoto.rejected, (state) => {
        state.isDeleting = false;
      });
  },
  selectors: {
    selectPhotos: (state) => state.photos,
    selectFetchingPhotos: (state) => state.fetchingPhotos,
    selectErrorFetchingPhotos: (state) => state.errorFetchingPhotos,
    selectGalleryAuthor: (state) => state.galleryAuthor,
    selectFetchingGalleryAuthor: (state) => state.fetchAuthor,
    selectCreatingPhoto: (state) => state.isCreating,
    selectErrorCreatingPhoto: (state) => state.errorCreating,
    selectDeletingPhoto: (state) => state.isDeleting,
  },
});

export const galleryReducer = gallerySlice.reducer;

export const {
  selectPhotos,
  selectFetchingPhotos,
  selectCreatingPhoto,
  selectGalleryAuthor,
  selectFetchingGalleryAuthor,
  selectErrorCreatingPhoto,
  selectDeletingPhoto,
} = gallerySlice.selectors;
