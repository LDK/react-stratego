(self.webpackChunkreact_stratego=self.webpackChunkreact_stratego||[]).push([[635],{3520:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>g});var o=n(7294),r=n(5697),i=n.n(r),a=n(1272),u=n(8900),c=n(3379),l=n.n(c),s=n(2697);function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?b(e):t}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}l()(s.Z,{insert:"head",singleton:!1}),s.Z.locals;const g=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(p,e);var t,n,r,c,l,s=(c=p,l=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=h(c);if(l){var n=h(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return d(this,e)});function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=s.call(this,e)).state={menuOpen:e.menuOpen||!1},t.id="mobile-menu",t.toggleMenu=t.toggleMenu.bind(b(t)),e.app.MobileMenu=b(t),t}return t=p,r=[{key:"propTypes",get:function(){return{app:i().object,menuOpen:i().bool}}}],(n=[{key:"toggleMenu",value:function(){this.setState({menuOpen:!this.state.menuOpen})}},{key:"render",value:function(){var e=this,t=this.props.app,n=t.state.currentUser.user_id||null,r=[];return this.state.menuOpen&&(t.gameOpened&&r.push(o.createElement("a",{key:"0",className:"anchor d-block",onClick:function(){e.toggleMenu(),t.nav.goHome()}},"Home")),r.push(o.createElement("a",{key:"1",className:"anchor d-block",onClick:function(){e.toggleMenu(),t.openRulesModal()}},"View Rules")),n?(r.push(o.createElement("a",{key:"4",className:"anchor d-block",onClick:function(){e.toggleMenu(),t.openNewGameMenu()}},"New Game")),r.push(o.createElement(a.Z,{key:"5",app:t,className:"anchor d-block",user:{id:n,name:"My Profile"}})),r.push(o.createElement("a",{key:"6",className:"anchor d-block bottom-link",onClick:function(){e.toggleMenu(),t.logUserOut()}},"Log Out"))):(r.push(o.createElement("a",{key:"2",className:"anchor d-block",onClick:function(){e.toggleMenu(),t.openLoginMenu()}},"Login")),r.push(o.createElement("a",{key:"3",className:"anchor d-block",onClick:function(){e.toggleMenu(),t.openRegistrationMenu()}},"Register")))),o.createElement("div",{id:this.id,className:this.state.menuOpen?"active":null},o.createElement(u.Z,{isOpen:this.state.menuOpen,menuClicked:this.toggleMenu,width:18,height:15,strokeWidth:1,rotate:0,color:"black",borderRadius:0,animationDuration:.5}),o.createElement("section",{className:"mobile-menu-items pt-4"},r))}}])&&f(t.prototype,n),r&&f(t,r),p}(o.Component)},1272:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(7294),r=n(5697),i=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,n,r,a,p,f=(a=m,p=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=s(a);if(p){var n=s(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return l(this,e)});function m(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),f.call(this,e)}return t=m,r=[{key:"propTypes",get:function(){return{user:i().object,app:i().object,id:i().number,className:i().string}}}],(n=[{key:"render",value:function(){var e=this;if(!this.props.user||!this.props.user.id||!this.props.user.name)return"";var t=this.props.app;return o.createElement("a",{className:"userLink "+this.props.className,id:this.props.id,onClick:function(){return t.openUserProfile(e.props.user.id)}},this.props.user.name)}}])&&u(t.prototype,n),r&&u(t,r),m}(o.Component)},2697:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var o=n(3645),r=n.n(o)()((function(e){return e[1]}));r.push([e.id,"body{--blue-button: #3777c7;--blue-shadow: #275797;--blue-highlight: #6797c7;--blue-light: #d7e7f7;--blue-grey: #373757;--blue-dark: #171747;--green-light: #d7f7e7;--green-grey: #97B797;--green-dark: #174717;--green-darker: #063606;--white: #f7f7f7;--red-button: rgb(199,55,55);--red-button-glow: rgba(255,111,111,.5);--red-shadow: #672727;--red-highlight: #e78787;--grey: #373737;--blue-grey-light: #c7cee7;--disabled-highlight: #676767;--disabled-light: #c7c7c7;--small-label-size: 12px;--yellow-highlight: #c7c767;--yellow-light: #f7f7d7;--space-border: rgba(2,2,2,.9);--midtone1: #79bd9a;--midtone2: #a8dba8;--highlight: #cff09e;--dark: #3b8686;--darker: #1b6666;--water: #3880be;--grass: #7cc43f;--sand: #d1c05b;--unpassable: rgba(255,64,64,.75);--square-size-default: 54px;--square-size-tablet: 45px;--square-size-landscape: 33px;--square-size-portrait: 38px;--glow-high: rgba(212,212,116,0.9);--glow-low: rgba(212,212,116,0.4)}#mobile-menu{position:fixed;height:50px;width:100%;bottom:0px;left:0px;background-color:rgba(60,150,120,.5);transition:all .25s;z-index:2;padding:1rem}#mobile-menu.active{background-color:#3c9678;height:100%;width:100%}#mobile-menu>div{bottom:1rem;left:1rem;position:fixed !important;cursor:pointer}#mobile-menu .mobile-menu-items a{padding:.75rem;color:#000 !important;background:#cecece;border-bottom:1px solid #000;border-left:1px solid #000;border-right:1px solid #000;text-align:center;font-weight:500}#mobile-menu .mobile-menu-items a:nth-child(2),#mobile-menu .mobile-menu-items a:nth-child(4),#mobile-menu .mobile-menu-items a:nth-child(6){background:#efefef}#mobile-menu .mobile-menu-items a:nth-child(1){border-top:1px solid #000}@media(min-width: 576px){#mobile-menu{width:50px;height:100%}}@media(min-width: 768px){#mobile-menu{display:none !important}}",""]);const i=r},8900:(e,t,n)=>{"use strict";t.Z=a;var o=i(n(7294)),r=i(n(5697));function i(e){return e&&e.__esModule?e:{default:e}}function a(e){var t=(e.width||36)+"px",n=(e.height||30)+"px",r=parseInt(n.replace("px",""))/2+"px",i=e.isOpen||!1,a=e.strokeWidth||2,u="-"+a/2+"px",c=e.animationDuration||"0.4",l=function(e,t,n){return"translate3d(0,"+(e?r:t)+",0) rotate("+(e?n+"deg":"0")+")"},s={container:{width:t,height:n,position:"relative",transform:"rotate("+(e.rotate||0)+"deg)"},lineBase:{display:"block",height:a+"px",width:"100%",background:e.color||"#000",transitionTimingFunction:"ease",transitionDuration:c+"s",borderRadius:(e.borderRadius||0)+"px",transformOrigin:"center",position:"absolute"},firstLine:{transform:l(i,0,45),marginTop:u},secondLine:{transitionTimingFunction:"ease-out",transitionDuration:c/4+"s",opacity:i?"0":"1",top:r,marginTop:u},thirdLine:{transform:l(i,n,-45),marginTop:u}};return o.default.createElement("div",{style:s.container,className:e.className,onClick:e.menuClicked},o.default.createElement("span",{style:Object.assign({},s.lineBase,s.firstLine)}),o.default.createElement("span",{style:Object.assign({},s.lineBase,s.secondLine)}),o.default.createElement("span",{style:Object.assign({},s.lineBase,s.thirdLine)}))}a.propTypes={isOpen:r.default.bool.isRequired,menuClicked:r.default.func.isRequired,width:r.default.number,height:r.default.number,strokeWidth:r.default.number,rotate:r.default.number,color:r.default.string,borderRadius:r.default.number,animationDuration:r.default.number,className:r.default.string}}}]);