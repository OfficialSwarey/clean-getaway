const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{__qh.setState("menu");__qh.pickMap("tower");__qh.resetGame();__qh.setState("playing");});
  const H=`const q=__qh;const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
    const go=(x,z,lvl,yaw,pitch)=>{q.P.ladder=null;q.P.climb=null;q.P.x=x;q.P.z=z;q.P.level=lvl;q.P.jh=0;q.P.y=lvl*4;q.P.vy=0;q.P.yaw=yaw;q.P.pitch=pitch||0;q.P.crouch=false;step(1);};
    const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});
    const walk=(yaw,n)=>{q.P.yaw=yaw;q.keys.KeyW=true;step(n);q.keys.KeyW=false;step(2);};
    const away=()=>{q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});q.cams.forEach(c=>c.dead=true);};
    const digit=d=>{window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+d}));window.dispatchEvent(new KeyboardEvent("keyup",{code:"Digit"+d}));};`;
  const run=src=>p.evaluate(new Function(H+src));
  const out={};
  await run(`away();`);
  // stairs: lobby -> floor 1 -> floor 2 -> ... -> roof
  out.stairs=await run(`go(6.2,4.6,0,Math.PI/2);const d0=pr();q.pressE();step(20);
    walk(Math.PI/2,30);const a=at();
    walk(0,80);const b=at();
    walk(Math.PI/2*0,0);q.P.yaw=-Math.PI/2;walk(-Math.PI/2,15);const b2=at();
    walk(Math.PI,80);const c=at();
    return {door:d0,landing:a,l1:b,b2,l2:c};`);
  out.stairs2=await run(`const r=[];for(let l=2;l<6;l++){walk(-Math.PI/2*0+ (l%2?Math.PI:0),5);
      const yaw=(l%2===0)?0:Math.PI;const sx=(l%2===0)?1.5:3.6;q.P.x=sx;step(1);walk(yaw,80);r.push(at());}
    return r;`);
  // elevator: from the lobby up to 2, then refuse 4 without the card
  out.elev=await run(`go(-6.2,-0.5,0,-Math.PI/2);const p0=pr();q.pressE();step(1);const st=JSON.stringify(q.G.t.el);step(40);
    walk(-Math.PI/2,40);const inCar=at();const p1=pr();digit(4);step(2);const t4=document.getElementById("toast").textContent;digit(2);step(5);const moving=q.G.t.el.moving;step(150);
    const arr=at();const el=JSON.stringify(q.G.t.el);walk(Math.PI/2,40);const out1=at();
    return {p0,st,inCar,p1,t4,moving,arr,el,out1};`);
  // exec card from Hale (pickpocket), then the elevator to 4, the exec stairwell door on 3
  out.exec=await run(`const h=q.guards.find(g=>g.name==="Hale");h.route=[[0,9.6,0,99]];h.wp=0;h.x=0;h.z=9.6;h.yaw=0;h.wait=99;h.face=0;step(2);
    go(0,9.0,2,Math.PI);const a=pr();q.keys.KeyE=true;step(60);q.keys.KeyE=false;step(1);
    return {prompt:a,exec:q.G.t.exec};`);
  out.execDoor=await run(`go(5.8,-3.6,3,Math.PI/2);const a=pr();q.pressE();step(30);const d=q.doors.find(d=>d.exec&&d.level===3);return {prompt:a,open:d.open,locked:d.locked};`);
  // IT note, keycard, server room, override
  out.server=await run(`go(12.85,-9.6,1,0);const a=pr();q.pressE();step(1);const know=q.G.knowCode;
    q.P.hasCard=true;go(-8.0,-6.9,2,Math.PI/2);const b=pr();q.pressE();step(30);const sd=q.doors.find(d=>d.name==="server room door");
    go(-13,-6.4,2,Math.PI);const c=pr();q.pressE();step(1);return {note:a,know,door:b,open:sd.open,term:c,keypad:q.G.keypad};`);
  await p.evaluate(()=>{const c=__qh.G.safeCode;for(const d of c)window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+d}));});
  await p.waitForTimeout(1500);
  out.override=await run(`const s=q.G.t.override;step(30*21);return {s,after:q.G.t.override,chip:document.getElementById("chip")?document.getElementById("chip").textContent:""};`);
  // Vane's voice
  out.voice=await run(`const v=q.civs.find(c=>c.label==="Victor Vane");go(v.x+1.5,v.z+1.5,5,0);q.G.t.call.next=0;step(30*10);return {rec:+q.G.t.rec.toFixed(1),voice:q.G.t.voice,talk:v.talk,sub:document.getElementById("subLine").textContent,vstate:v.state,sus:v.sus};`);
  out.voice2=await run(`if(!q.G.t.voice){q.G.t.call.next=0;step(30*10);}return {rec:+q.G.t.rec.toFixed(1),voice:q.G.t.voice};`);
  // vault
  out.vault=await run(`q.G.t.voice=true;q.G.t.override="done";go(-9.2,-2.6,4,0);const a=pr();q.keys.KeyE=true;step(100);q.keys.KeyE=false;step(30);return {prompt:a,open:q.G.vaultOpen,bags:q.bags.filter(b=>b.box==="vault").map(b=>b.state)};`);
  // loot -> chute -> skip -> van
  out.chute=await run(`q.P.masked=true;const b=q.bags.find(b=>b.box==="vault"&&!b.gold);const bp=b.mesh.position;go(bp.x+1.2,bp.z,4,Math.PI/2,-0.6);const a=pr();q.pressE();step(1);const carry=!!q.P.carry;
    go(-0.6,-6.0,4,0);const c=pr();q.pressE();step(2);const st=b.state,lvl=b.level,pos=[+b.mesh.position.x.toFixed(1),+b.mesh.position.z.toFixed(1)];
    go(-0.5,-17.2,0,Math.PI);const d=pr();q.pressE();step(1);const carry2=!!q.P.carry;
    go(q.SECURE.x,q.SECURE.z,0,0);const e=pr();q.pressE();step(1);q.keys.KeyE=false;step(2);const f=pr();
    return {pick:a,carry,chute:c,st,lvl,pos,skip:d,carry2,load:e,leave:f,secured:q.G.secured};`);
  out.errs=errs.slice();
  console.log(JSON.stringify(out,null,1));
  await b.close();
})();
