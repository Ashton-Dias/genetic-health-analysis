var Ze=Object.defineProperty;var Ce=r=>{throw TypeError(r)};var Ue=(r,n,e)=>n in r?Ze(r,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[n]=e;var b=(r,n,e)=>Ue(r,typeof n!="symbol"?n+"":n,e),Ye=(r,n,e)=>n.has(r)||Ce("Cannot "+e);var Te=(r,n,e)=>n.has(r)?Ce("Cannot add the same private member more than once"):n instanceof WeakSet?n.add(r):n.set(r,e);var K=(r,n,e)=>(Ye(r,n,"access private method"),e);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();function pe(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let O=pe();function Ie(r){O=r}const ze=/[&<>"']/,Qe=new RegExp(ze.source,"g"),Pe=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,Ke=new RegExp(Pe.source,"g"),We={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Re=r=>We[r];function _(r,n){if(n){if(ze.test(r))return r.replace(Qe,Re)}else if(Pe.test(r))return r.replace(Ke,Re);return r}const Xe=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;function Je(r){return r.replace(Xe,(n,e)=>(e=e.toLowerCase(),e==="colon"?":":e.charAt(0)==="#"?e.charAt(1)==="x"?String.fromCharCode(parseInt(e.substring(2),16)):String.fromCharCode(+e.substring(1)):""))}const et=/(^|[^\[])\^/g;function k(r,n){let e=typeof r=="string"?r:r.source;n=n||"";const t={replace:(s,o)=>{let i=typeof o=="string"?o:o.source;return i=i.replace(et,"$1"),e=e.replace(s,i),t},getRegex:()=>new RegExp(e,n)};return t}function _e(r){try{r=encodeURI(r).replace(/%25/g,"%")}catch{return null}return r}const q={exec:()=>null};function Ae(r,n){const e=r.replace(/\|/g,(o,i,a)=>{let l=!1,d=i;for(;--d>=0&&a[d]==="\\";)l=!l;return l?"|":" |"}),t=e.split(/ \|/);let s=0;if(t[0].trim()||t.shift(),t.length>0&&!t[t.length-1].trim()&&t.pop(),n)if(t.length>n)t.splice(n);else for(;t.length<n;)t.push("");for(;s<t.length;s++)t[s]=t[s].trim().replace(/\\\|/g,"|");return t}function W(r,n,e){const t=r.length;if(t===0)return"";let s=0;for(;s<t&&r.charAt(t-s-1)===n;)s++;return r.slice(0,t-s)}function tt(r,n){if(r.indexOf(n[1])===-1)return-1;let e=0;for(let t=0;t<r.length;t++)if(r[t]==="\\")t++;else if(r[t]===n[0])e++;else if(r[t]===n[1]&&(e--,e<0))return t;return-1}function Se(r,n,e,t){const s=n.href,o=n.title?_(n.title):null,i=r[1].replace(/\\([\[\]])/g,"$1");if(r[0].charAt(0)!=="!"){t.state.inLink=!0;const a={type:"link",raw:e,href:s,title:o,text:i,tokens:t.inlineTokens(i)};return t.state.inLink=!1,a}return{type:"image",raw:e,href:s,title:o,text:_(i)}}function nt(r,n){const e=r.match(/^(\s+)(?:```)/);if(e===null)return n;const t=e[1];return n.split(`
`).map(s=>{const o=s.match(/^\s+/);if(o===null)return s;const[i]=o;return i.length>=t.length?s.slice(t.length):s}).join(`
`)}class te{constructor(n){b(this,"options");b(this,"rules");b(this,"lexer");this.options=n||O}space(n){const e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){const e=this.rules.block.code.exec(n);if(e){const t=e[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:W(t,`
`)}}}fences(n){const e=this.rules.block.fences.exec(n);if(e){const t=e[0],s=nt(t,e[3]||"");return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(n){const e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(/#$/.test(t)){const s=W(t,"#");(this.options.pedantic||!s||/ $/.test(s))&&(t=s.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){const e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:e[0]}}blockquote(n){const e=this.rules.block.blockquote.exec(n);if(e){let t=e[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,`
    $1`);t=W(t.replace(/^ *>[ \t]?/gm,""),`
`);const s=this.lexer.state.top;this.lexer.state.top=!0;const o=this.lexer.blockTokens(t);return this.lexer.state.top=s,{type:"blockquote",raw:e[0],tokens:o,text:t}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t=e[1].trim();const s=t.length>1,o={type:"list",raw:"",ordered:s,start:s?+t.slice(0,-1):"",loose:!1,items:[]};t=s?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=s?t:"[*+-]");const i=new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`);let a="",l="",d=!1;for(;n;){let c=!1;if(!(e=i.exec(n))||this.rules.block.hr.test(n))break;a=e[0],n=n.substring(a.length);let f=e[2].split(`
`,1)[0].replace(/^\t+/,A=>" ".repeat(3*A.length)),p=n.split(`
`,1)[0],m=0;this.options.pedantic?(m=2,l=f.trimStart()):(m=e[2].search(/[^ ]/),m=m>4?1:m,l=f.slice(m),m+=e[1].length);let h=!1;if(!f&&/^ *$/.test(p)&&(a+=p+`
`,n=n.substring(p.length+1),c=!0),!c){const A=new RegExp(`^ {0,${Math.min(3,m-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),x=new RegExp(`^ {0,${Math.min(3,m-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),R=new RegExp(`^ {0,${Math.min(3,m-1)}}(?:\`\`\`|~~~)`),$=new RegExp(`^ {0,${Math.min(3,m-1)}}#`);for(;n;){const v=n.split(`
`,1)[0];if(p=v,this.options.pedantic&&(p=p.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),R.test(p)||$.test(p)||A.test(p)||x.test(n))break;if(p.search(/[^ ]/)>=m||!p.trim())l+=`
`+p.slice(m);else{if(h||f.search(/[^ ]/)>=4||R.test(f)||$.test(f)||x.test(f))break;l+=`
`+p}!h&&!p.trim()&&(h=!0),a+=v+`
`,n=n.substring(v.length+1),f=p.slice(m)}}o.loose||(d?o.loose=!0:/\n *\n *$/.test(a)&&(d=!0));let w=null,g;this.options.gfm&&(w=/^\[[ xX]\] /.exec(l),w&&(g=w[0]!=="[ ] ",l=l.replace(/^\[[ xX]\] +/,""))),o.items.push({type:"list_item",raw:a,task:!!w,checked:g,loose:!1,text:l,tokens:[]}),o.raw+=a}o.items[o.items.length-1].raw=a.trimEnd(),o.items[o.items.length-1].text=l.trimEnd(),o.raw=o.raw.trimEnd();for(let c=0;c<o.items.length;c++)if(this.lexer.state.top=!1,o.items[c].tokens=this.lexer.blockTokens(o.items[c].text,[]),!o.loose){const f=o.items[c].tokens.filter(m=>m.type==="space"),p=f.length>0&&f.some(m=>/\n.*\n/.test(m.raw));o.loose=p}if(o.loose)for(let c=0;c<o.items.length;c++)o.items[c].loose=!0;return o}}html(n){const e=this.rules.block.html.exec(n);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(n){const e=this.rules.block.def.exec(n);if(e){const t=e[1].toLowerCase().replace(/\s+/g," "),s=e[2]?e[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",o=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:s,title:o}}}table(n){const e=this.rules.block.table.exec(n);if(!e||!/[:|]/.test(e[2]))return;const t=Ae(e[1]),s=e[2].replace(/^\||\| *$/g,"").split("|"),o=e[3]&&e[3].trim()?e[3].replace(/\n[ \t]*$/,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===s.length){for(const a of s)/^ *-+: *$/.test(a)?i.align.push("right"):/^ *:-+: *$/.test(a)?i.align.push("center"):/^ *:-+ *$/.test(a)?i.align.push("left"):i.align.push(null);for(const a of t)i.header.push({text:a,tokens:this.lexer.inline(a)});for(const a of o)i.rows.push(Ae(a,i.header.length).map(l=>({text:l,tokens:this.lexer.inline(l)})));return i}}lheading(n){const e=this.rules.block.lheading.exec(n);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(n){const e=this.rules.block.paragraph.exec(n);if(e){const t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){const e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){const e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:_(e[1])}}tag(n){const e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&/^<a /i.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(n){const e=this.rules.inline.link.exec(n);if(e){const t=e[2].trim();if(!this.options.pedantic&&/^</.test(t)){if(!/>$/.test(t))return;const i=W(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{const i=tt(e[2],"()");if(i>-1){const l=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,l).trim(),e[3]=""}}let s=e[2],o="";if(this.options.pedantic){const i=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s);i&&(s=i[1],o=i[3])}else o=e[3]?e[3].slice(1,-1):"";return s=s.trim(),/^</.test(s)&&(this.options.pedantic&&!/>$/.test(t)?s=s.slice(1):s=s.slice(1,-1)),Se(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:o&&o.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){const s=(t[2]||t[1]).replace(/\s+/g," "),o=e[s.toLowerCase()];if(!o){const i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Se(t,o,t[0],this.lexer)}}emStrong(n,e,t=""){let s=this.rules.inline.emStrongLDelim.exec(n);if(!s||s[3]&&t.match(/[\p{L}\p{N}]/u))return;if(!(s[1]||s[2]||"")||!t||this.rules.inline.punctuation.exec(t)){const i=[...s[0]].length-1;let a,l,d=i,c=0;const f=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(f.lastIndex=0,e=e.slice(-1*n.length+i);(s=f.exec(e))!=null;){if(a=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!a)continue;if(l=[...a].length,s[3]||s[4]){d+=l;continue}else if((s[5]||s[6])&&i%3&&!((i+l)%3)){c+=l;continue}if(d-=l,d>0)continue;l=Math.min(l,l+d+c);const p=[...s[0]][0].length,m=n.slice(0,i+s.index+p+l);if(Math.min(i,l)%2){const w=m.slice(1,-1);return{type:"em",raw:m,text:w,tokens:this.lexer.inlineTokens(w)}}const h=m.slice(2,-2);return{type:"strong",raw:m,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(n){const e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(/\n/g," ");const s=/[^ ]/.test(t),o=/^ /.test(t)&&/ $/.test(t);return s&&o&&(t=t.substring(1,t.length-1)),t=_(t,!0),{type:"codespan",raw:e[0],text:t}}}br(n){const e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n){const e=this.rules.inline.del.exec(n);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(n){const e=this.rules.inline.autolink.exec(n);if(e){let t,s;return e[2]==="@"?(t=_(e[1]),s="mailto:"+t):(t=_(e[1]),s=t),{type:"link",raw:e[0],text:t,href:s,tokens:[{type:"text",raw:t,text:t}]}}}url(n){let e;if(e=this.rules.inline.url.exec(n)){let t,s;if(e[2]==="@")t=_(e[0]),s="mailto:"+t;else{let o;do o=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(o!==e[0]);t=_(e[0]),e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:t,href:s,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(n){const e=this.rules.inline.text.exec(n);if(e){let t;return this.lexer.state.inRawBlock?t=e[0]:t=_(e[0]),{type:"text",raw:e[0],text:t}}}}const it=/^(?: *(?:\n|$))+/,st=/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,ot=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,U=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,rt=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Me=/(?:[*+-]|\d{1,9}[.)])/,De=k(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,Me).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),de=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,at=/^[^\n]+/,fe=/(?!\s*\])(?:\\.|[^\[\]\\])+/,lt=k(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",fe).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ct=k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Me).getRegex(),oe="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ge=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,ut=k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",ge).replace("tag",oe).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Be=k(de).replace("hr",U).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",oe).getRegex(),ht=k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Be).getRegex(),me={blockquote:ht,code:st,def:lt,fences:ot,heading:rt,hr:U,html:ut,lheading:De,list:ct,newline:it,paragraph:Be,table:q,text:at},Ee=k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",U).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",oe).getRegex(),pt={...me,table:Ee,paragraph:k(de).replace("hr",U).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Ee).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",oe).getRegex()},dt={...me,html:k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ge).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:q,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:k(de).replace("hr",U).replace("heading",` *#{1,6} *[^
]`).replace("lheading",De).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ge=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ft=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ne=/^( {2,}|\\)\n(?!\s*$)/,gt=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Y="\\p{P}\\p{S}",mt=k(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,Y).getRegex(),yt=/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,kt=k(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,Y).getRegex(),bt=k("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,Y).getRegex(),vt=k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,Y).getRegex(),wt=k(/\\([punct])/,"gu").replace(/punct/g,Y).getRegex(),xt=k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),$t=k(ge).replace("(?:-->|$)","-->").getRegex(),Ct=k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",$t).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ne=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Tt=k(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",ne).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),He=k(/^!?\[(label)\]\[(ref)\]/).replace("label",ne).replace("ref",fe).getRegex(),Oe=k(/^!?\[(ref)\](?:\[\])?/).replace("ref",fe).getRegex(),Rt=k("reflink|nolink(?!\\()","g").replace("reflink",He).replace("nolink",Oe).getRegex(),ye={_backpedal:q,anyPunctuation:wt,autolink:xt,blockSkip:yt,br:Ne,code:ft,del:q,emStrongLDelim:kt,emStrongRDelimAst:bt,emStrongRDelimUnd:vt,escape:Ge,link:Tt,nolink:Oe,punctuation:mt,reflink:He,reflinkSearch:Rt,tag:Ct,text:gt,url:q},_t={...ye,link:k(/^!?\[(label)\]\((.*?)\)/).replace("label",ne).getRegex(),reflink:k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ne).getRegex()},le={...ye,escape:k(Ge).replace("])","~|])").getRegex(),url:k(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},At={...le,br:k(Ne).replace("{2,}","*").getRegex(),text:k(le.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},X={normal:me,gfm:pt,pedantic:dt},V={normal:ye,gfm:le,breaks:At,pedantic:_t};class F{constructor(n){b(this,"tokens");b(this,"options");b(this,"state");b(this,"tokenizer");b(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=n||O,this.options.tokenizer=this.options.tokenizer||new te,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const e={block:X.normal,inline:V.normal};this.options.pedantic?(e.block=X.pedantic,e.inline=V.pedantic):this.options.gfm&&(e.block=X.gfm,this.options.breaks?e.inline=V.breaks:e.inline=V.gfm),this.tokenizer.rules=e}static get rules(){return{block:X,inline:V}}static lex(n,e){return new F(e).lex(n)}static lexInline(n,e){return new F(e).inlineTokens(n)}lex(n){n=n.replace(/\r\n|\r/g,`
`),this.blockTokens(n,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){const t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(n,e=[]){this.options.pedantic?n=n.replace(/\t/g,"    ").replace(/^ +$/gm,""):n=n.replace(/^( *)(\t+)/gm,(a,l,d)=>l+"    ".repeat(d.length));let t,s,o,i;for(;n;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(a=>(t=a.call({lexer:this},n,e))?(n=n.substring(t.raw.length),e.push(t),!0):!1))){if(t=this.tokenizer.space(n)){n=n.substring(t.raw.length),t.raw.length===1&&e.length>0?e[e.length-1].raw+=`
`:e.push(t);continue}if(t=this.tokenizer.code(n)){n=n.substring(t.raw.length),s=e[e.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+t.raw,s.text+=`
`+t.text,this.inlineQueue[this.inlineQueue.length-1].src=s.text):e.push(t);continue}if(t=this.tokenizer.fences(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.heading(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.hr(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.blockquote(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.list(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.html(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.def(n)){n=n.substring(t.raw.length),s=e[e.length-1],s&&(s.type==="paragraph"||s.type==="text")?(s.raw+=`
`+t.raw,s.text+=`
`+t.raw,this.inlineQueue[this.inlineQueue.length-1].src=s.text):this.tokens.links[t.tag]||(this.tokens.links[t.tag]={href:t.href,title:t.title});continue}if(t=this.tokenizer.table(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.lheading(n)){n=n.substring(t.raw.length),e.push(t);continue}if(o=n,this.options.extensions&&this.options.extensions.startBlock){let a=1/0;const l=n.slice(1);let d;this.options.extensions.startBlock.forEach(c=>{d=c.call({lexer:this},l),typeof d=="number"&&d>=0&&(a=Math.min(a,d))}),a<1/0&&a>=0&&(o=n.substring(0,a+1))}if(this.state.top&&(t=this.tokenizer.paragraph(o))){s=e[e.length-1],i&&s.type==="paragraph"?(s.raw+=`
`+t.raw,s.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):e.push(t),i=o.length!==n.length,n=n.substring(t.raw.length);continue}if(t=this.tokenizer.text(n)){n=n.substring(t.raw.length),s=e[e.length-1],s&&s.type==="text"?(s.raw+=`
`+t.raw,s.text+=`
`+t.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=s.text):e.push(t);continue}if(n){const a="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,e}inline(n,e=[]){return this.inlineQueue.push({src:n,tokens:e}),e}inlineTokens(n,e=[]){let t,s,o,i=n,a,l,d;if(this.tokens.links){const c=Object.keys(this.tokens.links);if(c.length>0)for(;(a=this.tokenizer.rules.inline.reflinkSearch.exec(i))!=null;)c.includes(a[0].slice(a[0].lastIndexOf("[")+1,-1))&&(i=i.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(a=this.tokenizer.rules.inline.blockSkip.exec(i))!=null;)i=i.slice(0,a.index)+"["+"a".repeat(a[0].length-2)+"]"+i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(a=this.tokenizer.rules.inline.anyPunctuation.exec(i))!=null;)i=i.slice(0,a.index)+"++"+i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;n;)if(l||(d=""),l=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(c=>(t=c.call({lexer:this},n,e))?(n=n.substring(t.raw.length),e.push(t),!0):!1))){if(t=this.tokenizer.escape(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.tag(n)){n=n.substring(t.raw.length),s=e[e.length-1],s&&t.type==="text"&&s.type==="text"?(s.raw+=t.raw,s.text+=t.text):e.push(t);continue}if(t=this.tokenizer.link(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.reflink(n,this.tokens.links)){n=n.substring(t.raw.length),s=e[e.length-1],s&&t.type==="text"&&s.type==="text"?(s.raw+=t.raw,s.text+=t.text):e.push(t);continue}if(t=this.tokenizer.emStrong(n,i,d)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.codespan(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.br(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.del(n)){n=n.substring(t.raw.length),e.push(t);continue}if(t=this.tokenizer.autolink(n)){n=n.substring(t.raw.length),e.push(t);continue}if(!this.state.inLink&&(t=this.tokenizer.url(n))){n=n.substring(t.raw.length),e.push(t);continue}if(o=n,this.options.extensions&&this.options.extensions.startInline){let c=1/0;const f=n.slice(1);let p;this.options.extensions.startInline.forEach(m=>{p=m.call({lexer:this},f),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(o=n.substring(0,c+1))}if(t=this.tokenizer.inlineText(o)){n=n.substring(t.raw.length),t.raw.slice(-1)!=="_"&&(d=t.raw.slice(-1)),l=!0,s=e[e.length-1],s&&s.type==="text"?(s.raw+=t.raw,s.text+=t.text):e.push(t);continue}if(n){const c="Infinite loop on byte: "+n.charCodeAt(0);if(this.options.silent){console.error(c);break}else throw new Error(c)}}return e}}class ie{constructor(n){b(this,"options");this.options=n||O}code(n,e,t){const s=(e||"").match(/^\S*/)?.[0];return n=n.replace(/\n$/,"")+`
`,s?'<pre><code class="language-'+_(s)+'">'+(t?n:_(n,!0))+`</code></pre>
`:"<pre><code>"+(t?n:_(n,!0))+`</code></pre>
`}blockquote(n){return`<blockquote>
${n}</blockquote>
`}html(n,e){return n}heading(n,e,t){return`<h${e}>${n}</h${e}>
`}hr(){return`<hr>
`}list(n,e,t){const s=e?"ol":"ul",o=e&&t!==1?' start="'+t+'"':"";return"<"+s+o+`>
`+n+"</"+s+`>
`}listitem(n,e,t){return`<li>${n}</li>
`}checkbox(n){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(n){return`<p>${n}</p>
`}table(n,e){return e&&(e=`<tbody>${e}</tbody>`),`<table>
<thead>
`+n+`</thead>
`+e+`</table>
`}tablerow(n){return`<tr>
${n}</tr>
`}tablecell(n,e){const t=e.header?"th":"td";return(e.align?`<${t} align="${e.align}">`:`<${t}>`)+n+`</${t}>
`}strong(n){return`<strong>${n}</strong>`}em(n){return`<em>${n}</em>`}codespan(n){return`<code>${n}</code>`}br(){return"<br>"}del(n){return`<del>${n}</del>`}link(n,e,t){const s=_e(n);if(s===null)return t;n=s;let o='<a href="'+n+'"';return e&&(o+=' title="'+e+'"'),o+=">"+t+"</a>",o}image(n,e,t){const s=_e(n);if(s===null)return t;n=s;let o=`<img src="${n}" alt="${t}"`;return e&&(o+=` title="${e}"`),o+=">",o}text(n){return n}}class ke{strong(n){return n}em(n){return n}codespan(n){return n}del(n){return n}html(n){return n}text(n){return n}link(n,e,t){return""+t}image(n,e,t){return""+t}br(){return""}}class I{constructor(n){b(this,"options");b(this,"renderer");b(this,"textRenderer");this.options=n||O,this.options.renderer=this.options.renderer||new ie,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new ke}static parse(n,e){return new I(e).parse(n)}static parseInline(n,e){return new I(e).parseInline(n)}parse(n,e=!0){let t="";for(let s=0;s<n.length;s++){const o=n[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[o.type]){const i=o,a=this.options.extensions.renderers[i.type].call({parser:this},i);if(a!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(i.type)){t+=a||"";continue}}switch(o.type){case"space":continue;case"hr":{t+=this.renderer.hr();continue}case"heading":{const i=o;t+=this.renderer.heading(this.parseInline(i.tokens),i.depth,Je(this.parseInline(i.tokens,this.textRenderer)));continue}case"code":{const i=o;t+=this.renderer.code(i.text,i.lang,!!i.escaped);continue}case"table":{const i=o;let a="",l="";for(let c=0;c<i.header.length;c++)l+=this.renderer.tablecell(this.parseInline(i.header[c].tokens),{header:!0,align:i.align[c]});a+=this.renderer.tablerow(l);let d="";for(let c=0;c<i.rows.length;c++){const f=i.rows[c];l="";for(let p=0;p<f.length;p++)l+=this.renderer.tablecell(this.parseInline(f[p].tokens),{header:!1,align:i.align[p]});d+=this.renderer.tablerow(l)}t+=this.renderer.table(a,d);continue}case"blockquote":{const i=o,a=this.parse(i.tokens);t+=this.renderer.blockquote(a);continue}case"list":{const i=o,a=i.ordered,l=i.start,d=i.loose;let c="";for(let f=0;f<i.items.length;f++){const p=i.items[f],m=p.checked,h=p.task;let w="";if(p.task){const g=this.renderer.checkbox(!!m);d?p.tokens.length>0&&p.tokens[0].type==="paragraph"?(p.tokens[0].text=g+" "+p.tokens[0].text,p.tokens[0].tokens&&p.tokens[0].tokens.length>0&&p.tokens[0].tokens[0].type==="text"&&(p.tokens[0].tokens[0].text=g+" "+p.tokens[0].tokens[0].text)):p.tokens.unshift({type:"text",text:g+" "}):w+=g+" "}w+=this.parse(p.tokens,d),c+=this.renderer.listitem(w,h,!!m)}t+=this.renderer.list(c,a,l);continue}case"html":{const i=o;t+=this.renderer.html(i.text,i.block);continue}case"paragraph":{const i=o;t+=this.renderer.paragraph(this.parseInline(i.tokens));continue}case"text":{let i=o,a=i.tokens?this.parseInline(i.tokens):i.text;for(;s+1<n.length&&n[s+1].type==="text";)i=n[++s],a+=`
`+(i.tokens?this.parseInline(i.tokens):i.text);t+=e?this.renderer.paragraph(a):a;continue}default:{const i='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return t}parseInline(n,e){e=e||this.renderer;let t="";for(let s=0;s<n.length;s++){const o=n[s];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[o.type]){const i=this.options.extensions.renderers[o.type].call({parser:this},o);if(i!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){t+=i||"";continue}}switch(o.type){case"escape":{const i=o;t+=e.text(i.text);break}case"html":{const i=o;t+=e.html(i.text);break}case"link":{const i=o;t+=e.link(i.href,i.title,this.parseInline(i.tokens,e));break}case"image":{const i=o;t+=e.image(i.href,i.title,i.text);break}case"strong":{const i=o;t+=e.strong(this.parseInline(i.tokens,e));break}case"em":{const i=o;t+=e.em(this.parseInline(i.tokens,e));break}case"codespan":{const i=o;t+=e.codespan(i.text);break}case"br":{t+=e.br();break}case"del":{const i=o;t+=e.del(this.parseInline(i.tokens,e));break}case"text":{const i=o;t+=e.text(i.text);break}default:{const i='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(i),"";throw new Error(i)}}}return t}}class Z{constructor(n){b(this,"options");this.options=n||O}preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}}b(Z,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));var H,ce,je;class St{constructor(...n){Te(this,H);b(this,"defaults",pe());b(this,"options",this.setOptions);b(this,"parse",K(this,H,ce).call(this,F.lex,I.parse));b(this,"parseInline",K(this,H,ce).call(this,F.lexInline,I.parseInline));b(this,"Parser",I);b(this,"Renderer",ie);b(this,"TextRenderer",ke);b(this,"Lexer",F);b(this,"Tokenizer",te);b(this,"Hooks",Z);this.use(...n)}walkTokens(n,e){let t=[];for(const s of n)switch(t=t.concat(e.call(this,s)),s.type){case"table":{const o=s;for(const i of o.header)t=t.concat(this.walkTokens(i.tokens,e));for(const i of o.rows)for(const a of i)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{const o=s;t=t.concat(this.walkTokens(o.items,e));break}default:{const o=s;this.defaults.extensions?.childTokens?.[o.type]?this.defaults.extensions.childTokens[o.type].forEach(i=>{const a=o[i].flat(1/0);t=t.concat(this.walkTokens(a,e))}):o.tokens&&(t=t.concat(this.walkTokens(o.tokens,e)))}}return t}use(...n){const e=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(t=>{const s={...t};if(s.async=this.defaults.async||s.async||!1,t.extensions&&(t.extensions.forEach(o=>{if(!o.name)throw new Error("extension name required");if("renderer"in o){const i=e.renderers[o.name];i?e.renderers[o.name]=function(...a){let l=o.renderer.apply(this,a);return l===!1&&(l=i.apply(this,a)),l}:e.renderers[o.name]=o.renderer}if("tokenizer"in o){if(!o.level||o.level!=="block"&&o.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const i=e[o.level];i?i.unshift(o.tokenizer):e[o.level]=[o.tokenizer],o.start&&(o.level==="block"?e.startBlock?e.startBlock.push(o.start):e.startBlock=[o.start]:o.level==="inline"&&(e.startInline?e.startInline.push(o.start):e.startInline=[o.start]))}"childTokens"in o&&o.childTokens&&(e.childTokens[o.name]=o.childTokens)}),s.extensions=e),t.renderer){const o=this.defaults.renderer||new ie(this.defaults);for(const i in t.renderer){if(!(i in o))throw new Error(`renderer '${i}' does not exist`);if(i==="options")continue;const a=i,l=t.renderer[a],d=o[a];o[a]=(...c)=>{let f=l.apply(o,c);return f===!1&&(f=d.apply(o,c)),f||""}}s.renderer=o}if(t.tokenizer){const o=this.defaults.tokenizer||new te(this.defaults);for(const i in t.tokenizer){if(!(i in o))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const a=i,l=t.tokenizer[a],d=o[a];o[a]=(...c)=>{let f=l.apply(o,c);return f===!1&&(f=d.apply(o,c)),f}}s.tokenizer=o}if(t.hooks){const o=this.defaults.hooks||new Z;for(const i in t.hooks){if(!(i in o))throw new Error(`hook '${i}' does not exist`);if(i==="options")continue;const a=i,l=t.hooks[a],d=o[a];Z.passThroughHooks.has(i)?o[a]=c=>{if(this.defaults.async)return Promise.resolve(l.call(o,c)).then(p=>d.call(o,p));const f=l.call(o,c);return d.call(o,f)}:o[a]=(...c)=>{let f=l.apply(o,c);return f===!1&&(f=d.apply(o,c)),f}}s.hooks=o}if(t.walkTokens){const o=this.defaults.walkTokens,i=t.walkTokens;s.walkTokens=function(a){let l=[];return l.push(i.call(this,a)),o&&(l=l.concat(o.call(this,a))),l}}this.defaults={...this.defaults,...s}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,e){return F.lex(n,e??this.defaults)}parser(n,e){return I.parse(n,e??this.defaults)}}H=new WeakSet,ce=function(n,e){return(t,s)=>{const o={...s},i={...this.defaults,...o};this.defaults.async===!0&&o.async===!1&&(i.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),i.async=!0);const a=K(this,H,je).call(this,!!i.silent,!!i.async);if(typeof t>"u"||t===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof t!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(i.hooks&&(i.hooks.options=i),i.async)return Promise.resolve(i.hooks?i.hooks.preprocess(t):t).then(l=>n(l,i)).then(l=>i.hooks?i.hooks.processAllTokens(l):l).then(l=>i.walkTokens?Promise.all(this.walkTokens(l,i.walkTokens)).then(()=>l):l).then(l=>e(l,i)).then(l=>i.hooks?i.hooks.postprocess(l):l).catch(a);try{i.hooks&&(t=i.hooks.preprocess(t));let l=n(t,i);i.hooks&&(l=i.hooks.processAllTokens(l)),i.walkTokens&&this.walkTokens(l,i.walkTokens);let d=e(l,i);return i.hooks&&(d=i.hooks.postprocess(d)),d}catch(l){return a(l)}}},je=function(n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,n){const s="<p>An error occurred:</p><pre>"+_(t.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(t);throw t}};const G=new St;function y(r,n){return G.parse(r,n)}y.options=y.setOptions=function(r){return G.setOptions(r),y.defaults=G.defaults,Ie(y.defaults),y};y.getDefaults=pe;y.defaults=O;y.use=function(...r){return G.use(...r),y.defaults=G.defaults,Ie(y.defaults),y};y.walkTokens=function(r,n){return G.walkTokens(r,n)};y.parseInline=G.parseInline;y.Parser=I;y.parser=I.parse;y.Renderer=ie;y.TextRenderer=ke;y.Lexer=F;y.lexer=F.lex;y.Tokenizer=te;y.Hooks=Z;y.parse=y;y.options;y.setOptions;y.use;y.walkTokens;y.parseInline;I.parse;F.lex;async function Et(r){const n=await r.text(),e=new Map,t=new Map,s=n.split(`
`);for(const o of s){if(!o||o[0]==="#")continue;const i=o.split("	");if(i.length<4)continue;const a=i[0].trim(),l=i[1].trim(),d=i[2].trim(),c=i[3].trim();!c||c==="--"||(e.set(a,{chromosome:l,position:d,genotype:c}),t.set(`${l}:${d}`,{rsid:a,genotype:c}))}return{byRsid:e,byPosition:t,totalSnps:e.size}}let ae=null;async function Lt(r){if(ae)return ae;const n="./refdata/",e=[["comprehensiveSnps","comprehensive_snps.json"],["clinicalContext","clinical_context.json"],["pathways","pathways.json"],["clinvar","clinvar_snps.json"]],t=[["pharmgkb","pharmgkb.json"]],s={},o=[...e,...t];let i=0;for(const[a,l]of e){r?.(a,i,o.length);const d=await fetch(n+l);if(!d.ok)throw new Error(`Failed to load reference data: ${l}`);s[a]=await d.json(),i+=1,r?.(a,i,o.length)}for(const[a,l]of t){r?.(a,i,o.length);try{const d=await fetch(n+l);s[a]=d.ok?await d.json():{}}catch{s[a]={}}i+=1,r?.(a,i,o.length)}return ae=s,s}function Le(r){return r.length===2?r.split("").reverse().join(""):r}function Ft(r,n){const{comprehensiveSnps:e,pharmgkb:t}=n,s=[],o=[],i={total_snps:r.totalSnps,analyzed_snps:0,high_impact:0,moderate_impact:0,low_impact:0};for(const[a,l]of Object.entries(e)){const d=r.byRsid.get(a);if(!d)continue;const c=d.genotype,f=l.variants[c]||l.variants[Le(c)];f&&(s.push({rsid:a,gene:l.gene,category:l.category,genotype:c,status:f.status,description:f.desc,magnitude:f.magnitude,note:l.note||""}),i.analyzed_snps+=1,f.magnitude>=3?i.high_impact+=1:f.magnitude>=2?i.moderate_impact+=1:f.magnitude>=1&&(i.low_impact+=1))}for(const[a,l]of Object.entries(t)){const d=r.byRsid.get(a);if(!d)continue;const c=d.genotype,f=l.genotypes[c]||l.genotypes[Le(c)];f&&["1A","1B","2A","2B"].includes(l.level)&&o.push({rsid:a,gene:l.gene,drugs:l.drugs,genotype:c,annotation:f,level:l.level,category:l.category})}return s.sort((a,l)=>l.magnitude-a.magnitude),o.sort((a,l)=>a.level.localeCompare(l.level)),{findings:s,pharmgkbFindings:o,summary:i}}function be(r){return r.replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase())}function It(r){return r>=3?`🔴 HIGH (${r}/6)`:r===2?`🟡 MODERATE (${r}/6)`:r===1?`🟢 LOW (${r}/6)`:`⚪ NEUTRAL (${r}/6)`}function zt(r){return r==="1A"||r==="1B"?`🔵 ${r} - Clinical guideline annotation`:r==="2A"||r==="2B"?`🟣 ${r} - Variant has moderate evidence`:`⚫ ${r}`}function ve(r,n,e){return r[`${n}|${e}`]||null}function Pt(r,n){return Object.entries(r).filter(([,e])=>e.includes(n)).map(([e])=>e)}function Fe(r,n,e,t){const s=[];s.push(`### ${n}. ${r.gene} (${r.rsid})`,""),s.push(`**Category:** ${r.category}  `),s.push(`**Your Genotype:** \`${r.genotype}\`  `),s.push(`**Status:** ${be(r.status)}  `),s.push(`**Impact:** ${It(r.magnitude)}`,""),s.push(`**Description:** ${r.description}`),r.note&&s.push("",`**Note:** ${r.note}`);const o=Pt(t,r.gene);o.length&&s.push("",`**Related Pathways:** ${o.join(", ")}`);const i=ve(e,r.gene,r.status);if(i){if(s.push("","#### Mechanism",i.mechanism),i.implications?.length){s.push("","#### Implications");for(const a of i.implications)s.push(`- ${a}`)}if(i.actions?.length){s.push("","#### Recommended Actions");for(const a of i.actions)s.push(`- ${a}`)}if(i.interactions?.length){s.push("","#### Gene Interactions");for(const a of i.interactions)s.push(`- ${a}`)}}return s.push("","---",""),s.join(`
`)}function Mt(r,n){const e=[];return e.push(`### ${n}. ${r.gene} - ${r.rsid}`,""),e.push(`**Evidence Level:** ${zt(r.level)}  `),e.push(`**Category:** ${r.category}  `),e.push(`**Your Genotype:** \`${r.genotype}\`  `),e.push(`**Affected Drugs:** ${r.drugs}`,""),e.push("#### Clinical Annotation",r.annotation,""),["1A","1B"].includes(r.level)&&e.push("#### Clinical Significance","This is a high-evidence drug-gene interaction with clinical guideline support. Discuss with prescribing physicians before starting these medications."),e.push("---",""),e.join(`
`)}function Dt(r){const{findings:n,pharmgkbFindings:e,summary:t}=r,s=n.filter(f=>f.magnitude>=3),o=n.filter(f=>f.magnitude===2),i=n.filter(f=>f.magnitude===1),a=e.filter(f=>f.level.startsWith("1")),l=e.filter(f=>f.level.startsWith("2")),d=[...new Set(n.map(f=>f.category))].sort(),c=[];c.push("# Exhaustive Genetic Health Report",""),c.push(`**Generated:** ${new Date().toISOString().slice(0,16).replace("T"," ")}`,""),c.push("---","","## Executive Summary",""),c.push("### Genome Overview"),c.push(`- **Total SNPs in Raw Data:** ${t.total_snps.toLocaleString()}`),c.push(`- **Clinically Relevant SNPs Analyzed:** ${n.length}`),c.push(`- **PharmGKB Drug Interactions:** ${e.length}`,""),c.push("### Impact Distribution"),c.push(`- 🔴 **High Impact (magnitude ≥3):** ${s.length}`),c.push(`- 🟡 **Moderate Impact (magnitude 2):** ${o.length}`),c.push(`- 🟢 **Low Impact (magnitude 1):** ${i.length}`),c.push(`- ⚪ **Informational (magnitude 0):** ${n.length-s.length-o.length-i.length}`,""),c.push("### Pharmacogenomics"),c.push(`- 🔵 **Level 1 (Clinical Guidelines):** ${a.length}`),c.push(`- 🟣 **Level 2 (Moderate Evidence):** ${l.length}`,""),c.push("### Categories Covered");for(const f of d){const p=n.filter(m=>m.category===f).length;c.push(`- ${f}: ${p} findings`)}return c.push("","---",""),c.join(`
`)}function Bt(r,n,e){const t=r.filter(i=>i.magnitude>=3),s=r.filter(i=>i.magnitude===2),o=[];return o.push("## 🔴 Priority Findings (High Impact)",""),o.push("These findings have the most significant implications for your health decisions.",""),t.forEach((i,a)=>o.push(Fe(i,a+1,n,e))),s.length&&(o.push("## 🟡 Moderate Impact Findings",""),o.push("These findings warrant attention and may influence health decisions.",""),s.forEach((i,a)=>o.push(Fe(i,a+1,n,e)))),o.join(`
`)}function Gt(r,n){const e=[];e.push("## 🔗 Pathway Analysis",""),e.push("Your genes grouped by biological pathway, showing how multiple variants may interact.","");for(const[t,s]of Object.entries(n)){const o=r.filter(i=>s.includes(i.gene));if(o.length){e.push(`### ${t}`,"");for(const i of o){const a=i.magnitude>=3?"🔴":i.magnitude===2?"🟡":i.magnitude===1?"🟢":"⚪";e.push(`- ${a} **${i.gene}:** ${be(i.status)}`)}if(e.push(""),t==="Methylation Cycle"){const i=o.find(l=>l.gene==="MTHFR"&&l.magnitude>=2),a=o.find(l=>l.gene==="MTRR"&&l.magnitude>=2);i&&a&&e.push("⚠️ **Pathway Impact:** Multiple methylation cycle variants detected. Consider comprehensive methylation support (methylfolate + methylcobalamin + B2).","")}else t==="Blood Pressure"&&o.filter(a=>a.magnitude>=1).length>=2&&e.push("⚠️ **Pathway Impact:** Multiple blood pressure-related variants. Recommend regular monitoring and lifestyle optimization.","");e.push("---","")}}return e.join(`
`)}function Nt(r,n){const e=[...new Set(r.map(s=>s.category||"Other"))].sort(),t=[];t.push("## Complete Findings by Category",""),t.push("Every genetic finding analyzed, organized by category.","");for(const s of e){const o=r.filter(i=>i.category===s);o.length&&(t.push(`### 📂 ${s}`,""),o.sort((i,a)=>a.magnitude-i.magnitude),o.forEach((i,a)=>{const l=be(i.status),d=i.magnitude>=3?"🔴":i.magnitude===2?"🟡":i.magnitude===1?"🟢":"⚪";t.push(`#### ${a+1}. ${i.gene} (${i.rsid}) ${d}`),t.push(`- **Genotype:** \`${i.genotype}\` | **Status:** ${l} | **Impact:** ${i.magnitude}/6`),t.push(`- ${i.description}`);const c=ve(n,i.gene,i.status);c&&(t.push(`- **Mechanism:** ${c.mechanism.slice(0,200)}...`),c.actions?.length&&t.push(`- **Key Action:** ${c.actions[0]}`)),t.push("")}),t.push("---",""))}return t.join(`
`)}function Ht(r){const n=[];n.push("## 💊 Pharmacogenomics - Complete Drug-Gene Interactions",""),n.push("This section contains all drug-gene interactions from PharmGKB with clinical annotations.","Share this information with prescribing physicians before starting new medications.","");const e=s=>r.filter(o=>o.level===s),t=[["1A","Level 1A - Highest Evidence (Clinical Guideline Annotations)"],["1B","Level 1B - High Evidence (Clinical Guideline Annotations)"],["2A","Level 2A - Moderate Evidence"],["2B","Level 2B - Moderate Evidence"]];for(const[s,o]of t){const i=e(s);i.length&&(n.push(`### ${o}`,""),i.forEach((a,l)=>n.push(Mt(a,l+1))))}return n.join(`
`)}function Ot(r,n){const e=[];e.push("## 📋 Comprehensive Action Summary","");const t={supplement:[],diet:[],lifestyle:[],monitoring:[],medical:[]},s=(i,a)=>a.some(l=>i.includes(l));for(const i of r){const a=ve(n,i.gene,i.status);if(a?.actions)for(const l of a.actions){const d=l.toLowerCase(),c=`- ${l} *(from ${i.gene})*`;s(d,["supplement","vitamin","mg","mcg","iu","dose"])?t.supplement.push(c):s(d,["diet","eat","food","limit","avoid","meal"])?t.diet.push(c):s(d,["exercise","sleep","stress","meditation"])?t.lifestyle.push(c):s(d,["test","monitor","check","measure"])?t.monitoring.push(c):s(d,["doctor","physician","medical","prescrib"])&&t.medical.push(c)}}const o=i=>[...new Set(i)];return t.supplement.length&&(e.push("### 💊 Supplement Considerations","*Discuss with healthcare provider before starting*",""),e.push(...o(t.supplement).slice(0,15),"")),t.diet.length&&(e.push("### 🥗 Dietary Recommendations",""),e.push(...o(t.diet).slice(0,10),"")),t.lifestyle.length&&(e.push("### 🏃 Lifestyle Actions",""),e.push(...o(t.lifestyle).slice(0,10),"")),t.monitoring.length&&(e.push("### 📊 Monitoring Recommendations",""),e.push(...o(t.monitoring).slice(0,10),"")),t.medical.length&&(e.push("### 🏥 Medical Considerations",""),e.push(...o(t.medical).slice(0,10),"")),e.push("---",""),e.join(`
`)}function jt(){return`## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT medical advice.

