const path = require("path");
const express = require("express");
const app = express();


let propertiesReader = require("properties-reader");
let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = propertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(dbName);

app.use(cors());

app.use(express.json());

//app.set('json spaces', 3);

 app.param('collectionName'
    , function (req, res, next, collectionName) {
      req.collection = db.collection(collectionName);
      return next();
   });

app.get('/collections/:collectionName'
   , function (req, res, next) {
      req.collection.find({}).toArray(function (err, results) {
         if (err) {
            return next(err);
         }
         res.send(results);
      });
   });

// PORT
const PORT = process.env.PORT || 3000;

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});