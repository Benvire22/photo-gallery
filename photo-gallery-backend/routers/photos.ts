import express from 'express';
import mongoose from 'mongoose';
import auth, { RequestWithUser } from '../middleware/auth';
import permit from '../middleware/permit';
import { imageUpload } from '../multer';
import Photo from '../models/Photo';
import authSimple from '../middleware/authSimple';

const photosRouter = express.Router();

photosRouter.get('/', authSimple, async (req: RequestWithUser, res, next) => {
  try {
    const currentUser = req.user;
    const { user } = req.query;

    if (user !== '') {
      if (!mongoose.isValidObjectId(user)) {
        return res.status(400).send({ error: 'Invalid user ID!' });
      }

      const photos = await Photo.find(
        currentUser?._id === user
          ? { user: currentUser }
          : { user, isPublished: true }).populate('user', '_id displayName');

      return res.send(photos);
    }

    const photos = await Photo.find(
      currentUser?.role === 'admin'
        ? {}
        : { isPublished: true }).populate('user', '_id displayName');

    return res.send(photos);
  } catch (e) {
    return next(e);
  }
});

photosRouter.post('/', auth, permit('user', 'admin'), imageUpload.single('image'), async (req: RequestWithUser, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send({ error: 'Wrong token!' });
    }

    if (!req.body.title || !req.file || !req.body.image) {
      return res.status(400).send({ error: 'All fields are required!' });
    }

    const photo = new Photo({
      user: req.user,
      title: req.body.title,
      image: req.file.filename,
    });

    await photo.save();
    return res.send(photo);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

photosRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req: RequestWithUser, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send({ error: 'Wrong token!' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ error: 'Invalid photo ID!' });
    }

    const editedCocktail = await Photo.findById(req.params.id);

    if (!editedCocktail) {
      return res.status(400).send({ error: 'Photo not found!' });
    }

    editedCocktail.isPublished = !editedCocktail.isPublished;
    editedCocktail.save();

    return res.send(editedCocktail);
  } catch (e) {
    return next(e);
  }
});

photosRouter.delete('/:id', auth, permit('admin', 'user'), async (req: RequestWithUser, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).send({ error: 'Wrong token!' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send({ error: 'Invalid photo ID!' });
    }

    if (user.role === 'user') {
      const deletedCocktail = await Photo.findOneAndDelete({
        _id: req.params.id,
        user: req.user,
      });

      if (!deletedCocktail) {
        return res.status(400).send({ error: 'Photo not found!' });
      }

      return res.send({ message: 'Photo deleted successfully!' });
    }

    const deletedCocktail = await Photo.findByIdAndDelete(req.params.id);

    if (!deletedCocktail) {
      return res.status(400).send({ error: 'Photo not found!' });
    }

    return res.send({ message: 'Photo deleted successfully!' });
  } catch (e) {
    return next(e);
  }
});

export default photosRouter;
