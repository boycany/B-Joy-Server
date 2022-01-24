import express from 'express'
const app = express()

import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'

import knex from 'knex'
import { response } from 'express'

import register from './controllers/register.js'
import signin from './controllers/signin.js'
import profile from './controllers/profile.js'
import image from './controllers/image.js'

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
  }
});

/*
測試是否成功連接postgres
//knex這個套件是回覆一個promise

    db.select('*').from('users').then(data=>{
         console.log(data)
    })
    .catch(err=>console.log(err))

*/

app.use(express.urlencoded({ extended: false }))
app.use(express.json())  

app.use(cors())  //npm install cors ---> 才能讓前端跟Server要資料

//express v4.16 以上的版本就不用使用bodyParser
//舊版本寫法： (須先npm install body-parser)
//const bodyParser = require('body-parser')
//app.use(bodyParser.json())


app.get('/', (req, res)=>{
    // res.send('Hello, this server.')
    // db.select('*').from('users')
    //     .then(user=>{
    //         res.send(user)
    //     })
    res.send('It is working!')
})

app.post('/signin', signin.handleSignin(db, bcrypt))
//更省略的寫法。因為當使用者對signin的網址送出請求時
//signin.handleSignin(db, bcrypt)就會像js的callback function一樣輸入(req, res)
//---> signin.handleSignin(db, bcrypt)(req, res) 像是這樣啟動函式
// 在signin.js 那段也會依序輸入變數

app.post('/register', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt) 
    //這寫法叫做 dependency injection
})

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res)=>{
    image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res)=>{
    image.handleApiCall(req, res)
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`app is running on port ${process.env.PORT}.`)
})

/* 
    初步規劃 route setting:

    /                 --> res: show "this is working"
    /signin           --> "POST" method --> res: "Success" or "Fail" 
    /register         --> "POST" method --> res: user
    /profile/:userId  --> "GET" method --> res: user
    /image            --> "PUT" method --> res: user  
*/