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
    title: 'Cat',
    image: 'fixtures/admin-avatar.jpg',
  }, {
    user: user,
    title: 'JABAS RULES YEAH',
    image: 'fixtures/jabas-pic.webp',
  }, {
    user: user,
    title: 'The little snakie!',
    image: 'fixtures/snake-pic.jpg',
  }, {
    user: admin,
    title: 'MORE CATS!',
    image: 'fixtures/cat-pic.jpg',
  }, {
    user: user,
    title: 'Stop cat posting, look at that doggie!',
    image: 'fixtures/dog-pic.jpg',
  }, {
    user: admin,
    title: `It's a me, deb.`,
    image: 'fixtures/viskasha.png',
  }, {
    user: admin,
    title: `У меня в полисаднике пионы растут.`,
    image: 'fixtures/pion.jpg',
  });

  await db.close();
  await mongoose.disconnect();
};

run().catch(console.error);