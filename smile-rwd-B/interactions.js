function renderGrowthNumber(el,text){el.innerHTML=text.replace(/,/g,'<span class="stat-comma">,</span>');}
document.addEventListener('DOMContentLoaded',()=>{
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const toggle=document.getElementById('ch-button-toggle'),nav=document.getElementById('ch-nav-wrap'),mobile=matchMedia('(max-width:768px)');
 function menu(open,focus=false){nav.classList.toggle('opening',open);toggle.classList.toggle('active',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');document.documentElement.classList.toggle('menu-open',open);nav.inert=mobile.matches&&!open;if(focus)(open?nav.querySelector('a'):toggle).focus();}
 toggle.addEventListener('click',()=>menu(!nav.classList.contains('opening'),true));mobile.addEventListener('change',()=>menu(false));
 document.addEventListener('keydown',e=>{if(!nav.classList.contains('opening'))return;if(e.key==='Escape'){menu(false,true);return;}if(e.key==='Tab'){const a=[toggle,...nav.querySelectorAll('a[href]')],i=a.indexOf(document.activeElement);if(e.shiftKey&&i===0){e.preventDefault();a.at(-1).focus();}else if(!e.shiftKey&&i===a.length-1){e.preventDefault();toggle.focus();}}});
 nav.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{menu(false);const target=document.querySelector(a.getAttribute('href'));if(target){target.tabIndex=-1;target.focus({preventScroll:true});}}));menu(false);
 document.querySelector('[aria-label="捲動至內容"]').addEventListener('click',()=>document.getElementById('section-intro').scrollIntoView({behavior:reduced?'instant':'smooth'}));
 const url=new URL(location.href);url.hash='';
 document.getElementById('facebookShare').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url.href);
 document.getElementById('lineShare').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(url.href)+'&text='+encodeURIComponent(document.title);
 document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
 const top=document.getElementById('scroll-to-top-btn');top.setAttribute('aria-label','回到頁首');
 function progress(){top.style.opacity=scrollY>350?'1':'0';top.style.pointerEvents=scrollY>350?'auto':'none';top.tabIndex=scrollY>350?0:-1;}
 addEventListener('scroll',progress,{passive:true});addEventListener('resize',progress);progress();top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
 document.querySelectorAll('[data-flip-card]').forEach(card=>{
  card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-pressed','false');
  const faces=card.querySelectorAll('.backface-hidden'),title=faces[0].querySelector('h4').textContent.trim(),desc=faces[1].querySelector('p').textContent.trim();
  card.setAttribute('aria-label',title+'；點擊查看說明');faces[1].setAttribute('aria-hidden','true');
  function flip(){const active=card.getAttribute('aria-pressed')!=='true';card.setAttribute('aria-pressed',String(active));card.dataset.isFlipped=String(active);const inner=card.querySelector('.transform-style-3d');inner.style.transform=active?'rotateY(180deg)':'rotateY(0deg)';inner.style.webkitTransform=active?'rotateY(180deg)':'rotateY(0deg)';inner.classList.toggle('rotate-y-180',active);faces[0].setAttribute('aria-hidden',String(active));faces[1].setAttribute('aria-hidden',String(!active));card.setAttribute('aria-label',active?title+'：'+desc+'；點擊返回':title+'；點擊查看說明');}
  card.addEventListener('click',flip);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip();}});
 });
 const slides=[...document.querySelectorAll('[data-assessment-slide-desktop]')],badges=[...document.querySelectorAll('[data-assessment-badge-desktop]')],dots=[...document.querySelectorAll('[data-slide-dot]')];
 const status=document.createElement('p');status.className='carousel-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.style.cssText='position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0';document.querySelector('.assessment-carousel').append(status);let current=0;
 let assessmentTransitioning=false;
 function renderAssessment(index){
  current=index;
  [slides,badges].forEach(items=>items.forEach((el,i)=>{el.style.display=i===current?(items===badges?'inline-block':'block'):'none';el.setAttribute('aria-hidden',String(i!==current));}));
  dots.forEach((dot,i)=>{dot.style.backgroundColor=i===current?'#1e4d9d':'#cbd5e1';dot.style.width=i===current?'32px':'12px';dot.setAttribute('aria-current',String(i===current));dot.setAttribute('aria-label',badges[i].textContent);});
  status.textContent=(current+1)+' / '+slides.length+'　'+badges[current].textContent;
 }
 async function show(i){
  if(assessmentTransitioning)return;
  const next=(i+slides.length)%slides.length;
  if(next===current||typeof slides[current].animate!=='function'){renderAssessment(next);return;}
  assessmentTransitioning=true;
  const direction=i>current?1:-1;
  const outgoing=slides[current];
  const exit=outgoing.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX('+(-direction*100)+'px)'}],{duration:180,easing:'ease-in',fill:'forwards'});

  try{
   await exit.finished.catch(()=>{});
   renderAssessment(next);exit.cancel();
   const enter=slides[next].animate([{opacity:0,transform:'translateX('+(direction*120)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:440,easing:'cubic-bezier(.18,.75,.25,1)',fill:'both'});

   await enter.finished.catch(()=>{});enter.cancel();
  }finally{exit.cancel();assessmentTransitioning=false;}
 }

 dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
 document.querySelectorAll('[data-slide-prev]').forEach(b=>{b.setAttribute('aria-label','上一個評估主題');b.addEventListener('click',()=>show(current-1));});document.querySelectorAll('[data-slide-next]').forEach(b=>{b.setAttribute('aria-label','下一個評估主題');b.addEventListener('click',()=>show(current+1));});show(0);
 const swipeCard=document.querySelector('.assessment-card');
 let swipeStart=null;
 function assessmentSwipeDirection(dx,dy,elapsed){
  if(elapsed>1200||Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy)*1.4)return 0;
  return dx<0?1:-1;
 }
 swipeCard.addEventListener('touchstart',e=>{
  swipeStart=null;
  if(!matchMedia('(max-width:639px)').matches||e.touches.length!==1||e.target.closest('a,button,input,select,textarea'))return;
  const point=e.touches[0];swipeStart={x:point.clientX,y:point.clientY,time:performance.now()};
 },{passive:true});
 swipeCard.addEventListener('touchmove',e=>{if(e.touches.length!==1)swipeStart=null;},{passive:true});
 swipeCard.addEventListener('touchcancel',()=>{swipeStart=null;},{passive:true});
 swipeCard.addEventListener('touchend',e=>{
  const start=swipeStart;swipeStart=null;
  if(!start||e.changedTouches.length!==1||e.touches.length)return;
  const point=e.changedTouches[0],direction=assessmentSwipeDirection(point.clientX-start.x,point.clientY-start.y,performance.now()-start.time);
  if(direction)show(current+direction);
 },{passive:true});
 document.querySelectorAll('.table-scroll').forEach(region=>{const hint=document.createElement('p');hint.className='table-hint';hint.textContent='比較表可左右滑動，查看兩種矯正方式';region.before(hint);});
});

