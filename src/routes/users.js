const express = require('express');
const multer = require('multer');
const { getById, getList, addItem, updateItem, patchItem, removeItem } = require('../services/users');

const router = express.Router();

const PREFIX = '/users';
const path = require('path');
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, path.join(`${__dirname}../../../public/avatars`));
  },
  filename(_req, _file, cb) {
    const uniquePreffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniquePreffix} ${_file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/:id', async (req, res) => {
  const user = await getById(req.params.id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.send(user);
});

router.get('/', async (req, res) => {
  const users = await getList();

  res.send(users);
});

router.post('/', upload.single('avatar'), async (req, res) => {
  req.body.avatar = req.file.path;
  await addItem(req.body);

  res.sendStatus(201);
});

router.put('/:id', upload.single('avatar'), async (req, res) => {
  if (req.file.path) {
    req.body.avatar = req.file.path;
  }
  await updateItem(req.params.id, req.body);

  res.sendStatus(200);
});

router.patch('/:id', upload.single('avatar'), async (req, res) => {
  if (req.file.path) {
    req.body.avatar = req.file.path;
  }
  await patchItem(req.params.id, req.body);

  res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
  await removeItem(req.params.id);

  res.sendStatus(200);
});

module.exports = [PREFIX, router];
