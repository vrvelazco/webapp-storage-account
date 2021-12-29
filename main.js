const express = require('express')
const MimeType = require('mime-types')

const shared = require('./shared')

const app = express()
const port = process.env.PORT

app.get('/', async function (req, res) {
    try {
        let shareName = process.env.FILE_SHARED_NAME
        // let fileName = 'files/calemdario cheems 2022.pdf'
        let fileName = req.query.url;
        
        let stripedName = fileName.split("/")
        stripedName = stripedName[stripedName.length -1]

        let extension = stripedName.split(".")
        extension = extension[extension.length -1]

        let mimeType = MimeType.lookup(extension)
        let r = await shared(shareName, fileName);

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
