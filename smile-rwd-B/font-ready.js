// Wait for the shared sans-serif typography and B's independent Ming headline.
(()=>{
 let done=false;
 function reveal(){if(done)return;done=true;document.documentElement.classList.remove('fonts-pending');if(window.resolveSmileFonts)window.resolveSmileFonts();}
 const fallback=setTimeout(reveal,4000);
 if(!document.fonts){clearTimeout(fallback);reveal();return;}
 void document.body.offsetHeight;
 const subtitle=document.fonts.load('600 24px "Noto Sans TC"','打造完美笑容的安心法則');
 const heading=matchMedia('(min-width:1024px)').matches?document.fonts.load('900 48px "Noto Serif TC"','矯正前，先看懂代價'):document.fonts.load('900 48px "Noto Sans TC"','矯正前，先看懂代價');
 Promise.all([document.fonts.ready,subtitle,heading]).then(()=>{clearTimeout(fallback);requestAnimationFrame(reveal);}).catch(reveal);
})();
