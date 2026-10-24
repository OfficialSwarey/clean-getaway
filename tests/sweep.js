const {chromium}=require('playwright-core');
(async()=>{const maps=(process.argv[2]||"harbor,harborDay,meridian,meridianDay,club,manor,casino,port,tower,jewel,jewelDay").split(",");
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:320,height:180}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
for(const m of maps){
 const r=await p.evaluate(new Function(H+`q.setState("menu");q.pickMap("${m}");q.resetGame();q.setState("playing");q.scene.updateMatrixWorld(true);
  const all=[];q.scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type!=="BufferGeometry")all.push(o);});
  const targets=[];q.scene.traverse(o=>{if(o.isMesh&&o.visible&&o.layers.mask!==0)targets.push(o);});
  const leaf=new Set();q.doors.forEach(d=>(d.leaves||[]).forEach(l=>{const o=l.mesh||l.piv||l;o.traverse&&o.traverse(x=>leaf.add(x));}));
  const vis=o=>{for(let a=o;a;a=a.parent)if(!a.visible)return false;return true;};
  const bb=new THREE.Box3(),rc=new THREE.Raycaster();rc.camera=q.camera;const down=new THREE.Vector3(0,-1,0);
  const floating=[],zf=[];const planes=[];
  for(const o of all){if(leaf.has(o)||!vis(o)||o.isSprite)continue;bb.setFromObject(o);const sx=bb.max.x-bb.min.x,sy=bb.max.y-bb.min.y,sz=bb.max.z-bb.min.z;
    if(sy<0.002&&sx*sz>0.05){planes.push({o,y:bb.max.y,b:bb.clone()});continue;}
    const base=Math.floor((bb.min.y+0.5)/4)*4,rel=bb.min.y-base;
    if(rel<0.06||rel>1.1||Math.min(sx,sz)<0.2||sx*sz<0.12||sy<0.05)continue;
    if(o.material&&o.material.transparent)continue;
    if(Math.max(sx,sz)>4)continue;
    floating.push({o,b:bb.clone()});}
  const boxes=all.filter(o=>!leaf.has(o)&&vis(o)).map(o=>({o,b:new THREE.Box3().setFromObject(o)}));
  const fl2=[];
  for(const f of floating){const B=f.b;let ok=false;
    for(const t of boxes){if(t.o===f.o)continue;const T=t.b;
      const ox=Math.min(B.max.x,T.max.x+0.03)-Math.max(B.min.x,T.min.x-0.03),oz=Math.min(B.max.z,T.max.z+0.03)-Math.max(B.min.z,T.min.z-0.03);if(ox<=0||oz<=0)continue;
      if(T.max.y>=B.min.y-0.07&&T.min.y<=B.min.y+0.02){ok=true;break;}            // something under it (or it passes through it)
      if(T.min.y<=B.min.y&&T.max.y>=B.max.y-0.02&&(Math.min(T.max.x-T.min.x,T.max.z-T.min.z)<0.6||T.max.y-T.min.y>2)){ok=true;break;} // hung on a wall/pole
    }
    if(!ok)fl2.push({at:[+((B.min.x+B.max.x)/2).toFixed(2),+B.min.y.toFixed(2),+((B.min.z+B.max.z)/2).toFixed(2)],size:[+(B.max.x-B.min.x).toFixed(2),+(B.max.y-B.min.y).toFixed(2),+(B.max.z-B.min.z).toFixed(2)],col:f.o.material&&f.o.material.color&&f.o.material.color.getHexString()});}
  floating.length=0;floating.push(...fl2);
  for(let i=0;i<planes.length;i++)for(let j=i+1;j<planes.length;j++){const a=planes[i],c=planes[j];if(Math.abs(a.y-c.y)>0.003)continue;
    const ox=Math.min(a.b.max.x,c.b.max.x)-Math.max(a.b.min.x,c.b.min.x),oz=Math.min(a.b.max.z,c.b.max.z)-Math.max(a.b.min.z,c.b.min.z);
    if(ox>0.05&&oz>0.05&&ox*oz>0.05&&a.o.material!==c.o.material)zf.push({y:+a.y.toFixed(3),x:[+Math.max(a.b.min.x,c.b.min.x).toFixed(1),+Math.min(a.b.max.x,c.b.max.x).toFixed(1)],z:[+Math.max(a.b.min.z,c.b.min.z).toFixed(1),+Math.min(a.b.max.z,c.b.max.z).toFixed(1)]});}
  return {floating,zf:zf.slice(0,30),nz:zf.length};`));
 console.log("##",m,"floating",r.floating.length,"zfight",r.nz);r.floating.forEach(f=>console.log("  F",JSON.stringify(f)));r.zf.forEach(f=>console.log("  Z",JSON.stringify(f)));}
console.log(errs);await b.close();})();
