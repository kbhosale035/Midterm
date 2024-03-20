// Import packages
const express = require('express');


const {Storage} = require('@google-cloud/storage');

// Set the port
const port = 2010git branch -M main;

// Create instances of necessary packages
const app = express();
const storage = new Storage();

// Set the identifier for the GCS bucket where the file will be stored
const malbucket = 'sp24_kbhosale_malicious_files';
const benbucket = 'sp24_kbhosale_benign_files';


// Routes
app.get('/', async (req, res) => {
    const [malFiles] = await storage.bucket(malbucket).getFiles();
    const malFileCount = malFiles.length

    const [benFiles] = await storage.bucket(benbucket).getFiles();
    const benFileCount = benFiles.length

    res.send("Malicious File Count = " + malFileCount + " and Benign File Count = " + benFileCount);
});


app.listen(port, () => {
    console.log(`Web App listening on port ${port}`);
});