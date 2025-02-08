import mongoose ,{Document,Model,Schema} from "mongoose" 
import { IUser } from "./user.model";
interface IComment extends Document{
    user:IUser,
    question:string,
    questionReplies?:IComment[];
}

interface IReview extends Document{
    user:IUser,
    rating:number,
    comment:string,
    commnetRepice:IComment[]
}

interface ILink extends Document{
    title:string,
    url:string,
}

interface ICourseData extends Document{
    title:string;
    description:string;
    videoUrl:string;

    videoSection:string;
    videoLength:number;
    videoPlayer:string;
    links:ILink[];
    suggestion:string;
    question:IComment[];

}

interface ICourse extends Document{
    name:string;
    description:string;
    price:number;
    estimatedPrice?:number;
    thumbnail:object;
    tags:string;
    level:string;
    demoUrl:string;
    benefits:{title:string}[];
    prerequisties:{title:String}[],
    reviews:IReview[];
    courseData:ICourseData[];
    rating?:number;
    purchased?:number;
}

const reviewSchema=new Schema<IReview>({
    user:Object,
    rating:{
        type:Number,
        default:0
    },
    comment:String,
})

const linkSchema=new Schema<ILink>({
    title:String,
    url:String,
})

const commentSchema=new Schema <IComment>({
    user:Object,
    question:String,
    questionReplies:[Object],
})



const courseDataSchema=new Schema<ICourseData>({
    title:String,
    description:String,
    videoUrl:String,

    videoSection:String,
    videoLength:Number,
    videoPlayer:String,
    links:[linkSchema],
    suggestion:String,
    question:[commentSchema],



})

const courseSchema=new Schema<ICourse>({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    estimatedPrice:{
        type:Number,
    },
    thumbnail:{
        public_id:{
            require:true,
            type:String,
        },
        url:{
            require:true,
            type:String,
        }
    },
    tags:{
        required:true,
        type:String,


    },
    level:{
        type:String,
        required:true,
    },
    demoUrl:{
        type:String,
        required:true,
    },
    benefits:{
        type:[{title:String}],

    },
    prerequisties:{
       type:[{title:String}],
    },
    courseData:[courseDataSchema],
    rating:{
        type:Number,
        default:0,
    },
    purchased:{
        type:Number,
        default:0,
    },
    reviews:[reviewSchema]




})
const CourseModel: Model<ICourse>=mongoose.model("course",courseSchema);
export default CourseModel;