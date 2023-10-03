const Users = require('../../Schema/Authentication/')
const nodemailer = require("nodemailer");
const jwtConfig = require("../../config/jwtConfig")
const jwt = require('jsonwebtoken');

const myFollowers = async (req, res) => {
  try {
    const idArray = req.body.idArray; // Assuming the array of IDs is sent in the request body

    // Use the $in operator to find documents with IDs in the idArray
    const followers = await Users.find({ _id: { $in: idArray } });

    // Do something with the found followers
    res.status(200).json({ followers });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
}

const myProfile = (req, res) => {
  Users.findById(req.params.id)
  .then((user) => {
    if(user){
      res.status(200).json(user)
    }
    else{
      res.status(500).json({message:'not found'})
    }
  })
  .catch(err => res.status(500).json({message:'server error'}))
}

const addFriend = async (req, res) => {
  const { userId, friendId, action } = req.body; // Assuming you pass userId, friendId, and action in the request body

  try {
    // Find the user by userId
    const user = await Users.findById(userId);
    const addRequest = await Users.findById(friendId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add') {
      // Add the friendId to the friendList if it's not already there
      if (!user.friendList.includes(friendId)) {
        user.friendList.push(friendId);
        user.followers = user.followers.filter(id => id !== friendId);
        addRequest.friendList.push(userId);
        addRequest.requestSend = addRequest.requestSend.filter(id => id !== userId);

      }
    } else if (action === 'delete') {
      // Remove the friendId from the friendList
      user.friendList = user.friendList.filter(id => id !== friendId);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated user document
    await user.save();

    await addRequest.save();

    return res.status(200).json({ message: 'Friend list updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}






const requestSend = async (req, res) => {
  const { userId, friendId, action } = req.body; // Assuming you pass userId, friendId, and action in the request body

  try {
    // Find the user by userId
    const user = await Users.findById(userId);
    const follower = await Users.findById(friendId) 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(!follower){
      return res.status(404).json({ message: 'follower not found' });
    }

    if (action === 'add') {
      // Add the friendId to the friendList if it's not already there
      if (!user.requestSend.includes(friendId) && !follower.followers.includes(userId)) {
        user.requestSend.push(friendId);
        follower.followers.push(userId)
      }
    } else if (action === 'delete') {
      // Remove the friendId from the friendList
      user.requestSend = user.requestSend.filter(id => id !== friendId);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated user document
    await user.save();
    await follower.save();

    return res.status(200).json({ message: 'Friend list updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}



const signUp = (req, res) => {

  const transporter1 = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: "deapth.search.it@gmail.com",
      pass: "bbtzouxqqbejsmfa",
    },
  });
  

  const mailOptions1 = {
    from: "deapth.search.it@gmail.com",
    to: req.body.email,
    subject: "user verification",
    text: "Depth Search Team",
    html: `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Template</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.15/dist/tailwind.min.css">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50">
          <h1>Hello ${req.body.fullName}</h1>

          <p> we want to verify you . so please click in this <a href="http://localhost:3000/verify/${jwtConfig(req.body.fullName, req.body.email, req.body.password)}">Link</a> </p>
          <br/>
          <br/>
          <br/>
          <p>Thanks </p>
          <p>Depth Search Team</p>
        </body>
      </html>
        `,
  };


  transporter1.sendMail(mailOptions1, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      res.send("Email sent: ");
    }
  });


}

// const verify = (req, res) => {

//   const token = req.body.token;
//   const decodedToken = token && jwt.decode(token, { complete: true });
//   console.log(decodedToken?.payload)

//   let newUser = new Users();
//   newUser.fullName = decodedToken && decodedToken?.payload?.fullName.toString()
//   newUser.email = decodedToken && decodedToken?.payload?.email.toString()
//   newUser.setPassword( decodedToken && decodedToken?.payload?.password.toString())

//   Users.findOne({ email: decodedToken && decodedToken?.payload?.email})
//     .then((user) => {
//       if (user) {
//         res.status(400).json({ message: 'User already exists' })
//       }
//       else {
//         newUser.save()
//         .then((response) => {
//           if(response){
//             res.status(200).json({ message: "user updated successfully"})
//           }
//           else{
//             res.status(500).json({ message: "Error in Create User"})
//           }
//         })
//         .catch((error) => {
//           res.status(500).json({ message: "Error in Create User, Reporting from save Catch"})
//         });
      
//       }
//     })
//     .catch(err => {
//       res.status(500).json({ message: "Error in Create User, Reporting from Find Catch"})
//     })
// }
const verify = (req, res) => {
  const token = req.body.token;
  const decodedToken = token && jwt.decode(token, { complete: true });

  // Check if the token is valid and not expired
  if (!decodedToken || (decodedToken.payload.exp <= Date.now() / 1000)) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  let newUser = new Users();
  newUser.fullName = decodedToken.payload.fullName.toString();
  newUser.email = decodedToken.payload.email.toString();
  newUser.setPassword(decodedToken.payload.password.toString());

  Users.findOne({ email: decodedToken.payload.email })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: 'User already exists' });
      } else {
        newUser.save()
          .then((response) => {
            if (response) {
              res.status(200).json({ message: 'User updated successfully' });
            } else {
              res.status(500).json({ message: 'Error in Create User' });
            }
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error in Create User, Reporting from save Catch' });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error in Create User, Reporting from Find Catch' });
    });
};

const signIn = (req, res) => {
  Users.findOne({ email: req.body.email })
  .then((user) => {
    if (user === null) {
      return res.status(400).send({
        message: "user not found",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).json({
          accessToken: jwtConfig(user.fullName, user.email),
          message: "success" ,
        });
      } else {
        return res.status(400).send({
          message: "password not matched" ,
        });
      }
    }
  })
}

module.exports = { signIn, verify, signUp, requestSend, addFriend, myProfile, myFollowers }