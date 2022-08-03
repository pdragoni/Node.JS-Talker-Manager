// valida os inputs do usuário
const validateInputs = (req, res, next) => {
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
};

module.exports = validateInputs;