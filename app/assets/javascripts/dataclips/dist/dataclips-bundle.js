!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){e.exports=n(3)},function(e,t,n){(function(n){var o,r,i;function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}r=[],void 0===(i="function"==typeof(o=function(){"use strict";function t(e,t,n){var o=new XMLHttpRequest;o.open("GET",e),o.responseType="blob",o.onload=function(){s(o.response,t,n)},o.onerror=function(){console.error("could not download file")},o.send()}function o(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function r(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var i="object"==("undefined"==typeof window?"undefined":a(window))&&window.window===window?window:"object"==("undefined"==typeof self?"undefined":a(self))&&self.self===self?self:"object"==(void 0===n?"undefined":a(n))&&n.global===n?n:void 0,c=i.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),s=i.saveAs||("object"!=("undefined"==typeof window?"undefined":a(window))||window!==i?function(){}:"download"in HTMLAnchorElement.prototype&&!c?function(e,n,a){var c=i.URL||i.webkitURL,s=document.createElement("a");n=n||e.name||"download",s.download=n,s.rel="noopener","string"==typeof e?(s.href=e,s.origin===location.origin?r(s):o(s.href)?t(e,n,a):r(s,s.target="_blank")):(s.href=c.createObjectURL(e),setTimeout((function(){c.revokeObjectURL(s.href)}),4e4),setTimeout((function(){r(s)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,n,i){if(n=n||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(function(e,t){return void 0===t?t={autoBom:!1}:"object"!=a(t)&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}(e,i),n);else if(o(e))t(e,n,i);else{var c=document.createElement("a");c.href=e,c.target="_blank",setTimeout((function(){r(c)}))}}:function(e,n,o,r){if((r=r||open("","_blank"))&&(r.document.title=r.document.body.innerText="downloading..."),"string"==typeof e)return t(e,n,o);var a="application/octet-stream"===e.type,s=/constructor/i.test(i.HTMLElement)||i.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent);if((l||a&&s||c)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=l?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),r?r.location.href=e:location=e,r=null},u.readAsDataURL(e)}else{var f=i.URL||i.webkitURL,d=f.createObjectURL(e);r?r.location=d:location.href=d,r=null,setTimeout((function(){f.revokeObjectURL(d)}),4e4)}});i.saveAs=s.saveAs=s,e.exports=s})?o.apply(t,r):o)||(e.exports=i)}).call(this,n(2))},function(e,t){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var o;o=function(){return this}();try{o=o||new Function("return this")()}catch(e){"object"===("undefined"==typeof window?"undefined":n(window))&&(o=window)}e.exports=o},function(e,t,n){"use strict";n.r(t);n(1);function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var o,r,i=[],a=!0,c=!1;try{for(n=n.call(e);!(a=(o=n.next()).done)&&(i.push(o.value),!t||i.length!==t);a=!0);}catch(e){c=!0,r=e}finally{try{a||null==n.return||n.return()}finally{if(c)throw r}}return i}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var a=function(){function e(t,n,o){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var r=Object.assign({},t.schema);Object.keys(n).length&&Object.keys(t.schema).forEach((function(e){var o=t.schema[e].formatter;o&&(n.formatters[o]?r[e].formatter=n.formatters[o]:delete r[e].formatter)}));var i={};if(Object.keys(o).length&&(this.default_filter=o.default_filter,this.rowActions=o.rowActions,o.filters&&Object.keys(o.filters).forEach((function(e){i[e]=o.filters[e]}))),this.schema=r,this.container=document.getElementById(t.dom_id),this.identifier=t.identifier,this.per_page=t.per_page,this.url=t.url,this.name=t.name,this.time_zone=t.time_zone,this.filters=i,this.disable_seconds=t.disable_seconds,this.selectable=t.selectable,t.limit)this.limit=t.limit;else{var a=window.innerHeight-this.container.offsetTop;this.limit=Math.max(parseInt(a/30)-2,20)}}var t,n,r;return t=e,(n=[{key:"onChange",value:function(){}},{key:"refresh",value:function(){this.reactable.clearData(),this.fetch()}},{key:"getSelected",value:function(){return this.reactable.getSelectedData()}},{key:"fetch",value:function(){var e=this.url,t=this.schema,n=this.reactable,o=this.fetchDataInBatches;o(1,e,t).then((function r(i){i.data;var a=i.currentPage,c=i.totalCount;a<i.totalPages&&o(a+1,e,t).then(r),n.addData(i.data,c)}))}},{key:"fetchDataInBatches",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0,r=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;return fetch(t+"?page="+e).then((function(e){return e.json()})).then((function(t){return t.records.length?{data:t.records.map((function(e){var t=JSON.parse(e),i={};return Object.entries(n).forEach((function(e){var n=o(e,2),a=n[0],c=n[1],s=t[a];if(void 0===s)throw new TypeError("Dataclips: attribute '".concat(a,"' is undefined. Please verify schema."));if("datetime"===c.type&&null!==s){if(!r.test(s))throw new TypeError("Dataclips: ensure attribute '".concat(a,"' is valid ISO8601."));var l=s.match(r)[2];i[a]=l?s:"".concat(s,"Z")}else i[a]=s})),i})),currentPage:t.page,totalCount:t.total_count,totalPages:t.total_pages}:{data:[],currentPage:e,totalCount:0,totalPages:e}}))}},{key:"init",value:function(e){var t=this,n=this.container,o=this.name,r=this.schema,i=this.identifier,a=(this.per_page,this.limit),c=this.time_zone,s=(this.url,this.fetchDataInBatches,this.filters),l=this.default_filter,u=this.rowActions,f=this.fetch,d=this.disable_seconds,h=this.selectable,p=Reactable.init({container:n,schema:r,identifier:i,limit:a,searchPresets:s,actions:u,displayTimeZone:c,itemsChange:function(e){t.onChange(e)},disableSeconds:d,selectable:h,fileName:o,controls:{refresh:{onClick:function(e){e.stopPropagation(),p.clearData(),f.apply(t)},key:"refresh",label:"Refresh"}}});p.render(),this.reactable=p,l&&p.applySearchPreset(l),this.fetch(),e(this)}}])&&i(t.prototype,n),r&&i(t,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();window.Dataclips=a}]);