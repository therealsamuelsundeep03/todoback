const userDB = require("../model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const controller = {
  email: null,
  password: null,
  hashString: null,
  userName: null,

  //   login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // if email or password does not exists then send an error message
      if (!email)
        return res
          .status(400)
          .json({ status: false, message: "Email is Required" });
      if (!password)
        return res
          .status(400)
          .json({ status: false, message: "Password is Required" });

      const user = await userDB.findOne({ email });

      // if user does not exists then send an error message
      if (!user)
        return res
          .status(401)
          .json({ message: "user does not exists", status: false });

      // if password is incorrect then send an error message or else send a logged in message
      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
      if (!isPasswordCorrect)
        return res
          .status(401)
          .json({ message: "Password is incorrect", status: false });
      res
        .status(200)
        .json({ message: "logged in", id: user._id,name: user.userName, status: true });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error, status: false });
    }
  },

  // register
  async register(req, res) {
    try {
      const { userName, email, password } = req.body;
      // if email or password or user name does not exists then send an error message
      if (!email)
        return res
          .status(400)
          .json({ status: false, message: "Email is Required" });
      if (!password)
        return res
          .status(400)
          .json({ status: false, message: "Password is Required" });
      if (!userName)
        return res
          .status(400)
          .json({ status: false, message: "Name is Required" });

      const user = await userDB.findOne({ email });

      // if user exists then send an error message
      if (user)
        return res.status(403).json({ message: "user exists", status: false });

      this.email = email; 
      this.password = password;
      this.userName = userName;

      this.hashString = jwt.sign({ userName }, process.env.ACCESS_TOKEN, {
        expiresIn: "10m",
      });
      const link = `http://localhost:8080/auth/verify/${this.hashString}`;
      const html = `
            <h1>Let's confirm your email address, To sign in please click on the link below</h1>
            <a href=${link} target="_self" style="text-decoration:none;color: #fff;"><button style="outline:none;border:none;padding: 10px;width: 20rem;height:5rem;color: #fff;border-radius:5px;background-color: rgb(37, 58, 95);font-size:18px;color: #fff;font-size:18px">Click Here</button></a>
            `;

      // if email doesn't exists then send a verification to the user email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: "samuel.sundeep03@gmail.com",
          pass: "aevlnscrjrsxudau",
        },
      });

      transporter
        .sendMail({
          from: '"MEDIUM" <samuel.sundeep03@gmail.com>',
          to: email,
          subject: "Email Confirmation",
          text: "Let's confirm your email address",
          html: html,
        })
        .then((info) => {
          res.json({ status: true, message: "check mail" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error in sending email");
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, status: false });
    }
  },
  async verifyMail(req, res) {
    try {
      const { token } = req.params;
      await jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ status: false, message: "verification failed" });
        // adding the user to the database
        const isSalt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(this.password, isSalt);
        const addUser = await userDB.create({
          email: this.email,
          userName: this.userName,
          password: hashPassword,
        });
        res.redirect('http://localhost:3000/login');
      });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  },
};

module.exports = controller;
