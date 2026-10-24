const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:400,height:225}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
for(const m of ["harbor","harborDay","meridian","meridianDay","club","manor","casino","port","tower","jewel","jewelDay","whiteout"]){
 const r=await p.evaluate(new Function(H+`q.setState("menu");q.pickMap("${m}");q.resetGame();q.setState("playing");q.scene.updateMatrixWorld(true);
  const leafSet=new Set();q.doors.forEach(d=>(d.leaves||[]).forEach(l=>{(l.mesh||l.piv||l).traverse&&(l.mesh||l.piv||l).traverse(o=>leafSet.add(o));}));
  const out=[];const bb=new THREE.Box3();
  q.scene.traverse(o=>{if(!o.isMesh||leafSet.has(o)||!o.geometry||o.geometry.type==="BufferGeometry")return;let skip=false;for(let a=o;a;a=a.parent)if(a.userData&&a.userData.win)skip=true;if(skip)return;bb.setFromObject(o);const sx=bb.max.x-bb.min.x,sz=bb.max.z-bb.min.z,sy=bb.max.y-bb.min.y;
    if(sy<0.15||Math.max(sx,sz)<0.25||Math.min(sx,sz)>0.12||Math.max(sx,sz)>4)return;
    for(const d of q.doors){const base=(d.level||0)*4;const alongX=Math.abs(Math.sin(d.rot))<0.5; // wall runs along x
      const perp=alongX?Math.abs((bb.min.z+bb.max.z)/2-d.z):Math.abs((bb.min.x+bb.max.x)/2-d.x);if(perp>0.4)continue;
      const lo=(alongX?d.x:d.z)-d.w/2+0.12,hi=(alongX?d.x:d.z)+d.w/2-0.12;const a=alongX?bb.min.x:bb.min.z,c=alongX?bb.max.x:bb.max.z;
      if(c<=lo||a>=hi)continue;if(bb.min.y>=base+d.h-0.02||bb.max.y<=base+0.05)continue;
      out.push({door:d.name,lvl:d.level,dx:+d.x.toFixed(2),dz:+d.z.toFixed(2),obj:o.geometry.type,at:[+((bb.min.x+bb.max.x)/2).toFixed(2),+((bb.min.y+bb.max.y)/2).toFixed(2),+((bb.min.z+bb.max.z)/2).toFixed(2)],size:[+sx.toFixed(2),+sy.toFixed(2),+sz.toFixed(2)],mask:o.layers.mask});}
    for(const w of (q.windows||[])){const alongX=!w.alongZ;const perp=alongX?Math.abs((bb.min.z+bb.max.z)/2-w.z):Math.abs((bb.min.x+bb.max.x)/2-w.x);if(perp>0.4)continue;
      const lo=(alongX?w.x:w.z)-w.w/2+0.1,hi=(alongX?w.x:w.z)+w.w/2-0.1;const a=alongX?bb.min.x:bb.min.z,c=alongX?bb.max.x:bb.max.z;if(c<=lo||a>=hi)continue;
      const wy=w.baseY;if(bb.max.y<wy-0.5||bb.min.y>wy+0.5)continue;
      out.push({win:w.name,lvl:w.level,wx:+w.x.toFixed(2),wz:+w.z.toFixed(2),obj:o.geometry.type,at:[+((bb.min.x+bb.max.x)/2).toFixed(2),+((bb.min.y+bb.max.y)/2).toFixed(2),+((bb.min.z+bb.max.z)/2).toFixed(2)],size:[+sx.toFixed(2),+sy.toFixed(2),+sz.toFixed(2)]});}
  });return out;`));
 console.log(m,JSON.stringify(r));}
console.log(errs);await b.close();})();
