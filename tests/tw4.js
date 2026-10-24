const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{__qh.setState("menu");__qh.pickMap("tower");__qh.resetGame();__qh.setState("playing");});
  const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
  const run=src=>p.evaluate(new Function(H+src));
  const out={};
  // guards patrol for 60 s: who moves, who gets stuck
  out.patrol=await run(`go(-3,27,0,0);const st=q.guards.map(g=>({n:g.name,x:g.x,z:g.z,moved:0,lx:g.x,lz:g.z}));
    for(let i=0;i<1800;i++){q.stepGame(1/30);q.guards.forEach((g,k)=>{const s=st[k];s.moved+=Math.hypot(g.x-s.lx,g.z-s.lz);s.lx=g.x;s.lz=g.z;});if(q.state!=="playing")break;}
    return {state:q.state,alarm:q.G.alarm,g:st.map(s=>s.n+":"+s.moved.toFixed(0)+"@"+s.lx.toFixed(1)+","+s.lz.toFixed(1))};`);
  out.civs=await run(`return q.civs.map(c=>c.label.slice(0,10)+":"+c.x.toFixed(1)+","+c.z.toFixed(1)+" "+c.state);`);
  await run(`q.resetGame();q.setState("playing");away();`);
  // stairs 4 -> 5 -> roof, roof door
  out.stairs=await run(`const r=[];go(1.5,4.6,4,0);walk(0,90);r.push(at());q.P.x=3.6;step(1);walk(Math.PI,90);r.push(at());
    walk(Math.PI/2*-1,15);const rd=pr();return {r,roofDoorPrompt:rd,at:at()};`);
  // gondola: board at the street, ride to 3, pick the window, climb in
  out.gon=await run(`go(17.5,-6,0,0);walk(Math.PI,40);const a=at(),pa=pr();digit(3);step(2);const mv=q.G.t.gon.moving;step(30*10);const b=at(),pb=pr();
    q.P.yaw=Math.PI/2;step(1);go(16.6,-2,3,Math.PI/2);const pc=pr();q.keys.KeyE=true;step(30*5);q.keys.KeyE=false;step(30);const w=q.windows.find(w=>!w.fixed&&w.level===3&&Math.abs(w.z+2)<0.1);
    q.keys.KeyW=true;step(4);q.tryJump();step(40);q.keys.KeyW=false;step(5);const c=at();
    return {board:a,pa,mv,arrive:b,pb,pc,win:w&&w.state,inside:c};`);
  out.gon2=await run(`go(17.2,0,3,0);step(2);digit(6);step(30*10);const a=at();walk(Math.PI/2,40);const b=at();return {roof:a,onRoof:b,lvl:q.G.t.gon.lvl};`);
  // fire alarm
  out.fire=await run(`go(6.0,0.8,1,Math.PI/2);const a=pr();q.keys.KeyE=true;step(40);q.keys.KeyE=false;step(2);
    const f=q.G.t.fire.on,doors=q.doors.filter(d=>d.exec).map(d=>d.locked),el=q.G.t.el.fire;
    step(30*30);const gone=q.civs.filter(c=>c.gone).length,civ=q.civs.map(c=>c.label.slice(0,8)+":"+(c.gone?"gone":c.x.toFixed(1)+","+c.z.toFixed(1)+","+c.state));
    step(30*20);return {prompt:a,on:f,doors,el,gone,civ,after50:q.G.t.fire.on,toast:toastT()};`);
  // chute
  out.chute=await run(`q.P.masked=true;const b=q.bags.find(b=>b.level===2);b.state="ground";const bp=b.mesh.position;go(bp.x-1.2,bp.z,2,-Math.PI/2,-0.6);const a=pr();q.pressE();step(1);const carry=!!q.P.carry;
    go(-0.6,-6.0,2,Math.PI);const c=pr();q.pressE();step(2);const st=b.state,lvl=b.level,pos=[+b.mesh.position.x.toFixed(1),+b.mesh.position.z.toFixed(1)];
    go(b.mesh.position.x,-17.4,0,Math.PI,-0.5);const d=pr();q.pressE();step(1);const carry2=!!q.P.carry;
    return {pick:a,carry,chute:c,st,lvl,pos,skip:d,carry2};`);
  // helicopter
  out.heli=await run(`go(-14.8,10.2,6,0);const a=pr();q.keys.KeyE=true;step(90);q.keys.KeyE=false;step(2);const s=q.G.t.heli.state;step(30*42);
    const s2=q.G.t.heli.state;go(-12.2,3.6,6,0);const b=pr();q.pressE();step(1);q.keys.KeyE=false;step(3);const c=pr();q.keys.KeyE=true;step(60);q.keys.KeyE=false;
    return {prompt:a,s,s2,load:b,leave:c,state:q.state,score:document.getElementById("endTakeVal").textContent};`);
  out.errs=errs;
  console.log(JSON.stringify(out,null,1));
  await b.close();
})();
