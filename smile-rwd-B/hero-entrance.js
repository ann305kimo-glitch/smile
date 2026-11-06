// Play the B cover once, after the image and headline font have had time to load.
(async()=>{
 const hero=document.querySelector('.photo-hero-b');
 if(!hero)return;
 const image=hero.querySelector('.photo-hero-media img');hero.classList.add('hero-entrance-pending');
 try{
  const photoReady=image.decode?image.decode().catch(()=>{}):image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});
  const fontReady=window.smileFontsReady||(document.fonts?document.fonts.ready:Promise.resolve());
  await Promise.all([photoReady,fontReady]);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{hero.classList.remove('hero-entrance-pending');hero.classList.add('hero-entrance-playing');}));
 }catch(error){hero.classList.remove('hero-entrance-pending');}
})();

// Keep the portrait flush with the solid B header as navigation height changes.
(() => {
 function align(){
  const header=document.getElementById('ch-header'),hero=document.querySelector('.photo-hero-b');
  if(!header||!hero)return;
  const update=()=>hero.style.setProperty('--b-header-height',header.getBoundingClientRect().height+'px');
  update();window.addEventListener('resize',update,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(update).observe(header);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',align,{once:true});else align();
})();
