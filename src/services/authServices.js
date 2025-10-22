const User = require("../models/user");

const signupService = async (userData) => {

  const {
    firstName,
    lastName,
    email,
    profileImageUrl,
    contactNumber,
    password,
    role,
  } = userData;
  
  const exist = await User.findOne({email:email});

  if (exist) throw new Error("user already exixts!");

  const user = await User.create({
    firstName:firstName,
    lastName:lastName,
    email:email,
    contactNumber:contactNumber,
    password:password,
    ...(profileImageUrl && { profileImageUrl }),
    ...(role && { role })
  })

  return user;

};

const loginService = async (userData)=>{
    const {email,password}=userData;
    const token = await User.matchPasswordAndGenerateToken(email,password);
    
    return token;

}

module.exports = {
  signupService,
  loginService
};
