// Reveal once the fonts used by the rendered page have settled.
(()=>{
 let done=false;
 function reveal(){if(done)return;done=true;document.documentElement.classList.remove('fonts-pending');if(window.resolveSmileFonts)window.resolveSmileFonts();}
 const fallback=setTimeout(reveal,4000);
 if(!document.fonts){clearTimeout(fallback);reveal();return;}
 // Force style resolution so FontFaceSet.ready includes visible font requests.
 void document.body.offsetHeight;
 Promise.all([document.fonts.ready,document.fonts.load('900 48px "Noto Sans TC"','矯正前，先看懂代價'),document.fonts.load('800 24px "Noto Sans TC"','打造完美笑容的安心法則')]).then(()=>{clearTimeout(fallback);requestAnimationFrame(reveal);}).catch(reveal);
})();
