const { BlobServiceClient } = require('@azure/storage-blob');
const { ClientSecretCredential } = require("@azure/identity");
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
  const clientCred = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID, 
    process.env.AZURE_CLIENT_ID, 
    process.env.AZURE_CLIENT_SECRET
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${process.env.STORAGE_NAME}.blob.core.windows.net`,
    clientCred
  );
  const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER);
  const blockBlobClient = containerClient.getBlockBlobClient(filename)
  const data = await blockBlobClient.download(0)
  let response = await streamToBuffer(data.readableStreamBody)
  return response
}

module.exports = {
  connect: connectToBlobContainer
}
