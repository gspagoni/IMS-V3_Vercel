const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 5000

//var BODName = [];
//var BODContent = [];

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req,res) => {
    res.send('<h1>Welcome to IMS Server V3</h1>')
})

app.get("/ping", (req,res)=>{
    let obj = {
    "status": "OK",
    "code": 200        
      }
  
      res.json(obj)
      return
  })
  
  app.get("/protocol",(req,res)=>{
    let obj = {
      "version": "v3",
      "messageMethod": "multipartMessage",
      "supportedEncoding": "NONE",
      "supportedCharacterSet": "UTF-8",
      "hasDiscovery": false,
      "message_ContentType": "application/json"
    }
  
    res.json(obj)
    return
  
  })
  
  app.post("/v3/multipartMessage", (req,res)=>{
    //console.log(req.headers)
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;  
    //console.log(fullUrl)
  
    var tenant = req.headers['x-tenantid'];
    var response = {
      "status": "OK",
      "code": 202,
      "message": "The request was processed successfully"
  }

    var data = '';
    var form = new multiparty.Form()
    form.parse(req, (err,fields,files)=>{
      //console.log("err ",err)
      //console.log("fields ",JSON.parse(fields.ParameterRequest[0]).documentName)
  try {
          const _bodname = JSON.parse(fields.ParameterRequest[0]).documentName;
  //    BODName.push(_bodname)
  //    console.log("Received : ",_bodname)
      //console.log("files ",files.MessagePayload[0].path)
      // Read stream from file saved in temp folder
      var reader = fs.createReadStream(files.MessagePayload[0].path)
      reader.on('data',(chunk)=> {
        data += chunk
      })
  
      reader.on('end',()=>{
     // console.log(data)      
//        BODContent.push(data)       
      })

  } catch (error) {
      response = {
        "status": "KO",
        "code": 400,
        "message": error.message
    }
  }
      // Delete file from temp folder
      fs.unlinkSync(files.MessagePayload[0].path)
    })
  
  
    res.set("X-TenantId",tenant).json(response).status(202)
    //res.status(200)
    return
  })
  
  app.listen(PORT, ()=> console.log(`server started at http://localhost:${PORT}`))
  