import express from "express";
import bodyParser from "body-parser";
import Post from "./db.js";

const app = express();
const port = 4000;

// Delete a post
app.delete("/posts/:id", (req, res) => {
    const index = req.params.id;
    if (index === -1) return res.status(404).json({ message: "Post not found" });
  
    Post.findByIdAndRemove(index, function(err){
        if (!err) {
          console.log("Successfully deleted");
        }
    });
    res.json({ message: "Post deleted" });
});

// Edit a post
app.patch("/posts/:title/:content", (req, res) => {
    
    let title = req.params.title;
    let content = req.params.content;

    console.log("new title " + title);

    Post.findOneAndUpdate({title: title},{$set: req.body},(err,post) => {
        if(!err){
            console.log("SuccessFull Updated");
        }
    });
    res.json({ message: "Post updated" }); 
});


app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
  