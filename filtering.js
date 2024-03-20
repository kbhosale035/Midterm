const {Storage} = require('@google-cloud/storage');
const {BigQuery} = require('@google-cloud/bigquery');

const storage = new Storage();
const bq = new BigQuery();


const getMaliciousFileNames = async () => {
  const sqlQuery = "SELECT filename FROM `sp24-41200-kbhosale-midterm.sp24_41200_kbhosale_dataset.Filtering_Malware_Files`  where Class = 'Malicious' ";
  const options = { query: sqlQuery};

  const [rows] = await bq.query(options);
  
  const fileNameSet = new Set()
  rows.forEach(row => fileNameSet.add(row.filename));
  return fileNameSet
  
}

const getBenignFileNames = async () => {
  const sqlQuery = "SELECT filename FROM `sp24-41200-kbhosale-midterm.sp24_41200_kbhosale_dataset.Filtering_Malware_Files`  where Class = 'Benign' ";
  const options = { query: sqlQuery};

  const [rows] = await bq.query(options);
  
  const fileNameSet = new Set()
  rows.forEach(row => fileNameSet.add(row.filename));
  return fileNameSet
}

const srcBucketName = 'iupui-cit41200-class-malpdf-pdf-source-kbhosale'

async function getFilesFromBucket() {
  
  // get files from bucket
  const [files] = await storage.bucket(srcBucketName).getFiles();
  
  // these file names are from csv data/bigquery
  const maliciousFiles = await getMaliciousFileNames();
  const benignFiles = await getBenignFileNames();

	// for each file in bucket, check if file is in which set
  for (const file of files) {
  	console.log(file.name)
    const name = file.name
  	if (maliciousFiles.has(name)) {
		const res = await	copyFile(name, 'sp24_kbhosale_malicious_files')
    } else if (benignFiles.has(name)){
    	const res = await copyFile(name, 'sp24_kbhosale_benign_files')
    } else {
    	console.log('file is neither malicious nor benign')
    }
  }
}


async function copyFile(srcFilename, destBucketName) {
    try {
        const copyDestination = storage.bucket(destBucketName).file(srcFilename);
        await storage.bucket(srcBucketName).file(srcFilename).copy(copyDestination);
        return true
    } catch(e) {
        console.log(e)
        return false
    }
  
  
}



getFilesFromBucket().catch(console.error);






