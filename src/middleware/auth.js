import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const bearerToken = req.headers['authorization'];
  let token = '';

  if (bearerToken) {
    token = bearerToken.split(' ')[1];
  } else {
    return res.status(403).json({
      error: 'a token is required for authentication',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN || 'default_token');
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      error: 'invalid token',
    });
  }
  return next();
};

export {auth};
