
//non-blocking and asynchronus
var fs=require('fs');

fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
    fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data2)=>{
        console.log(data2)
        fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
            console.log(data3)
            fs.writeFile('./txt/final.txt',`${data2} \n ${data3}`,'utf-8',(err)=>{
                console.log('filw writte  😍😍😍🤣🤣')
            });
        })
    })
})

fs.readFile('./txt/final.txt','utf-8',(err,data)=>{
    console.log(data);
})

// fs.appendFile('./txt/input.txt','bandi praveen');
fs.appendFile('./txt/input.txt','data appended',(err)=>{
    if(err) console.log(err);
    else{
        console.log('file appended')
    }
})

console.log('we will read File');