// Animate each statistic once when it becomes visible.
document.addEventListener('DOMContentLoaded',()=>{
 const stats=[...document.querySelectorAll('[data-stat-counter]')].filter(el=>!el.closest('.trend-card-adaptive'));
 function run(el){
  if(el.dataset.counted==='true')return;
  const target=Number(el.dataset.target),decimals=Number(el.dataset.decimals||0);
  if(!Number.isFinite(target))return;
  el.dataset.counted='true';
  let start;
  function format(value){return decimals?value.toFixed(decimals):Math.round(value).toLocaleString('en-US');}
  el.textContent=format(0);
  function frame(now){
   if(start===undefined)start=now;
   const progress=Math.min(Math.max((now-start)/1000,0),1);
   el.textContent=format(progress===1?target:target*(1-Math.pow(1-progress,3)));
   if(progress<1)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 }
 if(!('IntersectionObserver' in window)){stats.forEach(run);return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  observer.unobserve(entry.target);run(entry.target);
 }),{threshold:0.1});
 stats.forEach(el=>observer.observe(el));
});

// Accessible tabs retain a stable panel area when switching methods.
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-comparison-tabs]').forEach(root=>{
  const tabs=[...root.querySelectorAll('[role="tab"]')];
  const panels=[...root.querySelectorAll('[role="tabpanel"]')];
  function select(index,focus=false){
   tabs.forEach((tab,i)=>{const selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;panels[i].classList.toggle('is-inactive',!selected);panels[i].setAttribute('aria-hidden',String(!selected));panels[i].inert=!selected;panels[i].tabIndex=selected?0:-1;});
   if(focus)tabs[index].focus({preventScroll:true});
  }
  tabs.forEach((tab,index)=>{
   tab.addEventListener('click',()=>select(index));
   tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();select(next,true);});
  });
  select(0);
 });
});

