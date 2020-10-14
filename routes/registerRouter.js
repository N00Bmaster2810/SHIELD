const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../schema/userSchema");
const Company = require("../schema/companySchema");
const Developer = require("../schema/developerSchema");
const registerRouter = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}
const upload = multer({ storage: storage , fileFilter: fileFilter});

registerRouter
  .post("/registerDev", upload.single("devPic"), async (req, res) => {
    try {
      
      const { firstName, lastName, email, password, level, institution } = req.body;

      //validate request
      if (!firstName || !lastName || !email || !password) {
        req.flash("error", "All fields are mandatory");
        req.flash("firstname", firstName);
        req.flash("lastname", lastName);
        req.flash("email", email);
        return res.redirect("/");
      }

      //Check if email exists
      Developer.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email Exists");
          return res.redirect("/");
        }
      });

      //password hashing by use of bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //storing req body data in database
      const dev = new Developer({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        devPic: req.file.path,
        level: level,
        institution: institution
      });

      const user = new User({
        email: email,
        password: hashedPassword
      });

      await user.save();

      await dev.save();
      res.redirect("/");

      console.log(dev);
    } catch (err) {
      return res.status(500);
    }
  })
  .post("/registerComp", upload.single("compPic"), async (req, res) => {
    try {
      const { companyName, email, password, preference, website } = req.body;

      //validate request
      if (!companyName || !email || !password) {
        req.flash("error", "All fields are mandatory");
        req.flash("companyName", companyName);
        req.flash("email", email);
        return res.redirect("/");
      }

      //Check if email exists
      Company.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email Exists");
          return res.redirect("/");
        }
      });

      //password hashing by use of bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      //storing req body data in database
      const comp = new Company({
        name: companyName,
        email: email,
        password: hashedPassword,
        compPic: req.file.path,
        preference: preference,
        website: website
      });

      const user = new User({
        email: email,
        password: hashedPassword,
      });

      await user.save();

      await comp.save();
      res.redirect("/");
      console.log(comp);
    } catch (err) {
      return res.status(500);
    }
  });

module.exports = registerRouter;