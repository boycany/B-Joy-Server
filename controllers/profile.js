const handleProfileGet = (req, res, db) => {
    
    const { id } = req.params    
 
    db.select('*').from('users').where({id: id}).then(user=>{

        //console.log(user)  
        //印出user就會得知，如果網址輸入的id與資料庫的不匹配，會得到空陣列
 
        if (user.length){
            res.json(user[0])
        } else {
            res.status(400).json('Not Found')
        }        
    })
    .catch(err => res.status(400).json('error getting user'))
}

export default {
    handleProfileGet: handleProfileGet
}