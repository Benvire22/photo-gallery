import { GlobalError, Photo } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createPhoto, deletePhoto, fetchPhotos, togglePublished } from './galleryThunks';

export interface GalleryState {
  photos: Photo[];
  fetchingPhotos: boolean;
  errorFetchingPhotos: boolean;
  isCreating: boolean;
  errorCreating: null | GlobalError;
  isPublishing: boolean;
  isDeleting: boolean;
}

export const initialState: GalleryState = {
  photos: [],
  fetchingPhotos: false,
  errorFetchingPhotos: false,
  isCreating: false,
  errorCreating: null,
  isPublishing: false,
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
      .addCase(fetchPhotos.fulfilled, (state, { payload: cocktails }) => {
        state.photos = cocktails;
        state.fetchingPhotos = false;
      })
      .addCase(fetchPhotos.rejected, (state) => {
        state.fetchingPhotos = false;
        state.errorFetchingPhotos = true;
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
      .addCase(togglePublished.pending, (state) => {
        state.isPublishing = true;
      })
      .addCase(togglePublished.fulfilled, (state) => {
        state.isPublishing = false;
      })
      .addCase(togglePublished.rejected, (state) => {
        state.isPublishing = false;
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
    selectCreatingPhoto: (state) => state.isCreating,
    selectErrorCreatingPhoto: (state) => state.errorCreating,
    selectPublishingPhoto: (state) => state.isPublishing,
    selectDeletingPhoto: (state) => state.isDeleting,
  },
});

export const galleryReducer = gallerySlice.reducer;

export const {
  selectPhotos,
  selectFetchingPhotos,
  selectErrorFetchingPhotos,
  selectCreatingPhoto,
  selectErrorCreatingPhoto,
  selectPublishingPhoto,
  selectDeletingPhoto,
} = gallerySlice.selectors;
