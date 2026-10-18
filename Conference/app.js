(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var view=$('#view'),hud=$('#hud');

/* ---------- The safety line, wish starter & tweak guardrail ---------- */
var SAFETY='Put everything in one single .html file. Don\'t use outside internet links (use inline SVG for visuals and Web Audio for sound).';
var FORMULA='Make a screen-share tool for my [grade] [subject] online class to run on my computer during live sessions.\n[Describe what appears on my screen, what I click or enter, and what students see and discuss.]\n'+SAFETY;
var TWEAK_GUARD='Please give me the complete, updated single-file HTML code so I can copy and replace the whole thing.';
var sbCode='';

function toast(m){var t=$('#toast');t.textContent=m||'Copied!';t.classList.add('on');clearTimeout(toast.id);toast.id=setTimeout(function(){t.classList.remove('on')},2400)}
function copy(txt,msg){
  var ok=function(){toast(msg||'Copied! Now paste it into your Gemini chat.')};
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(ok,fb)}else fb();
  function fb(){var a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Press Ctrl+C to copy')}a.remove()}
}
function saveFile(txt, filename, type){
  var b = new Blob([txt], {type: type || 'text/plain;charset=utf-8'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1500);
  toast('Saved ' + filename + '. Look in your Downloads folder.');
}
function openInNewTab(txt){
  var b = new Blob([txt], {type: 'text/html;charset=utf-8'});
  var url = URL.createObjectURL(b);
  window.open(url, '_blank', 'noopener');
  setTimeout(function(){ URL.revokeObjectURL(url); }, 60000);
}

/* ---------- Cave of Wonders: content lives in treasures.js ---------- */
var TREASURES = window.TREASURES || [];
var GROUPS = window.TREASURE_GROUPS || [];

function escapeHTML(s){
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function stripTags(s){return (s||'').replace(/<[^>]+>/g,'')}
function groupOf(t){for(var k=0;k<GROUPS.length;k++){if(GROUPS[k].id===t.group)return GROUPS[k]}return {id:'',icon:'',title:'',hue:0}}
function readmeHTML(t){
  return '<h3>What is it?</h3><p>'+t.what+'</p><h4>How you might use it</h4><ul>'+
    t.uses.map(function(u){return '<li><strong>'+u[0]+':</strong> '+u[1]+'</li>'}).join('')+'</ul>';
}
function lessonHTML(t){
  var L=t.lesson;
  return '<h3>'+L.title+'</h3>'+L.points.map(function(p){
    return '<h5>'+p[0]+'</h5><ul>'+p[1].map(function(b){return '<li>'+b+'</li>'}).join('')+'</ul>';
  }).join('');
}
function lessonText(t){
  var L=t.lesson;
  return t.name+': '+L.title+'\n\n'+L.points.map(function(p){
    return stripTags(p[0])+'\n'+p[1].map(function(b){return '  - '+stripTags(b)}).join('\n');
  }).join('\n\n')+'\n';
}
function promptNote(t){
  if(t.promptNote) return t.promptNote;
  if(t.prompt && t.prompt.length>1500) return 'This prompt is long because I refined it over several tries. <b>Yours doesn&rsquo;t need to be!</b> Start with two or three plain sentences like the summary above.';
  return '';
}

var GEMDEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="gemg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef9c3"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#7c3aed"/></linearGradient><symbol id="gem" viewBox="0 0 40 44"><polygon points="20,2 36,14 30,42 10,42 4,14" fill="url(#gemg)" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/><polygon points="20,2 36,14 20,20" fill="#fff" fill-opacity=".35"/><polygon points="4,14 20,20 10,42" fill="#000" fill-opacity=".18"/></symbol></defs></svg>';
var CAPTION='Point at any gem for a quick peek. Click it to open the tool, see the wish, and pick up a tip.';
function gemHTML(t,i,g,k){
  return '<button class="gem" data-i="'+i+'" style="--hue:'+g.hue+'deg;--dur:'+(4.5+k%3*.7)+'s;--delay:'+(k*.35)+'s" aria-label="'+escapeHTML(t.name+': '+t.short+' ('+t.grades+')')+'">'
    +'<svg class="gemi" viewBox="0 0 40 44" aria-hidden="true"><use href="#gem"></use></svg>'
    +'<div class="gem-info">'
      +'<span class="gname">'+t.name+'</span>'
      +'<span class="gshort">'+t.short+'</span>'
    +'</div>'
    +'</button>';
}
function caveHTML(){
  return GEMDEFS+'<div class="cave-groups">'+GROUPS.map(function(g){
    var k=0,gems=TREASURES.map(function(t,i){return t.group===g.id?gemHTML(t,i,g,k++):''}).join('');
    var stackCls=(g.id==='deep'?'gem-stack-double':'gem-stack');
    return '<section class="cave-group cg-'+g.id+'" aria-label="'+escapeHTML(g.title)+'">'
      +'<h3><span aria-hidden="true">'+g.icon+'</span> '+g.title+'</h3><p class="gsub">'+g.sub+'</p>'
      +'<div class="'+stackCls+'">'+gems+'</div></section>';
  }).join('')+'</div><div id="gemCaption" aria-live="polite">'+CAPTION+'</div>';
}
function setCap(t){
  var c=$('#gemCaption');
  if(c&&t) c.innerHTML='<b>'+t.name+'</b> &mdash; '+t.short+' <span style="color:var(--cyan)">('+t.grades+')</span>';
}
function resetCap(){
  var c=$('#gemCaption');
  if(c) c.textContent=CAPTION;
}

function openModal(i){
  var t=TREASURES[i];
  if(!t)return;
  var m=$('#modal'),g=groupOf(t),note=promptNote(t);
  var isLong = (t.prompt || '').length > 1500;
  var promptBlock = isLong
    ? '<details class="mprompt-details"><summary>&#10024; View my full, polished prompt (click to expand)</summary><div class="mprompt-code">' + escapeHTML(t.prompt) + '</div></details>'
    : '<h4 class="mprompt-h">The exact wish I typed into Gemini</h4><div class="mprompt-code">' + escapeHTML(t.prompt) + '</div>';

  m.innerHTML='<div class="mback" data-close="1"></div>' +
    '<div class="mdlg" role="dialog" aria-modal="true" aria-labelledby="mtitle">' +
      '<div class="mheader">' +
        '<div class="mtop-row">' +
          '<div class="mbadges"><span class="mbadge">' + g.icon + ' ' + g.title + '</span><span class="mbadge mgrade">' + t.grades + '</span></div>' +
          '<button class="mclose" data-close="1" aria-label="Close">&times;</button>' +
        '</div>' +
        '<h3 id="mtitle">' + t.name + '</h3>' +
        '<p class="mdesc">' + t.short + '</p>' +
      '</div>' +
      '<div class="mtabs" role="tablist">' +
        '<button class="mtab active" data-mtab="result">&#128640; What It Does</button>' +
        '<button class="mtab" data-mtab="prompt">&#129668; The Wish</button>' +
        '<button class="mtab" data-mtab="lesson">&#128161; Tips I Learned</button>' +
      '</div>' +
      '<div class="mbody">' +
        '<div class="mpane active" id="mpane-result">' +
          '<div class="mresult-wrap"><div class="mreadme-card">' + readmeHTML(t) + '</div></div>' +
          '<div class="mtab-actions">' +
            '<a class="btn" href="' + encodeURI(t.file) + '" target="_blank" rel="noopener">&#128640; Open the tool</a>' +
            '<a class="btn alt" href="' + encodeURI(t.downloadFile || t.file) + '" download="' + (t.downloadName || '') + '" target="_blank" rel="noopener" data-savefiles="' + i + '">&#128190; Download a copy</a>' +
          '</div>' +
        '</div>' +
        '<div class="mpane" id="mpane-prompt">' +
          '<div class="mprompt-wrap">' +
            '<div class="mwish"><span class="mwish-label">How you can start (in plain words)</span><p>&ldquo;' + t.wish + '&rdquo;</p></div>' +
            (note ? '<p class="mnote">' + note + '</p>' : '') +
            promptBlock +
          '</div>' +
          '<div class="mtab-actions">' +
            '<button class="btn" data-copyprompt="' + i + '">&#128203; Copy the prompt</button>' +
            '<button class="btn alt" data-saveprompt="' + i + '">&#128190; Save as a text file</button>' +
          '</div>' +
        '</div>' +
        '<div class="mpane" id="mpane-lesson">' +
          '<div class="mlesson-wrap"><div class="mlesson-card">' + lessonHTML(t) + '</div></div>' +
          '<div class="mtab-actions">' +
            '<button class="btn" data-copylesson="' + i + '">&#128203; Copy the tips</button>' +
            '<button class="btn alt" data-savelesson="' + i + '">&#128190; Save as a text file</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  m.classList.add('open');
  document.body.style.overflow='hidden';
  var closeBtn=m.querySelector('.mclose');
  if(closeBtn) closeBtn.focus();
}

function closeModal(){
  var m=$('#modal');
  if(!m.classList.contains('open'))return;
  m.classList.remove('open');
  m.innerHTML='';
  document.body.style.overflow='';
}

function openLevelUpModal(){
  var m=$('#modal');
  m.innerHTML='<div class="mback" data-close="1"></div>' +
    '<div class="mdlg levelup-dialog" role="dialog" aria-modal="true" aria-labelledby="lutitle">' +
      '<div class="mheader">' +
        '<div class="mtop-row">' +
          '<span class="mbadge">&#129502;&#8205;&#9794;&#65039; Master of the Lamp &middot; Optional Level Up</span>' +
          '<button class="mclose" data-close="1" aria-label="Close">&times;</button>' +
        '</div>' +
        '<h3 id="lutitle">When (and How) to Break the Two Golden Rules</h3>' +
        '<p class="mdesc">95% of classroom tools work best as a single offline file. When you build huge games or multi-part apps later on, here is what happens behind the curtain:</p>' +
      '</div>' +
      '<div class="mbody levelup-modal-body">' +
        '<div class="break-box">' +
          '<span class="break-tag">&#129502;&#8205;&#9794;&#65039; Breaking Rule #1: When one file gets too big or slow</span>' +
          '<p>Websites are actually built from three separate ingredients:</p>' +
          '<ul class="tri-list">' +
            '<li><b>HTML</b> = <i>What is there</i> (the text, buttons, inputs, and structure)</li>' +
            '<li><b>CSS</b> = <i>How it looks</i> (the colors, fonts, styling, and layout)</li>' +
            '<li><b>JavaScript (JS)</b> = <i>What it does</i> (the math, clicks, animations, and logic)</li>' +
          '</ul>' +
          '<p class="break-note">If Gemini ever gives you a ZIP folder with separate <code>.html</code>, <code>.css</code>, and <code>.js</code> files, don&rsquo;t panic! That&rsquo;s just organizing the closet into three tidy drawers.</p>' +
        '</div>' +
        '<div class="break-box">' +
          '<span class="break-tag">&#127912; Breaking Rule #2: Graphics, Audio &amp; External Styling</span>' +
          '<p>To keep your tools working 100% offline without broken image links, our Wish Formula secretly asks Gemini for two built-in browser tricks:</p>' +
          '<ul class="tri-list">' +
            '<li><b>Inline SVG visuals:</b> Pictures drawn with math right inside the file instead of outside image links.</li>' +
            '<li><b>Web Audio API sounds:</b> Chimes, buzzers, and ticks synthesized directly by your browser.</li>' +
          '</ul>' +
          '<p class="break-note"><b>What if you see &ldquo;Tailwind&rdquo;?</b> It&rsquo;s an external styling library that makes tools look sleek and modern. It works great while online, but if you want 100% offline reliability, tell Gemini: <i>&ldquo;Use vanilla HTML, CSS, and JS only.&rdquo;</i></p>' +
        '</div>' +
        '<div class="mtab-actions" style="justify-content:flex-end;margin-top:.4rem">' +
          '<button class="btn" data-close="1">Got It &#10003;</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  m.classList.add('open');
  document.body.style.overflow='hidden';
  var closeBtn=m.querySelector('.mclose');
  if(closeBtn) closeBtn.focus();
}

function openNotepadModal(){
  var m=$('#modal');
  m.innerHTML='<div class="mback" data-close="1"></div>' +
    '<div class="mdlg notepad-dialog" role="dialog" aria-modal="true" aria-labelledby="nptitle">' +
      '<div class="mheader">' +
        '<div class="mtop-row">' +
          '<span class="mbadge">Offline Fallback</span>' +
          '<button class="mclose" data-close="1" aria-label="Close">&times;</button>' +
        '</div>' +
        '<h3 id="nptitle">The Notepad Way: Save Any Code Offline</h3>' +
        '<p class="mdesc">If you don&rsquo;t have this presentation open, you can turn Gemini code into a working web app anytime using the text editor built into your computer:</p>' +
      '</div>' +
      '<div class="mbody notepad-modal-body">' +
        '<div class="np-step-card">' +
          '<span class="np-step-num">1</span>' +
          '<div class="np-step-text"><b>Open Notepad or TextEdit</b><p>Open <b>Notepad</b> on Windows, or <b>TextEdit</b> on Mac. <i>(On a Mac, choose Format &rarr; Make Plain Text first.)</i></p></div>' +
        '</div>' +
        '<div class="np-step-card">' +
          '<span class="np-step-num">2</span>' +
          '<div class="np-step-text"><b>Paste the code</b><p>Paste the full code block copied from your Gemini chat into the empty window.</p></div>' +
        '</div>' +
        '<div class="np-step-card">' +
          '<span class="np-step-num">3</span>' +
          '<div class="np-step-text"><b>Save as an HTML file</b><p>Go to <b>File &rarr; Save As</b>. Give it a name ending in <b>.html</b> (like <code>quiz.html</code>). In Notepad, change <b>&ldquo;Save as type&rdquo;</b> to <b>All files (*.*)</b> so it doesn&rsquo;t add .txt.</p></div>' +
        '</div>' +
        '<div class="np-step-card">' +
          '<span class="np-step-num">4</span>' +
          '<div class="np-step-text"><b>Double-click to open</b><p>Double-click your saved file in your Downloads or Desktop folder. It opens and runs in Chrome, Edge, or Safari&mdash;even completely offline!</p></div>' +
        '</div>' +
        '<div class="mtab-actions" style="justify-content:flex-end;margin-top:.8rem">' +
          '<button class="btn" data-close="1">Got It &#10003;</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  m.classList.add('open');
  document.body.style.overflow='hidden';
  var closeBtn=m.querySelector('.mclose');
  if(closeBtn) closeBtn.focus();
}

/* ---------- Slide building blocks ---------- */
function card(icon,title,body,cls){
  return '<div class="card'+(cls?' '+cls:'')+'">'
    +(icon?'<div class="card-head"><h3>'+title+'</h3><span class="cicon" aria-hidden="true">'+icon+'</span></div>':'<h3>'+title+'</h3>')
    +'<p>'+body+'</p></div>';
}
function bubble(who,text,extra){
  return who==='you'
    ? '<div class="card bubble you"><span class="who">&#128100; You</span><p>'+text+'</p></div>'
    : '<div class="card bubble genie"><span class="who">&#10024; Gemini / Genie</span><p>'+text+'</p>'+(extra||'')+'</div>';
}
function phrases(icon,title,list){
  return '<div class="card"><div class="card-head"><h3>'+title+'</h3><span class="cicon" aria-hidden="true">'+icon+'</span></div><div class="phrases">'
    +list.map(function(p){
      return '<button type="button" class="phrase" data-copytweak="'+encodeURIComponent(p)+'" title="Click to copy this tweak + full-file reminder">'
        +'<span>&ldquo;'+p+'&rdquo;</span><span class="phrase-copy-tag">&#128203; Copy</span></button>';
    }).join('')+'</div></div>';
}

var WISHES=[
  ['Grades 3-5 · Math','Make a "Mystery Number" screen-share warm-up for my 4th grade math class. Display a 4x4 grid of numbers and a list of 4 math clues (like "I am a multiple of 3" or "I am greater than 20"). As students discuss in chat, let me click numbers on the grid to cross them out until only the secret number remains, plus a button to generate a fresh board.'],
  ['Grades 6-8 · ELA','Make a vocabulary "Forbidden Words" game to screen share with my middle school class. Display one target vocabulary word at the top and 3 "forbidden" clue words below it, alongside a 30-second countdown timer. One student describes the word on mic without using the forbidden words while the chat guesses. Include a box where I can paste my own weekly word list.'],
  ['Grades 9-12 · STEM','Make a "Find the Error" screen-share tool for my high school Algebra/Chemistry class. Display a worked multi-step problem where one step has a common mistake. Let me click to highlight or reveal one step at a time as students debate in the chat where the math went wrong, then click a button to flip the faulty step into the corrected solution.'],
  ['Grades 9-12 · Humanities','Make a live Socratic seminar and debate board to screen share with my high school class. Display a central prompt at the top and two side-by-side columns ("Agree / Claim A" and "Disagree / Claim B"). As students share arguments and text evidence on mic or in chat, let me quickly type and drop their points into either column, star the strongest points, and export the final board as a study note.'],
  ['Social Studies · Trivia','Make a quote trivia game to screen share with my history class. Display a historical quote and four large answer buttons. When students vote in poll/chat and I click their choice, reveal whether it\'s correct along with a 2-sentence background fact.'],
  ['Live Classroom Helper','Make a live breakout group maker for my online class. I paste my student roster, and it automatically sorts them into groups of 4 on screen. Let me drag student names between groups live on screen, and provide a button to copy formatted group lists directly into meeting chat.']
];

/* ---------- Slides ---------- */
var SLIDES=[
{t:'The Classroom Genie',h:function(){return '<div class="hero">'
  +'<h1>The Classroom Genie</h1>'
  +'<p class="hero-sub">Make your own classroom tools with AI. No coding required.</p>'
  +'<div class="card glow hero-card"><p>AI is like a genie: it grants your wish <b>exactly</b> the way you say it.</p>'
  +'<p>The good news? <b>This genie gives you unlimited wishes.</b> If the first try isn&rsquo;t quite right, you just wish again.</p></div>'
  +'<div class="hero-foot static">'
  +'<p class="hero-meta">Pearson Virtual Schools Staff Conference &middot; Caleob King</p>'
  +'<p class="hero-cue">Press Space, the right arrow, or rub the lamp to begin.</p></div>'
  +'</div>'}},

{t:'Sound Familiar?',h:function(){return '<h2>Sound Familiar?</h2>'
  +'<div class="lead">Ready-made classroom websites can be great, until they aren&rsquo;t.</div>'
  +'<div class="grid g3">'
  +card('&#128273;','The Login Headache','Another account. Another forgotten password. Another website asking for student names.')
  +card('&#129513;','The Almost-Right Tool','It&rsquo;s close, but it doesn&rsquo;t quite fit your lesson, your students, or your standards.')
  +card('&#128679;','The Locked Door','The free trial ends, or the school filter blocks the site the morning you need it.')
  +'</div>'
  +'<div class="banner"><b>What if&hellip;</b> you could make the exact tool you need in a few minutes, and it opened right in your web browser&mdash;just like a normal webpage, ready to screen-share? No account. No login. No cost. <b>Nothing to install (no IT ticket needed!).</b> And student names never leave your computer.</div>'}},

{t:'How It Works: The Genie Loop',h:function(){return '<h2>How It Works: The Genie Loop</h2>'
  +'<div class="lead">Making a tool is a conversation, not a test. It goes around and around like this:</div>'
  +'<div class="grid loop">'
  +card('&#128173;','1. Imagine','Think of one small thing that would make your week easier.<em>&ldquo;I wish I had a fair way to call on students.&rdquo;</em>')
  +card('&#129668;','2. Wish','Type it into Gemini (our school-approved AI tool) in plain, everyday words.<em>&ldquo;Make a spinning wheel that picks a name from my class list.&rdquo;</em>')
  +card('&#128064;','3. Try','The AI builds it. Open it and click around like a student would.<em>&ldquo;It works! But it picked the same kid twice.&rdquo;</em>')
  +card('&#128257;','4. Tweak','Tell the AI what to change, then try again. Repeat as often as you like.<em>&ldquo;Take each name off the wheel after it&rsquo;s picked.&rdquo;</em>')
  +'</div>'
  +'<div class="banner">You don&rsquo;t need the perfect wish. <b>You just need a first wish.</b> Most good tools get there one small tweak at a time.</div>'}},

{t:'Watch a Wish Grow',h:function(){return '<h2>Watch a Wish Grow</h2>'
  +'<div class="lead">Here&rsquo;s what a typical conversation looks like (shortened a bit).</div>'
  +'<div class="chat chat-grid">'
  +bubble('you','Make a spinning wheel that picks a random name from a class list I paste in.')
  +bubble('genie','Here&rsquo;s your wheel! Paste your names in the box and click Spin.','<span class="chip">&#128196; spin-wheel.html</span>')
  +bubble('you','Love it! But it picked Jordan twice in a row. Can you take each name off after it&rsquo;s picked?')
  +bubble('genie','Done! Picked names now come off the wheel. I added an Undo button too, just in case.','<span class="chip">&#128196; spin-wheel.html (version 2)</span>')
  +bubble('you','Can it make a ticking sound while it spins? And use brighter colors?')
  +bubble('genie','Ticking sound and brighter colors added. Spin away!','<span class="chip">&#128196; spin-wheel.html (version 3)</span>')
  +'</div>'
  +'<div class="banner banner-row"><span><b>Three plain-English messages. Zero code.</b> That&rsquo;s the whole skill.</span>'
  +'<a class="btn" href="Example_1/WheelPicker.html" target="_blank" rel="noopener">&#127905; Try a finished wheel</a></div>'}},

{t:'The Cave of Wonders',h:function(){return '<h2>The Cave of Wonders</h2>'
  +'<div class="lead">Sixteen real tools and ideas, each one made by describing it to AI. Click any gem to explore:</div>'
  +'<div class="cave-wrap static">'+caveHTML()+'</div>'}},

{t:'Two Golden Rules',h:function(){return '<h2>Two Golden Rules</h2>'
  +'<div class="lead">Include these two simple requests at the end of every wish so your tool works anywhere without headaches:</div>'
  +'<div class="grid rules-grid">'
  +'<div class="card rule-card">'
    +'<div class="card-head"><h3>1. &ldquo;Put everything in one single file&rdquo;</h3><span class="pill guard">Rule #1</span></div>'
    +'<p class="rule-why">Instead of a messy folder of parts, Gemini gives you <b>one clickable webpage file</b> that opens right in Chrome, Edge, or Safari.</p>'
    +'<ul class="rule-benefit-list">'
      +'<li><b>Easy to keep:</b> Save it in your lesson folder just like a Word doc or PDF.</li>'
      +'<li><b>Easy to share:</b> Email the file to a teammate and it works on their computer too.</li>'
    +'</ul>'
  +'</div>'
  +'<div class="card rule-card">'
    +'<div class="card-head"><h3>2. &ldquo;Don&rsquo;t use outside internet links&rdquo;</h3><span class="pill guard">Rule #2</span></div>'
    +'<p class="rule-why">Gemini draws all visuals and creates all sound effects <b>right inside the file itself</b> instead of pulling from outside websites.</p>'
    +'<ul class="rule-benefit-list">'
      +'<li><b>Filter-proof:</b> School web filters have nothing to block on the morning of your lesson.</li>'
      +'<li><b>100% Offline:</b> Works even if your internet connection slows down.</li>'
    +'</ul>'
  +'</div>'
  +'</div>'
  +'<div class="levelup-row static">'
    +'<button class="btn alt levelup-btn" data-open-levelup="1">&#129502;&#8205;&#9794;&#65039; Master of the Lamp: When to Break the Rules (Level Up)</button>'
  +'</div>'
  +'<div class="banner">&#128274; <b>Privacy Note:</b> Our school&rsquo;s Gemini setup is privacy-protected (0-PII) so you can safely paste in your lesson plans and curriculum! (And since your finished tool runs on your own computer, student names you type into a tool never go to the cloud at all.)</div>'}},

{t:'Your Wish Starter & Borrowed Wishes',h:function(){return '<h2>Your Wish Starter &amp; Borrowed Wishes</h2>'
  +'<div class="lead">Built for live online teaching: run on your computer and shared via screen share. Copy the general formula OR borrow a ready-made wish below:</div>'
  +'<div class="wish-combo static">'
    +'<div class="card starter-card">'
      +'<div class="starter-head">'
        +'<div><span class="pill role">Teacher Screen-Share Formula</span> <span class="dim">Fill in the blanks and paste into Gemini</span></div>'
        +'<button class="btn" data-copy="formula">&#128203; Copy Wish Formula</button>'
      +'</div>'
      +'<div class="formula-parts">'
        +'<div class="part"><span class="pill aud">1 &middot; Who &amp; Where</span><p>Make a screen-share tool for my <mark>[grade] [subject]</mark> online class to run on my computer during live sessions.</p></div>'
        +'<div class="part"><span class="pill task">2 &middot; Live Screen Share</span><p><mark>[Describe what appears on my screen, what I click or enter, and what students see and discuss.]</mark></p></div>'
        +'<div class="part"><span class="pill guard">3 &middot; Single-File Guardrail</span><p>'+SAFETY+'</p><span class="guard-reassure">&#10024; Gemini speaks this language&mdash;just leave it attached!</span></div>'
      +'</div>'
    +'</div>'
    +'<div class="borrow-header">'
      +'<h3>&#10024; Ready-to-Borrow Wishes (Screen-Share &amp; Productivity Ready)</h3>'
      +'<span class="dim">Click any button to copy the wish + single-file rule straight to your clipboard</span>'
    +'</div>'
    +'<div class="grid g3 wishbank static">'
    +WISHES.map(function(w){
      return '<div class="card wish"><div class="wish-top"><span class="pill">'+w[0]+'</span>'
        +'<button class="btn alt btn-sm" data-copytxt="'+encodeURIComponent(w[1]+'\n\n'+SAFETY)+'">&#128203; Copy</button></div>'
        +'<p>'+w[1]+'</p></div>';
    }).join('')
    +'</div>'
  +'</div>'
  +'<div class="banner">&#10024; <b>Step 1:</b> Click <b>Copy</b> on the formula or your favorite wish above and paste it into Gemini. Once Gemini writes your code, head to the next slide to turn it into a working tool!</div>'}},

{t:'Save & Open Your Tool',h:function(){return '<h2>Save &amp; Open Your Tool: The Magic File Maker</h2>'
  +'<div class="lead">Gemini will hand you a block of code. You never need to read it! Paste it below to turn it into a clickable webpage file and launch it full-screen:</div>'
  +'<div class="sb-steps-row static">'
    +'<div class="sb-step"><span class="s-badge">1</span><div class="s-text"><b>Copy from Gemini</b><span class="s-desc">Click the Copy icon on Gemini&rsquo;s code box</span></div></div>'
    +'<div class="sb-step-arrow">&#10140;</div>'
    +'<div class="sb-step"><span class="s-badge">2</span><div class="s-text"><b>Paste &amp; Name Below</b><span class="s-desc">Paste into the box and give it a title</span></div></div>'
    +'<div class="sb-step-arrow">&#10140;</div>'
    +'<div class="sb-step"><span class="s-badge">3</span><div class="s-text"><b>Save &amp; Launch Full-Screen</b><span class="s-desc">Saves your .html file and opens it in a new tab!</span></div></div>'
  +'</div>'
  +'<div class="file-maker-wrap static">'
    +'<div class="file-maker-card">'
      +'<div class="sb-top-bar">'
        +'<label for="sb-code" class="sb-label">Paste your Gemini code here:</label>'
        +'<button class="btn alt btn-sm" id="sb-clear">Clear Box</button>'
      +'</div>'
      +'<textarea id="sb-code" spellcheck="false" placeholder="Click here, then press Ctrl+V (Windows) or Cmd+V (Mac) to paste the code from Gemini..."></textarea>'
      +'<div class="sb-bottom-bar">'
        +'<div class="sb-name-group">'
          +'<label for="sb-name">File name:</label>'
          +'<input id="sb-name" value="my-classroom-tool" autocomplete="off">'
          +'<span class="dim">.html</span>'
        +'</div>'
        +'<div class="sb-action-btns">'
          +'<button class="btn" id="sb-both">&#128640; Save .html &amp; Open in New Tab</button>'
          +'<button class="btn alt" id="sb-open">&#127760; Open in New Tab Only</button>'
          +'<button class="btn alt" id="sb-save">&#128190; Download .html Only</button>'
        +'</div>'
      +'</div>'
      +'<div class="reopen-note">&#128194; <b>How to use it next week:</b> Your saved <code>.html</code> file goes to your <b>Downloads</b> folder. Double-click it anytime (or move it to your lesson folder) and it opens right in your browser!</div>'
    +'</div>'
  +'</div>'
  +'<div class="sb-footer-bar static">'
    +'<div class="sb-tip">&#128161; <b>Bonus Shortcut:</b> If you see a <b>&ldquo;Preview&rdquo; or &ldquo;Open in Canvas&rdquo;</b> button at the bottom of Gemini&rsquo;s code box, you can click that to test your tool right inside Gemini before downloading!</div>'
    +'<button class="btn alt np-open-btn" id="btn-notepad" data-open-notepad="1">&#128221; Saving without this page? The Notepad Way</button>'
  +'</div>'},init:sandboxInit},

{t:'Magic Words for Tweaking',h:function(){return '<h2>Magic Words for Tweaking</h2>'
  +'<div class="lead">Your first version is a rough draft! Click any phrase below to copy it (with a built-in reminder for Gemini to give you the whole updated file):</div>'
  +'<div class="grid g2 static">'
  +phrases('&#127912;','Make it look right',['Make the words big enough to read on a shared screen.','Use bright, cheerful colors.','Make it calm and simple, with less on the screen.'])
  +phrases('&#128421;&#65039;','Make it easier on screen share',['Add a dark mode / high-contrast toggle so it\'s easier to read on screen share.','Add keyboard shortcuts (like Spacebar to advance) so I can run it quickly while teaching.','Add a Start Over button and a mute button.'])
  +phrases('&#9851;&#65039;','Make it reusable',['Let me paste in my own list of words or questions.','Add buttons to save my setup to a file and load it again later.'])
  +phrases('&#128736;&#65039;','When something\'s not working',['When I click the button, nothing happens. Please fix it.','The words run off the edge of the screen. Please make everything fit cleanly.','Start over with a simpler, cleaner version.'])
  +'</div>'
  +'<div class="banner">Every tweak is just one more message. If a change makes things worse, say <b>&ldquo;Go back to the last version.&rdquo;</b> And if Gemini ever gives you just a small piece of code, say <b>&ldquo;Give me the whole updated file.&rdquo;</b></div>'}},

{t:'Tinker Time',h:function(){
  return '<div class="final-stage static">'
    +'<div class="tinker-head"><h2>Tinker Time</h2><p class="tinker-goal">Make one wish. Try it. Tweak it once. <b>That&rsquo;s a win.</b></p></div>'
    +'<div class="tinker-jump-row" aria-label="Quick links back to workshop slides">'
    +'<button class="jump-link-btn" data-go="7">&larr; Back to Wish List</button>'
    +'<button class="jump-link-btn" data-go="8">&larr; Back to Magic File Maker</button>'
    +'<button class="jump-link-btn" data-go="9">&larr; Back to Magic Words</button>'
    +'<button class="jump-link-btn" data-go="5">&larr; Cave of Wonders</button>'
    +'</div>'
    +'<div class="final-timer-card">'
    +'<div class="led final-led" id="led" role="timer" aria-live="off">10:00</div>'
    +'<div class="timer-controls">'
    +'<button class="btn alt timer-btn" id="t-down" aria-label="Decrease by 1 minute" title="Decrease 1 minute">&#9660; &minus;1m</button>'
    +'<button class="btn timer-btn timer-go" id="tgo" aria-label="Play or pause timer">Play</button>'
    +'<button class="btn alt timer-btn" id="trs" aria-label="Reset timer">Reset</button>'
    +'<button class="btn alt timer-btn" id="t-up" aria-label="Increase by 1 minute" title="Increase 1 minute">&#9650; +1m</button>'
    +'</div>'
    +'</div>'
    +'<div class="music-player-card" aria-label="Music Player">'
    +'<div class="music-info">'
    +'<span class="music-icon" aria-hidden="true">&#9835;</span>'
    +'<span class="music-title" id="m-title" title="Current track">Ambient Focus</span>'
    +'<span class="music-loop-badge" title="Playing on loop">&#128257; Loop</span>'
    +'</div>'
    +'<div class="music-controls">'
    +'<button class="m-ctrl-btn" id="m-prev" aria-label="Previous track" title="Previous track">&#9198;</button>'
    +'<button class="m-ctrl-btn m-play-btn" id="m-play" aria-label="Play or pause music" title="Play / Pause">&#9658;</button>'
    +'<button class="m-ctrl-btn" id="m-next" aria-label="Next track" title="Next track">&#9197;</button>'
    +'<div class="music-vol-group">'
    +'<button class="m-ctrl-btn m-mute-btn" id="m-mute" aria-label="Mute / unmute music" title="Mute">&#128266;</button>'
    +'<input type="range" class="vol-slider" id="m-vol" min="0" max="1" step="0.05" value="0.7" aria-label="Volume slider">'
    +'</div>'
    +'</div>'
    +'</div>'
    +'<div class="final-actions-row">'
    +'<a class="btn rounded-action-btn" id="btn-padlet" href="https://padlet.com/ctking/wish-wall-s024jeclbv9ousv6zm5u" target="_blank" rel="noopener">Ideas Padlet</a>'
    +'</div>'
    +'</div>';
},init:timerInit}
];
var CAVE_SLIDE=1;
SLIDES.forEach(function(s,i){if(s.t==='The Cave of Wonders')CAVE_SLIDE=i+1});

function cleanCode(c){
  return (c||'').trim().replace(/^```[a-zA-Z]*\s*\n?/,'').replace(/\n?```\s*$/,'').trim();
}
function getCleanName(nm){
  return ((nm&&nm.value)||'').trim().replace(/\.html?$/i,'').replace(/[^\w\- ]+/g,'').replace(/\s+/g,'-')||'my-classroom-tool';
}
function sandboxInit(){
  var ta=$('#sb-code'),nm=$('#sb-name');
  if(!ta)return;
  ta.value=sbCode;
  ta.oninput=function(){sbCode=ta.value};

  var bothBtn=$('#sb-both');
  if(bothBtn)bothBtn.onclick=function(){
    var c=cleanCode(ta.value);
    if(!c){toast('Paste your code from Gemini into the box first');ta.focus();return}
    var n=getCleanName(nm)+'.html';
    openInNewTab(c);
    saveFile(c,n,'text/html;charset=utf-8');
    toast('Opened in a new tab & saved ' + n + ' to Downloads!');
  };

  var openBtn=$('#sb-open');
  if(openBtn)openBtn.onclick=function(){
    var c=cleanCode(ta.value);
    if(!c){toast('Paste your code from Gemini into the box first');ta.focus();return}
    openInNewTab(c);
    toast('Opened your tool in a new browser tab!');
  };

  var saveBtn=$('#sb-save');
  if(saveBtn)saveBtn.onclick=function(){
    var c=cleanCode(ta.value);
    if(!c){toast('Paste your code from Gemini into the box first');ta.focus();return}
    var n=getCleanName(nm)+'.html';
    saveFile(c,n,'text/html;charset=utf-8');
  };

  var clearBtn=$('#sb-clear');
  if(clearBtn)clearBtn.onclick=function(){ta.value='';sbCode='';ta.focus()};
}

/* ---------- Timer & Music Player ---------- */
var tm={left:600,base:600,run:0,id:null};
function fmt(s){
  if(s<0)s=0;
  return ('0'+Math.floor(s/60)).slice(-2)+':'+('0'+s%60).slice(-2);
}
function chime(){
  try{
    var c=new (window.AudioContext||window.webkitAudioContext)();
    [523.25,659.25,783.99,1046.5].forEach(function(f,i){
      var o=c.createOscillator(),g=c.createGain();
      o.type='sine';o.frequency.value=f;
      o.connect(g);g.connect(c.destination);
      var t=c.currentTime+i*.18;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(.25,t+.03);
      g.gain.exponentialRampToValueAtTime(.001,t+1.6);
      o.start(t);o.stop(t+1.7);
    });
  }catch(e){}
}

var MUSIC_PLAYLIST=[
  {title:'Ambient Focus',file:'music/Ambient_Focus.mp3'},
  {title:'Upbeat Flow',file:'music/Upbeat_Flow.mp3'},
  {title:'Parade in a Teacup',file:'music/Parade in a Teacup.mp3'},
  {title:'Robot Groove Circuit',file:'music/Robot Groove Circuit.mp3'},
  {title:'Summer Night in Archfall',file:'music/Summer Night in Archfall.mp3'},
  {title:'Lofi Pause',file:'music/Lofi_Pause.mp3'},
  {title:'Retro Arcade',file:'music/Retro_Arcade.mp3'}
];

var musicAudio=null;
var musicState={
  idx:0,
  isPlaying:false,
  volume:0.7,
  isMuted:false
};

function getAudio(){
  if(!musicAudio){
    musicAudio=new Audio();
    musicAudio.loop=true;
    musicAudio.volume=musicState.volume;
    musicAudio.muted=musicState.isMuted;
    musicAudio.addEventListener('ended',function(){
      musicAudio.currentTime=0;
      musicAudio.play().catch(function(){});
    });
  }
  return musicAudio;
}

function updateMusicUI(){
  var titleEl=$('#m-title');
  var playBtn=$('#m-play');
  var muteBtn=$('#m-mute');
  var volSlider=$('#m-vol');

  if(titleEl&&MUSIC_PLAYLIST[musicState.idx]){
    titleEl.textContent=MUSIC_PLAYLIST[musicState.idx].title;
  }
  if(playBtn){
    playBtn.innerHTML=musicState.isPlaying?'&#10074;&#10074;':'&#9658;';
    playBtn.setAttribute('title',musicState.isPlaying?'Pause song':'Play song');
  }
  if(muteBtn){
    var isM=musicState.isMuted||musicState.volume===0;
    muteBtn.innerHTML=isM?'&#128263;':(musicState.volume<.5?'&#128265;':'&#128266;');
    muteBtn.setAttribute('title',isM?'Unmute':'Mute');
  }
  if(volSlider){
    volSlider.value=musicState.volume;
  }
}

function loadTrack(idx,autoPlay){
  musicState.idx=(idx+MUSIC_PLAYLIST.length)%MUSIC_PLAYLIST.length;
  var audio=getAudio();
  audio.src=encodeURI(MUSIC_PLAYLIST[musicState.idx].file);
  audio.loop=true;
  if(autoPlay){
    var p=audio.play();
    if(p&&p.then){
      p.then(function(){
        musicState.isPlaying=true;
        updateMusicUI();
      }).catch(function(){
        musicState.isPlaying=false;
        updateMusicUI();
      });
    }
  }else{
    updateMusicUI();
  }
}

function toggleMusicPlay(){
  var audio=getAudio();
  if(!audio.src||audio.src===''||audio.src===window.location.href){
    loadTrack(musicState.idx,true);
    return;
  }
  if(audio.paused){
    var p=audio.play();
    if(p&&p.then){
      p.then(function(){
        musicState.isPlaying=true;
        updateMusicUI();
      }).catch(function(){});
    }
  }else{
    audio.pause();
    musicState.isPlaying=false;
    updateMusicUI();
  }
}

function prevTrack(){
  var wasPlaying=musicState.isPlaying;
  loadTrack(musicState.idx-1,wasPlaying);
}

function nextTrack(){
  var wasPlaying=musicState.isPlaying;
  loadTrack(musicState.idx+1,wasPlaying);
}

function toggleMute(){
  var audio=getAudio();
  musicState.isMuted=!musicState.isMuted;
  audio.muted=musicState.isMuted;
  updateMusicUI();
}

function setVolume(val){
  var audio=getAudio();
  musicState.volume=val;
  audio.volume=val;
  if(val>0&&musicState.isMuted){
    musicState.isMuted=false;
    audio.muted=false;
  }
  updateMusicUI();
}

function stepMinute(direction){
  var s=tm.left;
  var target;
  if(direction>0){
    target=Math.floor(s/60)*60+60;
    if(target>5940)target=5940;
  }else{
    target=Math.ceil(s/60)*60-60;
    if(target<60)target=60;
  }
  tm.left=target;
  tm.base=target;
  var led=$('#led');
  if(led)led.textContent=fmt(tm.left);
}

function timerInit(){
  var led=$('#led'),goBtn=$('#tgo');
  function draw(){if(led)led.textContent=fmt(tm.left)}
  function stop(){clearInterval(tm.id);tm.run=0;if(goBtn)goBtn.textContent='Play'}
  function setT(s){stop();tm.left=s;tm.base=s;draw()}
  tm.base=tm.base||600;
  draw();
  if(goBtn)goBtn.textContent=tm.run?'Pause':'Play';

  var upBtn=$('#t-up');
  if(upBtn)upBtn.onclick=function(){stepMinute(1)};

  var downBtn=$('#t-down');
  if(downBtn)downBtn.onclick=function(){stepMinute(-1)};

  var rsBtn=$('#trs');
  if(rsBtn)rsBtn.onclick=function(){setT(tm.base)};

  if(goBtn){
    goBtn.onclick=function(){
      if(tm.run){stop();return}
      if(tm.left<=0)tm.left=tm.base;
      tm.run=1;goBtn.textContent='Pause';
      clearInterval(tm.id);
      tm.id=setInterval(function(){
        tm.left--;draw();
        if(tm.left<=0){stop();chime();toast('Time is up!')}
      },1000);
    };
  }

  var mPrev=$('#m-prev'),mPlay=$('#m-play'),mNext=$('#m-next'),mMute=$('#m-mute'),mVol=$('#m-vol');
  if(mPrev)mPrev.onclick=function(){prevTrack()};
  if(mPlay)mPlay.onclick=function(){toggleMusicPlay()};
  if(mNext)mNext.onclick=function(){nextTrack()};
  if(mMute)mMute.onclick=function(){toggleMute()};
  if(mVol){
    mVol.oninput=function(e){setVolume(+e.target.value)};
  }

  updateMusicUI();
}

/* ---------- Views ---------- */
function slideView(n,full){
  var s=SLIDES[n-1];hud.classList.remove('hide');
  view.innerHTML='<section aria-label="Slide '+n+'">'+s.h()+'</section>';
  arm(view.firstChild,full);
  if(s.init)s.init();
  hud.innerHTML='<button data-nav="-1" aria-label="Previous">&#8249;</button>'+SLIDES.map(function(x,i){return '<button class="dot'+(i+1===n?' on':'')+'" title="'+(i+1)+'. '+x.t+'" aria-label="Slide '+(i+1)+': '+x.t+'" data-go="'+(i+1)+'"></button>'}).join('')+'<button data-nav="1" aria-label="Next">&#8250;</button><span>Slide '+n+' of '+SLIDES.length+'</span><span id="cnt"></span><a href="#slide-'+CAVE_SLIDE+'">Cave of Wonders</a>';
  hudCount();document.title=s.t+' | The Classroom Genie';
}

/* ---------- Reveal engine: one talking point per click ---------- */
var st={u:[],i:0},full=false,busy=false,first=true;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function arm(sec,all){
  st.u=[].filter.call(sec.querySelectorAll('.card,.banner,li,:scope>p,.card>p,.hero>p'),function(e){
    if(e.closest('.static'))return false;
    if(e.matches('.hero>p:first-of-type'))return false;
    if(e.matches('.card')&&e.querySelector('li'))return false;
    if(e.matches('.card>p')&&!e.parentNode.querySelector('li'))return false;
    return true});
  st.i=all?st.u.length:0;
  st.u.forEach(function(e,k){e.classList.add('rv');e.style.setProperty('--dx',(k%2?'':'-')+'120px');if(all)e.classList.add('in','nt')});
  setTimeout(function(){st.u.forEach(function(e){e.classList.remove('nt')})},60);
}
function hudCount(){var c=$('#cnt');if(c)c.textContent=st.u.length?'· '+st.i+'/'+st.u.length:''}
function step(d){
  if(busy||$('#modal').classList.contains('open'))return;
  if(d>0){if(st.i<st.u.length){st.u[st.i++].classList.add('in');hudCount()}else if(cur<SLIDES.length)go(cur+1)}
  else{if(st.i>0){st.u[--st.i].classList.remove('in');hudCount()}else if(cur>1){full=true;go(cur-1)}}
}

/* ---------- Lamp and smoke transition ---------- */
var LAMPSVG='<svg viewBox="0 0 200 120" aria-hidden="true" style="overflow:visible"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset=".55" stop-color="#f59e0b"/><stop offset="1" stop-color="#92400e"/></linearGradient><filter id="bl"><feGaussianBlur stdDeviation="1.6"/></filter></defs><g fill="none" stroke-linecap="round" filter="url(#bl)"><path class="w w1" stroke="#c4b5fd" stroke-width="4" d="M20 30C4 16 34 6 16-8S30-32 14-48"/><path class="w w2" stroke="#67e8f9" stroke-width="3" d="M22 28C36 14 6 4 24-10S8-34 26-50"/><path class="w w3" stroke="#f0abfc" stroke-width="3" d="M18 32C0 22 26 12 10 0S28-24 12-38"/></g><path d="M52 66C36 62 30 50 18 34L27 29C40 43 50 49 62 53Z" fill="url(#lg)"/><path d="M46 78C46 58 72 50 100 50S154 58 154 78 128 106 100 106 46 98 46 78Z" fill="url(#lg)" stroke="#fde68a" stroke-width="2"/><path d="M150 66C178 62 184 92 158 98" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/><path d="M84 52C88 40 112 40 116 52Z" fill="#d97706"/><circle cx="100" cy="38" r="5" fill="#fde68a"/><rect x="78" y="104" width="44" height="8" rx="3" fill="#92400e"/><path d="M62 70C70 62 90 60 104 62" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';

function duneLayer(w,h,base,amp,color,seed){
  var n=7,pts=[];
  for(var i=0;i<=n;i++){
    var x=i/n*w,y=base-Math.sin(i*1.7+seed)*amp*.4-Math.abs(Math.sin(seed*3+i*2.3))*amp*.6;
    pts.push([x,y]);
  }
  var d='M0,'+h+' L'+pts[0][0]+','+pts[0][1];
  for(var i=0;i<pts.length-1;i++){
    var mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;
    d+=' Q'+pts[i][0]+','+pts[i][1]+' '+mx+','+my;
  }
  d+=' L'+w+','+pts[pts.length-1][1]+' L'+w+','+h+' Z';
  return '<path d="'+d+'" fill="'+color+'"/>';
}
function buildDunes(){
  var w=1600,h=260,seed=Math.random()*10;
  var svg='<svg viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true">'
    +duneLayer(w,h,h*.42,30,'rgba(46,16,101,.55)',seed)
    +duneLayer(w,h,h*.62,34,'rgba(30,27,75,.72)',seed+2.1)
    +duneLayer(w,h,h*.82,30,'rgba(9,10,16,.96)',seed+4.4)
    +'</svg>';
  var d=document.createElement('div');d.id='dunes';d.innerHTML=svg;document.body.appendChild(d);
}
buildDunes();
var lamp=document.createElement('button');lamp.id='lamp';lamp.setAttribute('data-nav','1');lamp.setAttribute('aria-label','Rub the lamp: next point');lamp.innerHTML=LAMPSVG;document.body.appendChild(lamp);
var cv=document.createElement('canvas');cv.id='smoke';document.body.appendChild(cv);var cx=cv.getContext('2d');
var modal=document.createElement('div');modal.id='modal';document.body.appendChild(modal);
var PAL=['46,16,101','30,27,75','88,28,135','109,40,217','22,18,60','14,116,144'];
function build(){
  var W=cv.width=innerWidth,H=cv.height=innerHeight,R=Math.max(W,H)/5,r=lamp.getBoundingClientRect(),sp={x:r.left+r.width*.1,y:r.top+r.height*.27},ps=[];
  for(var gx=-R*.3;gx<W+R*.6;gx+=R*.85)for(var gy=-R*.3;gy<H+R*.6;gy+=R*.85){
    var tx=gx+(Math.random()-.5)*R*.5,ty=gy+(Math.random()-.5)*R*.5;
    ps.push({tx:tx,ty:ty,r:R*(1+Math.random()*.5),c:PAL[Math.random()*PAL.length|0],d:Math.hypot(tx-sp.x,ty-sp.y)/Math.hypot(W,H),sw:(Math.random()<.5?-1:1)*(1+Math.random()*1.5)})}
  return{ps:ps,sp:sp,W:W,H:H};
}
function draw(S,t){
  cx.clearRect(0,0,S.W,S.H);
  S.ps.forEach(function(p){
    var q=Math.min(1,Math.max(0,(t-p.d*.45)/.55));if(q<=0)return;
    var e=1-Math.pow(1-q,3),vx=p.tx-S.sp.x,vy=p.ty-S.sp.y,a=(1-e)*p.sw,c=Math.cos(a),s=Math.sin(a);
    var x=S.sp.x+(vx*c-vy*s)*e,y=S.sp.y+(vx*s+vy*c)*e,r=Math.max(8,p.r*e),g=cx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,'rgba('+p.c+',.95)');g.addColorStop(.6,'rgba('+p.c+',.6)');g.addColorStop(1,'rgba('+p.c+',0)');
    cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()});
  var f=Math.max(0,(t-.85)/.15);if(f>0){cx.fillStyle='rgba(20,12,48,'+f*.96+')';cx.fillRect(0,0,S.W,S.H)}
}
function ease(k){return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2}
function anim(S,a,b,ms){return new Promise(function(res){var t0=performance.now();(function f(n){var k=Math.min(1,(n-t0)/ms);draw(S,a+(b-a)*ease(k));k<1?requestAnimationFrame(f):res()})(t0)})}
function pause(ms){return new Promise(function(r){setTimeout(r,ms)})}
function transition(swap){
  if(reduce||busy){swap();return}
  busy=true;cv.style.display='block';lamp.classList.add('rub');
  var S=build();
  anim(S,0,1,1000).then(function(){swap();return pause(140)}).then(function(){return anim(S,1,0,1100)}).then(function(){cv.style.display='none';lamp.classList.remove('rub');busy=false});
}

/* ---------- Routing & events ---------- */
var cur=1;
function render(){
  var h=location.hash.replace('#',''),m=/^slide-(\d+)$/.exec(h);
  view.style.padding='';window.scrollTo(0,0);
  cur=m?Math.min(SLIDES.length,Math.max(1,+m[1])):1;
  var f=full;full=false;slideView(cur,f);
}
function route(){if(first){first=false;render()}else transition(render)}
function go(n){n=Math.min(SLIDES.length,Math.max(1,n));location.hash='#slide-'+n}
document.addEventListener('mouseover',function(e){var g=e.target.closest('.gem');if(g)setCap(TREASURES[+g.dataset.i])});
document.addEventListener('mouseout',function(e){var g=e.target.closest('.gem');if(g)resetCap()});
document.addEventListener('focusin',function(e){var g=e.target.closest('.gem');if(g)setCap(TREASURES[+g.dataset.i])});
document.addEventListener('focusout',function(e){var g=e.target.closest('.gem');if(g)resetCap()});
document.addEventListener('click',function(e){
  var lu=e.target.closest('[data-open-levelup]');if(lu){openLevelUpModal();return}
  var np=e.target.closest('#btn-notepad,[data-open-notepad]');if(np){openNotepadModal();return}
  var g=e.target.closest('[data-i]');if(g&&g.classList.contains('gem')){openModal(+g.dataset.i);return}
  var cl=e.target.closest('[data-close]');if(cl){closeModal();return}
  var mt=e.target.closest('[data-mtab]');
  if(mt){
    var tabId=mt.dataset.mtab,dlg=mt.closest('.mdlg');
    if(dlg){
      dlg.querySelectorAll('.mtab').forEach(function(b){b.classList.toggle('active',b===mt)});
      dlg.querySelectorAll('.mpane').forEach(function(p){p.classList.toggle('active',p.id==='mpane-'+tabId)});
    }
    return;
  }
  var cp=e.target.closest('[data-copyprompt]');
  if(cp){
    var idx=+cp.dataset.copyprompt;
    if(TREASURES[idx]&&TREASURES[idx].prompt){
      copy(TREASURES[idx].prompt);
      toast('Prompt copied to clipboard!');
    }
    return;
  }
  var sp=e.target.closest('[data-saveprompt]');
  if(sp){
    var idx=+sp.dataset.saveprompt;
    var tr=TREASURES[idx];
    if(tr&&tr.prompt){
      saveFile(tr.prompt, tr.name.replace(/[^a-zA-Z0-9_-]/g,'_')+'_Prompt.txt');
    }
    return;
  }
  var clsn=e.target.closest('[data-copylesson]');
  if(clsn){
    var idx=+clsn.dataset.copylesson;
    var tr=TREASURES[idx];
    if(tr){
      var txt=tr.lessonMd || lessonText(tr);
      if(txt){
        copy(txt);
        toast('Lesson copied to clipboard!');
      }
    }
    return;
  }
  var slsn=e.target.closest('[data-savelesson]');
  if(slsn){
    var idx=+slsn.dataset.savelesson;
    var tr=TREASURES[idx];
    if(tr){
      var txt=tr.lessonMd || lessonText(tr);
      if(txt){
        saveFile(txt, tr.name.replace(/[^a-zA-Z0-9_-]/g,'_')+'_Lesson.md');
      }
    }
    return;
  }
  var sf=e.target.closest('[data-savefiles]');
  if(sf){
    var idx=+sf.dataset.savefiles;
    var tr=TREASURES[idx];
    if(tr){
      toast('Downloading ' + (tr.downloadName || 'file(s)'));
    }
    return;
  }
  var tw=e.target.closest('[data-copytweak]');
  if(tw){
    var rawTweak=decodeURIComponent(tw.dataset.copytweak);
    copy(rawTweak+'\n\n'+TWEAK_GUARD, 'Tweak copied (with full-file reminder)!');
    return;
  }
  var t=e.target.closest('[data-nav],[data-go],[data-copy],[data-copytxt],[data-dl]');
  if(!t){if(!e.target.closest('button,a,input,textarea,summary,pre'))step(1);return}
  if(t.dataset.nav)step(+t.dataset.nav);
  if(t.dataset.go&&!busy){full=true;go(+t.dataset.go)}
  if(t.dataset.copy)copy(FORMULA);
  if(t.dataset.copytxt)copy(decodeURIComponent(t.dataset.copytxt));
  if(t.dataset.dl){var b=new Blob(['<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>My Classroom Tool</title>\n</head>\n<body>\n<!-- Paste the code from your AI chat here, replacing this whole file. -->\n</body>\n</html>\n'],{type:'text/html'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tool.html';document.body.appendChild(a);a.click();a.remove();toast('tool.html downloaded')}
});
document.addEventListener('keydown',function(e){
  if(/INPUT|TEXTAREA/.test(e.target.tagName))return;
  if($('#modal').classList.contains('open')){if(e.key==='Escape')closeModal();return}
  if(e.target.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))return;
  var k=e.key;
  if(k==='ArrowRight'||k===' '||k==='PageDown'){e.preventDefault();step(1)}
  else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();step(-1)}
});
var sx=null;
document.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
document.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>60)step(d<0?1:-1);sx=null});
window.addEventListener('hashchange',route);
route();
})();