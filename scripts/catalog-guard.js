#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {pageDocument,relativePublicUrl,validateMaterialMetadata}=require('./material-metadata');

const root=path.resolve(__dirname,'..');
const currentPath=path.join(root,'data/catalog.json');
const baselinePath=path.join(root,'releases/catalog-v121.json');

function readJson(p){return JSON.parse(fs.readFileSync(p,'utf8'));}
function sitePath(url){return path.join(root,url.replace(/^\//,''));}
function pageFile(url){return path.join(sitePath(url),'index.html');}
function sameArray(a=[],b=[]){return JSON.stringify(a)===JSON.stringify(b);}

function validateCatalog(current, baseline, opts={checkFiles:true}){
  const errors=[];
  const warnings=[];
  const added=[];
  const changed=[];
  const archived=[];
  const currentById=new Map(current.products.map(p=>[p.id,p]));
  const baselineById=new Map(baseline.products.map(p=>[p.id,p]));

  if(currentById.size!==current.products.length) errors.push('В текущем реестре есть повторяющиеся id.');

  for(const old of baseline.products){
    const now=currentById.get(old.id);
    if(!now){
      errors.push(`Удалён из реестра без разрешения: ${old.title} (${old.id})`);
      continue;
    }
    if(old.status==='published'){
      if(now.status==='archived'){
        if(now.ownerApproval!==true || !String(now.archiveReason||'').trim()){
          errors.push(`Материал переведён в архив без ownerApproval=true и archiveReason: ${old.title}`);
        } else archived.push(old.title);
      } else if(now.status!=='published'){
        errors.push(`Недопустимый статус ранее опубликованного материала: ${old.title} → ${now.status}`);
      }
      if(now.page!==old.page) errors.push(`Изменён постоянный URL: ${old.title}: ${old.page} → ${now.page}`);
    }
  }

  for(const now of current.products){
    const old=baselineById.get(now.id);
    if(!old) added.push(now.title);
    else if(now.title!==old.title || now.description!==old.description || now.category!==old.category || now.priceType!==old.priceType || now.preview!==old.preview || !sameArray(now.downloads,old.downloads)) changed.push(now.title);

    if(now.status!=='published') continue;
    for(const required of ['id','title','page','catalogPage','preview','priceType','category']){
      if(!now[required]) errors.push(`${now.id}: отсутствует обязательное поле ${required}`);
    }
    if(now.priceType==='paid' && !now.purchaseUrl) errors.push(`${now.title}: платный продукт без purchaseUrl`);

    if(opts.checkFiles){
      const pf=pageFile(now.page);
      if(!fs.existsSync(pf)) errors.push(`${now.title}: отсутствует страница ${now.page}`);
      const preview=sitePath(now.preview);
      if(!fs.existsSync(preview)) errors.push(`${now.title}: отсутствует превью ${now.preview}`);
      for(const d of now.downloads||[]){
        if(!fs.existsSync(sitePath(d))) errors.push(`${now.title}: отсутствует файл ${d}`);
      }
      for(const rel of now.related||[]){
        if(!fs.existsSync(pageFile(rel))) errors.push(`${now.title}: не работает связанная страница ${rel}`);
      }
      for(const [label,linkedPage] of [['игра',now.game],['мобильный workbook',now.workbook]]){
        if(linkedPage && !fs.existsSync(pageFile(linkedPage))) errors.push(`${now.title}: не работает связанная страница (${label}) ${linkedPage}`);
      }
      const catalogFile=pageFile(now.catalogPage);
      if(!fs.existsSync(catalogFile)) errors.push(`${now.title}: отсутствует каталог ${now.catalogPage}`);
      else {
        const html=fs.readFileSync(catalogFile,'utf8');
        const catalogHref=now.catalogHref||relativePublicUrl(pageDocument(now.catalogPage),now.page);
        if(!html.includes(`href="${catalogHref}"`) && !html.includes(`href='${catalogHref}'`)){
          errors.push(`${now.title}: карточка/ссылка исчезла из каталога ${now.catalogPage}`);
        }
        if(!html.includes(now.title)) errors.push(`${now.title}: название отсутствует в каталоге ${now.catalogPage}`);
      }
      if(fs.existsSync(pf)){
        const html=fs.readFileSync(pf,'utf8');
        if(!html.includes(now.title)) warnings.push(`${now.title}: название не найдено дословно на собственной странице.`);
      }
    }
  }
  if(opts.checkFiles){
    const metadataResult=validateMaterialMetadata(current,{rootDirectory:root});
    errors.push(...metadataResult.errors);
  }
  return {errors,warnings,added,changed,archived,currentCount:current.products.filter(p=>p.status==='published').length,baselineCount:baseline.products.filter(p=>p.status==='published').length};
}

function writeReport(result,current,baseline){
  const removed=result.errors.filter(x=>x.startsWith('Удалён из реестра'));
  const lines=[
    '# EDUKASS · RELEASE REPORT', '',
    `Предыдущая контрольная точка: ${baseline.release}`,
    `Проверяемая версия: ${current.release}`, '',
    `Опубликованных материалов: ${result.baselineCount} → ${result.currentCount}`,
    `Добавлено: ${result.added.length}`,
    `Изменено по реестру: ${result.changed.length}`,
    `Архивировано с разрешением владельца: ${result.archived.length}`,
    `Удалено без разрешения: ${removed.length}`,
    `Ошибок целостности: ${result.errors.length}`,
    `Предупреждений: ${result.warnings.length}`, ''
  ];
  if(result.added.length) lines.push('## Добавлено',...result.added.map(x=>`- ${x}`),'');
  if(result.changed.length) lines.push('## Изменено',...result.changed.map(x=>`- ${x}`),'');
  if(result.archived.length) lines.push('## Архивировано',...result.archived.map(x=>`- ${x}`),'');
  if(result.errors.length) lines.push('## ОШИБКИ — ВЫПУСК ЗАБЛОКИРОВАН',...result.errors.map(x=>`- ${x}`),'');
  if(result.warnings.length) lines.push('## Предупреждения',...result.warnings.map(x=>`- ${x}`),'');
  lines.push(result.errors.length?'**РЕЗУЛЬТАТ: ВЫПУСК ЗАБЛОКИРОВАН**':'**РЕЗУЛЬТАТ: ВЫПУСК РАЗРЕШЁН**','');
  fs.writeFileSync(path.join(root,'RELEASE_REPORT_RU.md'),lines.join('\n'),'utf8');
}

if(require.main===module){
  const current=readJson(currentPath);
  const baseline=readJson(baselinePath);
  const result=validateCatalog(current,baseline,{checkFiles:true});
  writeReport(result,current,baseline);
  console.log(`Catalog guard: ${result.currentCount} published; errors=${result.errors.length}; warnings=${result.warnings.length}`);
  if(result.errors.length){
    for(const e of result.errors) console.error('ERROR:',e);
    process.exit(1);
  }
}

module.exports={validateCatalog};
