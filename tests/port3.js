const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{__qh.setState("menu");__qh.pickMap("port");__qh.resetGame();__qh.setState("playing");});
  const H=`const q=__qh;const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
    const go=(x,z,lvl,yaw,pitch)=>{q.P.ladder=null;q.P.x=x;q.P.z=z;q.P.level=lvl;q.P.jh=0;q.P.y=lvl*4;q.P.vy=0;q.P.yaw=yaw;q.P.pitch=pitch||0;q.P.crouch=false;step(1);};
    const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});`;
  const run=src=>p.evaluate(new Function(H+src));
  const out={};
  await run(`q.guards.forEach(g=>{g.route=[[60,-28],[60,-27]];g.wp=0;g.x=60;g.z=-28;});q.cams.forEach(c=>c.dead=true);
    const X=q.LV.def.X,r=X.rows[q.G.p.row];r.lifted=true;r.bg.position.set(-7.25,1.3,6+q.G.p.row*3.5);{const i=q.colliders.indexOf(r.bcol);if(i>=0)q.colliders.splice(i,1);}
    q.G.p.hatchOpen=true;q.G.p.manifest=true;{const i=q.colliders.indexOf(X.hatch.cols[0]);if(i>=0)q.colliders.splice(i,1);}`);
  out.down=await run(`go(-2.3,29.1,1,Math.PI/2);const a=pr();q.pressE();step(40);q.keys.KeyS=true;step(90);q.keys.KeyS=false;step(5);return {prompt:a,at:at(),ladder:!!q.P.ladder};`);
  out.keypad=await run(`const z=q.LV.def.X.rows[q.G.p.row].z;go(-8.8,z,0,-Math.PI/2);const a=pr();q.pressE();step(1);return {prompt:a,open:q.G.keypad};`);
  await p.evaluate(()=>{const c=__qh.G.safeCode;for(const d of c)window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+d}));});
  await p.waitForFunction(()=>__qh.G.vaultOpen,null,{timeout:20000}).catch(()=>{});
  out.loot=await run(`step(60);q.P.masked=true;q.P.raise=1;const b=q.bags.find(b=>b.box==="vault"&&b.gold);const z=b.mesh.position.z;let a="";for(const yw of [Math.PI/2,-Math.PI/2]){go(-13.9,z,0,yw,-0.6);a=pr();if(a)break;}
    q.pressE();step(1);const c=q.P.carry&&q.P.carry.gold;const pos0=at();
    for(let i=0;i<1;i++){} go(q.SECURE.x,q.SECURE.z-0.4,0,0);const lp=pr();q.pressE();step(1);q.keys.KeyE=false;step(3);const vp=pr();q.keys.KeyE=true;step(50);q.keys.KeyE=false;
    return {open:q.G.vaultOpen,prompt:a,gold:c,loadPrompt:lp,leave:vp,state:q.state,score:document.getElementById("endTakeVal").textContent,boatBag:[+b.mesh.position.x.toFixed(1),+b.mesh.position.y.toFixed(2)]};`);
  out.picked=await run(`q.setState("menu");q.pickMap("harbor");q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[60,-28],[60,-27]];g.wp=0;g.x=60;g.z=-28;});
    const w=q.windows.find(w=>!w.fixed&&w.name==="office window");w.state="open";{const i=q.colliders.indexOf(w.col);if(i>=0)q.colliders.splice(i,1);}
    go(-13.2,-9,0,Math.PI/2);q.keys.KeyW=true;step(6);q.tryJump();step(40);q.keys.KeyW=false;step(5);const out1=at();
    q.keys.KeyW=true;q.P.yaw=-Math.PI/2;step(4);q.tryJump();step(40);q.keys.KeyW=false;step(5);return {out:out1,backIn:at()};`);
  console.log(JSON.stringify(out,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
