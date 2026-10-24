// Difficulties: Easy sends some patrol guards home (never the camera operator or a guard the job needs), every job still runs,
// and the score shows the difficulty.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:960,height:540}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
const maps=["harbor","harborDay","meridian","meridianDay","club","jewel","jewelDay","manor","casino","port","tower","whiteout"];
const out={};
for(const m of maps){
  out[m]=await p.evaluate(m=>{const q=__qh,r={};
    for(const d of ["easy","normal","hard"]){q.setDifficulty(d,false);q.setState("menu");q.pickMap("harbor");q.buildMap(m);q.resetGame();q.setState("playing");
      const sec=q.guards.filter(g=>g.security).length;
      let err=null;try{for(let i=0;i<300;i++){q.stepGame(1/30);if(q.state!=="playing")break;}}catch(e){err=e.message;}
      r[d]={guards:q.guards.length,sec,state:q.state,err,pagers:null};}
    q.setDifficulty("normal",false);return r;},m);
  console.log(m,JSON.stringify(out[m]));
}
// the score on easy and hard
const sc=await p.evaluate(()=>{const q=__qh,r={};
  for(const d of ["easy","normal","hard"]){q.setDifficulty(d,false);q.setState("menu");q.buildMap("harbor");q.resetGame();q.setState("playing");q.G.vanTake=40000;q.G.secured=1;q.endGame(true);
    r[d]={score:document.getElementById("endTakeVal").textContent,rows:[...document.querySelectorAll("#endBreak dt")].map(e=>e.textContent)};}
  q.setDifficulty("normal",false);return r;});
console.log(JSON.stringify(sc));
console.log(errs.join("\n")||"no errors");await b.close();})();
