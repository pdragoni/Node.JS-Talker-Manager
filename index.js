const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const crypto = require('crypto');

const TALKERS_JSON = './talker.json';

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
    const talkers = JSON.parse(data); // transforma em objeto javascript e retorna na linha abaixo
    return talkers;
  } catch (error) {
    return console.log('erro');
  }
};

app.get('/talker', async (request, response) => {
  const talkers = await getTalkers();
  if (!talkers || talkers.length === 0) {
    return response.status(HTTP_OK_STATUS).json([]);
  }
  return response.status(HTTP_OK_STATUS).json(talkers);
});

// Cria o endpoint para talker/:id
app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talkers = await getTalkers();
  const talker = talkers.find((t) => t.id === Number(id));
  console.log(talker);
  if (!talker) {
  return response.status(ID_NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
}
  return response.status(HTTP_OK_STATUS).json(talker); 
});

// valida os inputs do usuário
function validateInputs(req, res, next) {
  const SIX = 6;
  const { email, password } = req.body;
  const regexValidation = /\S+@\S+\.\S+/i;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!regexValidation.test(email)) { 
    return res.status(400).json({
    message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < SIX) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
next();
}

// Cria o  endpoint para /login
app.post('/login', validateInputs, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  if (validateInputs && token) {
    return res.status(HTTP_OK_STATUS).json({ token });
  }
});
