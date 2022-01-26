const http = require("http");
const fs = require("fs");
const url = require("url")

const server = http.createServer((req,res) => {

    let {deportes} = JSON.parse(fs.readFileSync("deportes.json"))

    // Pintar html
    if(req.url === "/"){
      res.setHeader('content-type', 'text/html')
        fs.readFile('index.html', 'utf-8', (err,data) =>{
            res.end(data)
        })
    }

    // leer json
    if(req.url === "/deportes" && req.method === "GET"){
        res.writeHead(200,{'Content-Type': 'application/json'})
        res.end(JSON.stringify({deportes}))
    }

    // agregar informaicon
    if(req.url === "/agregar" && req.method === "POST"){
              
        let respuesta = ""
        req.on("data",(body) =>{
            respuesta += body
    
        });
        req.on("end", () =>{

            deportes.push(JSON.parse(respuesta))

            fs.writeFile("deportes.json",JSON.stringify({deportes}), (err)=>{
                res.writeHead(201,{'Content-Type': 'application/json'})
                 res.end(JSON.stringify(deportes))
        })
        })
    }

    // editar informaicon
    if(req.url === "/editar" && req.method === "PUT"){
        
        let respuesta = ""
        req.on("data",(body) =>{
            respuesta += body

        });
        req.on("end", () =>{
            
            const depor = JSON.parse(respuesta)
            deportes = deportes.map(d =>{
            if(d.nombre === depor.nombre){
                d.precio = depor.precio
            }
            return d
        })
         
        fs.writeFile("deportes.json",JSON.stringify({deportes}), (err)=>{
            res.writeHead(201,{'Content-Type': 'application/json'})
             res.end(JSON.stringify(deportes))
             })
        })
    }

    // eliminar informaicon
    if(req.url.includes("/eliminar")){
        const {nombre} = url.parse(req.url,true).query
            deportes = deportes.filter((d) => d.nombre !== nombre );
  
            fs.writeFile("deportes.json",JSON.stringify({deportes}), (err)=>{
                res.writeHead(201,{'Content-Type': 'application/json'})
                res.end(JSON.stringify(deportes))
        })   
      
    }
})

server.listen(3080, () => console.log("servido activooooooo"))


module.exports = server;