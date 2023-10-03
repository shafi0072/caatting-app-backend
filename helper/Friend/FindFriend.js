const Users = require('../../Schema/Authentication/')


const findFriends = (req, res) => {
  Users.find()
    .then(data => {
      if(data){
        res.status(200).send(data)
      }
      else{
        res.status(500).json({message:"something weird happened"})
      }
    })
    .catch(err => res.status(500).json({message:'error catch'}))
}

module.exports = { findFriends }