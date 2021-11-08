import User from "../models/user.model";
import jwt from "jsonwebtoken";
import config from "./../config/config";
var expressJwt = require('express-jwt');


const signin = (req, res) => {
  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      return res.status(400).json({ error: "Email and password don't match" });
    }

    const token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), _id: user._id }, config.secret);

    res.cookie("token", token, { expire: new Date() + 999 });

    return res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  });
};

const signout = (req, res) => {
  return res
      .clearCookie("token")
      .status(200)
      .json({ message: "Successfully logged out" });
};

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.equals(req.auth._id);
  if (!authorized) return res.status(403).json('Not authorized');
  next();
};

const requireSignin = expressJwt({
  secret: config.secret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

export default { signin, signout, hasAuthorization, requireSignin };
