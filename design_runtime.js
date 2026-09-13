// Portfolio interaction snapshot. Requires the full scaffold; see IMPLEMENTATION.md.
(() => {
 'use strict';
 const root = document.documentElement;
 const header = document.querySelector('.site-header');
 const probe = document.querySelector('.viewport-probe');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
 const clamp = (n, a=0, b=1) => Math.max(a, Math.min(b, n));
 const mix = (a,b,t) => a+(b-a)*t;
 const smooth = t => { t=clamp(t); return t*t*(3-2*t); };
 const nav = [...document.querySelectorAll('.nav-list a')];
 const sections = [...document.querySelectorAll('main > section[id]')];
 let motionFailed = false;
 let enabled = false, ready = false, measuring = false, frame = 0, dirty = true;
 let lenis = null, headerHeight = 0, lastScroll = -1, resizeTimer = 0, ticket = 0;
 let measureTools = () => {};
 const stories = [...document.querySelectorAll('[data-story]')].map(track => ({
   track, panel:track.querySelector('.story-panel'), stack:track.querySelector('.stage-stack'),
   stages:[...track.querySelectorAll('[data-stage]')], buttons:[...track.querySelectorAll('[data-stage-button]')],
   count:track.querySelector('.stage-count'), line:track.querySelector('.progress-line'),
   marker:track.querySelector('.progress-marker'), pinned:false, active:-1,
   start:0, travel:0, step:0, panelHeight:0, progress:0, phase:0
 }));
 const storyByName = new Map(stories.map(s=>[s.track.dataset.story,s]));
 const metricGroups=stories.flatMap(story=>story.stages.map(stage=>({
   story,stage,cards:[...stage.querySelectorAll('.kpi-card')],active:-1
 }))).filter(group=>group.cards.length);
 const arts = [...document.querySelectorAll('[data-art]')].map(art => ({
   element:art, owner:art.closest('[data-scene-scope]'), story:storyByName.get(art.dataset.art),
   visible:true, x:0, y:0,
   units:[...art.querySelectorAll('.scroll-unit')].map((node,index)=>({
     node, pointer:node.querySelector('.pointer-unit'), index,
     depth:Number(node.querySelector('.pointer-unit').dataset.depth),
     poses:node.dataset.poses.split(';').map(p=>p.split(',').map(Number))
   }))
 }));
 // A single accessible text node per word; the duplicate is a decorative color layer.
 const headings = [...document.querySelectorAll('.hero-word, .section h2:not(.sr-only), .stage h3')].map(element => {
   const words = element.textContent.trim().split(/\s+/);
   const fragment = document.createDocumentFragment();
   const fills=[];
   words.forEach((word,index) => {
     if(index) fragment.append(document.createTextNode(' '));
     const span=document.createElement('span');span.className='reveal-word';
     span.append(document.createTextNode(word));
     const fill=document.createElement('span');fill.className='word-fill';
     fill.setAttribute('aria-hidden','true');fill.textContent=word;span.append(fill);
     fragment.append(span);fills.push(fill);
   });
   element.replaceChildren(fragment);
   return {element,fills,stage:element.closest('[data-stage]')};
 });
 document.getElementById('year').textContent=new Date().getFullYear();

 function requestPaint(){dirty=true;if(!frame&&!document.hidden) frame=requestAnimationFrame(tick);}
 function tick(time){
   frame=0;if(document.hidden)return;
   if(lenis)lenis.raf(time);
   if(dirty||lastScroll!==scrollY){dirty=false;lastScroll=scrollY;paint();}
   if(enabled&&lenis&&!frame)frame=requestAnimationFrame(tick);
 }
 function focusTarget(target){
   const added=!target.hasAttribute('tabindex')&&!target.matches('a,button,summary,input,select,textarea');
   if(added)target.setAttribute('tabindex','-1');
   target.focus({preventScroll:true});
   if(added)target.addEventListener('blur',()=>target.removeAttribute('tabindex'),{once:true});
 }
 function currentAnchor(){
   const line=headerHeight+Math.max(0,innerHeight-headerHeight)*.36;
   const pinned=stories.find(s=>s.pinned&&scrollY>=s.start&&scrollY<=s.start+s.travel);
   if(pinned){
     const stage=pinned.stages[Math.max(0,pinned.active)];
     return {element:stage,top:stage.getBoundingClientRect().top,story:pinned,index:Math.max(0,pinned.active),fraction:(scrollY-pinned.start)/pinned.step};
   }
   let best=null, distance=Infinity;
   const candidates=document.querySelectorAll('[data-stage], [data-reading-anchor], .hero-identity, .contact-intro, .site-footer');
   candidates.forEach(element=>{
     if(element.hidden||element.closest('[hidden]'))return;
     const r=element.getBoundingClientRect();
     if(r.bottom<=headerHeight||r.top>=innerHeight)return;
     const d=r.top<=line&&r.bottom>=line?0:Math.abs(r.top-line);
     if(d<distance){distance=d;best={element,top:r.top};}
   });
   if(best){
     const story=stories.find(s=>s.stages.includes(best.element));
     if(story){best.story=story;best.index=story.stages.indexOf(best.element);}
   }
   return best;
 }
 function showStage(story,index){
   index=clamp(index,0,story.stages.length-1);
   if(story.active===index&&story.stages.every((stage,i)=>stage.hidden===(i!==index)))return;
   story.stages.forEach((stage,i)=>{stage.hidden=i!==index;});
   story.buttons.forEach((button,i)=>{
     if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
   });
   story.count.textContent=String(index+1).padStart(2,'0')+' / '+String(story.stages.length).padStart(2,'0');
   story.active=index;
 }
 function unpin(story){
   story.pinned=false;story.active=-1;story.track.classList.remove('is-pinned','is-measuring');
   story.track.style.removeProperty('height');story.track.style.removeProperty('--panel-height');
   story.stack.style.removeProperty('--stage-height');
   story.stages.forEach(stage=>{stage.hidden=false;stage.style.removeProperty('opacity');stage.style.removeProperty('transform');});
   story.buttons.forEach(button=>button.removeAttribute('aria-current'));
 }
 function layout(restore=true){
   if(measuring)return;measuring=true;
   const anchor=restore?currentAnchor():null;
   const oldScroll=scrollY;
   const focusedStory=stories.find(story=>story.buttons.includes(document.activeElement));
   const focusedIndex=focusedStory?focusedStory.buttons.indexOf(document.activeElement):-1;
   headerHeight=header.getBoundingClientRect().height;
   root.style.setProperty('--header-height',headerHeight+'px');
   measureTools();
   const screenHeight=Math.min(innerHeight,probe.getBoundingClientRect().height||innerHeight);
   const panelHeight=Math.max(0,Math.floor(screenHeight-headerHeight));
   stories.forEach(story=>{
     unpin(story);
     if(!enabled||!CSS.supports('position','sticky')||panelHeight<360)return;
     story.track.classList.add('is-measuring');
     let maxPanel=0,maxStage=0;
     story.stages.forEach((stage,index)=>{
       story.stages.forEach((node,i)=>{node.hidden=i!==index;});
       maxStage=Math.max(maxStage,stage.getBoundingClientRect().height);
       maxPanel=Math.max(maxPanel,story.panel.getBoundingClientRect().height);
     });
     story.track.classList.remove('is-measuring');
     if(maxPanel>panelHeight-2){unpin(story);return;}
     story.pinned=true;story.panelHeight=panelHeight;
     story.step=panelHeight*(innerWidth < 768 ? 0.7 : 1);
     story.travel=story.step*story.stages.length;
     story.track.style.height=(panelHeight+story.travel)+'px';
     story.track.style.setProperty('--panel-height',panelHeight+'px');
     story.stack.style.setProperty('--stage-height',Math.ceil(maxStage)+'px');
     story.track.classList.add('is-pinned');
     showStage(story,anchor?.story===story?anchor.index:0);
   });
   stories.forEach(story=>{story.start=story.track.getBoundingClientRect().top+scrollY-headerHeight;});
   let destination=oldScroll;
   if(anchor){
     if(anchor.story?.pinned){
       const fraction=anchor.fraction??(anchor.index+.4);
       destination=anchor.story.start+fraction*anchor.story.step;
     }else if(anchor.element.isConnected&&!anchor.element.hidden){
       destination=oldScroll+anchor.element.getBoundingClientRect().top-anchor.top;
     }
   }
   destination=clamp(destination,0,Math.max(0,root.scrollHeight-innerHeight));
   if(lenis){lenis.resize();lenis.scrollTo(destination,{immediate:true});}
   else if(Math.abs(scrollY-destination)>.5)window.scrollTo({top:destination,behavior:'instant'});
   measuring=false;
   if(focusedStory&&!focusedStory.pinned)focusTarget(focusedStory.stages[focusedIndex].querySelector('h3'));
   requestPaint();
 }
 function progressFor(story){
   if(!story.pinned)return 0;
   return clamp((scrollY-story.start)/Math.max(1,story.travel));
 }
 function paint(){
   // Collect geometry before visual writes; wrapper offsets remain native document coordinates.
   const readLine=headerHeight+(innerHeight-headerHeight)*.36;
   const sectionRects=sections.map(element=>({element,rect:element.getBoundingClientRect()}));
   const headingRects=headings.map(heading=>({heading,rect:heading.element.getBoundingClientRect()}));
   const artRects=arts.filter(art=>art.visible).map(art=>({art,rect:art.element.getBoundingClientRect(),owner:art.owner.getBoundingClientRect()}));
   const barWidths=stories.map(story=>story.line.getBoundingClientRect().width);
   const metricReads=metricGroups.map(group=>({group,rects:enabled&&!group.story.pinned?group.cards.map(card=>card.getBoundingClientRect()):[]}));
   let active='home';
   sectionRects.forEach(({element,rect})=>{if(rect.top<=readLine)active=element.id;});
   if(scrollY+innerHeight>=root.scrollHeight-4)active='links';
   nav.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
   stories.forEach((story,k)=>{
     if(!story.pinned)return;
     story.progress=progressFor(story);
     const position=story.progress*story.stages.length;
     const index=Math.min(story.stages.length-1,Math.floor(position));
     const local=clamp(position-index);
     showStage(story,index);
     const incoming=index===0?1:smooth(local/.14);
     const outgoing=index===story.stages.length-1?1:1-smooth((local-.86)/.14);
     const visibility=Math.min(incoming,outgoing);
     const stage=story.stages[index];
     stage.style.opacity=String(.8+.2*visibility);
     stage.style.transform='translateY('+((1-incoming)*12-(1-outgoing)*12).toFixed(2)+'px)';
     story.phase=index+(index<story.stages.length-1?smooth((local-.78)/.22):0);
     story.local=local;
     story.marker.style.transform='translateX('+Math.max(0,barWidths[k]-8)*story.progress+'px)';
   });
   metricReads.forEach(({group,rects})=>{
     let active=-1;
     if(enabled&&!group.stage.hidden){
       if(group.story.pinned){
         const progress=clamp((group.story.local-.14)/.72);
         active=Math.min(group.cards.length-1,Math.floor(progress*group.cards.length));
       }else{
         let distance=Infinity;
         rects.forEach((rect,index)=>{
           if(rect.bottom<=headerHeight||rect.top>=innerHeight)return;
           const d=Math.abs(rect.top+rect.height*.5-readLine);
           if(d<distance){distance=d;active=index;}
         });
       }
     }
     if(active!==group.active){
       group.active=active;
       group.cards.forEach((card,index)=>{
         if(index===active)card.dataset.emphasis='true';else card.removeAttribute('data-emphasis');
       });
     }
   });
   headingRects.forEach(({heading,rect})=>{
     if(heading.element.closest('[hidden]'))return;
     let progress=clamp((innerHeight-rect.top)/(Math.max(1,innerHeight-headerHeight)*.65));
     const story=heading.stage&&stories.find(s=>s.stages.includes(heading.stage));
     if(story?.pinned)progress=clamp((story.local+.05)/.5);
     heading.fills.forEach((fill,index)=>{
       const p=enabled?clamp(progress*1.5-index/Math.max(1,heading.fills.length)*.35):1;
       fill.style.opacity=String(p);
     });
   });
   artRects.forEach(({art,rect,owner})=>{
     let progress=clamp((innerHeight-owner.top)/(Math.max(1,owner.height+innerHeight)));
     let phase=art.story?.pinned?art.story.phase:null;
     if(phase===null&&art.story){
       const starts=art.story.stages.map(s=>s.getBoundingClientRect().top);
       let i=0;starts.forEach((top,index)=>{if(top<=readLine)i=index;});
       const span=i<starts.length-1?Math.max(1,starts[i+1]-starts[i]):1;
       phase=i<starts.length-1?i+clamp((readLine-starts[i])/span):i;
     }
     art.units.forEach(unit=>{
       const max=unit.poses.length-1;
       const position=clamp(phase===null?progress*max:phase,0,max);
       const index=Math.min(max,Math.floor(position));
       const next=Math.min(max,index+1);
       const t=smooth(clamp((position-index)*1.15-unit.index*.025));
       const a=unit.poses[index],b=unit.poses[next];
       unit.node.style.transform=enabled?'translate('+mix(a[0],b[0],t).toFixed(2)+'px,'+mix(a[1],b[1],t).toFixed(2)+'px) scale('+mix(a[2],b[2],t).toFixed(3)+')':'';
       unit.pointer.style.transform=enabled&&finePointer.matches?'translate('+(art.x*8*unit.depth).toFixed(2)+'px,'+(art.y*8*unit.depth).toFixed(2)+'px)':'';
     });
   });
 }
 function scrollToPosition(top,onComplete,instant=false){
   if(lenis&&enabled&&!instant){
     lenis.scrollTo(top,{duration:.36,lerp:0,easing:t=>1-Math.pow(1-t,3),lock:false,onComplete});
   }else{window.scrollTo({top,behavior:'instant'});requestPaint();if(onComplete)onComplete();}
 }
 function navigate(target,{push=true,instant=false,focus=true}={}){
   if(!target)return;
   const ownTicket=++ticket;
   const stage=target.closest('[data-stage]');
   const story=stage&&stories.find(s=>s.stages.includes(stage));
   let top=target.getBoundingClientRect().top+scrollY-headerHeight-16;
   if(story?.pinned)top=story.start+(story.stages.indexOf(stage)+.4)*story.step;
   if(target.id==='home'||target.id==='main')top=0;
   if(push&&target.id){
     const hash='#'+encodeURIComponent(target.id);
     if(location.hash!==hash){
       try{history.pushState(null,'',hash);}
       catch{/* Scrolling remains available when local-file history is restricted. */}
     }
   }
   scrollToPosition(clamp(top,0,Math.max(0,root.scrollHeight-innerHeight)),()=>{
     if(ownTicket!==ticket)return;
     paint();if(focus)focusTarget(target);
   },instant);
 }
 function applyMotion(restore=true){
   enabled=!reduced.matches&&!motionFailed;
   root.dataset.motion=enabled?'on':'off';
   if(!enabled){ document.getAnimations?.().forEach(animation=>animation.cancel()); }
   if(!enabled&&lenis){lenis.destroy();lenis=null;}
   if(enabled&&!lenis&&typeof window.Lenis==='function'){
     lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,wheelMultiplier:1,touchMultiplier:1,autoRaf:false,autoResize:true,anchors:false,respectReducedMotion:true});
     lenis.on('scroll',requestPaint);
   }
   layout(restore);requestPaint();
 }
 document.addEventListener('click',event=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target.closest('a[href^="#"]');if(!link)return;
   const target=fragmentTarget(link.hash);if(!target)return;
   event.preventDefault();navigate(target);
 });
 stories.forEach(story=>story.buttons.forEach((button,index)=>button.addEventListener('click',()=>{
   if(!story.pinned)return;
   const ownTicket=++ticket;
   scrollToPosition(story.start+(index+.4)*story.step,()=>{if(ownTicket===ticket){paint();button.focus({preventScroll:true});}});
 })));
 // Keyboard scroll stays native. Stop an old wheel tween before the browser handles a key.
 document.addEventListener('keydown',event=>{
   if(!['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))return;
   if(event.target.closest('button,a,summary,input,textarea,select,[contenteditable="true"]'))return;
   ticket++;
   if(lenis)lenis.scrollTo(scrollY,{immediate:true});
 });
 window.addEventListener('wheel',()=>{ticket++;},{passive:true});
 window.addEventListener('touchstart',()=>{ticket++;if(lenis)lenis.scrollTo(scrollY,{immediate:true});},{passive:true});
 window.addEventListener('scroll',requestPaint,{passive:true});
 function scheduleLayout(){
   if(!ready)return;clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>layout(true),120);
 }
 window.addEventListener('resize',scheduleLayout,{passive:true});
 window.addEventListener('orientationchange',scheduleLayout,{passive:true});
 if(typeof ResizeObserver==='function')new ResizeObserver(()=>{
   if(ready&&Math.abs(header.getBoundingClientRect().height-headerHeight)>.5)scheduleLayout();
 }).observe(header);
 arts.forEach(art=>{
   art.owner.addEventListener('pointermove',event=>{
     if(!enabled||!finePointer.matches||event.pointerType==='touch')return;
     const rect=art.element.getBoundingClientRect();
     art.x=clamp((event.clientX-rect.left)/Math.max(1,rect.width)*2-1,-1,1);
     art.y=clamp((event.clientY-rect.top)/Math.max(1,rect.height)*2-1,-1,1);requestPaint();
   },{passive:true});
   art.owner.addEventListener('pointerleave',()=>{art.x=art.y=0;requestPaint();});
 });
 if(typeof IntersectionObserver==='function'){
   const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{
     const art=arts.find(item=>item.element===entry.target);if(!art)return;
     art.visible=entry.isIntersecting;art.element.dataset.visible=String(entry.isIntersecting);requestPaint();
   }),{rootMargin:'120px'});
   arts.forEach(art=>visibility.observe(art.element));
 }
 document.addEventListener('visibilitychange',()=>{
   root.dataset.suspended=String(document.hidden);
   if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else requestPaint();
 });
 reduced.addEventListener('change',()=>{if(ready)applyMotion(true);});
 finePointer.addEventListener('change',()=>{arts.forEach(art=>{art.x=art.y=0;});requestPaint();});
 function fragmentTarget(hash){
   try{return document.getElementById(decodeURIComponent(hash.slice(1)));}
   catch{return null;}
 }
 function followHash(){
   if(!ready||!location.hash)return;
   const target=fragmentTarget(location.hash);
   if(target)navigate(target,{push:false,instant:true,focus:false});
 }
 window.addEventListener('popstate',followHash);
 window.addEventListener('hashchange',followHash);
 const toolkit=document.querySelector('.skills-explorer');
 if(toolkit){
   const filters=[...toolkit.querySelectorAll('[data-skill-filter]')];
   const groups=[...toolkit.querySelectorAll('[data-skill-group]')];
   const status=toolkit.querySelector('.skill-status');
   const results=toolkit.querySelector('.skills-results');
   let toolAnimations=[], selectedTools=null;
   // Reserve the tallest group at this width without stacking content or fixing its height.
   measureTools=()=>{
     const hidden=groups.map(group=>group.hidden);
     let tallest=0;
     try{
       groups.forEach(group=>{
         groups.forEach(item=>{item.hidden=item!==group;});
         tallest=Math.max(tallest,group.getBoundingClientRect().height);
       });
     }finally{
       groups.forEach((group,index)=>{group.hidden=hidden[index];});
     }
     results.style.setProperty('--skills-height',Math.ceil(tallest)+'px');
   };
   function selectTools(key,animate=false){
     const group=groups.find(item=>item.dataset.skillGroup===key);
     if(!group||group===selectedTools)return;
     selectedTools=group;
     toolAnimations.forEach(animation=>animation.cancel());toolAnimations=[];
     groups.forEach(item=>{item.hidden=item!==group;});
     filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.skillFilter===key)));
     const tiles=[...group.querySelectorAll('.skill-tile')];
     status.textContent=group.querySelector('h4').textContent+' / '+tiles.length+' tools';
     if(animate){
       requestPaint();
       if(enabled&&!reduced.matches){
         const style=getComputedStyle(root);
         const duration=parseFloat(style.getPropertyValue('--control'))||200;
         const stagger=parseFloat(style.getPropertyValue('--stagger'))||40;
         tiles.forEach((tile,index)=>{
           if(typeof tile.animate==='function')toolAnimations.push(tile.animate(
             [{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
             {duration,delay:Math.min(index,5)*stagger,easing:'ease-out',fill:'backwards'}
           ));
         });
       }
     }
   }
   toolkit.dataset.enhanced='true';
   toolkit.querySelector('.skill-filters').hidden=false;status.hidden=false;
   filters.forEach(button=>button.addEventListener('click',()=>selectTools(button.dataset.skillFilter,true)));
   reduced.addEventListener('change',()=>{if(reduced.matches)toolAnimations.forEach(animation=>animation.cancel());});
   selectTools('frontend');
   measureTools();
 }
 const fontReady=document.fonts?document.fonts.ready:Promise.resolve();
 fontReady.then(()=>{
   ready=true;applyMotion(false);followHash();
 }).catch(()=>{ready=true;motionFailed=true;applyMotion(false);});
})();
