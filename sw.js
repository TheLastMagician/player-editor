if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,n)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const a={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return a;default:return e(s)}}))).then((e=>{const s=n(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-7ce2238d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"404.html",revision:"c2a5e3b0d65922434ff0e3033041c6fd"},{url:"assets/CharacterSaveTools.4af785c7.css",revision:"d784436fb36c56fe44719940260c22a7"},{url:"assets/CharacterSaveTools.d4cbfc80.js",revision:"9a73b5a6bf6fb60d6225a12da4742a96"},{url:"assets/index.030debbf.js",revision:"b06722a9b3ee97ef59f2daf9efd5cd96"},{url:"assets/index.eed2fb75.css",revision:"f73af050f2ff9de8564948d68260d853"},{url:"assets/vendor.5ae40592.js",revision:"7908b2860b7e50c2c4058c428202f594"},{url:"assets/vendor.a771d194.css",revision:"355303ecdc4721d503523591190081a5"},{url:"index.html",revision:"7c76f4a810de5297db4a414f8d29cb37"},{url:"pwa-192x192.png",revision:"a8ac7ec9414dccd8f171eeb3bfb6e15b"},{url:"pwa-512x512.png",revision:"679b09ad5f1f8745902b2222baac86a9"},{url:"manifest.webmanifest",revision:"499221c355f40f110b919239d1c112b2"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map