const {Schema,model} = require('mongoose');
const bcrypt = require('bcrypt');
const { createTokenForUser } = require('../../utils/authentication');
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         contactNumber:
 *           type: string
 *         profileImageUrl:
 *           type: string
 *         role:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const userSchema =  new Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImageUrl:{
        type:String,
        default:"/images/default.png"
    },
    contactNumber:{
        type: Number,
        required:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:[String],
        enum:["USER","CLIENT","ADMIN"],
        default:"USER"
        
    }
},{timestamps:true});

/**
 * Mongoose pre-save middleware to hash the user's password before saving it to the database.
 *
 * This function runs automatically before a 'save' operation.
 * If the password field has been modified, it generates a salt and hashes the password.
 *
 * Params:
 *   next() -> Callback to pass control to the next middleware.
 */
userSchema.pre('save', async function (next){

    const user = this;
    if(!user.isModified("password")) return ;
     
    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(this.password,salt);

    this.salt=salt;
    this.password=hashedPassword;

    next();


});

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
   const user = await this.findOne({email:email});
   
   if(!user) throw new Error("User does not exists !!");

   const salt=user.salt;
   const hashedPassword=await bcrypt.hash(password,salt);

   if(user.password !== hashedPassword) throw new Error("Incorrect Password !!");

   const validUser = {...user.toObject(),password:undefined,salt:undefined};

   const token = createTokenForUser(validUser);

   return token;

})

const User = model("users",userSchema);

module.exports = User;