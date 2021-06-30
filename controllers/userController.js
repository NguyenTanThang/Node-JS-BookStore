import data from "../data.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";
import { generateCustomerValidationLink } from "../utils/index.js";
import nodemailer from "nodemailer";
const CURRENT_CLIENT_URL = process.env.CURRENT_CLIENT_URL || "http://localhost:3000/";

export const seedUsers = async (req, res) => {
  //await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  res.send({ createdUsers });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .sort([["createdAt", -1]])
    .exec();
  res.send(users);
};

export const getUserByID = async (req, res) => {
  const userID = req.params.userID;
  const user = await User.findById(userID);

  if (!user) {
    return res.status(404).send({ message: "User Not Found" });
  }

  res.send(user);
};

export const getUserProfile = async (req, res) => {
  const userID = req.user._id;
  const user = await User.findById(userID);

  if (!user) {
    return res.status(404).send({ message: "User Not Found" });
  }

  res.send(user);
};

export const addUser = async (req, res) => {
  let { username, email, password, validated } = req.body;

  const existedUser = await User.findOne({
    email
  });

  if (existedUser) {
    return res.status(400).send({ message: "Please enter a valid email" });
  }

  password = bcrypt.hashSync(password);

  const user = new User({
    username, email, password, validated
  });

  const createdUser = await user.save();

  sendValidationEmail(req, createdUser);

  res.status(201).send({
    username: createdUser.username,
    email: createdUser.email,
    //token: generateToken(createdUser),
  });
};

export const editUser = async (req, res) => {
  const userID = req.params.userID;
  const user = await User.findById(userID);

  if (!user) {
      res.status(404).send({message: "User Not Found"});
  }

  const updatedUser = await User.findByIdAndUpdate(userID, {
      ...req.body
  });

  res.status(200).send(updatedUser);
}

export const signup = async (req, res) => {
  let { username, email, password } = req.body;

  const existedUser = await User.findOne({
    email
  });

  if (existedUser) {
    return res.status(400).send({ message: "Please enter a valid email" });
  }

  password = bcrypt.hashSync(password);

  const user = new User({
    username,
    email,
    password,
  });

  const createdUser = await user.save();

  sendValidationEmail(req, createdUser);

  res.status(201).send({
    username: createdUser.username,
    email: createdUser.email,
    //token: generateToken(createdUser),
  });
};

export const signin = async (req, res) => {
  let { email, password } = req.body;

  const existedUser = await User.findOne({ email });

  if (!existedUser || !bcrypt.compareSync(password, existedUser.password)) {
    return res.status(400).send({ message: "Invalid Credentials" });
  }

  if (!existedUser.validated) {
    return res.status(400).send({ message: "This account has not been validated" });
  }

  res.status(200).send({
    username: existedUser.username,
    email: existedUser.email,
    token: generateToken(existedUser),
  });
};

export const validateCustomer = async (req, res) => {
  try {
    let { customerID } = req.params;
    await User.findByIdAndUpdate(customerID, {
      validated: true,
    });

    res.redirect(CURRENT_CLIENT_URL);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      data: null,
      message: `Internal Server Error`,
      status: 500,
    });
  }
};

