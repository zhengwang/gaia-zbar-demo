(this["webpackJsonpjs-app"]=this["webpackJsonpjs-app"]||[]).push([[0],{26:function(e,t,n){},33:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(16),i=n.n(c),o=(n(26),n(20)),s=n(2),f=n(10);var u,h,l,d,_=n(8),b=n.n(_),m=n(1),g={wasi_snapshot_preview1:{fd_seek:function(){},fd_close:function(){},fd_write:function(){},fd_read:function(){},environ_sizes_get:function(){},environ_get:function(){},proc_exit:function(){},clock_time_get:function(){}},env:{log_char_arr:function(e,t){console.log(function(e,t){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:256,r="",a=new Uint8Array(t.buffer,e,n),c="",i=0;i<n&&"\0"!==(c=String.fromCharCode(a[i]));i++)r+=c;return r}(e,u))}}},j=function(e){var t=a.a.createRef(),n=a.a.createRef(),c=Object(r.useState)(null),i=Object(f.a)(c,2),o=i[0],s=i[1],h=Object(r.useState)(null),l=Object(f.a)(h,2),d=l[0],_=l[1];Object(r.useEffect)((function(){o&&d&&fetch("wasm/zbarapp.wasm").then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,g)})).then((function(e){console.log(e);var t=(u=e.instance.exports).malloc(o.data.length*Uint8ClampedArray.BYTES_PER_ELEMENT),n=u.malloc(128*Uint16Array.BYTES_PER_ELEMENT);new Uint8ClampedArray(u.memory.buffer).set(o.data,t,t/Uint8ClampedArray.BYTES_PER_ELEMENT),u.func_zbar(t,o.width,o.height,n);var r=new Uint16Array(u.memory.buffer,n),a=r[0];console.log("code_amt: "+a),console.log(" =========== split code ============");for(var c=[],i=0,s=1;i<a;i++){var f="",h="",l=r[s],d=r[s+1];console.log("type_len: "+l),console.log("data_len: "+d);for(var _=l+d,b=s+2;b<s+_+2;b++)b<s+l+2?f+=String.fromCharCode(r[b]):h+=String.fromCharCode(r[b]);console.log("type is: "+f),console.log("data is: "+h);var m=r[s+=_+2],g=r[s+1],j=r[s+2],p=r[s+3];s+=4,console.log("offset: "+s),c.push({x0:m,y0:g,x1:j,y1:p})}u.free(t),u.free(n)}))}),[o,d]);var j=Object(r.useCallback)((function(){t&&_(t.current)}),[t]);return Object(r.useEffect)((function(){j&&j()}),[j]),Object(m.jsxs)("div",{children:["Zbar is working. ",Object(m.jsx)("br",{}),Object(m.jsx)("img",{src:"assets/images/code4.png",ref:n,onLoad:function(e){s(function(e){var t=e.width,n=e.height,r=window.document.createElement("canvas");r.width=t,r.height=n;var a=r.getContext("2d");return a.drawImage(e,0,0,t,n),a.getImageData(0,0,t,n)}(e.target))},className:"".concat(b.a.demo_img)}),Object(m.jsx)("canvas",{ref:t,width:723,height:1112})]})},p=n(17),v=n.n(p),w=n(18),y=n(19),E=function(){function e(t){Object(w.a)(this,e);var n=t.instance,r=t.wasm_func,a=t.width,c=t.height;this.instance=n,this.width=a,this.height=c,this.frame_buffer_ptr=n.malloc(a*c*4*Uint8Array.BYTES_PER_ELEMENT),this.result_buffer_ptr=n.malloc(128*Uint16Array.BYTES_PER_ELEMENT),this.bytes_memory=new Uint8Array(this.instance.memory.buffer),this.wasm_func=n[r],this.process=this.process.bind(this)}return Object(y.a)(e,[{key:"process",value:function(e){this.bytes_memory.set(e,this.frame_buffer_ptr,this.frame_buffer_ptr/Uint8Array.BYTES_PER_ELEMENT),this.wasm_func(this.frame_buffer_ptr,this.width,this.height,this.result_buffer_ptr);var t=new Uint16Array(this.instance.memory.buffer,this.result_buffer_ptr),n=t[0],r=[];if(n>0)for(var a=0,c=1;a<n;a++){for(var i="",o="",s=t[c],f=s+t[c+1],u=c+2;u<c+f+2;u++)u<c+s+2?i+=String.fromCharCode(t[u]):o+=String.fromCharCode(t[u]);c+=f+2,r.push({type:i,data:o,points:{x0:t[c],y0:t[c+1],x1:t[c+2],y1:t[c+3]}}),c+=4}return r}}]),e}(),O={wasi_snapshot_preview1:{fd_seek:function(){},fd_close:function(){},fd_write:function(){},fd_read:function(){},environ_sizes_get:function(){},environ_get:function(){},proc_exit:function(){},clock_time_get:function(){}},env:{log_char_arr:function(e,t){}}},x=function(e){var t=Object(r.useRef)(null),n=Object(r.useRef)(null),a=Object(r.useState)([]),c=Object(f.a)(a,2),i=c[0],o=c[1],s=Object(r.useCallback)((function(){var e=t.current.video,r=n.current;l=e;var a=function t(){if(requestAnimationFrame(t),!e.paused&&!e.end){var n=function(e,t,n){var r=e.videoWidth*n,a=e.videoHeight*n;t.width=r,t.height=a;var c=t.getContext("2d");c.drawImage(e,0,0,r,a);try{var i=c.getImageData(0,0,r,a);return i.context=c,i}catch(o){return null}}(e,r,1);if(n){var a=d.process(n.data);if(a.length>0){for(var c=0;c<a.length;c++){var i=a[c].points,s=i.x0,f=i.y0,u=i.x1,h=i.y1,l=r.getContext("2d");l.lineWidth=5,l.strokeStyle="#FF0000",l.beginPath(),l.moveTo(s,f),l.lineTo(s,h),l.lineTo(u,h),l.lineTo(u,f),l.lineTo(s,f),l.stroke()}o(a)}}}};e.addEventListener("play",(function(){fetch("wasm/zbarapp.wasm").then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,O)})).then((function(e){h=e.instance.exports,d=new E({instance:h,wasm_func:"func_zbar",width:400,height:400}),a()}))}),!1)}),[t,n]);return Object(r.useEffect)((function(){s&&s()}),[s]),Object(r.useEffect)((function(){return function(){l&&(l.pause(),l.srcObject.getTracks().forEach((function(e){return e.stop()})),l.srcObject=null);d&&h&&(h.free(d.frame_buffer_ptr),h.free(d.result_buffer_ptr))}}),[]),Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(v.a,{audio:!1,width:1,height:1,ref:t,videoConstraints:{width:400,height:400,facingMode:"environment"}}),Object(m.jsxs)("div",{className:"container ".concat(b.a.scanner_container),children:[Object(m.jsx)("div",{className:"row justify-content-md-center",children:Object(m.jsx)("div",{className:"col-6 ".concat(b.a.code),children:i&&i.map((function(e,t){return Object(m.jsx)("label",{children:"Barcode: ".concat(e.type," - ").concat(e.data," ")},t)}))})}),Object(m.jsx)("div",{className:"row",children:Object(m.jsx)("div",{className:"col-12 ".concat(b.a.scanner),children:Object(m.jsx)("canvas",{ref:n})})})]})]})};var C=function(){return Object(m.jsx)("div",{children:Object(m.jsxs)(o.a,{children:[Object(m.jsx)(s.a,{exact:!0,path:"/",component:x}),Object(m.jsx)(s.a,{path:"/zbar",component:j})]})})},T=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,34)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),r(e),a(e),c(e),i(e)}))};i.a.render(Object(m.jsx)(a.a.StrictMode,{children:Object(m.jsx)(C,{})}),document.getElementById("root")),T()},8:function(e,t,n){e.exports={scanner_container:"Zbar_scanner_container__Fc3zg",scanner:"Zbar_scanner__2oDxN",code:"Zbar_code__1sDyJ",demo_img:"Zbar_demo_img__2BtJ4"}}},[[33,1,2]]]);
//# sourceMappingURL=main.318e3a3a.chunk.js.map