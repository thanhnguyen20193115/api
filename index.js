const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cookiePaser = require("cookie-parser");

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(cookiePaser())
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

// app.use((req,res, next)=>{
//     res.append('Access-Control-Allow-Origin',['*']);
//     res.append('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
//     res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     if (res.method == 'OPTIONS') {
//       res.send(200);
//     } else next();
// })

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
// app.use(express.static(path.join(__dirname,'./client/build')))
// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })
if ( process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"./client/build")));

  app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname,'client','build','index.html'));
  })
}else {
  app.get("/",(req,res)=>{
    res.send("api is runnig")
  })
}

app.listen(process.env.PORT || 5000);