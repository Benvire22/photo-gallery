import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Photo from './models/Photo';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropDatabase();
    console.log('Database dropped successfully');
  } catch (e) {
    console.log('Error dropping database:', e);
  }

  const [user, admin] = await User.create({
    email: 'user@email.com',
    password: '123WWW',
    displayName: 'Grisha',
    token: crypto.randomUUID(),
    role: 'user',
  }, {
    email: 'admin@email.com',
    password: '123321',
    displayName: 'Administrator',
    token: crypto.randomUUID(),
    role: 'admin',
  });

  await Photo.create({
    user: admin,
    title: 'adminpic',
    image: 'fixtures/admin-avatar.jpg',
  }, {
    user: user,
    title: 'Userpic',
    image: 'fixtures/admin-avatar.jpg',
  }, {
    user: user,
    title: 'userPic2',
    image: 'fixtures/admin-avatar.jpg',
  }, {
    user: admin,
    title: 'adminpic2',
    image: 'fixtures/admin-avatar.jpg',
  });

  await db.close();
  await mongoose.disconnect();
};

run().catch(console.error);