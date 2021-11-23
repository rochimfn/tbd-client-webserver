import {connection} from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!(email && password)) {
      res.status(400).json({
        error: 'email and password is required',
      });
    }
    const user = await connection.column('id', 'email', 'password')
        .select().table('users').where({email}).first();

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
          {user_id: user.id, email},
          process.env.TOKEN || 'default_token',
          {
            expiresIn: '2h',
          },
      );
      user.token = token;
      delete user.password;

      res.status(200).json(
          {
            message: 'login success',
            data: user,
          },
      );
    } else {
      res.status(400).json({
        error: 'invalid credentials',
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export {login};
