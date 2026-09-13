// Portfolio interaction snapshot. Requires the full scaffold; see IMPLEMENTATION.md.
(() => {
 'use strict';
 const root = document.documentElement;
 const header = document.querySelector('.site-header');
 const probe = document.querySelector('.viewport-probe');
 const compact = matchMedia('(max-width:767px)');
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
 let layoutSize = null;
 const stableHeight = () => probe.getBoundingClientRect().height || innerHeight;
 const visibleHeight = () => {
   const viewport=window.visualViewport;
   return viewport&&Math.abs(viewport.scale-1)<.01?Math.min(innerHeight,viewport.height):innerHeight;
 };

 // Track this page's resources without touching animations owned by other code.
 const listenerRemovers=[], animations=new Set(), heroMotion=new Set(), skillsMotion=new Set();
 let headerObserver=null, sceneObserver=null, pageSuspended=false, disposed=false, booted=false, heroEntered=false;
 const motionStyle=getComputedStyle(root);
 const motionValue=(name,fallback)=>parseFloat(motionStyle.getPropertyValue(name))||fallback;
 const motion={
   enter:motionValue('--enter',320),control:motionValue('--control',200),stagger:motionValue('--stagger',40),
   entryOffset:motionValue('--entry-offset',12),skillsOffset:motionValue('--skills-offset',8),
   stateOffset:motionValue('--state-offset',8),
   easeOut:motionStyle.getPropertyValue('--ease-out').trim()||'cubic-bezier(.16,1,.3,1)'
 };
 root.dataset.suspended=String(document.hidden);
 function listen(target,type,handler,options){
   target.addEventListener(type,handler,options);
   listenerRemovers.push(()=>target.removeEventListener(type,handler,options));
 }
 function cancelMotion(bucket=animations){
   [...bucket].forEach(animation=>{animation.cancel();animations.delete(animation);bucket.delete(animation);});
 }
 function animateMotion(element,keyframes,bucket,duration=motion.control,delay=0){
   if(!element||!enabled||reduced.matches||document.hidden||pageSuspended||disposed||typeof element.animate!=='function')return;
   try{
     const animation=element.animate(keyframes,{duration,delay,easing:motion.easeOut,fill:'backwards'});
     animations.add(animation);bucket.add(animation);
     const release=()=>{animations.delete(animation);bucket.delete(animation);animation.onfinish=null;animation.oncancel=null;};
     animation.onfinish=release;animation.oncancel=release;
   }catch{/* Unsupported animation options leave the readable base state in place. */}
 }
 function enterHero(){
   if(heroEntered)return;heroEntered=true;
   if(!enabled||document.hidden||scrollY>headerHeight||
      (location.hash&&!['#home','#main'].includes(location.hash)))return;
   const targets=[document.querySelector('.hero-identity'),document.querySelector('.hero-scene'),
     document.querySelector('.hero-description'),document.querySelector('.hero-side .text-link')];
   targets.forEach((element,index)=>animateMotion(element,[
     {opacity:.85,transform:'translateY('+motion.entryOffset+'px)'},
     {opacity:1,transform:'translateY(0)'}
   ],heroMotion,motion.enter,Math.min(index,2)*motion.stagger));
 }
 function stopWork(){
   ticket++;cancelMotion();clearTimeout(resizeTimer);resizeTimer=0;
   if(frame)cancelAnimationFrame(frame);frame=0;
   if(lenis)lenis.stop();
 }
 function resumePage(){
   if(!ready||disposed||pageSuspended||document.hidden)return;
   if(lenis)lenis.start();
   if(!booted){booted=true;applyMotion(false);followHash();enterHero();}
   else applyMotion(true);
 }

 const stories = [...document.querySelectorAll('[data-story]')].map(track => ({
   track, panel:track.querySelector('.story-panel'), top:track.querySelector('.story-top'), stack:track.querySelector('.stage-stack'),
   stages:[...track.querySelectorAll('[data-stage]')], buttons:[...track.querySelectorAll('[data-stage-button]')],
   count:track.querySelector('.stage-count'), line:track.querySelector('.progress-line'),
   marker:track.querySelector('.progress-marker'), pinned:false, active:-1, motion:new Set(),
   start:0, travel:0, step:0, panelHeight:0, progress:0, phase:0, toolsHeight:0
 }));
 stories.forEach(story=>story.stages.forEach((stage,index)=>{
   if(!stage.id)stage.id=story.track.dataset.story+'-stage-'+index;
   story.buttons[index].setAttribute('aria-controls',stage.id);
 }));
 const storyByName = new Map(stories.map(s=>[s.track.dataset.story,s]));
 const contactCards=[...document.querySelectorAll('.contact-link')].map(node=>({
   node,entered:false,motion:new Set()
 }));
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

 function requestPaint(){
   dirty=true;if(disposed||pageSuspended||document.hidden)return;
   if(!frame)frame=requestAnimationFrame(tick);
 }
 function tick(time){
   frame=0;if(disposed||pageSuspended||document.hidden)return;
   if(lenis)lenis.raf(time);
   if(dirty||lastScroll!==scrollY){dirty=false;lastScroll=scrollY;paint();}
   if(enabled&&lenis&&!frame)frame=requestAnimationFrame(tick);
 }
 function focusTarget(target){
   const added=!target.hasAttribute('tabindex')&&!target.matches('a,button,summary,input,select,textarea');
   if(added)target.setAttribute('tabindex','-1');
   target.focus({preventScroll:true});
   if(added)listen(target,'blur',()=>target.removeAttribute('tabindex'),{once:true});
 }
 function currentAnchor(){
   const viewport=visibleHeight();
   const line=headerHeight+Math.max(0,viewport-headerHeight)*.36;
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
     if(r.bottom<=headerHeight||r.top>=viewport)return;
     const d=r.top<=line&&r.bottom>=line?0:Math.abs(r.top-line);
     if(d<distance){distance=d;best={element,top:r.top};}
   });
   if(best){
     const story=stories.find(s=>s.stages.includes(best.element));
     if(story){best.story=story;best.index=story.stages.indexOf(best.element);}
   }
   return best;
 }
 function selectStage(story,index){
   if(story.active===index)return;
   story.buttons.forEach((button,i)=>{
     if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
   });
   story.count.textContent=String(index+1).padStart(2,'0')+' / '+String(story.stages.length).padStart(2,'0');
   story.active=index;
 }
 function showStage(story,index){
   index=clamp(index,0,story.stages.length-1);
   if(story.active===index&&story.stages.every((stage,i)=>stage.hidden===(i!==index)))return;
   const previous=story.active;
   cancelMotion(story.motion);
   story.stages.forEach((stage,i)=>{stage.hidden=i!==index;});
   selectStage(story,index);
   // Content and selected state change immediately. Only the incoming group moves.
   if(previous>=0&&!measuring&&story.pinned&&scrollY>=story.start&&scrollY<=story.start+story.travel){
     const direction=index>previous?1:-1;
     animateMotion(story.stack,[
       {opacity:.85,transform:'translateY('+(direction*motion.stateOffset)+'px)'},
       {opacity:1,transform:'translateY(0)'}
     ],story.motion);
   }
 }
 function unpin(story){
   cancelMotion(story.motion);
   story.pinned=false;story.active=-1;story.toolsHeight=0;
   story.track.classList.remove('is-pinned','is-measuring','has-sticky-tools');
   story.track.classList.add('is-flow');
   story.track.style.removeProperty('height');story.track.style.removeProperty('--panel-height');
   story.stack.style.removeProperty('--stage-height');
   story.track.style.removeProperty('--story-tools-height');
   story.stages.forEach(stage=>{stage.hidden=false;stage.style.removeProperty('opacity');stage.style.removeProperty('transform');});
   story.buttons.forEach(button=>button.removeAttribute('aria-current'));
 }
 function layout(restore=true){
   if(measuring||disposed||pageSuspended||document.hidden)return;measuring=true;
   // Measure stable positions rather than an in-flight presentation offset.
   stories.forEach(story=>cancelMotion(story.motion));
   contactCards.forEach(card=>cancelMotion(card.motion));
   const anchor=restore?currentAnchor():null;
   const oldScroll=scrollY;
   headerHeight=header.getBoundingClientRect().height;
   root.style.setProperty('--header-height',headerHeight+'px');
   measureTools();
   const screenHeight=stableHeight();
   const panelHeight=Math.max(0,Math.floor(screenHeight-headerHeight));
   stories.forEach(story=>{
     unpin(story);
     if(compact.matches||!enabled||!CSS.supports('position','sticky')||panelHeight<360)return;
     story.track.classList.remove('is-flow');
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
     story.step=panelHeight;
     story.travel=story.step*story.stages.length;
     story.track.style.height=(panelHeight+story.travel)+'px';
     story.track.style.setProperty('--panel-height',panelHeight+'px');
     story.stack.style.setProperty('--stage-height',Math.ceil(maxStage)+'px');
     story.track.classList.add('is-pinned');
     showStage(story,anchor?.story===story?anchor.index:0);
   });
   stories.forEach(story=>{
     if(!story.pinned){
       const toolsHeight=Math.ceil(story.top.getBoundingClientRect().height);
       // A toolbar must leave most of a short or zoomed screen free for content.
       const sticky=panelHeight>=240&&toolsHeight<=panelHeight*.3;
       story.track.classList.toggle('has-sticky-tools',sticky);
       story.toolsHeight=sticky?toolsHeight:0;
       story.track.style.setProperty('--story-tools-height',story.toolsHeight+'px');
     }
     story.start=story.track.getBoundingClientRect().top+scrollY-headerHeight;
   });
   layoutSize={width:root.clientWidth,height:screenHeight,header:headerHeight};
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
   requestPaint();
 }
 function progressFor(story){
   if(!story.pinned)return 0;
   return clamp((scrollY-story.start)/Math.max(1,story.travel));
 }
 function revealContacts(reads){
   let order=0;
   reads.forEach(({card,rect})=>{
     if(rect.bottom<=headerHeight||rect.top>=visibleHeight()*.9)return;
     card.entered=true;
     // A link under a pointer or keyboard focus should remain a stationary target.
     if(card.node.contains(document.activeElement)||(finePointer.matches&&card.node.matches(':hover')))return;
     animateMotion(card.node,[
       {opacity:.85,transform:'translateY('+motion.entryOffset+'px)'},
       {opacity:1,transform:'translateY(0)'}
     ],card.motion,motion.control,Math.min(order++,2)*motion.stagger);
   });
 }
 function paint(){
   // Collect geometry before visual writes; wrapper offsets remain native document coordinates.
   const viewport=visibleHeight();
   const readLine=headerHeight+Math.max(0,viewport-headerHeight)*.36;
   const stageRects=stories.map(story=>story.pinned?[]:story.stages.map(stage=>stage.getBoundingClientRect()));
   const sectionRects=sections.map(element=>({element,rect:element.getBoundingClientRect()}));
   const headingRects=headings.map(heading=>({heading,rect:heading.element.getBoundingClientRect()}));
   const artRects=arts.filter(art=>art.visible).map(art=>({art,rect:art.element.getBoundingClientRect(),owner:art.owner.getBoundingClientRect()}));
   const barWidths=stories.map(story=>story.line.getBoundingClientRect().width);
   const contactReads=contactCards.filter(card=>!card.entered).map(card=>({card,rect:card.node.getBoundingClientRect()}));
   const metricReads=metricGroups.map(group=>({group,rects:enabled&&!group.story.pinned?group.cards.map(card=>card.getBoundingClientRect()):[]}));
   let active='home';
   sectionRects.forEach(({element,rect})=>{if(rect.top<=readLine)active=element.id;});
   if(scrollY+innerHeight>=root.scrollHeight-4)active='links';
   nav.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
   stories.forEach((story,k)=>{
     if(!story.pinned){
       const rects=stageRects[k];
       const storyLine=headerHeight+story.toolsHeight+Math.max(0,viewport-headerHeight-story.toolsHeight)*.3;
       let index=0;
       rects.forEach((rect,i)=>{if(rect.top<=storyLine)index=i;});
       const span=index<rects.length-1?rects[index+1].top-rects[index].top:rects[index].height;
       const local=clamp((storyLine-rects[index].top)/Math.max(1,span));
       selectStage(story,index);
       story.phase=index+(index<rects.length-1?local:0);
       story.progress=(index+local)/rects.length;
       story.track.style.setProperty('--flow-progress',String(story.progress));
       return;
     }
     story.progress=progressFor(story);
     const position=story.progress*story.stages.length;
     const index=Math.min(story.stages.length-1,Math.floor(position));
     const local=clamp(position-index);
     showStage(story,index);
     story.phase=index+(index<story.stages.length-1?smooth((local-.78)/.22):0);
     story.local=local;
     story.marker.style.transform='translateX('+Math.max(0,barWidths[k]-8)*story.progress+'px)';
   });
   revealContacts(contactReads);
   metricReads.forEach(({group,rects})=>{
     let active=-1;
     if(enabled&&!group.stage.hidden){
       if(group.story.pinned){
         const progress=clamp((group.story.local-.14)/.72);
         active=Math.min(group.cards.length-1,Math.floor(progress*group.cards.length));
       }else{
         let distance=Infinity;
         rects.forEach((rect,index)=>{
           if(rect.bottom<=headerHeight+group.story.toolsHeight||rect.top>=viewport)return;
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
     let progress=clamp((viewport-rect.top)/(Math.max(1,viewport-headerHeight)*.65));
     const story=heading.stage&&stories.find(s=>s.stages.includes(heading.stage));
     if(story?.pinned)progress=clamp((story.local+.05)/.5);
     heading.fills.forEach((fill,index)=>{
       const p=enabled?clamp(progress*1.5-index/Math.max(1,heading.fills.length)*.35):1;
       fill.style.opacity=String(p);
     });
   });
   artRects.forEach(({art,rect,owner})=>{
     let progress=clamp((viewport-owner.top)/(Math.max(1,owner.height+viewport)));
     let phase=art.story?art.story.phase:null;
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
   if(!target||disposed||pageSuspended)return;
   cancelMotion(heroMotion);
   const ownTicket=++ticket;
   const stage=target.closest('[data-stage]');
   const story=stage&&stories.find(s=>s.stages.includes(stage));
   let top=target.getBoundingClientRect().top+scrollY-headerHeight-(story?.toolsHeight||0)-16;
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
   if(!enabled)cancelMotion();
   if(!enabled&&lenis){lenis.destroy();lenis=null;}
   if(disposed||pageSuspended||document.hidden)return;
   if(enabled&&!lenis&&typeof window.Lenis==='function'){
     lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,wheelMultiplier:1,touchMultiplier:1,autoRaf:false,autoResize:true,anchors:false,respectReducedMotion:true});
     lenis.on('scroll',requestPaint);
   }
   layout(restore);requestPaint();
 }
 listen(document,'click',event=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target.closest('a[href^="#"]');if(!link)return;
   const target=fragmentTarget(link.hash);if(!target)return;
   event.preventDefault();navigate(target);
 });
 stories.forEach(story=>story.buttons.forEach((button,index)=>listen(button,'click',()=>{
   if(!story.pinned){
     navigate(story.stages[index].querySelector('h3'));
     return;
   }
   const ownTicket=++ticket;
   scrollToPosition(story.start+(index+.4)*story.step,()=>{if(ownTicket===ticket){paint();button.focus({preventScroll:true});}});
 })));
 // Keep native page keys responsive, including when a link has keyboard focus.
 listen(document,'keydown',event=>{
   cancelMotion(heroMotion);
   if(event.defaultPrevented||event.isComposing||
      !['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))return;
   const target=event.target;
   if(!(target instanceof Element))return;
   if(target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"],[role="listbox"],[role="slider"],[role="spinbutton"]'))return;
   // Space activates these controls; on a normal link it scrolls the page.
   if(event.key===' '&&target.closest('button,summary,[role="button"]'))return;
   ticket++;
   if(lenis)lenis.scrollTo(scrollY,{immediate:true});
 });
 listen(window,'wheel',()=>{ticket++;cancelMotion(heroMotion);},{passive:true});
 listen(window,'touchstart',()=>{ticket++;cancelMotion(heroMotion);if(lenis)lenis.scrollTo(scrollY,{immediate:true});},{passive:true});
 listen(document,'pointerdown',()=>cancelMotion(heroMotion),{passive:true});
 listen(window,'scroll',requestPaint,{passive:true});
 function scheduleLayout(){
   if(!ready||disposed||pageSuspended||document.hidden)return;
   requestPaint();
   clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{
     resizeTimer=0;
     const current={width:root.clientWidth,height:stableHeight(),header:header.getBoundingClientRect().height};
     // Browser toolbar motion changes the visible viewport, not this stable layout.
     if(layoutSize&&Math.abs(current.width-layoutSize.width)<.5&&
        Math.abs(current.height-layoutSize.height)<.5&&Math.abs(current.header-layoutSize.header)<.5)return;
     layout(true);
   },120);
 }
 listen(window,'resize',scheduleLayout,{passive:true});
 listen(window,'orientationchange',scheduleLayout,{passive:true});
 if(window.visualViewport)listen(window.visualViewport,'resize',requestPaint,{passive:true});
 if(typeof ResizeObserver==='function'){
   headerObserver=new ResizeObserver(()=>{
     if(ready&&Math.abs(header.getBoundingClientRect().height-headerHeight)>.5)scheduleLayout();
   });
   headerObserver.observe(header);
 }
 arts.forEach(art=>{
   listen(art.owner,'pointermove',event=>{
     if(!enabled||!finePointer.matches||event.pointerType==='touch')return;
     const rect=art.element.getBoundingClientRect();
     art.x=clamp((event.clientX-rect.left)/Math.max(1,rect.width)*2-1,-1,1);
     art.y=clamp((event.clientY-rect.top)/Math.max(1,rect.height)*2-1,-1,1);requestPaint();
   },{passive:true});
   listen(art.owner,'pointerleave',()=>{art.x=art.y=0;requestPaint();});
 });
 contactCards.forEach(card=>{
   const settle=()=>{card.entered=true;cancelMotion(card.motion);};
   listen(card.node,'pointerenter',settle,{passive:true});
   listen(card.node,'pointerdown',settle,{passive:true});
   listen(card.node,'focusin',settle);
 });
 if(typeof IntersectionObserver==='function'){
   sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
     const art=arts.find(item=>item.element===entry.target);if(!art)return;
     art.visible=entry.isIntersecting;art.element.dataset.visible=String(entry.isIntersecting);requestPaint();
   }),{rootMargin:'120px'});
   arts.forEach(art=>sceneObserver.observe(art.element));
 }
 listen(document,'visibilitychange',()=>{
   root.dataset.suspended=String(document.hidden||pageSuspended);
   if(document.hidden)stopWork();else resumePage();
 });
 listen(window,'pagehide',event=>{
   pageSuspended=true;root.dataset.suspended='true';stopWork();
   if(headerObserver)headerObserver.disconnect();
   if(sceneObserver)sceneObserver.disconnect();
   if(!event.persisted){
     disposed=true;
     if(lenis){lenis.destroy();lenis=null;}
     listenerRemovers.splice(0).forEach(remove=>remove());
   }
 });
 listen(window,'pageshow',event=>{
   if(!event.persisted||disposed)return;
   pageSuspended=false;root.dataset.suspended=String(document.hidden);
   if(headerObserver)headerObserver.observe(header);
   if(sceneObserver)arts.forEach(art=>sceneObserver.observe(art.element));
   resumePage();
 });
 listen(reduced,'change',()=>{if(ready)applyMotion(true);});
 listen(finePointer,'change',()=>{arts.forEach(art=>{art.x=art.y=0;});requestPaint();});
 function fragmentTarget(hash){
   try{return document.getElementById(decodeURIComponent(hash.slice(1)));}
   catch{return null;}
 }
 function followHash(){
   if(!ready||!location.hash)return;
   const target=fragmentTarget(location.hash);
   if(target)navigate(target,{push:false,instant:true,focus:false});
 }
 listen(window,'popstate',followHash);
 listen(window,'hashchange',followHash);
 const toolkit=document.querySelector('.skills-explorer');
 if(toolkit){
   const filters=[...toolkit.querySelectorAll('[data-skill-filter]')];
   const groups=[...toolkit.querySelectorAll('[data-skill-group]')];
   const status=toolkit.querySelector('.skill-status');
   const results=toolkit.querySelector('.skills-results');
   let selectedTools=null;
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
     const direction=groups.indexOf(group)>=groups.indexOf(selectedTools)?1:-1;
     selectedTools=group;
     cancelMotion(skillsMotion);
     groups.forEach(item=>{item.hidden=item!==group;});
     filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.skillFilter===key)));
     const tiles=[...group.querySelectorAll('.skill-tile')];
     status.textContent=group.querySelector('h4').textContent+' / '+tiles.length+' tools';
     if(animate){
       requestPaint();
       animateMotion(group,[
         {opacity:.85,transform:'translateX('+(direction*motion.skillsOffset)+'px)'},
         {opacity:1,transform:'translateX(0)'}
       ],skillsMotion);
     }
   }
   toolkit.dataset.enhanced='true';
   toolkit.querySelector('.skill-filters').hidden=false;status.hidden=false;
   filters.forEach(button=>listen(button,'click',()=>selectTools(button.dataset.skillFilter,true)));
   selectTools('frontend');
   measureTools();
 }
 const fontReady=document.fonts?document.fonts.ready:Promise.resolve();
 fontReady.then(()=>{
   if(disposed)return;ready=true;resumePage();
 }).catch(()=>{if(disposed)return;ready=true;motionFailed=true;resumePage();});
})();
