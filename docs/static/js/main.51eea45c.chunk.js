(this["webpackJsonpjs-app"]=this["webpackJsonpjs-app"]||[]).push([[0],{26:function(e,t,n){},33:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n.n(r),c=n(15),a=n.n(c),s=(n(26),n(19)),o=n(1),f=n(21),h=n(9),u=n.n(h),d=n(16),_=n.n(d);var l,b=n(17),m=n(18),j=function(){function e(t){Object(b.a)(this,e);var n=t.instance,r=t.wasm_func,i=t.width,c=t.height;this.instance=n,this.width=i,this.height=c,this.frame_buffer_ptr=n.malloc(i*c*4*Uint8Array.BYTES_PER_ELEMENT),this.result_buffer_ptr=n.malloc(128*Uint16Array.BYTES_PER_ELEMENT),this.bytes_memory=new Uint8Array(this.instance.memory.buffer),this.wasm_func=n[r],this.process=this.process.bind(this)}return Object(m.a)(e,[{key:"process",value:function(e){this.bytes_memory.set(e,this.frame_buffer_ptr,this.frame_buffer_ptr/Uint8Array.BYTES_PER_ELEMENT),this.wasm_func(this.frame_buffer_ptr,this.width,this.height,this.result_buffer_ptr);var t=new Uint16Array(this.instance.memory.buffer,this.result_buffer_ptr),n=t[0],r=[];if(n>0)for(var i=0,c=1;i<n;i++){for(var a="",s="",o=t[c],f=o+t[c+1],h=c+2;h<c+f+2;h++)h<c+o+2?a+=String.fromCharCode(t[h]):s+=String.fromCharCode(t[h]);c+=f+2,r.push({type:a,data:s,points:{x0:t[c],y0:t[c+1],x1:t[c+2],y1:t[c+3]}}),c+=4}return r}}]),e}(),p=n(2),v={wasi_snapshot_preview1:{fd_seek:function(){},fd_close:function(){},fd_write:function(){},fd_read:function(){},environ_sizes_get:function(){},environ_get:function(){},proc_exit:function(){},clock_time_get:function(){}},env:{log_char_arr:function(e,t){}}},g=function(e){var t=Object(r.useRef)(null),n=Object(r.useRef)(null),i=Object(r.useState)([]),c=Object(f.a)(i,2),a=c[0],s=c[1],o=Object(r.useCallback)((function(){var e,r=t.current.video,i=n.current,c=function t(){if(requestAnimationFrame(t),!r.paused&&!r.end){var n=function(e,t,n){var r=e.videoWidth*n,i=e.videoHeight*n;t.width=r,t.height=i;var c=t.getContext("2d");c.drawImage(e,0,0,r,i);var a=c.getImageData(0,0,r,i);return a.context=c,a}(r,i,1),c=e.process(n.data);if(c.length>0){for(var a=0;a<c.length;a++){var o=c[a].points,f=o.x0,h=o.y0,u=o.x1,d=o.y1,_=i.getContext("2d");_.lineWidth=5,_.strokeStyle="#FF0000",_.beginPath(),_.moveTo(f,h),_.lineTo(f,d),_.lineTo(u,d),_.lineTo(u,h),_.lineTo(f,h),_.stroke()}s(c)}}};r.addEventListener("play",(function(){fetch("wasm/zbarapp.wasm").then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,v)})).then((function(t){console.log(t),l=t.instance.exports,e=new j({instance:l,wasm_func:"func_zbar",width:400,height:400}),c()}))}),!1)}),[t,n]);return Object(r.useEffect)((function(){o&&o()}),[o]),Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(_.a,{audio:!1,width:1,height:1,ref:t,videoConstraints:{width:400,height:400,facingMode:"environment"}}),Object(p.jsxs)("div",{className:"container ".concat(u.a.scanner_container),children:[Object(p.jsx)("div",{className:"row justify-content-md-center",children:Object(p.jsx)("div",{className:"col-6 ".concat(u.a.code),children:a&&a.map((function(e,t){return Object(p.jsx)("label",{children:"Barcode: ".concat(e.type," - ").concat(e.data," ")},t)}))})}),Object(p.jsx)("div",{className:"row",children:Object(p.jsx)("div",{className:"col-12 ".concat(u.a.scanner),children:Object(p.jsx)("canvas",{ref:n})})})]})]})};var x=function(){return Object(p.jsx)("div",{children:Object(p.jsx)(s.a,{children:Object(p.jsx)(o.a,{exact:!0,path:"/",component:g})})})},y=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,34)).then((function(t){var n=t.getCLS,r=t.getFID,i=t.getFCP,c=t.getLCP,a=t.getTTFB;n(e),r(e),i(e),c(e),a(e)}))};a.a.render(Object(p.jsx)(i.a.StrictMode,{children:Object(p.jsx)(x,{})}),document.getElementById("root")),y()},9:function(e,t,n){e.exports={scanner_container:"Zbar_scanner_container__Fc3zg",scanner:"Zbar_scanner__2oDxN",code:"Zbar_code__1sDyJ"}}},[[33,1,2]]]);
//# sourceMappingURL=main.51eea45c.chunk.js.map