### Key Points:
- Genetic associations are probabilistic, not deterministic
- Your genes are just one factor - environment, lifestyle, and other genes matter
- "Risk" variants don't guarantee outcomes; "protective" variants don't guarantee safety
- Consult healthcare providers before making medical decisions
- Some findings may have different implications in different populations
- Genetic science evolves - recommendations may change as research advances

### How to Use This Report:
1. **Share with providers** - Especially the pharmacogenomics section before new medications
2. **Focus on actionable items** - Prioritize evidence-based interventions
3. **Don't over-interpret** - One gene doesn't define your health destiny
4. **Combine with testing** - Many recommendations include follow-up lab tests

---

*Report generated entirely in your browser. Your genetic data was never uploaded anywhere.*
`}function Vt(r,n,e){const{clinicalContext:t,pathways:s}=n;let i=[Dt(r),Bt(r.findings,t,s),Gt(r.findings,s),Nt(r.findings,t),Ht(r.pharmgkbFindings),Ot(r.findings,t),jt()].join(`
`);return e&&(i=i.replace("# Exhaustive Genetic Health Report",`# Exhaustive Genetic Health Report

**Subject:** ${e}`)),i}function qt(r,n){const e=n.clinvar,t={pathogenic:[],likely_pathogenic:[],risk_factor:[],drug_response:[],protective:[],other_significant:[]},s={total_clinvar_positions:Object.keys(e).length,matched:0,pathogenic_matched:0,likely_pathogenic_matched:0};for(const[o,i]of r.byPosition){const a=e[o];if(a){s.matched+=1;for(const l of a){const d=i.genotype,c=l.ref,f=l.alt,p=l.sig.toLowerCase(),m=d.includes(f),h=d===f+f,w=m&&!h;if(d===c+c||!m)continue;const[A,x]=o.split(":"),R={chromosome:A,position:x,rsid:i.rsid,gene:l.gene,ref:c,alt:f,user_genotype:d,is_homozygous:h,is_heterozygous:w,clinical_significance:l.sig,review_status:l.review,gold_stars:l.stars||0,traits:l.traits,inheritance:l.inherit||"",hgvs_p:l.hgvs_p||"",hgvs_c:l.hgvs_c||"",molecular_consequence:l.mc||"",xrefs:l.xrefs||"",pmids:l.pmids||""};p.includes("pathogenic")&&!p.includes("likely")&&!p.includes("conflict")?(t.pathogenic.push(R),s.pathogenic_matched+=1):p.includes("likely pathogenic")||p.includes("likely_pathogenic")?(t.likely_pathogenic.push(R),s.likely_pathogenic_matched+=1):p.includes("risk factor")||p.includes("risk_factor")?t.risk_factor.push(R):p.includes("drug response")||p.includes("drug_response")?t.drug_response.push(R):p.includes("protective")?t.protective.push(R):(p.includes("association")||p.includes("affects"))&&t.other_significant.push(R)}}}return{findings:t,stats:s}}function Zt(r){const n=(r.inheritance||"").toLowerCase();return r.is_homozygous?["AFFECTED","Homozygous for variant"]:r.is_heterozygous?n.includes("recessive")?["CARRIER","Heterozygous carrier (recessive)"]:n.includes("dominant")?["AFFECTED","Heterozygous (dominant)"]:["HETEROZYGOUS","Heterozygous (inheritance unclear)"]:["UNKNOWN","Zygosity unclear"]}const Ut={CFTR:`**Cystic Fibrosis Carrier (CFTR)**:
- CF carriers may have ~10% reduced lung function (FEV1)
- Increased risk of pancreatitis (2-3x general population)
- Higher prevalence of chronic sinusitis
- Possible male fertility effects (CBAVD spectrum)
- **Recommendation**: Baseline pulmonary function test, avoid smoking, genetic counseling if planning pregnancy
`,HBB:`**Sickle Cell Trait Carrier (HBB)**:
- Generally asymptomatic under normal conditions
- Possible complications at extreme altitude or severe dehydration
- Malaria resistance (evolutionary advantage)
- **Recommendation**: Stay hydrated during intense exercise; inform physicians before surgery
`,GBA:`**Gaucher Disease Carrier (GBA)**:
- Carriers have increased Parkinson's disease risk (5-8x)
- No Gaucher disease symptoms
- **Recommendation**: Awareness of early Parkinson's symptoms; inform neurologist
`,SERPINA1:`**Alpha-1 Antitrypsin Carrier (SERPINA1)**:
- Carriers (MZ) have ~60% normal AAT levels
- Mildly increased risk of COPD, especially if smoking
- **Recommendation**: Absolutely avoid smoking; baseline liver function; consider AAT level testing
`,HFE:`**Hemochromatosis Carrier (HFE)**:
- Carriers may have mildly elevated iron absorption
- Usually clinically insignificant
- **Recommendation**: Periodic ferritin monitoring; avoid unnecessary iron supplements
`,HEXA:`**Tay-Sachs Carrier (HEXA)**:
- Carriers have no symptoms or health effects
- Purely reproductive implications
- **Recommendation**: Carrier testing for partner if planning pregnancy
`,SMN1:`**Spinal Muscular Atrophy Carrier (SMN1)**:
- Carriers have no symptoms
- ~1 in 50 people are carriers
- **Recommendation**: Carrier testing for partner if planning pregnancy
`,PAH:`**Phenylketonuria Carrier (PAH)**:
- Carriers have no symptoms
- Normal phenylalanine metabolism
- **Recommendation**: Carrier testing for partner if planning pregnancy
`};function ue(r){const n=(r||"").toUpperCase();return Ut[n]||`**Carrier Phenotype Notes:**
- Carrier status typically does not cause symptoms for recessive conditions
- Primary implication is reproductive risk if partner is also a carrier
- Some carriers may have subtle biochemical differences without clinical significance
- **Recommended:** Genetic counseling if planning pregnancy
`}function Ve(r){const n=[],e=[],t=[];for(const o of[...r.pathogenic,...r.likely_pathogenic]){const[i,a]=Zt(o);o.zygosity_status=i,o.zygosity_description=a,i==="AFFECTED"?n.push(o):i==="CARRIER"?e.push(o):t.push(o)}const s=(o,i)=>i.gold_stars-o.gold_stars||o.gene.localeCompare(i.gene);return[n,e,t,r.risk_factor,r.drug_response,r.protective].forEach(o=>o.sort(s)),{affected:n,carriers:e,hetUnknown:t}}function Yt(r,n,e){const{findings:t,stats:s}=r,o=new Date().toISOString().slice(0,16).replace("T"," "),{affected:i,carriers:a,hetUnknown:l}=Ve(t),d=e?`
**Subject:** ${e}`:"",c=h=>"⭐".repeat(h)+"☆".repeat(4-h),f=h=>h.traits?h.traits.split(";")[0]:"Condition not specified";let p=`# Exhaustive Disease Risk Report
${d}
**Generated:** ${o}

