import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import axios from "axios";
import Post from "./db.js";

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const API_URL = "http://localhost:4000";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Rendering main Page
app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// Rendering compose Page
app.get("/compose", function(req, res){
  res.render("compose");
});

// Compose page saving data to DB
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
    else {
      console.log(err);
    }
  });
});

// Home page..readmore rendering particular post 
app.get("/posts/:postId", function(req, res){
const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
      id: requestedPostId
    });
  });
});

// Rendering about page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

// Rendering contact page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

// Calling delete api to delete post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Rendering Edit Page
app.get("/edit/:editId", function(req, res){
  const editId = req.params.editId;
    Post.findOne({_id: editId}, function(err, post){
      res.render("edit", {
        title: post.title,
        content: post.content,
        id: editId
      });
    });
});

// To update post
app.post("/update/:postId", (req, res) => {
  console.log(req.body);
  let postId = req.params.postId
  Post.findOneAndUpdate({_id: postId},{title : req.body.postTitle,content: req.body.postBody},{new: true},(err,post) => {
      if(!err){
       console.log("Sucess");
      }
      else{
        console.log(err);
      }
  });
  res.redirect("/") 
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
