const handleRegister = (req, res, db, bcrypt)=>{

    const {name, email, password} = req.body

    if (!name || !email || !password){
        return res.status(400).json('不可有空白欄位')
    }

    const hash = bcrypt.hashSync(password)
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
                .returning('*')
                .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
            .catch(err=>console.log(err))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=>res.status(400).json('註冊未成功'))
}

export default {
    handleRegister: handleRegister
}