(() => {
'use strict';
function revealAnchor(){const id=location.hash.slice(1);const target=document.getElementById(id);if(target && target.tagName==='DETAILS')target.open=true;}
window.addEventListener('hashchange',revealAnchor);revealAnchor();
const topics = {
 risk: ['How are markets connected?', 'Financial networks offer a way to examine interconnectedness and how risk may spread among stocks.'],
 graphs: ['Making relationships visible.', 'I use Granger causality and functional structural equation models (FSEM) to examine relationships among stocks.'],
 ml: ['Learning from financial data.', 'My interests include machine learning applications in finance and data-driven approaches to market analysis.']
};
document.querySelectorAll('[data-topic]').forEach(button => {
 button.addEventListener('click', () => {
  document.querySelectorAll('[data-topic]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const [heading, copy] = topics[button.dataset.topic];
  const panel = document.getElementById('topic-copy');
  panel.querySelector('h3').textContent = heading;
  panel.querySelector('p').textContent = copy;
 });
});
const svg = document.getElementById('play-network');
if (!svg) return;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ns = 'http://www.w3.org/2000/svg';
const initial = [[65,100],[145,45],[285,65],[355,155],[290,245],[135,250],[205,150]];
const nodes = initial.map(([x,y],i) => ({x,y,label:String.fromCharCode(65+i)}));
const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[1,4]];
let selected = null;
const make = (tag,attrs) => { const e=document.createElementNS(ns,tag); Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v)); svg.append(e); return e; };
const lines=edges.map(() => make('line',{'aria-hidden':'true'}));
const circles=nodes.map((n,i) => make('circle',{r:14,tabindex:0,role:'button','aria-label':'Node '+n.label+'. Select to highlight connections; arrow keys move the node.'}));
const labels=nodes.map(n => {const e=make('text',{'text-anchor':'middle','aria-hidden':'true'});e.textContent=n.label;return e;});
const controls=nodes.map((n,i) => { const b=document.createElement('button');b.type='button';b.textContent=n.label;b.setAttribute('aria-label','Highlight node '+n.label);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(i));document.querySelector('.node-controls').append(b);return b; });
function draw(){
 edges.forEach(([a,b],i) => { const e=lines[i]; e.setAttribute('x1',nodes[a].x);e.setAttribute('y1',nodes[a].y);e.setAttribute('x2',nodes[b].x);e.setAttribute('y2',nodes[b].y);e.classList.toggle('active',selected===a || selected===b); });
 nodes.forEach((n,i)=>{circles[i].setAttribute('cx',n.x);circles[i].setAttribute('cy',n.y);circles[i].classList.toggle('selected',selected===i);circles[i].setAttribute('aria-pressed',String(selected===i));labels[i].setAttribute('x',n.x);labels[i].setAttribute('y',n.y-22);controls[i].setAttribute('aria-pressed',String(selected===i));});
}
function select(i){selected=i;const count=edges.filter(([a,b])=>a===i || b===i).length;document.getElementById('network-status').textContent='Node '+nodes[i].label+' · '+count+' direct connections in this illustrative network.';draw();}
function move(i,x,y){nodes[i].x=Math.max(25,Math.min(395,x));nodes[i].y=Math.max(35,Math.min(265,y));draw();}
circles.forEach((c,i)=>{
 let pointer=null;
 c.addEventListener('click',()=>select(i));
 c.addEventListener('keydown',e=>{
  if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i);return;}
  const delta={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];
  if(delta){e.preventDefault();move(i,nodes[i].x+delta[0],nodes[i].y+delta[1]);}
 });
 c.addEventListener('pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;c.setPointerCapture(pointer);select(i);});
 c.addEventListener('pointermove',e=>{
  if(pointer!==e.pointerId)return;
  const matrix=svg.getScreenCTM();if(!matrix)return;
  const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());move(i,p.x,p.y);
 });
 const end=()=>{pointer=null;};
 c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);c.addEventListener('lostpointercapture',end);
});
document.getElementById('reset-network').addEventListener('click',()=>{nodes.forEach((n,i)=>{[n.x,n.y]=initial[i];});selected=null;document.getElementById('network-status').textContent='Layout reset. Select a node to explore its connections.';draw();});
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
document.getElementById('shuffle-network').addEventListener('click',()=>{clearPulse();nodes.forEach((n,i)=>{const angle=(i/nodes.length)*Math.PI*2+Math.random()*.5;move(i,210+Math.cos(angle)*140,150+Math.sin(angle)*100);});document.getElementById('network-status').textContent='A new layout, the same connections.';});
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