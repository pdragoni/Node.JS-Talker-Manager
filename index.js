const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const TALKERS_JSON = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
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
    return response.status(200).json([]);
  }
  return response.status(200).json(talkers);
});

// Cria o endpoint para talker/:id
app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const talkers = await getTalkers();
  const talker = talkers.find((t) => t.id === Number(id));
  console.log(talker);
  if (!talker) {
  return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
  return response.status(200).json(talker); 
});