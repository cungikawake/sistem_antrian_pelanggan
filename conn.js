const mysql = require('mysql')
const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'antrian',
  multipleStatements: true
})
db.connect((err)=>{
  if(err) console.log(err)
  else console.log('berhasil ngonek db')
})


module.exports = db
