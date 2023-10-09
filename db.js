import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true}).then(res => console.log("Connected to DB")).catch(err => console.log(err));

const postSchema = {
    title: String,
    content: String
  };
  
const Post = mongoose.model("Post", postSchema);

export default Post;