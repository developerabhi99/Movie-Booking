const JWT = require('jsonwebtoken');

const secretKey="!@mdi$cod@an($r";
const createTokenForUser=(user)=>{

    const payload={
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phoneNumber:user.contactNumber,
        role:user.role
    }

    const token = JWT.sign(payload,secretKey, { expiresIn: '1h' });

    return token;
    
}

const verifyTokenForUser=(token)=>{
    const payload = JWT.verify(token,secretKey);

    return payload;
}

module.exports={
    createTokenForUser,
    verifyTokenForUser
}