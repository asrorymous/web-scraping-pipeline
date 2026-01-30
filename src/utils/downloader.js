const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");

async function downloadFile(url, fileName) {
  // to the output folder
  const folderPath = path.join(__dirname, "../../output/images");

  // Making the folder
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, fileName);

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to get image! Status: ${response.status}`);

    const fileStream = fs.createWriteStream(filePath);
    //this pipeline is for geting data from int to the file directly
    await pipeline(response.body, fileStream);

    return true;
  } catch (err) {
    console.error(`Error download ${fileName}: `, err.message);
    return false;
  }
}

module.exports = { downloadFile };
