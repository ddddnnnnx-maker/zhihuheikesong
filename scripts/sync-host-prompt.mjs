import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
// Keep the user-owned Markdown as the source. Only the server snapshot is shipped.
const source=new URL('../主持人Prompt.md',import.meta.url);
const target=new URL('../server/host-prompt.mjs',import.meta.url);
export async function syncHostPrompt(){
  const text=await readFile(source,'utf8');
  if(!text.includes('海龟汤')||!text.includes('判定流程'))throw new Error('主持人Prompt.md 内容不完整，未更新主持人规则');
  const hash=createHash('sha256').update(text).digest('hex');
  await writeFile(target,'// Generated from 主持人Prompt.md by scripts/sync-host-prompt.mjs. Do not edit.\nexport const HOST_PROMPT_SOURCE_SHA256 = '+JSON.stringify(hash)+';\nexport const HOST_PROMPT_REFERENCE = '+JSON.stringify(text)+';\n');
}