const sendValidationEmail = (req, customer) => {
  const { email } = req.body;
  const { _id } = customer;
  let validationLink = generateCustomerValidationLink(_id);

  // Step 1
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "letsflix360@gmail.com",
      clientId:
        "582869229993-sep486l73m7h0lbdvgdikuep6lg1h4df.apps.googleusercontent.com",
      clientSecret: "2NavuGUamJCb-MtQbUS3q0ag",
      refreshToken:
        "1//045QWXDyTRlyeCgYIARAAGAQSNwF-L9IrFykn4KkSYvEQ56TjH3h-7trxBGv5anAhl69rLuajNjfALgh-ZNxrLKaBiknmq7tNdng",
      accessToken:
        "ya29.a0AfH6SMABo7TsTLS5GifEfqGmUpp5lvaXUiYFwc5MdvnmgnVIW75JWkEoQz3o6Dfx30wBZZsaT77Su0AS9Zc5GXnx4D8Id_1i9T-uWBQKzj5H7KBPnDQurklbDOgy-G2OVtQ-7kU7cOqcLf_1T8v6UmrFgokJpCukxg0",
    },
  });

  /*
      <p>You have successfully created a new account on Let's Flix. Please proceed to the link below to validate it</p>
      <a href="${validationLink}" target="_blank">Validate</a>
  */

  // Step 2
  let mailOptions = {
    from: "letsflix360@gmail.com", // TODO: email sender
    to: email, // TODO: email receiver
    subject: "Let's Flix Account Validation",
    html: `
        <!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Simple Transactional Email</title>
            <style>
              /* -------------------------------------
                  GLOBAL RESETS
              ------------------------------------- */
              
              /*All the styling goes here*/
              
              img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%; 
              }
        
              body {
                background-color: #f6f6f6;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%; 
              }
        
              table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                width: 100%; }
                table td {
                  font-family: sans-serif;
                  font-size: 14px;
                  vertical-align: top; 
              }
        
              /* -------------------------------------
                  BODY & CONTAINER
              ------------------------------------- */
        
              .body {
                background-color: #f6f6f6;
                width: 100%; 
              }
        
              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
              .container {
                display: block;
                margin: 0 auto !important;
                /* makes it centered */
                max-width: 580px;
                padding: 10px;
                width: 580px; 
              }
        
              /* This should also be a block element, so that it will fill 100% of the .container */
              .content {
                box-sizing: border-box;
                display: block;
                margin: 0 auto;
                max-width: 580px;
                padding: 10px; 
              }
        
              /* -------------------------------------
                  HEADER, FOOTER, MAIN
              ------------------------------------- */
              .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%; 
              }
        
              .wrapper {
                box-sizing: border-box;
                padding: 20px; 
              }
        
              .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
              }
        
              .footer {
                clear: both;
                margin-top: 10px;
                text-align: center;
                width: 100%; 
              }
                .footer td,
                .footer p,
                .footer span,
                .footer a {
                  color: #999999;
                  font-size: 12px;
                  text-align: center; 
              }
        
              /* -------------------------------------
                  TYPOGRAPHY
              ------------------------------------- */
              h1,
              h2,
              h3,
              h4 {
                color: #000000;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin: 0;
                margin-bottom: 30px; 
              }
        
              h1 {
                font-size: 35px;
                font-weight: 300;
                text-align: center;
                text-transform: capitalize; 
              }
        
              p,
              ul,
              ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                margin-bottom: 15px; 
              }
                p li,
                ul li,
                ol li {
                  list-style-position: inside;
                  margin-left: 5px; 
              }
        
              a {
                color: #3498db;
                text-decoration: underline; 
              }
        
              /* -------------------------------------
                  BUTTONS
              ------------------------------------- */
              .btn {
                box-sizing: border-box;
                width: 100%; }
                .btn > tbody > tr > td {
                  padding-bottom: 15px; }
                .btn table {
                  width: auto; 
              }
                .btn table td {
                  background-color: #ffffff;
                  border-radius: 5px;
                  text-align: center; 
              }
                .btn a {
                  background-color: #ffffff;
                  border: solid 1px #3498db;
                  border-radius: 5px;
                  box-sizing: border-box;
                  color: #3498db;
                  cursor: pointer;
                  display: inline-block;
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0;
                  padding: 12px 25px;
                  text-decoration: none;
                  text-transform: capitalize; 
              }
        
              .btn-primary table td {
                background-color: #3498db; 
              }
        
              .btn-primary a {
                background-color: #3498db;
                border-color: #3498db;
                color: #ffffff; 
              }
        
              /* -------------------------------------
                  OTHER STYLES THAT MIGHT BE USEFUL
              ------------------------------------- */
              .last {
                margin-bottom: 0; 
              }
        
              .first {
                margin-top: 0; 
              }
        
              .align-center {
                text-align: center; 
              }
        
              .align-right {
                text-align: right; 
              }
        
              .align-left {
                text-align: left; 
              }
        
              .clear {
                clear: both; 
              }
        
              .mt0 {
                margin-top: 0; 
              }
        
              .mb0 {
                margin-bottom: 0; 
              }
        
              .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0; 
              }
        
              .powered-by a {
                text-decoration: none; 
              }
        
              hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                margin: 20px 0; 
              }
        
              /* -------------------------------------
                  RESPONSIVE AND MOBILE FRIENDLY STYLES
              ------------------------------------- */
              @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important; 
                }
                table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
                  font-size: 16px !important; 
                }
                table[class=body] .wrapper,
                table[class=body] .article {
                  padding: 10px !important; 
                }
                table[class=body] .content {
                  padding: 0 !important; 
                }
                table[class=body] .container {
                  padding: 0 !important;
                  width: 100% !important; 
                }
                table[class=body] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important; 
                }
                table[class=body] .btn table {
                  width: 100% !important; 
                }
                table[class=body] .btn a {
                  width: 100% !important; 
                }
                table[class=body] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important; 
                }
              }
        
              /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
              ------------------------------------- */
              @media all {
                .ExternalClass {
                  width: 100%; 
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                  line-height: 100%; 
                }
                .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important; 
                }
                #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
                }
                .btn-primary table td:hover {
                  background-color: #34495e !important; 
                }
                .btn-primary a:hover {
                  background-color: #34495e !important;
                  border-color: #34495e !important; 
                } 
              }
        
            </style>
          </head>
          <body class="">
            <span class="preheader">Welcome ${email}, we are glad to see new people joining in.</span>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
              <tr>
                <td>&nbsp;</td>
                <td class="container">
                  <div class="content">
        
                    <!-- START CENTERED WHITE CONTAINER -->
                    <table role="presentation" class="main">
        
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <p>Hi there,</p>
                                <p>You just have one more thing to do which is validate the email. Please click the button below to validate it</p>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                  <tbody>
                                    <tr>
                                      <td align="left">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                          <tbody>
                                            <tr>
                                              <td> <a href="${validationLink}" target="_blank">validate Email</a> </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p>Once your email have been validated, you can login right away.</p>
                                <p>Thank you! Hope you have a good time using our application.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
        
                    <!-- END MAIN CONTENT AREA -->
                    </table>
                    <!-- END CENTERED WHITE CONTAINER -->
        
                    <!-- START FOOTER -->
                    <div class="footer">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td class="content-block">
                            <span class="apple-link">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>
                            <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                          </td>
                        </tr>
                        <tr>
                          <td class="content-block powered-by">
                            Powered by <a href="http://htmlemail.io">HTMLemail</a>.
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->
        
                  </div>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `,
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
      return console.log("Error occurs");
    }
    return console.log("Email sent!!!");
  });
};
