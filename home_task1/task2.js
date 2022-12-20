const fs = require("fs");
const csv = require("csvtojson");

const file = "./data/csv/data.csv";
const fileOut = "./data/csv/out.csv";

const rStream = fs.createReadStream(file, {
  highWaterMark: 10,
});

const wStream = fs.createWriteStream(fileOut, {
  highWaterMark: 10,
});

try {
  rStream.pipe(csv()).pipe(wStream);
} catch (e) {
  console.log(`Error occured during data transfer ${e.code} ${e.message}`);
}

rStream.on("close", () => {
  console.log("File has been closed");
});
