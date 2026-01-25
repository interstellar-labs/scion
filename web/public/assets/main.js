/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis,re=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),ce=new WeakMap;let _e=class{constructor(e,r,i){if(this._$cssResult$=!0,i!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o;const r=this.t;if(re&&e===void 0){const i=r!==void 0&&r.length===1;i&&(e=ce.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ce.set(r,e))}return e}toString(){return this.cssText}};const ze=t=>new _e(typeof t=="string"?t:t+"",void 0,se),v=(t,...e)=>{const r=t.length===1?t[0]:e.reduce((i,s,n)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1],t[0]);return new _e(r,t,se)},De=(t,e)=>{if(re)t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(const r of e){const i=document.createElement("style"),s=q.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=r.cssText,t.appendChild(i)}},de=re?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(const i of e.cssRules)r+=i.cssText;return ze(r)})(t):t;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Te,defineProperty:je,getOwnPropertyDescriptor:Me,getOwnPropertyNames:Ue,getOwnPropertySymbols:Ne,getPrototypeOf:He}=Object,Y=globalThis,he=Y.trustedTypes,Le=he?he.emptyScript:"",Re=Y.reactiveElementPolyfillSupport,N=(t,e)=>t,F={toAttribute(t,e){switch(e){case Boolean:t=t?Le:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},ie=(t,e)=>!Te(t,e),pe={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:ie};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;let C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,r=pe){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(e,r),!r.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,r);s!==void 0&&je(this.prototype,e,s)}}static getPropertyDescriptor(e,r,i){const{get:s,set:n}=Me(this.prototype,e)??{get(){return this[r]},set(a){this[r]=a}};return{get:s,set(a){const c=s?.call(this);n?.call(this,a),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??pe}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;const e=He(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){const r=this.properties,i=[...Ue(r),...Ne(r)];for(const s of i)this.createProperty(s,r[s])}const e=this[Symbol.metadata];if(e!==null){const r=litPropertyMetadata.get(e);if(r!==void 0)for(const[i,s]of r)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[r,i]of this.elementProperties){const s=this._$Eu(r,i);s!==void 0&&this._$Eh.set(s,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const r=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)r.unshift(de(s))}else e!==void 0&&r.push(de(e));return r}static _$Eu(e,r){const i=r.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,r=this.constructor.elementProperties;for(const i of r.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return De(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,r,i){this._$AK(e,i)}_$ET(e,r){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:F).toAttribute(r,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,r){const i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const n=i.getPropertyOptions(s),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:F;this._$Em=s;const c=a.fromAttribute(r,n.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,r,i,s=!1,n){if(e!==void 0){const a=this.constructor;if(s===!1&&(n=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??ie)(n,r)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,r,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,r,{useDefault:i,reflect:s,wrapped:n},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??r??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(r=void 0),this._$AL.set(e,r)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[s,n]of i){const{wrapped:a}=n,c=this[s];a!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,n,c)}}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(r)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(r)}willUpdate(e){}_$AE(e){this._$EO?.forEach(r=>r.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(r=>this._$ET(r,this[r])),this._$EM()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[N("elementProperties")]=new Map,C[N("finalized")]=new Map,Re?.({ReactiveElement:C}),(Y.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ne=globalThis,ue=t=>t,J=ne.trustedTypes,me=J?J.createPolicy("lit-html",{createHTML:t=>t}):void 0,Ae="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+$,Ie=`<${Se}>`,P=document,H=()=>P.createComment(""),L=t=>t===null||typeof t!="object"&&typeof t!="function",ae=Array.isArray,Be=t=>ae(t)||typeof t?.[Symbol.iterator]=="function",te=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ge=/-->/g,fe=/>/g,A=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ve=/'/g,be=/"/g,Pe=/^(?:script|style|textarea|title)$/i,Ge=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),l=Ge(1),O=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),ye=new WeakMap,S=P.createTreeWalker(P,129);function Ee(t,e){if(!ae(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return me!==void 0?me.createHTML(e):e}const We=(t,e)=>{const r=t.length-1,i=[];let s,n=e===2?"<svg>":e===3?"<math>":"",a=U;for(let c=0;c<r;c++){const o=t[c];let p,m,d=-1,f=0;for(;f<o.length&&(a.lastIndex=f,m=a.exec(o),m!==null);)f=a.lastIndex,a===U?m[1]==="!--"?a=ge:m[1]!==void 0?a=fe:m[2]!==void 0?(Pe.test(m[2])&&(s=RegExp("</"+m[2],"g")),a=A):m[3]!==void 0&&(a=A):a===A?m[0]===">"?(a=s??U,d=-1):m[1]===void 0?d=-2:(d=a.lastIndex-m[2].length,p=m[1],a=m[3]===void 0?A:m[3]==='"'?be:ve):a===be||a===ve?a=A:a===ge||a===fe?a=U:(a=A,s=void 0);const y=a===A&&t[c+1].startsWith("/>")?" ":"";n+=a===U?o+Ie:d>=0?(i.push(p),o.slice(0,d)+Ae+o.slice(d)+$+y):o+$+(d===-2?c:y)}return[Ee(t,n+(t[r]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class R{constructor({strings:e,_$litType$:r},i){let s;this.parts=[];let n=0,a=0;const c=e.length-1,o=this.parts,[p,m]=We(e,r);if(this.el=R.createElement(p,i),S.currentNode=this.el.content,r===2||r===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=S.nextNode())!==null&&o.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(Ae)){const f=m[a++],y=s.getAttribute(d).split($),V=/([.?@])?(.*)/.exec(f);o.push({type:1,index:n,name:V[2],strings:y,ctor:V[1]==="."?qe:V[1]==="?"?Fe:V[1]==="@"?Je:Q}),s.removeAttribute(d)}else d.startsWith($)&&(o.push({type:6,index:n}),s.removeAttribute(d));if(Pe.test(s.tagName)){const d=s.textContent.split($),f=d.length-1;if(f>0){s.textContent=J?J.emptyScript:"";for(let y=0;y<f;y++)s.append(d[y],H()),S.nextNode(),o.push({type:2,index:++n});s.append(d[f],H())}}}else if(s.nodeType===8)if(s.data===Se)o.push({type:2,index:n});else{let d=-1;for(;(d=s.data.indexOf($,d+1))!==-1;)o.push({type:7,index:n}),d+=$.length-1}n++}}static createElement(e,r){const i=P.createElement("template");return i.innerHTML=e,i}}function z(t,e,r=t,i){if(e===O)return e;let s=i!==void 0?r._$Co?.[i]:r._$Cl;const n=L(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(t),s._$AT(t,r,i)),i!==void 0?(r._$Co??=[])[i]=s:r._$Cl=s),s!==void 0&&(e=z(t,s._$AS(t,e.values),s,i)),e}class Ve{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:r},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(r,!0);S.currentNode=s;let n=S.nextNode(),a=0,c=0,o=i[0];for(;o!==void 0;){if(a===o.index){let p;o.type===2?p=new B(n,n.nextSibling,this,e):o.type===1?p=new o.ctor(n,o.name,o.strings,this,e):o.type===6&&(p=new Ze(n,this,e)),this._$AV.push(p),o=i[++c]}a!==o?.index&&(n=S.nextNode(),a++)}return S.currentNode=P,s}p(e){let r=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,r),r+=i.strings.length-2):i._$AI(e[r])),r++}}class B{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,r,i,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=z(this,e,r),L(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==O&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Be(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==u&&L(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:r,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=R.createElement(Ee(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(r);else{const n=new Ve(s,this),a=n.u(this.options);n.p(r),this.T(a),this._$AH=n}}_$AC(e){let r=ye.get(e.strings);return r===void 0&&ye.set(e.strings,r=new R(e)),r}k(e){ae(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let i,s=0;for(const n of e)s===r.length?r.push(i=new B(this.O(H()),this.O(H()),this,this.options)):i=r[s],i._$AI(n),s++;s<r.length&&(this._$AR(i&&i._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);e!==this._$AB;){const i=ue(e).nextSibling;ue(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,r,i,s,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=r,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(e,r=this,i,s){const n=this.strings;let a=!1;if(n===void 0)e=z(this,e,r,0),a=!L(e)||e!==this._$AH&&e!==O,a&&(this._$AH=e);else{const c=e;let o,p;for(e=n[0],o=0;o<n.length-1;o++)p=z(this,c[i+o],r,o),p===O&&(p=this._$AH[o]),a||=!L(p)||p!==this._$AH[o],p===u?e=u:e!==u&&(e+=(p??"")+n[o+1]),this._$AH[o]=p}a&&!s&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class qe extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}}class Fe extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==u)}}class Je extends Q{constructor(e,r,i,s,n){super(e,r,i,s,n),this.type=5}_$AI(e,r=this){if((e=z(this,e,r,0)??u)===O)return;const i=this._$AH,s=e===u&&i!==u||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==u&&(i===u||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class Ze{constructor(e,r,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}}const Ke=ne.litHtmlPolyfillSupport;Ke?.(R,B),(ne.litHtmlVersions??=[]).push("3.3.2");const Ye=(t,e,r)=>{const i=r?.renderBefore??e;let s=i._$litPart$;if(s===void 0){const n=r?.renderBefore??null;i._$litPart$=s=new B(e.insertBefore(H(),n),n,void 0,r??{})}return s._$AI(t),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oe=globalThis;class g extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ye(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}}g._$litElement$=!0,g.finalized=!0,oe.litElementHydrateSupport?.({LitElement:g});const Qe=oe.litElementPolyfillSupport;Qe?.({LitElement:g});(oe.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const b=t=>(e,r)=>{r!==void 0?r.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Xe={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:ie},et=(t=Xe,e,r)=>{const{kind:i,metadata:s}=r;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),i==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(r.name,t),i==="accessor"){const{name:a}=r;return{set(c){const o=e.get.call(this);e.set.call(this,c),this.requestUpdate(a,o,t,!0,c)},init(c){return c!==void 0&&this.C(a,void 0,t,c),c}}}if(i==="setter"){const{name:a}=r;return function(c){const o=this[a];e.call(this,c),this.requestUpdate(a,o,t,!0,c)}}throw Error("Unsupported decorator location: "+i)};function h(t){return(e,r)=>typeof r=="object"?et(t,e,r):((i,s,n)=>{const a=s.hasOwnProperty(n);return s.constructor.createProperty(n,i),a?Object.getOwnPropertyDescriptor(s,n):void 0})(t,e,r)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _(t){return h({...t,state:!0,attribute:!1})}var tt=Object.defineProperty,rt=Object.getOwnPropertyDescriptor,X=(t,e,r,i)=>{for(var s=i>1?void 0:i?rt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&tt(e,r,s),s};const st=[{title:"Overview",items:[{path:"/",label:"Dashboard",icon:"house"}]},{title:"Management",items:[{path:"/groves",label:"Groves",icon:"folder"},{path:"/agents",label:"Agents",icon:"cpu"}]},{title:"System",items:[{path:"/settings",label:"Settings",icon:"gear"}]}];let D=class extends g{constructor(){super(...arguments),this.user=null,this.currentPath="/",this.collapsed=!1}render(){return l`
      <div class="logo">
        <div class="logo-icon">S</div>
        <div class="logo-text">
          <h1>Scion</h1>
          <span>Agent Orchestration</span>
        </div>
      </div>

      <nav class="nav-container">
        ${st.map(t=>l`
            <div class="nav-section">
              <div class="nav-section-title">${t.title}</div>
              <ul class="nav-list">
                ${t.items.map(e=>l`
                    <li class="nav-item">
                      <a
                        href="${e.path}"
                        class="nav-link ${this.isActive(e.path)?"active":""}"
                        @click=${r=>this.handleNavClick(r,e.path)}
                      >
                        <sl-icon name="${e.icon}"></sl-icon>
                        <span class="nav-link-text">${e.label}</span>
                      </a>
                    </li>
                  `)}
              </ul>
            </div>
          `)}
      </nav>

      <div class="nav-footer">
        <button
          class="theme-toggle"
          @click=${()=>this.toggleTheme()}
          title="Toggle theme"
          aria-label="Toggle dark mode"
        >
          <sl-icon name="sun-moon"></sl-icon>
        </button>
      </div>
    `}isActive(t){return t==="/"?this.currentPath==="/":this.currentPath.startsWith(t)}handleNavClick(t,e){this.dispatchEvent(new CustomEvent("nav-click",{detail:{path:e},bubbles:!0,composed:!0}))}toggleTheme(){const t=document.documentElement,r=t.getAttribute("data-theme")==="dark"?"light":"dark";t.setAttribute("data-theme",r),r==="dark"?t.classList.add("sl-theme-dark"):t.classList.remove("sl-theme-dark"),localStorage.setItem("scion-theme",r),this.dispatchEvent(new CustomEvent("theme-change",{detail:{theme:r},bubbles:!0,composed:!0}))}};D.styles=v`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: var(--scion-sidebar-width, 260px);
      background: var(--scion-surface, #ffffff);
      border-right: 1px solid var(--scion-border, #e2e8f0);
    }

    :host([collapsed]) {
      width: var(--scion-sidebar-collapsed-width, 64px);
    }

    .logo {
      padding: 1.25rem 1rem;
      border-bottom: 1px solid var(--scion-border, #e2e8f0);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--scion-primary, #3b82f6) 0%, #1d4ed8 100%);
      border-radius: 0.5rem;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    :host([collapsed]) .logo-text {
      display: none;
    }

    .logo-text h1 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--scion-text, #1e293b);
      margin: 0;
      line-height: 1.2;
    }

    .logo-text span {
      font-size: 0.6875rem;
      color: var(--scion-text-muted, #64748b);
      white-space: nowrap;
    }

    .nav-container {
      flex: 1;
      padding: 1rem 0.75rem;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section:last-child {
      margin-bottom: 0;
    }

    .nav-section-title {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--scion-text-muted, #64748b);
      margin-bottom: 0.5rem;
      padding: 0 0.75rem;
    }

    :host([collapsed]) .nav-section-title {
      display: none;
    }

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item {
      margin-bottom: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.5rem;
      color: var(--scion-text, #1e293b);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    :host([collapsed]) .nav-link {
      justify-content: center;
      padding: 0.75rem;
    }

    .nav-link:hover {
      background: var(--scion-bg-subtle, #f1f5f9);
    }

    .nav-link.active {
      background: var(--scion-primary, #3b82f6);
      color: white;
    }

    .nav-link.active:hover {
      background: var(--scion-primary-hover, #2563eb);
    }

    .nav-link sl-icon {
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .nav-link-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([collapsed]) .nav-link-text {
      display: none;
    }

    .nav-footer {
      padding: 0.75rem;
      border-top: 1px solid var(--scion-border, #e2e8f0);
    }

    .theme-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background: var(--scion-bg-subtle, #f1f5f9);
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .theme-toggle:hover {
      background: var(--scion-border, #e2e8f0);
    }
  `;X([h({type:Object})],D.prototype,"user",2);X([h({type:String})],D.prototype,"currentPath",2);X([h({type:Boolean,reflect:!0})],D.prototype,"collapsed",2);D=X([b("scion-nav")],D);var it=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,j=(t,e,r,i)=>{for(var s=i>1?void 0:i?nt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&it(e,r,s),s};let w=class extends g{constructor(){super(...arguments),this.user=null,this.currentPath="/",this.pageTitle="Dashboard",this.showMobileMenu=!1,this._menuOpen=!1}render(){return l`
      <div class="header-left">
        ${this.showMobileMenu?l`
              <button
                class="mobile-menu-btn"
                @click=${()=>this.handleMobileMenuClick()}
                aria-label="Open navigation menu"
              >
                <sl-icon name="list" style="font-size: 1.25rem;"></sl-icon>
              </button>
            `:""}
        <h1 class="page-title">${this.pageTitle}</h1>
      </div>

      <div class="header-right">
        <div class="header-actions">
          <sl-tooltip content="Notifications">
            <sl-icon-button name="bell" label="Notifications"></sl-icon-button>
          </sl-tooltip>
          <sl-tooltip content="Help">
            <sl-icon-button name="question-circle" label="Help"></sl-icon-button>
          </sl-tooltip>
        </div>

        <div class="user-section">${this.renderUserSection()}</div>
      </div>
    `}renderUserSection(){if(!this.user)return l`
        <a href="/auth/login" class="sign-in-link">
          <sl-icon name="box-arrow-in-right"></sl-icon>
          Sign in
        </a>
      `;const t=this.getInitials(this.user.name);return l`
      <span class="user-name">${this.user.name}</span>
      <sl-dropdown class="user-dropdown" placement="bottom-end">
        <button slot="trigger" class="user-button" aria-label="User menu">
          <sl-avatar
            class="user-avatar"
            initials="${t}"
            image="${this.user.avatar||""}"
            label="${this.user.name}"
          ></sl-avatar>
          <sl-icon name="chevron-down" class="dropdown-icon"></sl-icon>
        </button>
        <sl-menu>
          <sl-menu-item>
            <sl-icon slot="prefix" name="person"></sl-icon>
            Profile
          </sl-menu-item>
          <sl-menu-item>
            <sl-icon slot="prefix" name="gear"></sl-icon>
            Settings
          </sl-menu-item>
          <sl-divider></sl-divider>
          <sl-menu-item @click=${()=>this.handleLogout()}>
            <sl-icon slot="prefix" name="box-arrow-right"></sl-icon>
            Sign out
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    `}getInitials(t){return t.split(" ").map(e=>e[0]).join("").toUpperCase().slice(0,2)}handleMobileMenuClick(){this.dispatchEvent(new CustomEvent("mobile-menu-toggle",{bubbles:!0,composed:!0}))}handleLogout(){this.dispatchEvent(new CustomEvent("logout",{bubbles:!0,composed:!0}))}};w.styles=v`
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--scion-header-height, 60px);
      padding: 0 1.5rem;
      background: var(--scion-surface, #ffffff);
      border-bottom: 1px solid var(--scion-border, #e2e8f0);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
      padding: 0.5rem;
      background: transparent;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      color: var(--scion-text, #1e293b);
    }

    .mobile-menu-btn:hover {
      background: var(--scion-bg-subtle, #f1f5f9);
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }
    }

    .page-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 640px) {
      .header-actions {
        display: none;
      }
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--scion-text, #1e293b);
    }

    @media (max-width: 640px) {
      .user-name {
        display: none;
      }
    }

    .sign-in-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: var(--scion-primary, #3b82f6);
      color: white;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.15s ease;
    }

    .sign-in-link:hover {
      background: var(--scion-primary-hover, #2563eb);
    }

    /* User dropdown styles */
    .user-dropdown {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem;
      background: transparent;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .user-button:hover {
      background: var(--scion-bg-subtle, #f1f5f9);
    }

    .user-avatar {
      --size: 2rem;
    }

    .dropdown-icon {
      font-size: 0.75rem;
      color: var(--scion-text-muted, #64748b);
      transition: transform 0.15s ease;
    }

    .user-dropdown[open] .dropdown-icon {
      transform: rotate(180deg);
    }
  `;j([h({type:Object})],w.prototype,"user",2);j([h({type:String})],w.prototype,"currentPath",2);j([h({type:String})],w.prototype,"pageTitle",2);j([h({type:Boolean})],w.prototype,"showMobileMenu",2);j([_()],w.prototype,"_menuOpen",2);w=j([b("scion-header")],w);var at=Object.defineProperty,ot=Object.getOwnPropertyDescriptor,le=(t,e,r,i)=>{for(var s=i>1?void 0:i?ot(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&at(e,r,s),s};const lt={"/":"Dashboard","/groves":"Groves","/agents":"Agents","/settings":"Settings"};let I=class extends g{constructor(){super(...arguments),this.path="/",this.currentLabel=""}render(){const t=this.generateBreadcrumbs();return t.length<=1?l``:l`
      <sl-breadcrumb>
        ${t.map((e,r)=>l`
            <sl-breadcrumb-item
              href="${e.current?"":e.href}"
              ?aria-current=${e.current?"page":!1}
            >
              ${r===0?l`<sl-icon name="house" class="breadcrumb-icon"></sl-icon>`:""}
              ${e.label}
            </sl-breadcrumb-item>
          `)}
      </sl-breadcrumb>
    `}generateBreadcrumbs(){const t=[];if(t.push({label:"Home",href:"/",current:this.path==="/"}),this.path==="/")return t;const e=this.path.split("/").filter(Boolean);let r="";return e.forEach((i,s)=>{r+=`/${i}`;const n=s===e.length-1;let a=lt[r];a||(this.isId(i)?a=this.currentLabel&&n?this.currentLabel:this.formatId(i):a=this.formatSegment(i)),t.push({label:a,href:r,current:n})}),t}isId(t){return/^[0-9a-f-]{8,}$/i.test(t)||/^\d+$/.test(t)}formatId(t){return t.length>8?t.slice(0,8)+"...":t}formatSegment(t){return t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}};I.styles=v`
    :host {
      display: block;
    }

    sl-breadcrumb {
      --separator-color: var(--scion-text-muted, #64748b);
    }

    sl-breadcrumb-item::part(label) {
      font-size: 0.875rem;
    }

    sl-breadcrumb-item::part(label):hover {
      color: var(--scion-primary, #3b82f6);
    }

    sl-breadcrumb-item[aria-current='page']::part(label) {
      color: var(--scion-text, #1e293b);
      font-weight: 500;
    }

    .breadcrumb-icon {
      font-size: 0.875rem;
      vertical-align: middle;
      margin-right: 0.25rem;
    }
  `;le([h({type:String})],I.prototype,"path",2);le([h({type:String})],I.prototype,"currentLabel",2);I=le([b("scion-breadcrumb")],I);var ct=Object.defineProperty,dt=Object.getOwnPropertyDescriptor,ee=(t,e,r,i)=>{for(var s=i>1?void 0:i?dt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&ct(e,r,s),s};const $e={"/":"Dashboard","/groves":"Groves","/agents":"Agents","/settings":"Settings"};let T=class extends g{constructor(){super(...arguments),this.user=null,this.currentPath="/",this._drawerOpen=!1}render(){const t=this.getPageTitle();return l`
      <!-- Desktop Sidebar -->
      <aside class="sidebar">
        <scion-nav .user=${this.user} .currentPath=${this.currentPath}></scion-nav>
      </aside>

      <!-- Mobile Drawer -->
      <sl-drawer
        class="mobile-drawer"
        ?open=${this._drawerOpen}
        placement="start"
        @sl-hide=${()=>this.handleDrawerClose()}
      >
        <scion-nav
          .user=${this.user}
          .currentPath=${this.currentPath}
          @nav-click=${()=>this.handleNavClick()}
        ></scion-nav>
      </sl-drawer>

      <!-- Main Content -->
      <main class="main">
        <scion-header
          .user=${this.user}
          .currentPath=${this.currentPath}
          .pageTitle=${t}
          ?showMobileMenu=${!0}
          @mobile-menu-toggle=${()=>this.handleMobileMenuToggle()}
          @logout=${()=>this.handleLogout()}
        ></scion-header>

        <div class="content">
          <div class="content-inner">
            <slot></slot>
          </div>
        </div>
      </main>
    `}getPageTitle(){return $e[this.currentPath]?$e[this.currentPath]:this.currentPath.startsWith("/groves/")?"Grove Details":this.currentPath.startsWith("/agents/")?this.currentPath.includes("/terminal")?"Terminal":"Agent Details":"Page Not Found"}handleMobileMenuToggle(){this._drawerOpen=!this._drawerOpen}handleDrawerClose(){this._drawerOpen=!1}handleNavClick(){this._drawerOpen=!1}handleLogout(){fetch("/auth/logout",{method:"POST",credentials:"include"}).then(()=>{window.location.href="/auth/login"}).catch(t=>{console.error("Logout failed:",t)})}};T.styles=v`
    :host {
      display: flex;
      min-height: 100vh;
      background: var(--scion-bg, #f8fafc);
    }

    /* Desktop sidebar */
    .sidebar {
      display: flex;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
    }

    /* Mobile drawer */
    .mobile-drawer {
      --size: 280px;
    }

    .mobile-drawer::part(panel) {
      background: var(--scion-surface, #ffffff);
    }

    .mobile-drawer::part(close-button) {
      color: var(--scion-text, #1e293b);
    }

    .mobile-drawer::part(close-button):hover {
      color: var(--scion-primary, #3b82f6);
    }

    /* Main content area */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* Prevent flex overflow */
    }

    /* Content wrapper */
    .content {
      flex: 1;
      padding: 1.5rem;
      overflow: auto;
    }

    @media (max-width: 640px) {
      .content {
        padding: 1rem;
      }
    }

    /* Max width container */
    .content-inner {
      max-width: var(--scion-content-max-width, 1400px);
      margin: 0 auto;
      width: 100%;
    }

    /* Loading overlay */
    .loading-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.2s ease,
        visibility 0.2s ease;
    }

    .loading-overlay.visible {
      opacity: 1;
      visibility: visible;
    }

    @media (prefers-color-scheme: dark) {
      .loading-overlay {
        background: rgba(15, 23, 42, 0.8);
      }
    }
  `;ee([h({type:Object})],T.prototype,"user",2);ee([h({type:String})],T.prototype,"currentPath",2);ee([_()],T.prototype,"_drawerOpen",2);T=ee([b("scion-app")],T);var ht=Object.defineProperty,pt=Object.getOwnPropertyDescriptor,M=(t,e,r,i)=>{for(var s=i>1?void 0:i?pt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&ht(e,r,s),s};const we={running:{variant:"success",icon:"play-circle",pulse:!1},stopped:{variant:"neutral",icon:"stop-circle",pulse:!1},provisioning:{variant:"warning",icon:"hourglass-split",pulse:!0},starting:{variant:"warning",icon:"arrow-repeat",pulse:!0},stopping:{variant:"warning",icon:"arrow-repeat",pulse:!0},error:{variant:"danger",icon:"exclamation-triangle",pulse:!1},healthy:{variant:"success",icon:"check-circle",pulse:!1},unhealthy:{variant:"danger",icon:"x-circle",pulse:!1},pending:{variant:"warning",icon:"clock",pulse:!0},active:{variant:"success",icon:"circle-fill",pulse:!1},inactive:{variant:"neutral",icon:"circle",pulse:!1},success:{variant:"success",pulse:!1},warning:{variant:"warning",pulse:!1},danger:{variant:"danger",pulse:!1},info:{variant:"primary",pulse:!1},neutral:{variant:"neutral",pulse:!1}};let x=class extends g{constructor(){super(...arguments),this.status="neutral",this.label="",this.size="medium",this.showIcon=!0,this.showPulse=!0}render(){const t=we[this.status]||we.neutral,e=this.label||this.status,r=this.showPulse&&t.pulse;return l`
      <span class="badge ${t.variant} ${this.size} ${r?"pulse":""}">
        ${this.showIcon&&t.icon?l`<sl-icon name="${t.icon}"></sl-icon>`:""}
        ${e}
      </span>
    `}};x.styles=v`
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-weight: 500;
      text-transform: capitalize;
      white-space: nowrap;
    }

    /* Size variants */
    .badge.small {
      font-size: 0.6875rem;
      padding: 0.125rem 0.5rem;
      gap: 0.25rem;
    }

    .badge.medium {
      font-size: 0.75rem;
    }

    .badge.large {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
    }

    .badge sl-icon {
      font-size: 0.875em;
    }

    .badge.small sl-icon {
      font-size: 0.75em;
    }

    .badge.large sl-icon {
      font-size: 1em;
    }

    /* Variant colors */
    .badge.success {
      background: var(--scion-success-100, #dcfce7);
      color: var(--scion-success-700, #15803d);
    }

    .badge.warning {
      background: var(--scion-warning-100, #fef3c7);
      color: var(--scion-warning-700, #b45309);
    }

    .badge.danger {
      background: var(--scion-danger-100, #fee2e2);
      color: var(--scion-danger-700, #b91c1c);
    }

    .badge.primary {
      background: var(--scion-primary-100, #dbeafe);
      color: var(--scion-primary-700, #1d4ed8);
    }

    .badge.neutral {
      background: var(--scion-neutral-100, #f1f5f9);
      color: var(--scion-neutral-600, #475569);
    }

    /* Pulse indicator */
    .pulse {
      position: relative;
    }

    .pulse::before {
      content: '';
      position: absolute;
      left: 0.5rem;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .pulse.success::before {
      background: var(--scion-success-500, #22c55e);
      box-shadow: 0 0 0 0 var(--scion-success-400, #4ade80);
    }

    .pulse.warning::before {
      background: var(--scion-warning-500, #f59e0b);
      box-shadow: 0 0 0 0 var(--scion-warning-400, #fbbf24);
    }

    .pulse.danger::before {
      background: var(--scion-danger-500, #ef4444);
      box-shadow: 0 0 0 0 var(--scion-danger-400, #f87171);
    }

    @keyframes pulse {
      0% {
        box-shadow:
          0 0 0 0 rgba(34, 197, 94, 0.5),
          0 0 0 0 rgba(34, 197, 94, 0.3);
      }
      70% {
        box-shadow:
          0 0 0 6px rgba(34, 197, 94, 0),
          0 0 0 10px rgba(34, 197, 94, 0);
      }
      100% {
        box-shadow:
          0 0 0 0 rgba(34, 197, 94, 0),
          0 0 0 0 rgba(34, 197, 94, 0);
      }
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .badge.success {
        background: rgba(34, 197, 94, 0.2);
        color: #86efac;
      }

      .badge.warning {
        background: rgba(245, 158, 11, 0.2);
        color: #fcd34d;
      }

      .badge.danger {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
      }

      .badge.primary {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
      }

      .badge.neutral {
        background: rgba(100, 116, 139, 0.2);
        color: #cbd5e1;
      }
    }
  `;M([h({type:String})],x.prototype,"status",2);M([h({type:String})],x.prototype,"label",2);M([h({type:String})],x.prototype,"size",2);M([h({type:Boolean})],x.prototype,"showIcon",2);M([h({type:Boolean})],x.prototype,"showPulse",2);x=M([b("scion-status-badge")],x);var ut=Object.defineProperty,mt=Object.getOwnPropertyDescriptor,ke=(t,e,r,i)=>{for(var s=i>1?void 0:i?mt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&ut(e,r,s),s};let Z=class extends g{constructor(){super(...arguments),this.pageData=null}render(){const t=this.pageData?.user?.name?.split(" ")[0]||"there";return l`
      <div class="hero">
        <h1>Welcome back, ${t}!</h1>
        <p>Here's what's happening with your agents today.</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <h3>Active Agents</h3>
          <div class="stat-value">
            <span>--</span>
          </div>
          <div class="stat-change">
            <scion-status-badge status="success" label="Ready" size="small"></scion-status-badge>
          </div>
        </div>
        <div class="stat-card">
          <h3>Groves</h3>
          <div class="stat-value">--</div>
          <div class="stat-change">Project workspaces</div>
        </div>
        <div class="stat-card">
          <h3>Tasks Completed</h3>
          <div class="stat-value">--</div>
          <div class="stat-change">This week</div>
        </div>
        <div class="stat-card">
          <h3>System Status</h3>
          <div class="stat-value">
            <scion-status-badge status="healthy" size="large" label="Healthy"></scion-status-badge>
          </div>
          <div class="stat-change">All systems operational</div>
        </div>
      </div>

      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <a href="/agents" class="action-card">
          <div class="action-icon">
            <sl-icon name="plus-lg"></sl-icon>
          </div>
          <div class="action-text">
            <h4>Create Agent</h4>
            <p>Spin up a new AI agent</p>
          </div>
        </a>
        <a href="/groves" class="action-card">
          <div class="action-icon">
            <sl-icon name="folder"></sl-icon>
          </div>
          <div class="action-text">
            <h4>View Groves</h4>
            <p>Browse project workspaces</p>
          </div>
        </a>
        <a href="/agents" class="action-card">
          <div class="action-icon">
            <sl-icon name="terminal"></sl-icon>
          </div>
          <div class="action-text">
            <h4>Open Terminal</h4>
            <p>Connect to running agent</p>
          </div>
        </a>
      </div>

      <div class="activity-section">
        <h2 class="section-title">Recent Activity</h2>
        <div class="activity-list">
          <div class="empty-state">
            <sl-icon name="clock-history"></sl-icon>
            <p>No recent activity to display.<br />Start by creating your first agent.</p>
            <sl-button variant="primary" href="/agents" style="margin-top: 1rem;">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Create Agent
            </sl-button>
          </div>
        </div>
      </div>
    `}};Z.styles=v`
    :host {
      display: block;
    }

    .hero {
      background: linear-gradient(
        135deg,
        var(--scion-primary, #3b82f6) 0%,
        var(--scion-primary-700, #1d4ed8) 100%
      );
      color: white;
      padding: 2rem;
      border-radius: var(--scion-radius-lg, 0.75rem);
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .hero p {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--scion-surface, #ffffff);
      border-radius: var(--scion-radius-lg, 0.75rem);
      padding: 1.5rem;
      box-shadow: var(--scion-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
      border: 1px solid var(--scion-border, #e2e8f0);
    }

    .stat-card h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 0.5rem 0;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--scion-text, #1e293b);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-change {
      font-size: 0.875rem;
      margin-top: 0.5rem;
      color: var(--scion-text-muted, #64748b);
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--scion-text, #1e293b);
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all var(--scion-transition-fast, 150ms ease);
      text-decoration: none;
      color: inherit;
    }

    .action-card:hover {
      border-color: var(--scion-primary, #3b82f6);
      box-shadow: var(--scion-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      transform: translateY(-2px);
    }

    .action-icon {
      width: 3rem;
      height: 3rem;
      border-radius: var(--scion-radius, 0.5rem);
      background: var(--scion-primary-50, #eff6ff);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--scion-primary, #3b82f6);
      flex-shrink: 0;
    }

    .action-icon sl-icon {
      font-size: 1.5rem;
    }

    .action-text h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      color: var(--scion-text, #1e293b);
    }

    .action-text p {
      font-size: 0.875rem;
      color: var(--scion-text-muted, #64748b);
      margin: 0;
    }

    /* Recent activity section */
    .activity-section {
      margin-top: 2rem;
    }

    .activity-list {
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
      overflow: hidden;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--scion-border, #e2e8f0);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: var(--scion-bg-subtle, #f1f5f9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--scion-text-muted, #64748b);
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--scion-text, #1e293b);
      margin: 0;
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--scion-text-muted, #64748b);
      margin-top: 0.125rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: var(--scion-text-muted, #64748b);
    }

    .empty-state sl-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
  `;ke([h({type:Object})],Z.prototype,"pageData",2);Z=ke([b("scion-page-home")],Z);var gt=Object.defineProperty,ft=Object.getOwnPropertyDescriptor,G=(t,e,r,i)=>{for(var s=i>1?void 0:i?ft(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&gt(e,r,s),s};let E=class extends g{constructor(){super(...arguments),this.pageData=null,this.loading=!0,this.groves=[],this.error=null}connectedCallback(){super.connectedCallback(),this.loadGroves()}async loadGroves(){this.loading=!0,this.error=null;try{const t=await fetch("/api/groves");if(!t.ok){const r=await t.json().catch(()=>({}));throw new Error(r.message||`HTTP ${t.status}: ${t.statusText}`)}const e=await t.json();this.groves=Array.isArray(e)?e:e.groves||[]}catch(t){console.error("Failed to load groves:",t),this.error=t instanceof Error?t.message:"Failed to load groves"}finally{this.loading=!1}}getStatusVariant(t){switch(t){case"active":return"success";case"inactive":return"neutral";case"error":return"danger";default:return"neutral"}}formatDate(t){try{const e=new Date(t);return new Intl.RelativeTimeFormat("en",{numeric:"auto"}).format(Math.round((e.getTime()-Date.now())/(1e3*60*60*24)),"day")}catch{return t}}render(){return l`
      <div class="header">
        <h1>Groves</h1>
        <sl-button variant="primary" size="small" disabled>
          <sl-icon slot="prefix" name="plus-lg"></sl-icon>
          New Grove
        </sl-button>
      </div>

      ${this.loading?this.renderLoading():this.error?this.renderError():this.renderGroves()}
    `}renderLoading(){return l`
      <div class="loading-state">
        <sl-spinner></sl-spinner>
        <p>Loading groves...</p>
      </div>
    `}renderError(){return l`
      <div class="error-state">
        <sl-icon name="exclamation-triangle"></sl-icon>
        <h2>Failed to Load Groves</h2>
        <p>There was a problem connecting to the API.</p>
        <div class="error-details">${this.error}</div>
        <sl-button variant="primary" @click=${()=>this.loadGroves()}>
          <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
          Retry
        </sl-button>
      </div>
    `}renderGroves(){return this.groves.length===0?this.renderEmptyState():l`
      <div class="grove-grid">${this.groves.map(t=>this.renderGroveCard(t))}</div>
    `}renderEmptyState(){return l`
      <div class="empty-state">
        <sl-icon name="folder2-open"></sl-icon>
        <h2>No Groves Found</h2>
        <p>
          Groves are project workspaces that contain your agents. Create your first grove to get
          started, or run
          <code>scion init</code> in a project directory.
        </p>
        <sl-button variant="primary" disabled>
          <sl-icon slot="prefix" name="plus-lg"></sl-icon>
          Create Grove
        </sl-button>
      </div>
    `}renderGroveCard(t){return l`
      <a href="/groves/${t.id}" class="grove-card">
        <div class="grove-header">
          <div>
            <h3 class="grove-name">
              <sl-icon name="folder-fill"></sl-icon>
              ${t.name}
            </h3>
            <div class="grove-path">${t.path}</div>
          </div>
          <scion-status-badge
            status=${this.getStatusVariant(t.status)}
            label=${t.status}
            size="small"
          >
          </scion-status-badge>
        </div>
        <div class="grove-stats">
          <div class="stat">
            <span class="stat-label">Agents</span>
            <span class="stat-value">${t.agentCount}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Updated</span>
            <span class="stat-value" style="font-size: 0.875rem; font-weight: 500;">
              ${this.formatDate(t.updatedAt)}
            </span>
          </div>
        </div>
      </a>
    `}};E.styles=v`
    :host {
      display: block;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--scion-text, #1e293b);
      margin: 0;
    }

    .grove-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .grove-card {
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
      padding: 1.5rem;
      transition: all var(--scion-transition-fast, 150ms ease);
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .grove-card:hover {
      border-color: var(--scion-primary, #3b82f6);
      box-shadow: var(--scion-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      transform: translateY(-2px);
    }

    .grove-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .grove-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .grove-name sl-icon {
      color: var(--scion-primary, #3b82f6);
    }

    .grove-path {
      font-size: 0.875rem;
      color: var(--scion-text-muted, #64748b);
      margin-top: 0.25rem;
      font-family: var(--scion-font-mono, monospace);
      word-break: break-all;
    }

    .grove-stats {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--scion-border, #e2e8f0);
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--scion-text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--scion-surface, #ffffff);
      border: 1px dashed var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
    }

    .empty-state sl-icon {
      font-size: 4rem;
      color: var(--scion-text-muted, #64748b);
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 1.5rem 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: var(--scion-text-muted, #64748b);
    }

    .loading-state sl-spinner {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .error-state {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--sl-color-danger-200, #fecaca);
      border-radius: var(--scion-radius-lg, 0.75rem);
    }

    .error-state sl-icon {
      font-size: 3rem;
      color: var(--sl-color-danger-500, #ef4444);
      margin-bottom: 1rem;
    }

    .error-state h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.5rem 0;
    }

    .error-state p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 1rem 0;
    }

    .error-details {
      font-family: var(--scion-font-mono, monospace);
      font-size: 0.875rem;
      background: var(--scion-bg-subtle, #f1f5f9);
      padding: 0.75rem 1rem;
      border-radius: var(--scion-radius, 0.5rem);
      color: var(--sl-color-danger-700, #b91c1c);
      margin-bottom: 1rem;
    }
  `;G([h({type:Object})],E.prototype,"pageData",2);G([_()],E.prototype,"loading",2);G([_()],E.prototype,"groves",2);G([_()],E.prototype,"error",2);E=G([b("scion-page-groves")],E);var vt=Object.defineProperty,bt=Object.getOwnPropertyDescriptor,W=(t,e,r,i)=>{for(var s=i>1?void 0:i?bt(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&vt(e,r,s),s};let k=class extends g{constructor(){super(...arguments),this.pageData=null,this.loading=!0,this.agents=[],this.error=null}connectedCallback(){super.connectedCallback(),this.loadAgents()}async loadAgents(){this.loading=!0,this.error=null;try{const t=await fetch("/api/agents");if(!t.ok){const r=await t.json().catch(()=>({}));throw new Error(r.message||`HTTP ${t.status}: ${t.statusText}`)}const e=await t.json();this.agents=Array.isArray(e)?e:e.agents||[]}catch(t){console.error("Failed to load agents:",t),this.error=t instanceof Error?t.message:"Failed to load agents"}finally{this.loading=!1}}getStatusVariant(t){switch(t){case"running":return"success";case"stopped":return"neutral";case"provisioning":return"warning";case"error":return"danger";default:return"neutral"}}render(){return l`
      <div class="header">
        <h1>Agents</h1>
        <sl-button variant="primary" size="small" disabled>
          <sl-icon slot="prefix" name="plus-lg"></sl-icon>
          New Agent
        </sl-button>
      </div>

      ${this.loading?this.renderLoading():this.error?this.renderError():this.renderAgents()}
    `}renderLoading(){return l`
      <div class="loading-state">
        <sl-spinner></sl-spinner>
        <p>Loading agents...</p>
      </div>
    `}renderError(){return l`
      <div class="error-state">
        <sl-icon name="exclamation-triangle"></sl-icon>
        <h2>Failed to Load Agents</h2>
        <p>There was a problem connecting to the API.</p>
        <div class="error-details">${this.error}</div>
        <sl-button variant="primary" @click=${()=>this.loadAgents()}>
          <sl-icon slot="prefix" name="arrow-clockwise"></sl-icon>
          Retry
        </sl-button>
      </div>
    `}renderAgents(){return this.agents.length===0?this.renderEmptyState():l`
      <div class="agent-grid">${this.agents.map(t=>this.renderAgentCard(t))}</div>
    `}renderEmptyState(){return l`
      <div class="empty-state">
        <sl-icon name="cpu"></sl-icon>
        <h2>No Agents Found</h2>
        <p>
          Agents are AI-powered workers that can help you with coding tasks. Create your first agent
          to get started.
        </p>
        <sl-button variant="primary" disabled>
          <sl-icon slot="prefix" name="plus-lg"></sl-icon>
          Create Agent
        </sl-button>
      </div>
    `}renderAgentCard(t){return l`
      <div class="agent-card">
        <div class="agent-header">
          <div>
            <h3 class="agent-name">
              <sl-icon name="cpu"></sl-icon>
              ${t.name}
            </h3>
            <div class="agent-template">${t.template}</div>
          </div>
          <scion-status-badge
            status=${this.getStatusVariant(t.status)}
            label=${t.status}
            size="small"
          >
          </scion-status-badge>
        </div>

        ${t.taskSummary?l` <div class="agent-task">${t.taskSummary}</div> `:""}

        <div class="agent-actions">
          <sl-button variant="primary" size="small" ?disabled=${t.status!=="running"}>
            <sl-icon slot="prefix" name="terminal"></sl-icon>
            Terminal
          </sl-button>
          ${t.status==="running"?l`
                <sl-button variant="danger" size="small" outline>
                  <sl-icon slot="prefix" name="stop-circle"></sl-icon>
                  Stop
                </sl-button>
              `:l`
                <sl-button variant="success" size="small" outline>
                  <sl-icon slot="prefix" name="play-circle"></sl-icon>
                  Start
                </sl-button>
              `}
        </div>
      </div>
    `}};k.styles=v`
    :host {
      display: block;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--scion-text, #1e293b);
      margin: 0;
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .agent-card {
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
      padding: 1.5rem;
      transition: all var(--scion-transition-fast, 150ms ease);
    }

    .agent-card:hover {
      border-color: var(--scion-primary, #3b82f6);
      box-shadow: var(--scion-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    }

    .agent-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .agent-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .agent-name sl-icon {
      color: var(--scion-primary, #3b82f6);
    }

    .agent-template {
      font-size: 0.875rem;
      color: var(--scion-text-muted, #64748b);
      margin-top: 0.25rem;
    }

    .agent-task {
      font-size: 0.875rem;
      color: var(--scion-text, #1e293b);
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: var(--scion-bg-subtle, #f1f5f9);
      border-radius: var(--scion-radius, 0.5rem);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .agent-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--scion-border, #e2e8f0);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--scion-surface, #ffffff);
      border: 1px dashed var(--scion-border, #e2e8f0);
      border-radius: var(--scion-radius-lg, 0.75rem);
    }

    .empty-state sl-icon {
      font-size: 4rem;
      color: var(--scion-text-muted, #64748b);
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 1.5rem 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      color: var(--scion-text-muted, #64748b);
    }

    .loading-state sl-spinner {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .error-state {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--sl-color-danger-200, #fecaca);
      border-radius: var(--scion-radius-lg, 0.75rem);
    }

    .error-state sl-icon {
      font-size: 3rem;
      color: var(--sl-color-danger-500, #ef4444);
      margin-bottom: 1rem;
    }

    .error-state h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.5rem 0;
    }

    .error-state p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 1rem 0;
    }

    .error-details {
      font-family: var(--scion-font-mono, monospace);
      font-size: 0.875rem;
      background: var(--scion-bg-subtle, #f1f5f9);
      padding: 0.75rem 1rem;
      border-radius: var(--scion-radius, 0.5rem);
      color: var(--sl-color-danger-700, #b91c1c);
      margin-bottom: 1rem;
    }
  `;W([h({type:Object})],k.prototype,"pageData",2);W([_()],k.prototype,"loading",2);W([_()],k.prototype,"agents",2);W([_()],k.prototype,"error",2);k=W([b("scion-page-agents")],k);var yt=Object.defineProperty,$t=Object.getOwnPropertyDescriptor,Ce=(t,e,r,i)=>{for(var s=i>1?void 0:i?$t(e,r):e,n=t.length-1,a;n>=0;n--)(a=t[n])&&(s=(i?a(e,r,s):a(s))||s);return i&&s&&yt(e,r,s),s};let K=class extends g{constructor(){super(...arguments),this.pageData=null}render(){const t=this.pageData?.path||"unknown";return l`
      <div class="container">
        <div class="illustration">
          <sl-icon name="emoji-frown"></sl-icon>
        </div>
        <div class="code">404</div>
        <h1>Page Not Found</h1>
        <p>
          Sorry, we couldn't find the page you're looking for. The path
          <span class="path">${t}</span> doesn't exist.
        </p>
        <div class="actions">
          <sl-button variant="primary" href="/">
            <sl-icon slot="prefix" name="house"></sl-icon>
            Back to Dashboard
          </sl-button>
          <sl-button variant="default" @click=${()=>this.handleGoBack()}>
            <sl-icon slot="prefix" name="arrow-left"></sl-icon>
            Go Back
          </sl-button>
        </div>
      </div>
    `}handleGoBack(){window.history.back()}};K.styles=v`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
    }

    .container {
      text-align: center;
      max-width: 480px;
      padding: 2rem;
    }

    .code {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, var(--scion-primary, #3b82f6) 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.75rem 0;
    }

    p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .path {
      font-family: var(--scion-font-mono, monospace);
      background: var(--scion-bg-subtle, #f1f5f9);
      padding: 0.25rem 0.5rem;
      border-radius: var(--scion-radius-sm, 0.25rem);
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    sl-button::part(base) {
      font-weight: 500;
    }

    .illustration {
      margin-bottom: 1.5rem;
    }

    .illustration sl-icon {
      font-size: 6rem;
      color: var(--scion-neutral-300, #cbd5e1);
    }
  `;Ce([h({type:Object})],K.prototype,"pageData",2);K=Ce([b("scion-page-404")],K);async function xe(){console.info("[Scion] Initializing client...");const t=wt();t&&console.info("[Scion] Initial page data:",t.path),await Promise.all([customElements.whenDefined("scion-app"),customElements.whenDefined("scion-nav"),customElements.whenDefined("scion-header"),customElements.whenDefined("scion-breadcrumb"),customElements.whenDefined("scion-status-badge"),customElements.whenDefined("scion-page-home"),customElements.whenDefined("scion-page-groves"),customElements.whenDefined("scion-page-agents"),customElements.whenDefined("scion-page-404")]),console.info("[Scion] Components defined, setting up router..."),xt(),console.info("[Scion] Client initialization complete")}function wt(){const t=document.getElementById("__SCION_DATA__");if(!t)return console.warn("[Scion] No initial data found"),null;try{return JSON.parse(t.textContent||"{}")}catch(e){return console.error("[Scion] Failed to parse initial data:",e),null}}function xt(){if(!document.querySelector("scion-app")){console.error("[Scion] App shell not found");return}document.addEventListener("click",e=>{const i=e.target.closest("a");if(!i)return;const s=i.getAttribute("href");s&&(s.startsWith("http")||s.startsWith("//")||s.startsWith("javascript:")||s.startsWith("#")||s.startsWith("/api/")||s.startsWith("/auth/")||s.startsWith("/events")||(e.preventDefault(),_t(s)))}),window.addEventListener("popstate",()=>{Oe(window.location.pathname)})}function _t(t){t!==window.location.pathname&&(window.history.pushState({},"",t),Oe(t),window.location.href=t)}function Oe(t){const e=document.querySelector("scion-app");e&&(e.currentPath=t)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{xe()}):xe();
//# sourceMappingURL=main.js.map
