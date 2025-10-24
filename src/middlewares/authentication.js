const { verifyTokenForUser } = require("../utils/authentication");

/**
 * This middleware checks whether every request is authenticated or not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


const checkAuthenticatedUser=(req,res,next)=>{

    try{

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
             success: false,
             message: 'Authorization token missing or malformed'
        })
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyTokenForUser(token);

    req.user=payload;

    next();

    }catch(e){
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: e.message
          });

    }

}

const checkRoleAuthorizationForClient=(role)=>{
    return (req,res,next)=>{
        try{
          if(!req.user){
            res.status(401).json({
                success:false,
                message:"User not authenticated"
            })
          }

          const userRole = req.user.role;

          const allowed = Array.isArray(userRole)?userRole.includes(role):userRole === role;

          if(!allowed){
            res.status(403).json({
                success:false,
                message:"User not authorized !!"
            })
          }

          next(); 

        }catch(e){
            res.status(500).json({
                success: false,
                message: "Error verifying role authorization",
                error: e.message,
              });
        }
     
    }
}

module.exports={
  checkAuthenticatedUser,
  checkRoleAuthorizationForClient
}