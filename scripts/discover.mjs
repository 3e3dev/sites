import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export async function discover(fetcher=fetch) {
  const repos=[];
  for(let page=1;;page++) {
    const response=await fetcher(`https://api.github.com/users/3e3dev/repos?per_page=100&type=owner&page=${page}`,{headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(30000)});
    if(!response.ok) throw new Error(`GitHub discovery failed: ${response.status}`);
    const batch=await response.json();
    if(!Array.isArray(batch)) throw new Error('Invalid repository response');
    repos.push(...batch);
    if(batch.length<100)break;
  }
  const projects=[];
  for(const repo of repos.filter(r=>r.has_pages&&!r.private&&r.name!=='sites'&&r.owner?.login.toLowerCase()==='3e3dev')) {
    const root=repo.name.toLowerCase()==='3e3dev.github.io';
    const standard=`https://3e3dev.github.io/${root?'':encodeURIComponent(repo.name)+'/'}`;
    // Follow the published Pages URL: this also resolves configured custom domains.
    const response=await fetcher(standard,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(30000)});
    if(!response.ok) throw new Error(`Pages URL unavailable for ${repo.name}: ${response.status}. Keeping previous deployment.`);
    const url=new URL(response.url||standard);
    if(!['https:','http:'].includes(url.protocol))throw new Error('Invalid Pages URL');
    projects.push({name:repo.name,description:repo.description||'',url:url.href});
  }
  return projects.sort((a,b)=>a.name.localeCompare(b.name));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const projects=await discover();
  await writeFile('data/projects.json',JSON.stringify({checkedAt:new Date().toISOString(),projects},null,2)+'\n');
  console.log(`Discovered ${projects.length} published projects.`);
}
