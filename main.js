const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");
const express = require('express')
const MimeType = require('mime-types')

const shared = require('./shared')

const app = express()
const port = process.env.PORT
async function getKV () {
    try {
        const credential = new DefaultAzureCredential();
        const kvName = process.env.VAULT_NAME
        const url = `https://${kvName}.vault.azure.net`
        const client = new SecretClient(url, credential)

        const localContainer = await client.getSecret('container')
        process.env.CONTAINER = localContainer.value
        const localSecret = await client.getSecret('storagekey')
        process.env.STORAGE_KEY = localSecret.value
        return true
    } catch (e) {
        throw e
    }
}
getKV()
.then(() => {
    console.log('connected to kv')
})
.catch(e => {
    console.log(e.message)
});

app.get('/', async function (req, res) {
    try {
        // let fileName = 'files/calemdario cheems 2022.pdf'
        let fileName = req.query.url;
        
        let stripedName = fileName.split("/")
        stripedName = stripedName[stripedName.length -1]

        let extension = stripedName.split(".")
        extension = extension[extension.length -1]

        let mimeType = MimeType.lookup(extension)
        let r = await shared(fileName);

        res.contentType(mimeType)
        //res.set('Content-disposition', 'attachment; filename=' + stripedName);
        res.send(r)
        res.end()
    } catch (e) {
        res.json(500, {
            message: e.message
        })
        res.end()
    }
})
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
