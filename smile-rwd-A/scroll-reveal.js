// Reveal selected editorial content once as it enters the viewport.
(() => {
 function setup(){
  if(!('IntersectionObserver' in window)||typeof Element.prototype.animate!=='function')return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const targets=new Map();
  document.querySelectorAll('.chapter-list h2[data-type="chapter"]').forEach(heading=>{
   targets.set(heading,0);
   const intro=heading.nextElementSibling;if(intro)targets.set(intro,80);
  });
  document.querySelectorAll('#section-daily-care .care-diet-card').forEach((card,i)=>targets.set(card,i*100));
  document.querySelectorAll('#section-daily-care .care-brushing ol>li').forEach((step,i)=>targets.set(step,i*100));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    observer.unobserve(entry.target);
    entry.target.animate([
     {opacity:0,transform:'translateY(14px)'},
     {opacity:1,transform:'translateY(0)'}
    ],{duration:420,delay:targets.get(entry.target)||0,easing:'cubic-bezier(.2,.65,.3,1)',fill:'backwards'});
   }
  },{threshold:.12,rootMargin:'0px 0px -24px 0px'});
  targets.forEach((delay,target)=>observer.observe(target));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
