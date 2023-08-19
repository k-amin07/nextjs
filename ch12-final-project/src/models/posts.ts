import { Schema, model, connect, Model, Mongoose } from 'mongoose';
import mongoose from 'mongoose';
type BlogPostModelType = Model<BlogPost>;

const BlogPostSchema = new Schema<BlogPost, BlogPostModelType>({
    id: String,
    meta: new Schema<Meta>({
        id: String,
        title: String,
        date: String,
        tags: [String]
    }),
    content: String
})

export const BlogPostModel = mongoose.models.BlogPost ||  model<BlogPost, BlogPostModelType> ('BlogPost', BlogPostSchema);

