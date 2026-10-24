// usage: node views.js map "setup js" name,x,z,lvl,yaw,pitch[,yOff] ...
const {chromium}=require('playwright-core');
(async()=>{const [map,setup,...vs]=process.argv.slice(2);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:800,height:450}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
await run(`q.setState("menu");q.pickMap("${map}");q.resetGame();q.setState("playing");away();q.DEV.ghost=true;${setup};step(60);document.getElementById("obj").style.display="none";`);
for(const v of vs){const [n,x,z,l,yaw,pitch,yo]=v.split(",");
 await run(`go(${x},${z},${l},${yaw});q.P.pitch=${pitch};${yo?`q.P.y=${l}*4+(${yo});`:""}step(2);`);await p.waitForTimeout(250);
 await p.screenshot({path:`../vv-${n}.png`,timeout:180000});}
console.log(errs.length?errs:"ok");await b.close();})();