// Show the historical baseline, then animate growth to the current value.
document.addEventListener('DOMContentLoaded',()=>{
 const groups=[];
 for(const key of ['expenditure','clinic']){
  const from=document.querySelector('[data-stat-counter="'+key+'-from"]');
  const to=document.querySelector('[data-stat-counter="'+key+'-to"]');
  if(!from||!to)continue;
  const oldRow=from.parentElement.parentElement,newRow=to.parentElement.parentElement;
  groups.push({from,to,oldRow,newRow,area:oldRow.parentElement});
 }
 function play(group){
  const {from,to,oldRow,newRow}=group;
  if(to.dataset.counted==='true')return;
  group.area.classList.remove('growth-pending');
  from.dataset.counted=to.dataset.counted='true';
  const baseline=Number(from.dataset.target),target=Number(to.dataset.target);
  const digits=Number(to.dataset.decimals||0),runningDigits=digits;
  function format(value,precision){return precision?value.toFixed(precision):Math.round(value).toLocaleString('en-US');}
  function animate(el,frames,options){if(el&&typeof el.animate==='function')el.animate(frames,options);}
  renderGrowthNumber(from,format(baseline,Number(from.dataset.decimals||0)));
  renderGrowthNumber(to,format(baseline,runningDigits));
  to.classList.add('growth-value');
  animate(oldRow,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,fill:'both',easing:'ease-out'});
  const arrow=oldRow.querySelector('svg');
  animate(arrow,[{opacity:0,transform:'translate(-8px,12px) scale(.65)'},{opacity:1,transform:'translate(3px,-5px) scale(1.12)',offset:.75},{opacity:1,transform:'translate(0,0) scale(1)'}],{duration:650,delay:250,fill:'both',easing:'ease-out'});
  animate(newRow,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,delay:550,fill:'both',easing:'ease-out'});
  let start;
  function frame(now){
   if(start===undefined)start=now;
   const elapsed=now-start-550;
   if(elapsed<0){requestAnimationFrame(frame);return;}
   const stepped=!Number.isInteger(baseline)&&digits===0;
   const duration=stepped?(target-Math.round(baseline))*300:1300;
   const progress=Math.min(elapsed/duration,1),eased=1-Math.pow(1-progress,3);
   const stepTime=elapsed;
   const value=stepped?Math.min(target,Math.round(baseline)+Math.floor(stepTime/300)):baseline+(target-baseline)*eased;
   renderGrowthNumber(to,progress===1?format(target,digits):format(value,runningDigits));
   if(progress<1)requestAnimationFrame(frame);

  }
  requestAnimationFrame(frame);
 }
 if(!('IntersectionObserver' in window)){groups.forEach(play);return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const height=entry.boundingClientRect.height;
  const viewport=entry.rootBounds?entry.rootBounds.height:innerHeight;
  const required=height>0?Math.min(.75,viewport*.5/height):.75;
  if(entry.intersectionRatio<required)return;
  const group=groups.find(item=>item.area===entry.target);
  if(group){observer.unobserve(entry.target);play(group);}
 }),{threshold:Array.from({length:16},(_,i)=>i/20),rootMargin:'0px 0px -40px 0px'});
 groups.forEach(group=>{group.area.classList.add('growth-pending');observer.observe(group.area);});
});





