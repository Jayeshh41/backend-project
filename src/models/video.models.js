import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
     videoFile: {
        type : String,              // Cloudinary url
        required: [true, "Video is required"],
     }, 
     thumbnail: {
        type : String,              // Cloudinary url
        required: true,
     },
     owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
     },
     title: {
        type: String,
        required: [true, "Title must be provided"]
    },
    description: {
        type: String,
        required: true,
    } ,
    duration: {
        type: Number,       // cloudinary url
        required: true,
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },  
},
    {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Video", videoSchema)