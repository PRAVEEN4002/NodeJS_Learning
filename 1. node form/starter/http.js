//creating our first web server


var http=require('http');
var fs=require('fs')
var url=require('url');
const sulgify=require('slugify');
var replaceTemplate=require('./modules/replaceTemplate')

const data=fs.readFileSync('./dev-data/data.json','utf-8');
const dataObj=JSON.parse(data)
const slugs=dataObj.map((item)=>{return sulgify(item.productName,{lower:true,replacement:'_',local:'telugu'})})
console.log(slugs)
const tempOverview=fs.readFileSync('./templates/template-overview.html','utf-8');
const tempCard=fs.readFileSync('./templates/template-card.html','utf-8');
const tempProduct=fs.readFileSync('./templates/template-product.html','utf-8');

const server=http.createServer((req,res)=>{
    
  
  const pathName=req.url
  console.log(url.parse(req.url,true));
  const {query}=url.parse(req.url,true);
  console.log(query.id)
  console.log()
    if(pathName=='/home' || pathName=='/'){
        res.end('it is the HOMEPAGE')
    }
    //overview page
    else if(pathName=='/overview')
    {
        res.writeHead(200,{
            'Content-Type':'text/html'
        });

        let cardsHtml=dataObj.map(product=>replaceTemplate(tempCard,product)).join('');
        
        const ouput=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(ouput);
    }
    else if(pathName==`/product?id=${query.id}`){
        res.writeHead(200,{
            'Content-Type':'text/html'
        });
          
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
       res.end(output)

    }
    //product page
    else if(pathName=='/mobile'){
        res.end('it is the mobile page')
    }
    else if(pathName=='/API'){
        res.writeHead(200,{
            'Content-Type':'application/json'
        })
        console.log(`${__dirname}`)
        const obj={
            dir_name:`the name is ${__dirname}`,
            name:'bandi praveen'
            
        }
        res.write(JSON.stringify(obj));
        res.end(data)
        
    }
    else {
        res.writeHead(404,{
            'Content-Type':'text/html',
            'my-own-headers':'hello-world'
             
        });
        res.end('<h1>Page Not Found !</h1>')
    }
})

server.listen('9090','127.0.0.1',()=>{
    console.log('server is running on 9090');
});