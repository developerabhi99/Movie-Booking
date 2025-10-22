const {Schema,model} = require('mongoose');
/**
 * @swagger
 * components:
 *   schemas:
 *     Theater:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         owner:
 *           type: string
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         totalSeats:
 *           type: integer
 *         screens:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - owner
 *         - name
 *         - location
 *         - totalSeats
 *         - screens
 */
const theaterSchema =  new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    totalSeats:{
        type:Number,
        required:true
    },
    screens:{
        type:Number,
        required:true,
        default:1
    }

},{timestamps:true});

const Theater = model("theaters",theaterSchema);

module.exports =Theater;