// A single path keeps the speech-bubble tail seamlessly connected at every width.
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('#section-daily-care .care-speech').forEach(title=>{
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');
  svg.classList.add('care-bubble-outline');svg.setAttribute('aria-hidden','true');svg.append(path);title.prepend(svg);
  function draw(){
   const box=title.getBoundingClientRect(),w=box.width,h=box.height,r=(h-2)/2,x=w*.32;
   title.parentElement.style.setProperty('--care-label-width',w+'px');
   svg.setAttribute('width',w);svg.setAttribute('height',h+24);svg.setAttribute('viewBox','0 0 '+w+' '+(h+24));
   path.setAttribute('d',`M ${r+1} 1 H ${w-r-1} Q ${w-1} 1 ${w-1} ${r+1} V ${h-r-1} Q ${w-1} ${h-1} ${w-r-1} ${h-1} H ${x+26} L ${x} ${h+21} V ${h-1} H ${r+1} Q 1 ${h-1} 1 ${h-r-1} V ${r+1} Q 1 1 ${r+1} 1 Z`);
   path.setAttribute('fill','white');path.setAttribute('stroke','#244fa0');path.setAttribute('stroke-width','2');path.setAttribute('stroke-linejoin','round');
  }
  if('ResizeObserver' in window)new ResizeObserver(draw).observe(title);
  addEventListener('resize',draw);if(document.fonts)document.fonts.ready.then(draw);draw();
 });
});

// Measure card three without showing it; apply its height only to desktop card two.
document.addEventListener('DOMContentLoaded',()=>{
 const card=document.querySelector('.assessment-card');if(!card)return;
 const third=card.querySelector('[data-assessment-slide-desktop="2"]');
 function measure(){
  if(!matchMedia('(min-width:1024px)').matches){card.style.removeProperty('--desktop-assessment-third-height');return;}
  const style=getComputedStyle(card),copy=third.cloneNode(true);
  const width=card.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  copy.setAttribute('aria-hidden','true');copy.inert=true;
  copy.style.cssText='display:block!important;position:absolute!important;visibility:hidden!important;pointer-events:none;width:'+width+'px;height:auto;min-height:0!important;left:0;top:0;';
  card.append(copy);const height=copy.getBoundingClientRect().height;copy.remove();
  card.style.setProperty('--desktop-assessment-third-height',Math.ceil(height)+'px');
 }
 let pending=false;
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;measure();});}
 addEventListener('resize',schedule);card.querySelectorAll('img').forEach(img=>img.addEventListener('load',schedule));
 if(document.fonts)document.fonts.ready.then(schedule);schedule();
});

// Pop each care speech bubble once when scrolling into view.
document.addEventListener('DOMContentLoaded',()=>{
 const bubbles=[...document.querySelectorAll('#section-daily-care .care-speech')];
 function pop(bubble){
  if(bubble.dataset.popped==='true')return;
  bubble.dataset.popped='true';
  if(typeof bubble.animate!=='function')return;
  bubble.animate([
   {opacity:0,transform:'translateY(16px) scale(.88)'},
   {opacity:1,transform:'translateY(-3px) scale(1.04)',offset:.65},
   {opacity:1,transform:'translateY(0) scale(1)'}
  ],{duration:650,easing:'cubic-bezier(.2,.7,.3,1)'});
 }
 if(!('IntersectionObserver' in window)){bubbles.forEach(pop);return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting&&entry.intersectionRatio>=.5){observer.unobserve(entry.target);pop(entry.target);}
 }),{threshold:.5,rootMargin:'0px 0px -32px 0px'});
 bubbles.forEach(bubble=>observer.observe(bubble));
});

// Keep the header state correct on scroll and when restoring a page position.
document.addEventListener('DOMContentLoaded',()=>{
 const header=document.getElementById('ch-header');if(!header)return;
 function updateHeader(){header.classList.toggle('is-scrolled',window.scrollY>24);}
 window.addEventListener('scroll',updateHeader,{passive:true});
 window.addEventListener('pageshow',updateHeader);
 updateHeader();
});
