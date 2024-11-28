import mongoose,{Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs"
const emailRegexPattern:RegExp=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export interface IUser extends Document{

    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    }
    role:string;
    isVerfied:boolean;
    courses:Array<{courseId:string}>
    comparePassword:(password:string)=>Promise<boolean>
}


const userSchema:Schema<IUser>=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        validate:{
            validator:function(value:string){
                return emailRegexPattern.test(value);
            },
            message:"please enter valid email"
        },
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please enter you pasword"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false,
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        default:"user",
    },
    isVerfied:{
        type:Boolean,
        default:false,
    },
    courses:[
        {
            courseId:String,
        }
    ]
},{timestamps:true})

//hash password
userSchema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.comparePassword=async function (enteredPassword:string):Promise<boolean> {
    return await bcrypt.compare(enteredPassword,this.password);
    
}






const userModel:Model<IUser>=mongoose.model("User",userSchema)
export default userModel
