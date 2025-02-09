import mongoose,{Document,Model,Schema} from "mongoose"
export  interface INoticication extends Document {
    title:string,
    message:string,
    status:string,
    userId:string,

}



const notificationSchema=new Schema <INoticication>({
    title:{
        type:String ,
        require:true,
    },
    message:{
        type:String ,
        required:true,

    },
    status:{
        type:String ,
        required:true,
        default:"unread"
    }
},{timestamps:true});

const notificationModel:Model<INoticication> =mongoose.model("notification",notificationSchema)

export default notificationModel;