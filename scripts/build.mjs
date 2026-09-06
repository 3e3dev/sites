import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('docs', { recursive: true });
for (const name of ['index.html', 'style.css']) await copyFile(`src/${name}`, `docs/${name}`);
await copyFile('.nojekyll', 'docs/.nojekyll');
console.log('Built static portfolio in docs/');
