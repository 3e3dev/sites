import test from 'node:test';import assert from 'node:assert/strict';
import {discover} from './discover.mjs';import {renderCard} from './build.mjs';
const repo=(name,extra={})=>({name,owner:{login:'3e3dev'},has_pages:true,private:false,...extra});
test('discovers new sites across pages, excludes private sites and itself, follows custom domains',async()=>{
 let pages=0;const items=[repo('sites'),repo('private',{private:true}),repo('off',{has_pages:false}),repo('new-project')];
 const result=await discover(async(url,options)=>{
 if(options.method==='HEAD')return {ok:true,url:'https://example.com/'};
 pages++;return {ok:true,json:async()=>pages===1?[...items,...Array.from({length:96},(_,i)=>repo(`off-${i}`,{has_pages:false}))]:[repo('another')]};
 });assert.equal(pages,2);assert.deepEqual(result.map(r=>r.name),['another','new-project']);assert.equal(result[0].url,'https://example.com/');
});
test('API or website failure aborts instead of publishing an incomplete scan',async()=>{
 await assert.rejects(()=>discover(async()=>({ok:false,status:403})),/403/);
 await assert.rejects(()=>discover(async(u,o)=>o.method?{ok:false,status:503}:{ok:true,json:async()=>[repo('new')]}),/Keeping previous deployment/);
});
test('new card safely escapes metadata and rejects script URLs',()=>{
 const html=renderCard({name:'new-site',url:'https://example.com/',description:'<script>alert("x")</script>'},3);
 assert(html.includes('04'));assert(html.includes('New Site'));assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert.throws(()=>renderCard({name:'bad',url:'javascript:alert(1)'},0),/Unsafe/);
});
