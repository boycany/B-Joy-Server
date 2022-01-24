const handleSignin = (db, bcrypt) => (req, res) => {

    const { password, email} = req.body
    if (!password || !email){
        return res.status(400).json('不可有空白欄位')
    }

    db.select('email', 'hash').from('login')
        .where('email','=', email)
        .then(data=>{
            const isValid = bcrypt.compareSync(password, data[0].hash)
            // console.log(isValid)
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user=>{
                        // console.log(user[0])
                        res.json(user[0])
                    })
                    .catch(err=>res.status(400).json('找不到這個使用者'))
            }else {
                res.status(400).json('帳號或密碼錯誤')
            }
        })
        .catch(err=>res.status(400).json('帳號或密碼錯誤'))

}

export default {
    handleSignin: handleSignin
}