import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderCard(project,index,curated={}) {
  const number=String(index+1).padStart(2,'0');
  const url=new URL(project.url);
  if(!['http:','https:'].includes(url.protocol))throw new Error('Unsafe project URL');
  if(curated[project.name])return curated[project.name].replace(/class="number">\d+/,`class="number">${number}`).replace(/https:\/\/3e3dev.github.io\/[^/]+\/(?=")/g,escapeHtml(url.href));
  const title=escapeHtml(project.name.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()));
  return `<article class="card new-project"><a class="art" href="${escapeHtml(url.href)}" aria-label="Explore ${title}"><span class="number">${number}</span><span class="project-wordmark">${title}</span><span class="image-label">3E3DEV · WEB PROJECT</span><span class="round-arrow" aria-hidden="true">↗</span></a><div class="card-body"><span class="category">WEB · GITHUB PAGES</span><h3><a href="${escapeHtml(url.href)}">${title}</a></h3><p>${escapeHtml(project.description||'Explore this project by 3e3dev.')}</p><a class="visit" href="${escapeHtml(url.href)}">Explore the site <span aria-hidden="true">↗</span></a></div></article>`;
}
export async function build(){
 const [{projects},curated,template]=await Promise.all([readFile('data/projects.json','utf8').then(JSON.parse),readFile('data/curated.json','utf8').then(JSON.parse),readFile('src/template.html','utf8')]);
 const order=Object.keys(curated);projects.sort((a,b)=>(order.includes(a.name)?order.indexOf(a.name):999)-(order.includes(b.name)?order.indexOf(b.name):999)||a.name.localeCompare(b.name));
 const html=template.replace('{{CARDS}}',projects.length?projects.map((p,i)=>renderCard(p,i,curated)).join('\n'):'<p>No published projects yet.</p>').replace('{{COUNT}}',String(projects.length).padStart(2,'0'));
 await mkdir('docs',{recursive:true});await writeFile('docs/index.html',html);await writeFile('src/index.html',html);await copyFile('src/style.css','docs/style.css');await copyFile('.nojekyll','docs/.nojekyll');console.log(`Built ${projects.length} portfolio cards.`);
}
import {pathToFileURL} from 'node:url';
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await build();
