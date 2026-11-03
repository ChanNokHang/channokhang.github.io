(() => {
'use strict';
const svg = document.getElementById('play-network');
if (!svg) return;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ns = 'http://www.w3.org/2000/svg';
const initial = [[-125,-55,45],[-55,-100,-80],[95,-75,55],[130,30,-65],[55,95,70],[-95,75,-70],[0,0,0]];
let yaw=0.4,pitch=-0.2,zoom=1;
const nodes = initial.map(([x,y,z],i) => ({x,y,z,label:String.fromCharCode(65+i)}));
const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[1,4]];
let selected = null;
const make = (tag,attrs) => { const e=document.createElementNS(ns,tag); Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v)); svg.append(e); return e; };
const lines=edges.map(() => make('line',{'aria-hidden':'true'}));
const circles=nodes.map((n,i) => make('circle',{r:14,tabindex:0,role:'button','aria-label':'Node '+n.label+'. Select to highlight connections; arrow keys move the node.'}));
const labels=nodes.map(n => {const e=make('text',{'text-anchor':'middle','aria-hidden':'true'});e.textContent=n.label;return e;});
const controls=nodes.map((n,i) => { const b=document.createElement('button');b.type='button';b.textContent=n.label;b.setAttribute('aria-label','Highlight node '+n.label);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(i));document.querySelector('.node-controls').append(b);return b; });
function project(n){
 const x=n.x*Math.cos(yaw)+n.z*Math.sin(yaw), z=-n.x*Math.sin(yaw)+n.z*Math.cos(yaw);
 const y=n.y*Math.cos(pitch)-z*Math.sin(pitch), depth=n.y*Math.sin(pitch)+z*Math.cos(pitch);
 const scale=450/(450+depth)*zoom;
 return {x:210+x*scale,y:150+y*scale,scale,depth};
}
function draw(){
 const points=nodes.map(project);
 edges.forEach(([a,b],i)=>{const e=lines[i];e.setAttribute('x1',points[a].x);e.setAttribute('y1',points[a].y);e.setAttribute('x2',points[b].x);e.setAttribute('y2',points[b].y);e.classList.toggle('active',selected===a||selected===b);e.style.opacity=String(Math.max(.2,Math.min(1,(points[a].scale+points[b].scale)/2-.1)));});
 points.map((p,i)=>({p,i})).sort((a,b)=>b.p.depth-a.p.depth).forEach(({p,i})=>{
 const c=circles[i];c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',13*p.scale);c.classList.toggle('selected',selected===i);c.setAttribute('aria-pressed',String(selected===i));c.style.opacity=String(Math.min(1,.55+p.scale*.35));labels[i].setAttribute('x',p.x);labels[i].setAttribute('y',p.y-20*p.scale);controls[i].setAttribute('aria-pressed',String(selected===i));svg.append(c);svg.append(labels[i]);
 });
}
function select(i){selected=i;const count=edges.filter(([a,b])=>a===i || b===i).length;document.getElementById('network-status').textContent='Node '+nodes[i].label+' · '+count+' direct connections in this illustrative network.';draw();}
circles.forEach((c,i)=>{
 c.setAttribute('aria-label','Select node '+nodes[i].label);
 c.addEventListener('click',()=>{if(!suppressClick)select(i);});
 c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i);}});
});
let drag=null,suppressClick=false;
svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,distance:0};suppressClick=false;svg.setPointerCapture(e.pointerId);});
svg.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.distance+=Math.abs(dx)+Math.abs(dy);yaw+=dx*.008;pitch=Math.max(-1.4,Math.min(1.4,pitch+dy*.008));drag.x=e.clientX;drag.y=e.clientY;if(drag.distance>5)suppressClick=true;draw();});
function endDrag(){drag=null;}
svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',endDrag);svg.addEventListener('lostpointercapture',endDrag);
svg.addEventListener('keydown',e=>{const steps={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,-.12],ArrowDown:[0,.12]}[e.key];if(steps){e.preventDefault();yaw+=steps[0];pitch=Math.max(-1.4,Math.min(1.4,pitch+steps[1]));draw();}if(e.key==='+'||e.key==='-'||e.key==='='){e.preventDefault();zoom=Math.max(.7,Math.min(1.35,zoom+(e.key==='-'?-.05:.05)));document.getElementById('network-zoom').value=zoom;draw();}});
document.getElementById('rotate-left').addEventListener('click',()=>{yaw-=.25;draw();});
document.getElementById('rotate-right').addEventListener('click',()=>{yaw+=.25;draw();});
document.getElementById('network-zoom').addEventListener('input',e=>{zoom=Number(e.target.value);draw();});
document.getElementById('reset-network').addEventListener('click',()=>{nodes.forEach((n,i)=>{[n.x,n.y,n.z]=initial[i];});yaw=.4;pitch=-.2;zoom=1;selected=null;document.getElementById('network-zoom').value=1;document.getElementById('network-status').textContent='View reset. Drag to rotate the 3D network.';draw();});
draw();
let pulseTimer;
function clearPulse(){clearTimeout(pulseTimer); circles.forEach(c=>c.classList.remove('ripple-node'));}
document.getElementById('send-pulse').addEventListener('click',()=>{
 clearPulse();
 const start=selected===null?6:selected;
 select(start);
 const distances=nodes.map(()=>Infinity);distances[start]=0;const queue=[start];
 while(queue.length){const a=queue.shift();edges.forEach(([u,v])=>{const b=u===a?v:v===a?u:null;if(b!==null&&distances[b]===Infinity){distances[b]=distances[a]+1;queue.push(b);}});}
 circles.forEach((c,i)=>{c.style.animationDelay=reduceMotion.matches?'0ms':(distances[i]*220)+'ms';c.classList.add('ripple-node');});
 document.getElementById('network-status').textContent='A ripple from '+nodes[start].label+' follows the illustrative links. This is a visual toy, not a financial model.';
 pulseTimer=setTimeout(clearPulse,1800);
});
document.getElementById('shuffle-network').addEventListener('click',()=>{clearPulse();nodes.forEach(n=>{const a=Math.random()*Math.PI*2,z=Math.random()*2-1,r=Math.sqrt(1-z*z)*125;n.x=Math.cos(a)*r;n.y=z*110;n.z=Math.sin(a)*r;});draw();document.getElementById('network-status').textContent='A new layout, the same connections.';});
document.getElementById('reset-network').addEventListener('click',clearPulse);
const garden=document.getElementById('idea-garden');
let planted=0;
function plant(x,y){
 if(planted>=18){garden.replaceChildren();planted=0;}
 const g=document.createElementNS(ns,'g');g.setAttribute('class','garden-flower');
 const color=['#17665b','#b46b3d','#786698'][planted%3];
 const add=(tag,attrs)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));g.append(e);};
 add('path',{d:'M'+x+' 190 Q'+(x-8)+' '+(y+30)+' '+x+' '+y,stroke:'#70927b',fill:'none','stroke-width':2});
 for(let a=0;a<6;a++){const angle=a*Math.PI/3;add('circle',{cx:x+Math.cos(angle)*10,cy:y+Math.sin(angle)*10,r:7,fill:color});}
 add('circle',{cx:x,cy:y,r:5,fill:'#f1d58c'});garden.append(g);planted++;
 document.getElementById('garden-status').textContent=planted+' little idea'+(planted===1?'':'s')+' planted.';
}
garden.addEventListener('click',e=>{const m=garden.getScreenCTM();if(!m)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());plant(Math.max(22,Math.min(418,p.x)),Math.max(25,Math.min(155,p.y)));});
garden.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();plant(30+Math.random()*380,30+Math.random()*120);}});
document.getElementById('clear-garden').addEventListener('click',()=>{garden.replaceChildren();planted=0;document.getElementById('garden-status').textContent='A fresh page. Plant another idea.';});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearPulse();});
})();