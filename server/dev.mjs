import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {syncHostPrompt} from '../scripts/sync-host-prompt.mjs';
await syncHostPrompt();
const {default:worker}=await import('./api.mjs');
const root=fileURLToPath(new URL('../',import.meta.url));
try{process.loadEnvFile(path.join(root,'.env.local'));}catch(e){if(e.code!=='ENOENT')throw e;}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const env={DEEPSEEK_API_KEY:process.env.DEEPSEEK_API_KEY,DEEPSEEK_MODEL:process.env.DEEPSEEK_MODEL,ZHIHU_ACCESS_SECRET:process.env.ZHIHU_ACCESS_SECRET,SESSION_SECRET:process.env.SESSION_SECRET||randomBytes(32).toString('hex'),ASSETS:{async fetch(request){
  const url=new URL(request.url);let rel;try{rel=decodeURIComponent(url.pathname);}catch{return new Response('Bad path',{status:400});}
  const file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
  if(!file.startsWith(root)||rel.includes('..')||rel.includes('\\'))return new Response('Not found',{status:404});
  try{return new Response(await readFile(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'}});}catch{return new Response('Not found',{status:404});}
}}};
const server=http.createServer(async(req,res)=>{
  try{
    let body=Buffer.alloc(0);for await(const c of req){body=Buffer.concat([body,c]);if(body.length>32000){res.writeHead(413);res.end();return;}}
    const request=new Request(`http://127.0.0.1:${server.address().port}${req.url}`,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body}: {})});
    const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch{res.writeHead(500);res.end('Local server error');}
});
server.listen(Number(process.env.PORT)||4188,'127.0.0.1',()=>{console.log(`Local: http://127.0.0.1:${server.address().port}/`);console.log(`AI provider: ${env.DEEPSEEK_API_KEY?'DeepSeek':env.ZHIHU_ACCESS_SECRET?'Zhihu':'not configured'} (no credentials printed)`);});