---

## Executive Summary

### Genome Overview
- **Total SNPs in Raw Data:** ${n.toLocaleString()}
- **Your Positions Matched Against ClinVar:** ${s.matched.toLocaleString()}

### Clinical Findings Summary

| Category | Count | Description |
|----------|-------|-------------|
| 🔴 **Pathogenic (Affected)** | ${i.length} | Homozygous or dominant - clinical phenotype expected |
| 🟠 **Pathogenic (Carrier)** | ${a.length} | Heterozygous carrier for recessive conditions |
| 🟡 **Likely Pathogenic** | ${l.length} | Heterozygous, inheritance unclear |
| 🔵 **Risk Factors** | ${t.risk_factor.length} | Increased disease susceptibility |
| 💊 **Drug Response** | ${t.drug_response.length} | Pharmacogenomic variants |
| 🟢 **Protective** | ${t.protective.length} | Reduced disease risk |
| ⚪ **Other Associations** | ${t.other_significant.length} | Other clinically noted variants |

### Confidence Levels (Gold Stars)
- ⭐⭐⭐⭐ (4): Practice guideline / Expert panel reviewed
- ⭐⭐⭐ (3): Multiple submitters, no conflicts
- ⭐⭐ (2): Multiple submitters with some conflicts, or single submitter with criteria
- ⭐ (1): Single submitter with criteria
- ☆ (0): No assertion criteria provided

