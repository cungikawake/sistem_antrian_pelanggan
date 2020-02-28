const db = require('./conn')
const router = require('express').Router()

router.get('/printer', (req,res)=>{
  res.render('printer/index',{
    title:'Selamat Datang di Antrian Bersama',
  })
})

router.get('/', (req,res)=>{
  res.render('guest/index',{
    title:'Selamat Datang di Antrian Bersama',
  })
})

//max antrian 200 saja
 router.get('/awas', (req,res)=>{
   for (var i = 1; i <= 200; i++) {
     db.query("INSERT INTO queues VALUES('','0','"+(+i+200)+"','0')")
   }
 })

// route
router.get('/operator', (req,res)=>{
  db.query("SELECT number FROM queues WHERE operator='"+req.cookies.op_ppdb+"' ORDER BY time DESC", (err,results)=>{
    res.render('operator/index',{
      title:'Selamat Bertugas Operator!',
      queues:results
    })
  })
})

router.post('/operator', (req,res)=>{
  db.query("UPDATE queues SET operator='"+req.body.operator+"', time='"+Date.now()+"' WHERE (operator='0' OR operator='"+req.body.operator+"') AND number='"+req.body.number+"'")
})

//next call
router.post('/operator/next', (req,res)=>{
  db.query("SELECT number FROM queues WHERE operator='0' and status_cetak='1' LIMIT 0,1", (err,results)=>{
    if(results[0] === undefined){
      res.json({
        number:''
      })
    }else{
      res.json({
        number:results[0].number
      })
    }
  }) 
})

//recall number
router.post('/operator/next/query', (req,res)=>{
  db.query("UPDATE queues SET operator='"+req.body.operator+"', time='"+Date.now()+"' WHERE number='"+req.body.number+"'")
})

// ajax
router.get('/ajax/guest/table-queue', (req,res)=>{
  db.query("SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1; SELECT number from queues WHERE operator = '0' limit 0,3",['1','2','3','4','5','6'], (err,results)=>{
    res.render('ajax/table-queue', {
      op:results,
      layout:false
    })
  })
})


// queues reset
router.get('/reset', (req,res)=>{
    db.query("UPDATE queues SET operator='0', time='0', status_cetak='0'")
    //res.send('Reset antrian...')
    res.render('guest/index',{
      title:'Selamat Datang di Antrian Bersama',
    })
})


//ajax printer
router.get('/printer/table-printer', (req,res)=>{
  db.query("SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1;SELECT number FROM queues WHERE operator = ? ORDER BY time DESC LIMIT 0,1; SELECT * from queues WHERE operator = '0' and status_cetak = '0' limit 0,1",['1','2','3','4','5','6'], (err,results)=>{
    res.render('printer/table-printer', {
      op:results,
      layout:false 
    })
  }) 
})

//print antrian
router.post('/printer/next', (req,res)=>{
  db.query("UPDATE queues SET operator='0', time='0', status_cetak='1' where id="+req.body.id+"")

  db.query("SELECT * FROM queues WHERE id="+req.body.id+"", (err,results)=>{
    res.json({
      number:results[0].number,
      id:results[0].id
    })  
  })
})

module.exports = router
