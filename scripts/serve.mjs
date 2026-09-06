import http from 'node:http';
import {readFile} from 'node:fs/promises';
http.createServer(async(req,res)=>{const file=req.url==='/'?'index.html':req.url==='/style.css'?'style.css':null;if(!file){res.writeHead(404);res.end();return;}try{res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/html');res.end(await readFile(`src/${file}`));}catch{res.writeHead(500);res.end();}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