---

`;if(i.length){p+=`## 🔴 Pathogenic Variants — Affected Status

These variants are classified as pathogenic and your genotype suggests you may be affected.
**Consult a genetic counselor or physician for clinical interpretation.**

`;for(const h of i)p+=`### ${h.gene} — ${f(h)}

| Field | Value |
|-------|-------|
| **Gene** | ${h.gene} |
| **Position** | chr${h.chromosome}:${h.position} |
| **RSID** | ${h.rsid} |
| **Your Genotype** | \`${h.user_genotype}\` |
| **Variant** | ${h.ref} → ${h.alt} |
| **Zygosity** | ${h.is_homozygous?"Homozygous":"Heterozygous"} |
| **Clinical Significance** | ${h.clinical_significance} |
| **Confidence** | ${c(h.gold_stars)} (${h.gold_stars}/4) |
| **Review Status** | ${h.review_status} |
| **Inheritance** | ${h.inheritance||"Not specified"} |

**Condition(s):** ${h.traits||"Not specified"}

**Molecular Detail:** ${h.hgvs_p||h.hgvs_c||"Not available"}

**Consequence:** ${h.molecular_consequence||"Not specified"}

**Database References:** ${h.xrefs||"None"}

**Literature:** ${h.pmids||"None"}

---

`}if(a.length){p+=`## 🟠 Carrier Status — Recessive Conditions

You are a heterozygous carrier for these autosomal recessive conditions.
**Carriers typically do not show symptoms but may pass the variant to offspring.**

### Reproductive Implications
- If your partner is also a carrier for the same condition: **25% chance** of affected child
- If your partner is affected: **50% chance** of affected child
- Consider genetic counseling if planning pregnancy

`;for(const h of a)p+=`### ${h.gene} — ${f(h)}

| Field | Value |
|-------|-------|
| **Gene** | ${h.gene} |
| **Position** | chr${h.chromosome}:${h.position} |
| **RSID** | ${h.rsid} |
| **Your Genotype** | \`${h.user_genotype}\` (Carrier) |
| **Variant** | ${h.ref} → ${h.alt} |
| **Clinical Significance** | ${h.clinical_significance} |
| **Confidence** | ${c(h.gold_stars)} (${h.gold_stars}/4) |
| **Inheritance** | Autosomal Recessive |

**Full Condition(s):** ${h.traits||"Not specified"}

**Molecular Detail:** ${h.hgvs_p||h.hgvs_c||"Not available"}

${ue(h.gene)}

**Database References:** ${h.xrefs||"None"}

---

`}if(l.length){p+=`## 🟡 Pathogenic/Likely Pathogenic — Inheritance Unclear

You are heterozygous for these variants. The inheritance pattern is not clearly specified,
so clinical impact is uncertain. Some may be dominant (one copy = affected), others may be
carrier status only.

`;for(const h of l)p+=`### ${h.gene} — ${f(h)}

| Field | Value |
|-------|-------|
| **Gene** | ${h.gene} |
| **Position** | chr${h.chromosome}:${h.position} |
| **RSID** | ${h.rsid} |
| **Your Genotype** | \`${h.user_genotype}\` |
| **Variant** | ${h.ref} → ${h.alt} |
| **Clinical Significance** | ${h.clinical_significance} |
| **Confidence** | ${c(h.gold_stars)} (${h.gold_stars}/4) |
| **Inheritance** | ${h.inheritance||"Not specified"} |

**Condition(s):** ${h.traits||"Not specified"}

**Molecular Detail:** ${h.hgvs_p||h.hgvs_c||"Not available"}

---

`}const m=(h,w,g)=>{let A=`## ${h}

${w}

`;for(const x of g)A+=`### ${x.gene} — ${f(x)}

| **RSID** | **Genotype** | **Significance** | **Confidence** |
|----------|--------------|------------------|----------------|
| ${x.rsid} | \`${x.user_genotype}\` | ${x.clinical_significance} | ${c(x.gold_stars)} |

**Details:** ${x.traits||"Not specified"}

---

`;return A};if(t.risk_factor.length&&(p+=m("🔵 Risk Factor Variants","These variants are associated with increased susceptibility to certain conditions. They do not guarantee disease but indicate elevated risk.",t.risk_factor)),t.drug_response.length&&(p+=m("💊 Drug Response Variants","These variants affect response to medications.",t.drug_response)),t.protective.length&&(p+=m("🟢 Protective Variants","These variants are associated with reduced disease risk or protective effects.",t.protective)),t.other_significant.length){p+=`## ⚪ Other Clinically Noted Variants

These variants have clinical annotations that don't fit the above categories.

`;for(const h of t.other_significant.slice(0,50))p+=`### ${h.gene} — ${h.rsid}

| **Genotype** | **Significance** | **Confidence** | **Traits** |
|--------------|------------------|----------------|------------|
| \`${h.user_genotype}\` | ${h.clinical_significance} | ${c(h.gold_stars)} | ${(h.traits||"Not specified").slice(0,100)}... |

---

`}return p+=`## 📊 Analysis Statistics

| Metric | Value |
|--------|-------|
| Total SNPs in genome | ${n.toLocaleString()} |
| Genome positions matched against ClinVar | ${s.matched.toLocaleString()} |
| Pathogenic variants found | ${s.pathogenic_matched} |
| Likely pathogenic variants found | ${s.likely_pathogenic_matched} |
| Risk factors found | ${t.risk_factor.length} |
| Drug response variants | ${t.drug_response.length} |
| Protective variants | ${t.protective.length} |

---

## ⚠️ Important Disclaimer

This report is for **informational and educational purposes only**. It is NOT a clinical diagnosis.

### Key Points:
- Variant classifications are based on ClinVar submissions and may change over time
- Clinical significance depends on individual and family history
- Many variants have incomplete penetrance (not everyone with variant develops condition)
- Carrier status has reproductive implications but typically no personal health impact
- Variants with low gold stars have less evidence supporting their classification
- **Consult a genetic counselor or physician for clinical interpretation**

### How to Use This Report:
1. **Pathogenic/Affected**: Discuss with physician immediately
2. **Carrier Status**: Consider genetic counseling if planning pregnancy
3. **Risk Factors**: Inform preventive care decisions
4. **Drug Response**: Share with prescribing physicians

---

*Report generated entirely in your browser using a bundled ClinVar database snapshot. Your genetic data was never uploaded anywhere.*
`,{report:p,affected:i,carriers:a,hetUnknown:l}}function Qt(r,n,e,t){const s=new Date().toISOString().slice(0,16).replace("T"," "),o=t?`
**Subject:** ${t}`:"",i={};for(const u of r.findings)i[u.gene]=u;const{affected:a,carriers:l,hetUnknown:d}=e,c=n?.findings||{},f=r.findings.length,p=r.pharmgkbFindings.length,m=c.risk_factor?.length||0,h=c.drug_response?.length||0,w=c.protective?.length||0;let g=`# Actionable Health Protocol (V3)
${o}
**Generated:** ${s}

This protocol synthesizes ALL genetic findings into concrete recommendations:
- Lifestyle/health genetics (${f} findings)
- PharmGKB drug interactions (${p} interactions)
- Pathogenic/likely pathogenic variants (${a.length} affected, ${l.length} carrier, ${d.length} unclear)
- Risk factors (${m} variants)
- ClinVar drug response (${h} variants)
- Protective variants (${w} variants)

---

## Executive Summary

### High-Impact Lifestyle Findings (Magnitude >= 3)

`;const A=r.findings.filter(u=>u.magnitude>=3);if(A.length)for(const u of A)g+=`- **${u.gene}** (${u.category}): ${u.description}
`;else g+=`None detected.
`;g+=`
### Pathogenic/Likely Pathogenic Variants

`;const x=u=>u.traits?u.traits.split(";")[0]:"Unknown condition",R=u=>u>0?`(${u}/4 stars)`:"(low confidence)";if(a.length){g+=`**Affected Status:**
`;for(const u of a)g+=`- **${u.gene}**: ${x(u)} ${R(u.gold_stars)}
`;g+=`
`}if(l.length){g+=`**Carrier Status (Recessive):**
`;for(const u of l)g+=`- **${u.gene}**: ${x(u)} ${R(u.gold_stars)}
`;g+=`
`}if(d.length){g+=`**Heterozygous (Inheritance Unclear):**
`;for(const u of d)g+=`- **${u.gene}**: ${x(u)} ${R(u.gold_stars)}
`;g+=`
`}if(!a.length&&!l.length&&!d.length&&(g+=`None detected.

`),g+=`### Protective Variants

`,c.protective?.length)for(const u of c.protective)g+=`- **${u.gene}**: ${x(u)}
`;else g+=`None detected.
`;g+=`

---

## Supplement Recommendations

*Discuss with healthcare provider before starting any supplements*

`;const $=[],v=u=>i[u],S=u=>i[u]?.status;if(v("MTHFR")&&i.MTHFR.magnitude>=2&&($.push({name:"Methylfolate (L-5-MTHF)",dose:"400-800mcg daily",reason:"MTHFR variant reduces folic acid conversion",notes:"Avoid synthetic folic acid. Start low if slow COMT."}),$.push({name:"Methylcobalamin (B12)",dose:"1000mcg sublingual",reason:"Supports methylation cycle",notes:"Prefer methylcobalamin over cyanocobalamin"})),v("MTRR")&&i.MTRR.magnitude>=2&&($.some(u=>u.name.includes("B12"))||$.push({name:"Methylcobalamin (B12)",dose:"1000-5000mcg sublingual",reason:"MTRR variant impairs B12 recycling",notes:"May need higher doses than typical"})),S("GC")==="low"&&($.push({name:"Vitamin D3",dose:"2000-5000 IU daily",reason:"Genetically low vitamin D binding protein",notes:"Take with fat. Test 25-OH-D after 2-3 months. Target 40-60 ng/mL."}),$.push({name:"Vitamin K2 (MK-7)",dose:"100-200mcg daily",reason:"Synergistic with D3 for calcium metabolism",notes:"Optional but recommended with high-dose D3"})),S("FADS1")==="low_conversion"&&$.push({name:"Fish Oil or Algae Oil (EPA/DHA)",dose:"1-2g EPA+DHA daily",reason:"Poor conversion from plant omega-3s (ALA)",notes:"Direct marine source required. Flax/chia insufficient."}),S("COMT")==="slow"&&$.push({name:"Magnesium Glycinate",dose:"300-400mg evening",reason:"Supports COMT function, calming effect",notes:"Glycinate form preferred for bioavailability and sleep"}),v("PEMT")&&$.push({name:"Choline (Phosphatidylcholine or CDP-Choline)",dose:"250-500mg daily",reason:"PEMT variant increases dietary choline requirement",notes:"Eggs are excellent food source (2 eggs = ~300mg)"}),S("BCMO1")==="reduced"&&$.push({name:"Preformed Vitamin A or Cod Liver Oil",dose:"2500-5000 IU (as retinol)",reason:"Poor conversion from beta-carotene",notes:"Get from food (liver, eggs) or supplement. Avoid excess."}),S("IL6")==="high"&&$.push({name:"Omega-3 (EPA/DHA)",dose:"2-3g daily",reason:"Higher baseline inflammation (IL-6)",notes:"Anti-inflammatory. Consider curcumin as well."}),$.length){g+=`| Supplement | Dose | Reason | Notes |
|------------|------|--------|-------|
`;for(const u of $)g+=`| ${u.name} | ${u.dose} | ${u.reason} | ${u.notes} |
`}else g+=`No specific supplements indicated by genetic profile.
`;g+=`

---

## Dietary Recommendations

`;const z=[];S("APOA2")==="sensitive"&&z.push("**Limit saturated fat (<7% calories)**: APOA2 variant links sat fat intake to weight gain. Minimize butter, fatty red meat, full-fat dairy, coconut oil. Prefer olive oil, nuts, avocado."),v("MTHFR")&&i.MTHFR.magnitude>=2&&z.push("**Emphasize folate-rich foods**: Leafy greens, legumes, liver. Avoid folic acid-fortified processed foods when possible (UMFA accumulation risk)."),v("IL6")&&z.push("**Anti-inflammatory diet**: Omega-3 rich fish, colorful vegetables, minimize processed foods. Sleep deprivation spikes IL-6."),(i["MCM6/LCT"]?.status||"").includes("intolerant")&&z.push("**Lactose intolerance**: May tolerate small amounts or fermented dairy (yogurt, aged cheese). Lactase supplements available. Ensure calcium from other sources."),v("HLA-DQA1")&&z.push("**Celiac risk (HLA-DQ2.5)**: No preventive gluten-free diet needed. If GI symptoms arise, get celiac antibody testing (tTG-IgA) *while still eating gluten*.");const j=[];if(["slow","intermediate"].includes(S("CYP1A2"))&&j.push("slow metabolizer"),S("ADORA2A")==="anxiety_prone"&&j.push("anxiety-prone"),S("COMT")==="slow"&&j.push("slow COMT"),j.length&&z.push(`**Caffeine caution** (${j.join(", ")}): Limit to morning only (before 10am). Consider lower doses, green tea (L-theanine), or alternatives.`),v("HFE")&&z.push("**Iron awareness (HFE carrier)**: Don't supplement iron unless deficiency confirmed. Blood donation helps regulate if ferritin runs high."),z.length)for(const u of z)g+=`- ${u}

`;else g+=`No specific dietary modifications beyond general healthy eating.
`;g+=`
---

## Lifestyle Recommendations

`;const L=[];if(S("COMT")==="slow"&&L.push("**Stress management is critical**: Slow COMT means catecholamines (dopamine, norepinephrine) build up under stress. Daily meditation, breathwork, adequate sleep. Avoid combining multiple stimulants."),v("BDNF")&&i.BDNF.magnitude>=2&&L.push("**Exercise is essential**: BDNF variant reduces activity-dependent brain growth factor. Physical activity is one of the strongest natural BDNF boosters."),v("ACTN3")){const u=S("ACTN3");u==="endurance"?L.push("**Training style (ACTN3 endurance)**: Genetics favor endurance/aerobic training. Can still build strength but may excel at higher volume, aerobic work."):u==="power"?L.push("**Training style (ACTN3 power)**: Genetics favor explosive/strength training. May recover faster from power-based work."):L.push("**Training style (ACTN3 mixed)**: Versatile profile - respond well to both power and endurance training.")}v("ARNTL")&&L.push("**Circadian rhythm support (ARNTL)**: May have weaker internal clock. Strong morning light exposure, consistent sleep/wake times even weekends, blue light reduction in evening.");const we=["AGTR1","ACE","AGT","GNB3"];if(we.filter(u=>v(u)).length>=2&&L.push("**Blood pressure focus**: Multiple BP-related variants. Regular monitoring, sodium restriction, DASH diet pattern, 150+ min/week aerobic exercise."),v("MC1R")&&L.push("**Sun protection (MC1R)**: Accelerated skin aging variant. Daily SPF 30+, topical retinoids, antioxidant serums. Avoid excessive sun exposure."),L.length)for(const u of L)g+=`- ${u}

`;else g+=`Standard healthy lifestyle recommendations apply.
`;g+=`
---

## Monitoring Recommendations

`;const E=[];if(v("MTHFR")&&i.MTHFR.magnitude>=2&&E.push("**Homocysteine**: Annually. Target <10 µmol/L. MTHFR variant affects metabolism."),v("MTRR")&&i.MTRR.magnitude>=2&&E.push("**B12 + Methylmalonic acid (MMA)**: For functional B12 status. MTRR affects recycling."),v("GC")&&E.push("**25-OH Vitamin D**: After 2-3 months supplementation, then annually. Target 40-60 ng/mL."),we.some(u=>v(u))&&E.push("**Blood pressure**: Home monitoring recommended. Multiple BP-related variants."),v("HFE")&&E.push("**Ferritin/iron panel**: Every 1-2 years. HFE carrier status."),v("TCF7L2")&&i.TCF7L2.magnitude>=2&&E.push("**Fasting glucose or HbA1c**: Annually. TCF7L2 diabetes risk variant."),c.risk_factor?.length){const u=new Set;for(const C of c.risk_factor){const M=(C.traits||"").toLowerCase();M.includes("macular degeneration")&&u.add("macular_degeneration"),M.includes("diabetes")&&u.add("diabetes"),M.includes("hypertension")&&u.add("hypertension"),(M.includes("thrombosis")||M.includes("thromboembolism"))&&u.add("thrombosis")}u.has("macular_degeneration")&&E.push("**Eye exams**: Regular ophthalmology. Multiple age-related macular degeneration risk variants (CFH, C3, ERCC6)."),u.has("diabetes")&&!v("TCF7L2")&&E.push("**Glucose monitoring**: Multiple diabetes susceptibility variants detected."),u.has("thrombosis")&&E.push("**Clotting awareness**: Risk variants for venous thrombosis (F13B, FGA). Stay hydrated, move on long flights, know DVT symptoms.")}if(E.length)for(const u of E)g+=`- ${u}
`;else g+=`Standard health monitoring appropriate for age.
`;g+=`

---

## Drug-Gene Interactions

**Share this section with prescribing physicians.**

### PharmGKB Level 1 (Clinical Guidelines Exist)

`;const xe=r.pharmgkbFindings.filter(u=>["1A","1B"].includes(u.level));if(xe.length){g+=`| Gene | Level | Drugs | Your Genotype |
|------|-------|-------|---------------|
`;for(const u of xe){const C=u.drugs.length>50?u.drugs.slice(0,50)+"...":u.drugs;g+=`| ${u.gene} | ${u.level} | ${C} | \`${u.genotype}\` |
`}}else g+=`None detected.
`;g+=`
### PharmGKB Level 2 (Moderate Evidence)

`;const Q=r.pharmgkbFindings.filter(u=>["2A","2B"].includes(u.level));if(Q.length){g+=`| Gene | Level | Drugs | Your Genotype |
|------|-------|-------|---------------|
`;for(const u of Q.slice(0,15)){const C=u.drugs.length>50?u.drugs.slice(0,50)+"...":u.drugs;g+=`| ${u.gene} | ${u.level} | ${C} | \`${u.genotype}\` |
`}Q.length>15&&(g+=`
*...and ${Q.length-15} more Level 2 interactions*
`)}else g+=`None detected.
`;if(g+=`
### ClinVar Drug Response Variants

`,c.drug_response?.length){g+=`| Gene | RSID | Genotype | Drug/Response |
|------|------|----------|---------------|
`;for(const u of c.drug_response.slice(0,20)){const C=(u.traits||"").length>60?u.traits.slice(0,60)+"...":u.traits;g+=`| ${u.gene||"—"} | ${u.rsid} | \`${u.user_genotype}\` | ${C} |
`}c.drug_response.length>20&&(g+=`
*...and ${c.drug_response.length-20} more drug response variants*
`)}else g+=`None detected.
`;g+=`

---

## Carrier Status Notes

`;const $e=[...l,...d].map(u=>(u.gene||"").toUpperCase());let re=!1;for(const u of["CFTR","HBB","GBA","SERPINA1"])$e.includes(u)&&(g+=ue(u)+`
`,re=!0);if(d.find(u=>(u.gene||"").toUpperCase()==="CFTR")&&!$e.includes("CFTR")&&(g+=ue("CFTR")+`
`,re=!0),re||(l.length||d.length?g+=`Carrier status detected but no specific phenotype notes available for these genes. General recommendation: genetic counseling if planning pregnancy.
`:g+=`No carrier status detected.
`),g+=`

---

## Risk Factor Summary

*These variants indicate increased susceptibility, not certainty of disease.*

`,c.risk_factor?.length){const u={},C=(P,T)=>{u[P]=u[P]||[],u[P].push(T)};for(const P of c.risk_factor){const T=(P.traits||"").toLowerCase(),B=P.gene||"Unknown";T.includes("hypertension")?C("Hypertension",B):T.includes("diabetes")?C("Diabetes",B):T.includes("macular degeneration")?C("Macular Degeneration",B):T.includes("thrombosis")||T.includes("thromboembolism")?C("Thrombosis/Clotting",B):T.includes("obesity")?C("Obesity",B):T.includes("cancer")||T.includes("carcinoma")?C("Cancer Risk",B):(T.includes("inflammatory bowel")||T.includes("crohn"))&&C("Inflammatory Bowel Disease",B)}const M=Object.keys(u).sort();if(M.length){g+=`| Condition | Genes Involved |
|-----------|----------------|
`;for(const P of M){const T=[...new Set(u[P].filter(Boolean))].slice(0,5);g+=`| ${P} | ${T.join(", ")} |
`}}else g+=`Risk factors detected but not categorizable. See full disease risk report for details.
`}else g+=`No significant risk factors detected.
`;return g+=`

---

## Disclaimer

This protocol synthesizes genetic findings from multiple sources for informational purposes.
It is NOT a clinical diagnosis or medical advice.

- Genetic associations are probabilistic, not deterministic
- Environmental factors, lifestyle, and other genes also influence outcomes
- Classifications evolve as research progresses
- Consult healthcare providers before making medical decisions

---

*Generated entirely in your browser — combining lifestyle genetics, PharmGKB, and ClinVar. Your genetic data was never uploaded anywhere.*
`,g}const Kt=[{title:"Simplify it",prompt:"Read this genetic health report and rewrite it in plain English. Group findings into three buckets: “no action needed,” “worth discussing with my doctor,” and “safe to act on now.” Skip repeating the disclaimers — I've already read them."},{title:"30-day action plan",prompt:"Based on this report, build a prioritized 30-day action plan. Pick the 3-5 changes (supplements, diet, exercise, monitoring) that will have the biggest impact, order them by how soon I should start each one, and explain why each one made the cut."},{title:"Doctor visit prep",prompt:"I'm bringing this report to my next doctor's appointment. Turn it into a short list of specific questions to ask and tests to request, ordered by how urgent each one is."},{title:"One-week meal plan",prompt:"Turn the dietary recommendations in this report into a realistic one-week meal plan with a grocery list, sized for one person."},{title:"Supplement safety check",prompt:"List every supplement this report recommends, with dose and reason. Flag any that commonly interact with each other or with common medications, so I know exactly what to double-check with a pharmacist."},{title:"Explain the science",prompt:"Pick the 3 highest-impact findings in this report and explain the underlying biology for each one like I'm smart but have no medical background."}],Wt=document.getElementById("app");let he=null;Wt.innerHTML=`
  <div class="header">
    <h1>Genetic Health Analysis</h1>
    <p>Dump in your 23andMe data, get back lifestyle, disease risk, and drug-interaction reports</p>
  </div>

  <div class="privacy-banner">
    <div class="icon">🔒</div>
    <div>
      <strong>Your genetic data isn't going anywhere.</strong>
      This all runs locally, right here in your browser — your genome file never gets
      uploaded, sent anywhere, or stored on some server somewhere. The reference stuff
      (ClinVar, PharmGKB) just loads as static files; your actual genome stays on your machine.
    </div>
  </div>

  <div class="panel" id="input-panel">
    <label class="field" for="subject-name">Your name (optional, just shows up in the reports)</label>
    <input type="text" id="subject-name" placeholder="e.g. Jane Doe" />

    <label class="field">23andMe raw data file</label>
    <div class="dropzone" id="dropzone">
      <div>Drop your genome.txt file here, or click to choose</div>
      <div class="filename" id="filename"></div>
    </div>
    <input type="file" id="file-input" accept=".txt,.csv,.tsv" class="hidden" />

    <button class="btn-primary" id="analyze-btn" disabled>Analyze (locally, in-browser)</button>
    <div class="status-line" id="status-line"></div>
  </div>

  <div id="results" class="hidden"></div>

  <div class="footer-note">
    Just informational, not a diagnosis — go talk to a real doctor or genetic counselor.
  </div>
`;const N=document.getElementById("dropzone"),J=document.getElementById("file-input"),Xt=document.getElementById("filename"),se=document.getElementById("analyze-btn"),Jt=document.getElementById("status-line"),ee=document.getElementById("results"),en=document.getElementById("subject-name");N.addEventListener("click",()=>J.click());N.addEventListener("dragover",r=>{r.preventDefault(),N.classList.add("dragover")});N.addEventListener("dragleave",()=>N.classList.remove("dragover"));N.addEventListener("drop",r=>{r.preventDefault(),N.classList.remove("dragover"),r.dataTransfer.files.length&&qe(r.dataTransfer.files[0])});J.addEventListener("change",()=>{J.files.length&&qe(J.files[0])});function qe(r){he=r,Xt.textContent=`Selected: ${r.name} (${(r.size/1024/1024).toFixed(1)} MB)`,se.disabled=!1}se.addEventListener("click",tn);async function tn(){if(he){se.disabled=!0,ee.classList.add("hidden");try{D("Loading reference databases (ClinVar, PharmGKB, curated SNPs)…");const r=await Lt((d,c,f)=>{D(`Loading reference databases… (${c}/${f})`)});D("Parsing your genome file locally in this browser…");const n=await Et(he);D("Matching lifestyle/health SNPs…");const e=Ft(n,r);D("Matching against ClinVar for disease risk…");const t=qt(n,r);D("Generating reports…");const s=en.value.trim(),o=Vt(e,r,s),{report:i}=Yt(t,n.totalSnps,s),a=Ve(t.findings),l=Qt(e,t,a,s);nn({genome:n,healthResults:e,diseaseAnalysis:t,classification:a,reports:{"Actionable Protocol":l,"Lifestyle & Health":o,"Disease Risk":i},subjectName:s}),D("Done. Nothing was uploaded — all processing happened in this tab.",!1)}catch(r){console.error(r),D(`Error: ${r.message}`,!1)}finally{se.disabled=!1}}}function D(r,n=!0){Jt.innerHTML=n?`<span class="spinner"></span>${r}`:r}function nn({genome:r,healthResults:n,diseaseAnalysis:e,classification:t,reports:s}){ee.classList.remove("hidden"),t.affected.length+t.carriers.length+e.findings.risk_factor.length,ee.innerHTML=`
    <div class="panel">
      <div class="summary-grid">
        <div class="stat"><div class="num">${r.totalSnps.toLocaleString()}</div><div class="label">SNPs read</div></div>
        <div class="stat"><div class="num">${n.findings.length}</div><div class="label">Lifestyle findings</div></div>
        <div class="stat"><div class="num">${n.pharmgkbFindings.length}</div><div class="label">Drug interactions</div></div>
        <div class="stat"><div class="num">${t.affected.length}</div><div class="label">Pathogenic (affected)</div></div>
        <div class="stat"><div class="num">${t.carriers.length}</div><div class="label">Carrier variants</div></div>
        <div class="stat"><div class="num">${e.findings.risk_factor.length}</div><div class="label">Risk factors</div></div>
      </div>
    </div>

    <div class="panel">
      <h3 class="llm-tip-heading">💡 Do this next, seriously</h3>
      <p class="llm-tip-body">
        This report is dense because it's trying to be thorough, not because it's trying to be
        useful on its own. Grab it below and paste it into an LLM (ChatGPT, Claude, whatever) and
        talk to it like it's your own personal doctor who's actually read your DNA — ask it what
        <em>you</em> specifically should do about <em>your</em> specific genome. That's the real
        payoff here. Some prompts worth stealing, once you've uploaded the file:
      </p>
      <div class="llm-prompts" id="llm-prompts"></div>
      <p class="llm-tip-caveat">
        ⚠️ <strong>One catch:</strong> a cloud LLM actually gets a copy of this file —
        unlike your raw genome, which never left this tab. Only do this with a service you
        actually trust, or run a local model (Ollama, LM Studio) if you want that same
        on-device guarantee for this part too.
      </p>
    </div>

    <div class="panel">
      <div class="tabs" id="tabs"></div>
      <div class="report-toolbar">
        <button class="btn-secondary" id="download-btn">⬇ Download this report (.md)</button>
      </div>
      <div class="report-view" id="report-view"></div>
    </div>
  `;const o=document.getElementById("tabs"),i=document.getElementById("report-view"),a=document.getElementById("download-btn"),l=Object.keys(s);let d=l[0];function c(){i.innerHTML=y.parse(s[d]),[...o.children].forEach(p=>p.classList.toggle("active",p.dataset.name===d))}for(const p of l){const m=document.createElement("button");m.className="tab",m.dataset.name=p,m.textContent=p,m.addEventListener("click",()=>{d=p,c()}),o.appendChild(m)}a.addEventListener("click",()=>{const p=new Blob([s[d]],{type:"text/markdown"}),m=URL.createObjectURL(p),h=document.createElement("a");h.href=m,h.download=`${d.replace(/[^a-z0-9]+/gi,"_")}.md`,h.click(),URL.revokeObjectURL(m)}),c();const f=document.getElementById("llm-prompts");for(const{title:p,prompt:m}of Kt){const h=document.createElement("div");h.className="llm-prompt-card",h.innerHTML=`
      <div class="llm-prompt-text">
        <div class="llm-prompt-title">${p}</div>
        <div class="llm-prompt-body">${m}</div>
      </div>
      <button class="btn-secondary llm-copy-btn">Copy</button>
    `;const w=h.querySelector(".llm-copy-btn");w.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(m),w.textContent="Copied!",setTimeout(()=>w.textContent="Copy",1500)}catch{w.textContent="Select & copy manually"}}),f.appendChild(h)}ee.scrollIntoView({behavior:"smooth"})}
