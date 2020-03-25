const connection = require('../database/connection')
const crypto = require('crypto')

module.exports = {
    async index(req,res){
        const ongs = await connection('ongs').select('*')
   
        res.json(ongs)
   },
    async create(req, res) {
        const {name, email, whatsapp, city, uf} = req.body

        const id = crypto.randomBytes(4).toString('HEX')
    
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            uf,
            city
        })
    
        console.log(id)
    
        return res.json({id})
    }
}