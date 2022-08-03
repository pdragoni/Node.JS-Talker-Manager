const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const crypto = require('crypto');

const TALKERS_JSON = './talker.json';
const validateInputs = require('./middlewares/validateInputs');
const authToken = require('./middlewares/authToken');
const { validateName,
  validateAge,
  verifyTalk,
  validateWatchedAt,
  validateRate } = require('./middlewares/validateNewTalker');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const ID_NOT_FOUND = 404;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

  // --- As linhas abaixo são de implementação do código --- //

 // Faz leitura de talker.json //
const getTalkers = async () => {
  try {
    const data = await fs.readFile(TALKERS_JSON, 'utf-8');
    const talkers = JSON.parse(data); // transforma em array javascript e retorna na linha abaixo
    return talkers;
  } catch (error) {
    return console.log('erro');
  }
};

app.get('/talker', async (_req, res) => {
  const talkers = await getTalkers();
  if (!talkers || talkers.length === 0) {
    return res.status(HTTP_OK_STATUS).json([]);
  }
  return res.status(HTTP_OK_STATUS).json(talkers);
});

// Cria o endpoint para talker/:id
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.find((t) => t.id === Number(id));
  console.log(talker);
  if (!talker) {
  return res.status(ID_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
}
  return res.status(HTTP_OK_STATUS).json(talker);
});

// Cria o  endpoint para /login
app.post('/login', validateInputs, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  if (token) {
    return res.status(HTTP_OK_STATUS).json({ token });
  }
});

// Cria o endpoint /talker
app.post('/talker',
    authToken, validateName, validateAge, verifyTalk, validateWatchedAt, validateRate,
    async (req, res) => {
  const talkers = await getTalkers();
  const id = talkers.length + 1; // id do novo talker
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const newTalker = { name, age, id, talk: { watchedAt, rate } };
  talkers.push(newTalker);
  await fs.writeFile(TALKERS_JSON, JSON.stringify(talkers));
  return res.status(201).json(newTalker);
});

// 6 - Crie o endpoint PUT /talker/:id
app.put('/talker/:id',
  authToken, validateName, validateAge, verifyTalk, validateWatchedAt, validateRate,
  async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.findIndex((person) => person.id === Number(id));
  talkers[talker] = { ...talkers[talker], ...req.body };
  // const { name, age, talk: { watchedAt, rate } } = talker;
  await fs.writeFile(TALKERS_JSON, JSON.stringify(talkers));
  return res.status(200).json(talkers[talker]);
});