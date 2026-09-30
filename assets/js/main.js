(() => {
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    const close = () => { toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open menu'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Close menu':'Open menu'); nav.classList.toggle('is-open',open); });
    nav.addEventListener('click', e => { if(e.target.closest('a')) close(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } });
    document.addEventListener('click', e => { if(!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
    matchMedia('(min-width: 621px)').addEventListener('change',close);
  }
  const capabilities = {
    cloud:['01 / CLOUD','Cloud platforms','Azure and AWS infrastructure, with attention to the details that keep environments supportable.','Explore cloud expertise','#expertise'],
    identity:['02 / IDENTITY','Identity & infrastructure','Windows, Active Directory, Microsoft Entra ID, and virtualization connected through careful troubleshooting.','Explore identity expertise','#expertise'],
    automation:['03 / AUTOMATION','Practical automation','PowerShell scripts and repeatable workflows that reduce manual steps in routine operations.','Explore automation stories','#projects'],
    ai:['04 / AI & OPERATIONS','Evidence-led investigation','Grounded AI assistance for infrastructure knowledge and incident investigation, alongside reliable operations.','Explore the case study','projects/cloudops-platform/']
  };
  const nodes=[...document.querySelectorAll('.capability-nodes button')], panel=document.querySelector('.capability-panel');
  if(nodes.length && panel) {
    document.querySelector('.capability-nodes').classList.add('is-ready');
    nodes.forEach(button => button.addEventListener('click', () => {
      const [index,title,copy,link,href]=capabilities[button.dataset.capability];
      nodes.forEach(node=>node.setAttribute('aria-pressed',String(node===button)));
      panel.querySelector('.panel-index').textContent=index;
      panel.querySelector('#capability-title').textContent=title;
      panel.querySelector('#capability-description').textContent=copy;
      const a=panel.querySelector('#capability-link'); a.textContent=link+' ↗'; a.href=href;
    }));
    const visual=document.querySelector('.hero-visual'), scene=document.querySelector('.spatial-object');
    const canTilt=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
    if(scene) {
      visual.addEventListener('pointermove', e => { if(!canTilt.matches){scene.style.transform='';return;} const r=visual.getBoundingClientRect(); scene.style.transform='rotateY('+(((e.clientX-r.left)/r.width-.5)*8)+'deg) rotateX('+(-((e.clientY-r.top)/r.height-.5)*8)+'deg)'; });
      visual.addEventListener('pointerleave',()=>scene.style.transform='');
      canTilt.addEventListener('change',()=>scene.style.transform='');
    }
  }
  const toolbar=document.querySelector('.project-toolbar'), stories=[...document.querySelectorAll('.project-stories > .project-story')];
  if(toolbar && stories.length) {
    toolbar.hidden=false;
    toolbar.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
      const filter=button.dataset.filter; let visible=0;
      toolbar.querySelectorAll('[data-filter]').forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
      stories.forEach(story=>{ const show=filter==='all'||story.dataset.categories.split(' ').includes(filter); story.hidden=!show; if(show) visible++; });
      toolbar.querySelector('.project-count').textContent=visible+' '+(visible===1?'project':'projects');
    }));
  }
  const dialog=document.querySelector('.explore-dialog'), trigger=document.querySelector('.explore-trigger');
  if(dialog && trigger && typeof dialog.showModal==='function') {
    const input=dialog.querySelector('#explore-search'), results=dialog.querySelector('#explore-results'), empty=dialog.querySelector('.explore-empty'), status=dialog.querySelector('.explore-status');
    const isCase=!!document.querySelector('.case-hero'), home=isCase?'../../index.html':'';
    const entries=[
      ['About',home+'#about','Career and approach'],['Expertise',home+'#expertise','Cloud, identity, automation, AI'],['Selected projects',home+'#projects','Five FIS project stories'],['Experience',home+'#experience','FIS, Accenture, Digicom'],['Credentials',home+'#credentials','Education and certifications'],['Contact',home+'#contact','Email and LinkedIn'],
      ['OpsBridge — Cloud Operations & AI Investigation',isCase?'#overview':'projects/cloudops-platform/','Solo-built internal production platform · CloudOps · Pode · Foundry · AWS · Azure · PowerShell · AI'],['Data center move to AWS',home+'#aws-data-center','Cloud project'],['Legacy Azure tenant retirement',home+'#azure-tenant-retirement','Cloud and identity project'],['Scheduled jobs to Azure Automation',home+'#azure-automation-jobs','Automation project'],['EBS snapshot cleanup',home+'#ebs-snapshot-cleanup','AWS automation project']
    ];
    let active=0, shown=[];
    const mark=()=>{
      results.querySelectorAll('a').forEach((a,i)=>a.classList.toggle('is-active',i===active));
      const message=shown.length ? shown.length+' '+(shown.length===1?'result':'results')+'. Selected: '+shown[active][0]+'.' : 'No matching sections or projects.';
      if(status.textContent!==message) status.textContent=message;
    };
    const render=()=>{
      const q=input.value.trim().toLocaleLowerCase(); shown=entries.filter(([name,,desc])=>(name+' '+desc).toLocaleLowerCase().includes(q));
      results.replaceChildren();
      shown.forEach(([name,href,desc],i)=>{ const a=document.createElement('a'); a.href=href; a.className='explore-result'; a.dataset.index=i;
        const label=document.createElement('span'), sub=document.createElement('small'), arrow=document.createElement('b'); label.textContent=name; sub.textContent=desc; arrow.textContent='↗'; arrow.setAttribute('aria-hidden','true'); a.append(label,sub,arrow); results.append(a);
      });
      empty.hidden=shown.length>0; active=0; mark();
    };
    const open=()=>{ dialog.showModal(); input.value=''; render(); input.focus(); };
    trigger.hidden=false; trigger.addEventListener('click',open);
    document.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){ e.preventDefault(); if(!dialog.open) open(); else input.focus(); } });
    input.addEventListener('input',render);
    input.addEventListener('keydown',e=>{
      if((e.key==='ArrowDown'||e.key==='ArrowUp')&&shown.length){ e.preventDefault(); active=(active+(e.key==='ArrowDown'?1:-1)+shown.length)%shown.length; mark(); results.children[active].scrollIntoView({block:'nearest'}); }
      else if(e.key==='Enter'&&shown.length){ e.preventDefault(); results.children[active].click(); }
    });
    results.addEventListener('pointermove',e=>{ const a=e.target.closest('.explore-result'); if(a){ active=Number(a.dataset.index); mark(); } });
    results.addEventListener('click',e=>{
      const a=e.target.closest('a'); if(!a) return;
      const url=new URL(a.href), id=url.hash.slice(1), target=document.getElementById(id);
      if(target && url.pathname===location.pathname) {
        e.preventDefault();
        if(toolbar && target.closest('.project-stories') && target.hidden) toolbar.querySelector('[data-filter="all"]').click();
        dialog.close();
        requestAnimationFrame(()=>{
          history.pushState(null,'',url.hash);
          target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
        });
      } else dialog.close();
    });
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.preventDefault(); dialog.close(); } });
    dialog.addEventListener('click',e=>{ if(e.target===dialog) dialog.close(); });
    dialog.addEventListener('close',()=>trigger.focus({preventScroll:true}));
  }
  const progress=document.querySelector('.reading-progress');
  if(progress){ const update=()=>{ const max=document.documentElement.scrollHeight-innerHeight; progress.style.transform='scaleX('+(max>0?scrollY/max:0)+')'; }; addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update(); }
})();
