const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG',()=>{
    beforeEach( async ()=>{
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll( async ()=>{
        await connection.destroy()
    })
    
    it('should be able to create a new ONG', async ()=>{
        const response = await request(app)
        .post('/ongs')
        .send({
            name:"APAD2",
            email:"apademail@email.com.br",
            whatsapp:"16458965325",
            city:"Ouro Fino",
            uf:"mg"
        })
        expect(response.body).toHaveProperty('id')
        expect(response.body.id).toHaveLength(8)
    })

    it('should be able to return a json with a list of ongs', async ()=>{
        for(i = 0; i<3; i++){
            await request(app)
            .post('/ongs')
            .send({
                name:"APAD2",
                email:"apademail@email.com.br",
                whatsapp:"16458965325",
                city:"Ouro Fino",
                uf:"mg"
            })
        }
        const response = await request(app)
            .get('/ongs')
            expect(Array.isArray(response.body)).toBe(true)
            expect(response.body[0]).toHaveProperty('id')
            expect(response.body[0]).toHaveProperty('name')
            expect(response.body[0]).toHaveProperty('email')
            expect(response.body[0]).toHaveProperty('whatsapp')
            expect(response.body[0]).toHaveProperty('city')
            expect(response.body[0]).toHaveProperty('uf')

    })

    it('should be able to log in in the plataform', async ()=>{
    const response = await request(app)
    .post('/ongs')
    .send({
        name:"APAD2",
        email:"apademail@email.com.br",
        whatsapp:"16458965325",
        city:"Ouro Fino",
        uf:"mg"
    })
    const responseLogin = await request(app)
    .post('/session')
    .send({
        id: response.body.id
        })
        expect(responseLogin.body).toHaveProperty('name')
    })

    it('should be able to create an incident', async ()=>{
        const response = await request(app)
        .post('/ongs')
        .send({
            name:"APAD2",
            email:"apademail@email.com.br",
            whatsapp:"16458965325",
            city:"Ouro Fino",
            uf:"mg"
        })
        
        const responseIncident = await request(app).post('/incidents')
        .send({
            "title"	:"Caso teste",
            "description":"Detalhes do caso",
            "value": 4000.00
            })
            .set({'authorization':response.body.id})

        expect(responseIncident.body).toHaveProperty('id')

    })

    it('should be able to get a list of incident from specific ong', async ()=>{
        const response = await request(app)
        .post('/ongs')
        .send({
            name:"APAD2",
            email:"apademail@email.com.br",
            whatsapp:"16458965325",
            city:"Ouro Fino",
            uf:"mg"
        })
    
        for(i=0; i<3; i++){
            await request(app).post('/incidents')
            .send({
                "title"	:`Caso teste ${i}`,
                "description":`Detalhes do caso ${i}`,
                "value": 4000.00
                })
                .set({'authorization':response.body.id})
        }
        const incidentsResponse = await await request(app).get('/profile')
        .set({authorization:response.body.id})
        expect(Array.isArray(incidentsResponse.body)).toBe(true)
        expect(incidentsResponse.body[0]).toHaveProperty('id')
        expect(incidentsResponse.body[0]).toHaveProperty('id')
        expect(incidentsResponse.body[0]).toHaveProperty('title')
        expect(incidentsResponse.body[0]).toHaveProperty('description')
        expect(incidentsResponse.body[0]).toHaveProperty('value')
        expect(incidentsResponse.body[0]).toHaveProperty('ong_id')
        })

        it('should be able to get a list of incident', async ()=>{
            const response = await request(app)
            .post('/ongs')
            .send({
                name:"APAD2",
                email:"apademail@email.com.br",
                whatsapp:"16458965325",
                city:"Ouro Fino",
                uf:"mg"
            })
        
            for(i=0; i<3; i++){
                await request(app).post('/incidents')
                .send({
                    "title"	:`Caso teste ${i}`,
                    "description":`Detalhes do caso ${i}`,
                    "value": 4000.00
                    })
                    .set({'authorization':response.body.id})
            }
            const incidentsResponse = await await request(app).get('/incidents')
            .query({page:1})
            expect(Array.isArray(incidentsResponse.body)).toBe(true)
            expect(incidentsResponse.body[0]).toHaveProperty('id')
            expect(incidentsResponse.body[0]).toHaveProperty('title')
            expect(incidentsResponse.body[0]).toHaveProperty('description')
            expect(incidentsResponse.body[0]).toHaveProperty('value')
            expect(incidentsResponse.body[0]).toHaveProperty('ong_id')
            })

        it('should be able to delete a specific incident', async ()=>{
            const response = await request(app)
            .post('/ongs')
            .send({
                name:"APAD2",
                email:"apademail@email.com.br",
                whatsapp:"16458965325",
                city:"Ouro Fino",
                uf:"mg"
            })
            const createIncidentResponse = await request(app).post('/incidents')
                .send({
                    "title"	:"Caso teste",
                    "description":"Detalhes do caso",
                    "value": 4000.00
                    })
                    .set({'authorization':response.body.id})

            await request(app)
            .delete(`/incidents/${createIncidentResponse.body.id}`)
            .set({authorization:response.body.id})
            .expect(204)
            })
})

