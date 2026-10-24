const q=__qh;const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
const go=(x,z,lvl,yaw,pitch)=>{q.P.ladder=null;q.P.climb=null;q.P.x=x;q.P.z=z;q.P.level=lvl;q.P.jh=0;q.P.y=lvl*4;q.P.vy=0;q.P.yaw=yaw;q.P.pitch=pitch||0;q.P.crouch=false;step(1);};
const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});
const walk=(yaw,n)=>{q.P.yaw=yaw;q.keys.KeyW=true;step(n);q.keys.KeyW=false;step(2);};
const away=()=>{q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});q.cams.forEach(c=>c.dead=true);};
const digit=d=>{window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+d}));window.dispatchEvent(new KeyboardEvent("keyup",{code:"Digit"+d}));};
const toastT=()=>document.getElementById("toast").textContent;
