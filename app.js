const $$=(s,ctx=document)=>[...ctx.querySelectorAll(s)];

function flipCard(card,force){
  const shouldFlip=force===undefined?!card.classList.contains('flipped'):force;
  card.classList.toggle('flipped',shouldFlip);
  card.setAttribute('aria-pressed',shouldFlip?'true':'false');
}
$$('.playcard').forEach(card=>card.addEventListener('click',()=>flipCard(card)));

let allFlipped=false;
document.getElementById('flipAll').addEventListener('click',()=>{
  allFlipped=!allFlipped;
  $$('.playcard').forEach(card=>flipCard(card,allFlipped));
  document.getElementById('flipAll').textContent=allFlipped?'Show card fronts':'Flip all playcards';
});

$$('[data-jump]').forEach(btn=>btn.addEventListener('click',()=>{
  const el=document.querySelector(btn.dataset.jump);
  if(el)el.scrollIntoView({behavior:'smooth'});
}));

$$('.mini-quiz').forEach(box=>{
  const answer=Number(box.dataset.answer);
  const buttons=$$('button',box);
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{
    if(box.dataset.done)return;
    box.dataset.done='1';
    buttons.forEach(b=>b.disabled=true);
    const feedback=box.querySelector('.feedback');
    if(index===answer){
      button.classList.add('correct');
      feedback.textContent='Correct.';
    }else{
      button.classList.add('wrong');
      buttons[answer].classList.add('correct');
      feedback.textContent='Not quite — the correct answer is highlighted.';
    }
  }));
});

const finalQuestions=[
  ['Which firewall policy is the more conservative default?',['Default forward','Default discard','Allow all inbound'],1],
  ['Which firewall type tracks established TCP connections?',['Stateful inspection','Simple packet filter only','Circuit gateway only'],0],
  ['Which IDS approach can detect previously unknown attacks by spotting deviations from normal behavior?',['Misuse detection','Anomaly detection','Port forwarding'],1],
  ['Which malware is self-propagating and does not need to integrate into existing code?',['Virus','Worm','Spyware'],1],
  ['What is the main purpose of a sandbox in payload analysis?',['Increase bandwidth','Quarantine and observe suspicious content safely','Replace the firewall'],1],
  ['Which incident-management function links related alerts across systems and time?',['Correlation','Deletion','Compression'],0],
  ['Which DDoS defense is used during the attack to reduce impact?',['Detection and filtering','Only post-incident forensics','Only preemption before the attack'],0]
];

const finalHost=document.getElementById('finalQuiz');
let answered=0,score=0;
finalQuestions.forEach((q,i)=>{
  const wrap=document.createElement('article');
  wrap.className='final-q';
  wrap.innerHTML='<h3>'+(i+1)+'. '+q[0]+'</h3>';
  q[1].forEach((option,j)=>{
    const button=document.createElement('button');
    button.textContent=option;
    button.addEventListener('click',()=>{
      if(wrap.dataset.done)return;
      wrap.dataset.done='1';
      answered++;
      const buttons=$$('button',wrap);
      buttons.forEach(b=>b.disabled=true);
      if(j===q[2]){score++;button.classList.add('correct')}
      else{button.classList.add('wrong');buttons[q[2]].classList.add('correct')}
      updateFinal();
    });
    wrap.appendChild(button);
  });
  finalHost.appendChild(wrap);
});

const result=document.createElement('div');
result.className='final-result';
result.textContent='Complete all 7 questions to see your score.';
finalHost.appendChild(result);

function updateFinal(){
  if(answered<finalQuestions.length){
    result.textContent=answered+'/7 complete · current score '+score;
    return;
  }
  const pct=Math.round(score/finalQuestions.length*100);
  result.innerHTML='Final score: '+score+'/7 ('+pct+'%)<br><span style="font-weight:600">'+
    (pct>=85?'Strong understanding of Week 9 endpoint security.':pct>=60?'Good base — review the questions you missed.':'Review the visible summaries and flipcards, then try the lecture again.')+
    '</span>';
}

const sections=$$('.section');
const navLinks=$$('.topbar nav a');
addEventListener('scroll',()=>{
  const root=document.documentElement;
  const max=root.scrollHeight-root.clientHeight;
  document.getElementById('progress').style.width=(max?root.scrollTop/max*100:0)+'%';
  let active='';
  sections.forEach(sec=>{if(scrollY>=sec.offsetTop-120)active=sec.id});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+active));
},{passive:true});