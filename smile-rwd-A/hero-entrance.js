// Start once, after image decoding and the shared font-ready gate.
(async()=>{
 const hero=document.querySelector('.photo-hero-a');
 if(!hero||!matchMedia('(min-width:1024px)').matches)return;
 const image=hero.querySelector('.photo-hero-media img');
 hero.classList.add('hero-entrance-pending');
 try{
  const photoReady=image.decode?image.decode().catch(()=>{}):image.complete?Promise.resolve():new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true});});
  const fontsReady=window.smileFontsReady||(document.fonts?document.fonts.ready:Promise.resolve());
  await Promise.all([photoReady,fontsReady]);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{hero.classList.remove('hero-entrance-pending');hero.classList.add('hero-entrance-playing');}));
 }catch(error){hero.classList.remove('hero-entrance-pending');}
})();
