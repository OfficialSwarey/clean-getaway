// Co-op: two games with different histories build every co-op job identically from the same seed.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const A=await b.newPage(),B=await b.newPage();const errs=[];[A,B].forEach(p=>p.on('pageerror',e=>errs.push(e.message)));
await A.goto('file://'+__dirname+'/test.html');await B.goto('file://'+__dirname+'/test.html');await A.waitForTimeout(2000);
await B.evaluate(()=>{for(const m of ["club","meridianDay","jewel","tower","whiteout"])__qh.buildMap(m);});
const maps=["harbor","harborDay","meridian","meridianDay","club","jewel","jewelDay"];const out={};
for(const m of maps){
  const seed=1000+maps.indexOf(m)*77;
  const f=({m,seed})=>{__qh.coopBuild(m,seed);const r=v=>Math.round(v*1000);return {n:__qh.SYNC.objs.length,s:__qh.SYNC.objs.map(o=>[o.type,r(o.position.x),r(o.position.y),r(o.position.z),r(o.rotation.y),o.visible?1:0].join(",")),code:__qh.G.safeCode,cash:__qh.bags.map(b=>b.value).join(",")};};
  const a=await A.evaluate(f,{m,seed}),bb=await B.evaluate(f,{m,seed});
  let first=-1;for(let i=0;i<Math.max(a.s.length,bb.s.length);i++)if(a.s[i]!==bb.s[i]){first=i;break;}
  out[m]={n:[a.n,bb.n],firstDiff:first,diffA:first>=0?a.s[first]:null,diffB:first>=0?bb.s[first]:null,code:a.code===bb.code,loot:a.cash===bb.cash};
}
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");await b.close();})();
