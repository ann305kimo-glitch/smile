// One-time scroll entrances for the selected editorial blocks.
(() => {
 function setup(){
  if(!('IntersectionObserver' in window)||typeof Element.prototype.animate!=='function')return;
  const targets=new Map();
  document.querySelectorAll('.chapter-list h2[data-type="chapter"]').forEach(heading=>{
   targets.set(heading,0);
   if(heading.nextElementSibling)targets.set(heading.nextElementSibling,140);
  });
  document.querySelectorAll('#section-daily-care .care-diet-card').forEach((card,i)=>targets.set(card,i*150));
  document.querySelectorAll('#section-daily-care .care-brushing ol>li').forEach((step,i)=>targets.set(step,i*150));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting||entry.intersectionRatio<.2)continue;
    observer.unobserve(entry.target);
    entry.target.animate([
     {opacity:0,transform:'translateY(26px)'},
     {opacity:1,transform:'translateY(0)'}
    ],{duration:680,delay:targets.get(entry.target)||0,easing:'cubic-bezier(.16,.7,.3,1)',fill:'backwards'});
    entry.target.dataset.scrollRevealed='true';
   }
  },{threshold:[0,.2],rootMargin:'0px 0px -48px 0px'});
  targets.forEach((delay,target)=>observer.observe(target));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
