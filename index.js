const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// list all objects in a bucket
app.get("/listObjects", async (req, res) => {
  const bucketName = "bucketforinstanceprofile";
  const params = { Bucket: bucketName };

  try {
    const data = await s3.listObjects(params).promise();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve an object from a bucket
app.get("/retrieveObject/:key", async (req, res) => {
  const bucketName = "bucketforinstanceprofile";
  const { key } = req.params;

  const params = { Bucket: bucketName, Key: key };

  try {
    const data = await s3.getObject(params).promise();
    res.send(data.Body);
  } catch (error) {
    res.status(404).json({ error: "Object not found" });
  }
});

// Upload an object to a bucket
app.post("/uploadObject", async (req, res) => {
  const bucketName = "bucketforinstanceprofile";
  const fileName = "example.txt";
  const fileContent = "Hello, world!";

  const params = { Bucket: bucketName, Key: fileName, Body: fileContent };

  try {
    await s3.upload(params).promise();
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
