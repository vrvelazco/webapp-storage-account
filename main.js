const express = require('express')
const app = express()
app.get('/', (req,res) => {
    res.send('ok')
})
app.listen(process.env.PORT || 1337, () => {
    console.log('ok')
})
