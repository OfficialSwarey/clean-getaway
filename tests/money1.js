const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{try{localStorage.clear();}catch(e){}});
  const res={};
  for(const map of ["harbor","meridian","club"]){
    res[map]=await p.evaluate((map)=>{
      const q=__qh,out={};q.setState("menu");q.pickMap(map);q.resetGame();q.setState("playing");q.DEV.ghost=true;
      const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
      out.bagValues=q.bags.map(b=>b.value);out.cash=q.CASH.length;
      // every pile: find a standing spot in front of it, look at it, grab
      const fails=[];let got=0;
      for(const c of q.CASH){
        let ok=false;
        for(let k=0;k<12&&!ok;k++){
          const a=k*Math.PI/6,r=0.9;const x=c.x+Math.sin(a)*r,z=c.z+Math.cos(a)*r;
          const pp={x,z};q.colliders.length; // check free spot
          let free=true;for(const col of q.colliders){if((col.lvl||0)!==0)continue;if(x>col.minX-0.3&&x<col.maxX+0.3&&z>col.minZ-0.3&&z<col.maxZ+0.3){free=false;break;}}
          if(!free)continue;
          q.P.x=x;q.P.z=z;q.P.yaw=Math.atan2(-(c.x-x),-(c.z-z));q.P.pitch=-0.4;step(1);
          const pr=document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
          if(pr.includes("grab the cash")){const before=q.G.pocket;q.pressE();step(1);if(q.G.pocket>before){ok=true;got++;}}
        }
        if(!ok)fails.push([c.x,c.z]);
      }
      out.grabbed=got;out.fails=fails;out.pocket=q.G.pocket;
      q.updateHUD();out.hudTake=document.getElementById("takeVal").textContent;
      // drive off right away with only pocket cash
      q.P.x=q.SECURE.x+0.5;q.P.z=q.SECURE.z;step(1);
      out.vanPrompt=document.getElementById("promptText").textContent;
      q.keys.KeyE=true;step(Math.round(1.7*30));q.keys.KeyE=false;
      out.ended={state:q.state,title:document.getElementById("endTitle").textContent,take:document.getElementById("endTakeVal").textContent,best:document.getElementById("endBest").textContent,reason:document.getElementById("endReason").textContent};
      return out;
    },map);
  }
  // harbor: one bag, holding E straight after loading must not drive off; then a fresh hold does
  res.oneBag=await p.evaluate(()=>{
    const q=__qh,out={};q.setState("menu");q.pickMap("harbor");q.resetGame();q.setState("playing");q.DEV.ghost=true;q.P.masked=true;
    const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    q.G.vaultOpen=true;const b=q.bags[0];q.P.x=b.mesh.position.x;q.P.z=b.mesh.position.z+1;q.P.yaw=0;q.P.pitch=-0.5;step(1);q.pressE();step(1);
    out.carry=q.P.carry&&q.P.carry.value;q.updateHUD();out.chip=document.getElementById("carry").textContent;
    q.P.x=q.SECURE.x+0.5;q.P.z=q.SECURE.z;step(1);q.keys.KeyE=true;q.pressE();step(1);step(60);out.afterLoadHold={state:q.state,secured:q.G.secured};
    q.keys.KeyE=false;step(2);q.keys.KeyE=true;step(50);q.keys.KeyE=false;
    out.end={state:q.state,take:document.getElementById("endTakeVal").textContent,reason:document.getElementById("endReason").textContent,stats:document.getElementById("endStats").textContent,best:document.getElementById("endBest").textContent,bagValue:b.value};
    q.setState("menu");out.menuBest=[...document.querySelectorAll(".job-best")].map(e=>e.parentNode.dataset.map+": "+e.textContent);
    return out;});
  // police: everything lost
  res.busted=await p.evaluate(()=>{
    const q=__qh;q.pickMap("harbor");q.resetGame();q.setState("playing");q.DEV.ghost=true;q.G.pocket=5000;q.G.alarm=true;q.G.alarmT=0.05;for(let i=0;i<5;i++)q.stepGame(1/30);
    return {state:q.state,take:document.getElementById("endTakeVal").textContent,lbl:document.getElementById("endTakeLbl").textContent,reason:document.getElementById("endReason").textContent};});
  await p.screenshot({path:'70-busted.png'});
  console.log(JSON.stringify(res,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
