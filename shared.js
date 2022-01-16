const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");
const { BlobServiceClient } = require('@azure/storage-blob');
const connStr = process.env.STORAGE_KEY

async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
    });
}

async function connectToBlobContainer(filename) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_KEY);
  const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER);
  const blockBlobClient = containerClient.getBlockBlobClient(filename)
  const data = await blockBlobClient.download(0)
  let response = await streamToBuffer(data.readableStreamBody)
  return response
}

module.exports = connectToBlobContainer
