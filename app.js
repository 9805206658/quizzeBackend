const express = require('express');
const db=require("./db");
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
console.log(port);


// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const storage=multer.memoryStorage();
const upload=multer({storage:storage});

const path = require('path');

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../fontend/html')));

// Send the frontend's index.html file for any route that doesn't match the backend API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fontend/html', 'index.html'));
});
app.post("/player",upload.single("image"),(req,res)=>
{
    
console.log("enter");
const phone=req.body.phone;
const fullName=req.body.fullName;
const password=req.body.password;
const gender=req.body.gender;
const dob=req.body.dob;
const image_name=req.file.originalname;
const image=req.file.buffer;
db.query(`insert into player (phone,fullName,password,gender,dob,image_name,image) values(?,?,?,?,?,?,?)`,[phone,fullName,password,gender,dob,image_name,image],(err,result)=>
{
    if(err)
    
        console.log(err);
    else
    {
        console.log(result);
        res.json(result);

    }
});
}
)
app.post('/domPlayer/',upload.single("image"),(req,res)=>
{
    const name=req.body.name;
    const image_name=req.file.originalname;
    const image=req.file.buffer;
    const user_id=req.body.user_id
    db.query(`insert into domPlayer 
              (name,image_name,image,user_id)
              value(?,?,?,?)`,[name,image_name,image,user_id],
            (err,result)=>
            {
                if(err)
                    console.log(err);
                else
                console.log(result);
            });

})


app.post("/questionUpload/questionStore/:questionStore",(req,res)=>
    {
    
   console.log("enter");
   
  console.log(req.body);
    const question=req.body.question;
    const opt1=req.body.opt1;
    const opt2=req.body.opt2;
    const opt3=req.body.opt3;
    const correct=req.body.correct;
    const user_id=req.body.user_id;
    console.log(req.params.questionStore);
    let check=req.params.questionStore
    if(check=="false")
    {
   db.query(`insert into questionStore (question,opt1,opt2,opt3,correct,user_id) values(?,?,?,?,?,?)`,[question,opt1,opt2,opt3,correct,user_id],(err,result)=>
    {
        if(err)
        {
        console.log(err);
        }
        else
        {

            console.log(result);
            res.json(result);
        }
     });
    }
    else if(check=="true")
    {
        console.log("enter in  the second");

        db.query(`insert into questionStore2 (question,opt1,opt2,opt3,correct,user_id) values(?,?,?,?,?,?)`,[question,opt1,opt2,opt3,correct,user_id],(err,result)=>
            {
                if(err)
                console.log(err);
                else
                {
                 console.log(result);
                 res.json(result);
                }
            });
     }
}
 )

 app.put("/getQuestion",(req,res)=>
 {
console.log("enter");
if(req.body.tableName=="robot")
{
    db.query(`
         select * from  ${req.body.tableName}`,
        (err,result)=>
    {
       if(err)
            console.log(err);
        
        else
        {
             console.log(result);
            res.json(result);
        }
        });
    
    }


else
{
db.query(`
    select * from  ${req.body.tableName}
     where user_id=${req.body.id}`,
    (err,result)=>
{
   if(err)
        console.log(err);
    
    else
    {
         console.log(result);
        res.json(result);
    }
    });

}
 }

 )


app.delete("/deleteQuestion",(req,res)=>
{
    console.log(req.body);
      db.query(`
        delete from ${req.body.tableName}
        where  user_id=${req.body.id}

        `,(err,result)=>
            {
              if(err) 
                {
                    console.log(err);
                } 
              else 
              {
                console.log(result);
                res.json(result);
              }
            })
});

app.put("/getUser",(req,res)=>
{
    console.log(req.body);
    let myQuery;
  let id=req.body.id;
 
    if(id!=0 )
    {
        if(req.body.tableName=="domPlayer")
        {
         myQuery= `
        select * from
        ${req.body.tableName}
        where user_id=${req.body.id} `
        }
        else
        {
            myQuery= `
            select * from
            ${req.body.tableName}
            where id=${req.body.id} `
        }
    }
    else
    {
         myQuery= `
        select * from
        ${req.body.tableName}
        `
    }
    console.log(myQuery);

  db.query(`${myQuery}`,(err,result)=>
    {
        console.log("the  enter");

        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);

        res.json(result);
        }

    })
})


app.put("/history",(req,res)=>
{
    console.log("enter");
    console.log(req.body);
    const {score1,score2,rank1,rank2,id1,id2,hTime,hDate}=req.body;
    db.query(`insert into history (score1,score2,rank1,rank2,id1,id2,hTime,hDate) values(?,?,?,?,?,?,?,?)`,[score1,score2,rank1,rank2,id1,id2,hTime,hDate],(err,result)=>
    {
        if(err)
        console.log(err);
        else
        console.log(result);

    })

    
});

app.get("/history/historyUser/:historyUser/id/:id",(req,res)=>
    {
        console.log(req.params);
    let id=req.params.id;
        
        if(req.params.historyUser==="true")
        {
         db.query(`
                select player.fullName,player.image from history
                inner join player on player.id=history.id1 where history.id1=${id}`,(err,result)=>
                {
                    if(err)
                    console.log(err);
                    else
                    {
                    console.log(result)
                    res.json(result);
                    }
            
                });
            } 
       else
       {
        db.query(`select * from history where id1=${id}`,(err,result)=>
            {
                if(err)
                console.log(err);
                else
                {
                console.log(result);
                res.json(result);
                }
        
            });
         }
    
     })
     app.delete("/historyItem/delete",(req,res)=>
    {
        console.log("enter");
       console.log(req.body);
       db.query(`delete from history
        where id=${req.body.id}`,(err,result)=>
        {
            if(err)
            console.log(err);
            else
            console.log(result);
        })
    })

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });