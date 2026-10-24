const {chromium}=require('playwright-core');
(async()=>{const [map,expr]=process.argv.slice(2);const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:400,height:225}});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
console.log(JSON.stringify(await p.evaluate(new Function(H+`q.setState("menu");q.pickMap("${map}");q.resetGame();q.setState("playing");`+expr)),null,0));await b.close();})();
