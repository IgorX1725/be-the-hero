const express = require('express')

const app = express();

app.get('/',(req,res)=>{
    return res.json({
        event: 'Omnistack week 11.0',
        student: 'Igor Barbosa'
    })
})

app.listen(3333)