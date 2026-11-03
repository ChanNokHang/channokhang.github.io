(() => {
'use strict';
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
})();