(self.webpackChunkreact_stratego=self.webpackChunkreact_stratego||[]).push([[197,27],{4198:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>j});var o=n(7294),r=n(5697),a=n.n(r),s=n(7540),i=n(5181);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var h=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(h,e);var t,n,r,s,i,c=(s=h,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=m(s);if(i){var n=m(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return p(this,e)});function h(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),(t=c.call(this,e)).state={activeSuggestion:0,filteredSuggestions:[],showSuggestions:!1,userInput:""},t.onClick=t.onClick.bind(f(t)),t.onChange=t.onChange.bind(f(t)),t.onKeyDown=t.onKeyDown.bind(f(t)),t.selectOption=t.selectOption.bind(f(t)),e.parentObj&&e.refName?e.parentObj[e.refName]=f(t):e.parentObj&&(e.parentObj.autoSuggest=f(t)),t}return t=h,r=[{key:"propTypes",get:function(){return{parentObj:a().object,refName:a().string,onSelect:a().func,onChange:a().func,suggestions:a().array,inputName:a().string,placeholder:a().string}}}],(n=[{key:"selectOption",value:function(e,t){var n=e?t[e-1]:this.state.userInput;this.setState({activeSuggestion:0,showSuggestions:!!this.state.userInput&&!this.state.activeSuggestion,userInput:n}),this.props.onSelect&&"function"==typeof this.props.onSelect&&this.props.onSelect(n)}},{key:"onChange",value:function(e){var t=this.props.suggestions,n=e.currentTarget.value,o=t.filter((function(e){return 0===e.toLowerCase().indexOf(n.toLowerCase())}));this.setState({activeSuggestion:0,filteredSuggestions:o,showSuggestions:!0,userInput:e.currentTarget.value}),this.props.onChange&&"function"==typeof this.props.onChange&&this.props.onChange(e.currentTarget.value)}},{key:"onClick",value:function(e){this.setState({activeSuggestion:0,filteredSuggestions:[],showSuggestions:!1,userInput:e.currentTarget.innerText}),this.props.onSelect&&"function"==typeof this.props.onSelect&&this.props.onSelect(e.currentTarget.innerText)}},{key:"onKeyDown",value:function(e){var t=this.state,n=t.activeSuggestion,o=t.filteredSuggestions;if(13===e.keyCode)e.preventDefault(),this.selectOption(n,o);else if(38===e.keyCode){if(e.preventDefault(),0===n)return;this.setState({activeSuggestion:n-1})}else if(40===e.keyCode){if(e.preventDefault(),n===o.length)return;this.setState({activeSuggestion:n+1})}}},{key:"render",value:function(){var e,t=this.onChange,n=this.onClick,r=this.onKeyDown,a=this.state,s=a.activeSuggestion,i=a.filteredSuggestions,c=a.showSuggestions,l=a.userInput,u=this.props,p=u.inputName,f=u.placeholder;return c&&l&&(e=i.length?o.createElement("ul",{className:"suggestions"},i.map((function(e,t){var r;return t+1===s&&(r="suggestion-active"),o.createElement("li",{className:r,key:e,onClick:n},e)}))):o.createElement("div",{className:"no-suggestions"},o.createElement("em",null,"No suggestions"))),o.createElement(o.Fragment,null,o.createElement("input",{type:"text",autoComplete:"off",name:p,onChange:t,onKeyDown:r,value:l,placeholder:f}),e)}}])&&l(t.prototype,n),r&&l(t,r),h}(o.Component);h.defaultProps={suggestions:[]};const d=h;var y=n(1272),b=n(682),g=n(4051),v=n(1555);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function k(e,t){return(k=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function w(e,t){return!t||"object"!==S(t)&&"function"!=typeof t?E(e):t}function E(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function C(e){return(C=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const j=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&k(e,t)}(p,e);var t,n,r,c,l,u=(c=p,l=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=C(c);if(l){var n=C(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return w(this,e)});function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=u.call(this,e)).state={opponentSelectMode:"past",userSearch:"",formOpen:!1,opponentId:null,opponentFound:!1},t.id="newGame-modal",t.handleSubmit=t.handleSubmit.bind(E(t)),t.getModeHelpText=t.getModeHelpText.bind(E(t)),t.focusModeOption=t.focusModeOption.bind(E(t)),t.updateUserSearch=t.updateUserSearch.bind(E(t)),t.updatePastOpp=t.updatePastOpp.bind(E(t)),t.getOpenGames=t.getOpenGames.bind(E(t)),t.openMenu=t.openMenu.bind(E(t)),t.getPastOpponents=t.getPastOpponents.bind(E(t)),t.changeOpponentSelectMode=t.changeOpponentSelectMode.bind(E(t)),e.app.newGameMenu=E(t),t}return t=p,r=[{key:"propTypes",get:function(){return{app:a().object}}}],(n=[{key:"componentDidMount",value:function(){this.getPastOpponents(),this.props.app.getUsernames()}},{key:"openMenu",value:function(){this.getPastOpponents(),this.getOpenGames(),this.props.app.getUsernames(),this.setState({formOpen:!0})}},{key:"getOpenGames",value:function(){var e=this.props.app;if(!e.state.currentUser)return!1;var t={user_id:e.state.currentUser.user_id,userKey:e.state.currentUser.userKey};window.fetch(e.gameServer+"open_games",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(t){t.text().then((function(t){if(t.length){var n=JSON.parse(t),o=[];for(var r in n){var a={id:r,name:n[r].title,opponent:n[r].starter_name};a&&a.id&&o.push(a)}e.openGames=o}}))}))}},{key:"getPastOpponents",value:function(){var e=this.props.app;if(!e.state.currentUser)return!1;var t={user_id:e.state.currentUser.user_id,userKey:e.state.currentUser.userKey};window.fetch(e.gameServer+"past_opponents",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(t){t.text().then((function(t){if(t.length){var n=JSON.parse(t),o=[];for(var r in n){var a={id:r,name:n[r]};a&&a.id&&o.push(a)}e.pastOpponents=o}}))}))}},{key:"focusModeOption",value:function(e){if(e!=this.state.opponentSelectMode&&this.state.formOpen){var t={opponentSelectMode:e},n=this.state.opponentId;"past"!=this.state.opponentSelectMode&&"open"!=e&&"join"!=e&&"name"!=e||(n=null),"past"==e&&"(none)"==(n=this.pastOpponents.state.value)&&(n=null),"name"!=e&&(this.autoSuggest&&this.autoSuggest.setState({userInput:""}),t.userSearch=""),t.opponentFound=null!=n,t.opponentId=n,this.setState(t)}}},{key:"updateUserSearch",value:function(e){var t=this.props.app.usernameLookup[e]||null;this.setState({userSearch:e,opponentId:t,opponentFound:!!t})}},{key:"updatePastOpp",value:function(e){var t=parseInt(e)||null;this.setState({opponentId:t,opponentFound:!!t})}},{key:"changeOpponentSelectMode",value:function(e){this.setState({opponentSelectMode:e.target.value})}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.props.app,n=t.state.currentUser.user_id,o=t.state.currentUser.userKey,r=this.state.opponentId,a=this.state.opponentSelectMode;if(!n||!o)return[];if("join"==a)return this.setState({formOpen:!1}),this.getOpenGames(),void this.props.app.JoinGameMenu.setState({formOpen:!0});var s={user_id:n,userKey:o,mode:a},i=this;r&&(s.opponent_id=r),window.fetch(t.gameServer+"new_game",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(s)}).then((function(e){e.text().then((function(e){if(e.length){var n=JSON.parse(e);i.setState({formOpen:!1}),t.getRequests(),t.getGames(),n.gameId&&!isNaN(n.gameId)&&t.loadGame(n.gameId)}}))}))}},{key:"getModeHelpText",value:function(){var e;switch(this.state.opponentSelectMode){case"past":e="Choose from a list of your past opponents.  Avenge a past loss or reassert your dominance!";break;case"join":e="Join a random open game someone else has started.";break;case"open":e="Start a game anyone can join.  You can arrange your tiles while you wait for an opponent.";break;case"name":e="Search a list of available players to find your next opponent!";break;case"random":e="Feeling lucky?  Challenge a random opponent!";break;default:e=""}return e}},{key:"render",value:function(){var e=this;if(!this.state.formOpen)return null;var t=this.props.app,n=null,r="START GAME";"join"!=this.state.opponentSelectMode&&"random"!=this.state.opponentSelectMode||(r="FIND GAME");var a=null;this.state.opponentFound&&(n=o.createElement("span",{className:"pt-2 mt-3 d-block text-white text-center",style:{fontSize:"18px",width:"172px",height:"44px",background:"#e65f00",border:"1px solid black"}},o.createElement("p",{className:"opponentFound"},"Opponent Found!")),a=o.createElement(y.Z,{app:t,className:"anchor underline text-white d-block",user:{id:this.state.opponentId,name:"View Profile"}}));var c=this.getModeHelpText(),l=o.createElement("form",{action:t.gameServer+"new_game",onSubmit:this.handleSubmit},o.createElement(b.Z,{fluid:!0,className:"p-0",id:"new-game-menu"},o.createElement(g.Z,null,o.createElement(v.Z,{xs:12,className:"pl-3"},o.createElement("h3",{className:"text-white mt-0"},"NEW GAME"),o.createElement("p",{className:"text-white"},"Find an opponent:")),o.createElement(v.Z,{xs:12,md:7,className:"px-3"},o.createElement("div",{className:"w-100 game-mode-options bg-white p-3",style:{minHeight:"240px",border:"1px solid black"}},o.createElement("div",{onClick:function(){return e.focusModeOption("past")},className:"mb-3"},o.createElement("input",{type:"radio",name:"selectMode",className:"float-left mr-3 mt-1",value:"past",checked:"past"==this.state.opponentSelectMode,onChange:this.changeOpponentSelectMode}),o.createElement(i.default,{label:"Select from Past Opponents:",items:t.pastOpponents,emptyOption:"- Select Username -",emptyVal:"(none)",view:"select",id:"userOpponentList",parentObj:this,refName:"pastOpponents",callback:this.updatePastOpp})),o.createElement("div",{onClick:function(){return e.focusModeOption("name")},className:"mb-3"},o.createElement("input",{type:"radio",name:"selectMode",className:"float-left mr-3 mt-1",value:"name",checked:"name"==this.state.opponentSelectMode,onChange:this.changeOpponentSelectMode}),o.createElement("label",null,"User Search:"),o.createElement("div",{className:"autosuggest-wrapper"},o.createElement(d,{inputSize:"22",value:this.state.userSearch,onSelect:this.updateUserSearch,onChange:this.updateUserSearch,inputName:"nameSearch",placeholder:"Username",parentObj:this,suggestions:t.usernames?Object.values(t.usernames):[]}))),o.createElement("div",{onClick:function(){return e.focusModeOption("open")},className:""},o.createElement("label",null,"Create an Open Game"),o.createElement("input",{type:"radio",name:"selectMode",className:"float-left mr-3 mt-1",value:"open",checked:"open"==this.state.opponentSelectMode,onChange:this.changeOpponentSelectMode})),o.createElement("div",{onClick:function(){return e.focusModeOption("join")},className:""},o.createElement("label",null,"Join an Open Game"),o.createElement("input",{type:"radio",name:"selectMode",className:"float-left mr-3 mt-1",value:"join",checked:"join"==this.state.opponentSelectMode,onChange:this.changeOpponentSelectMode})),o.createElement("div",{onClick:function(){return e.focusModeOption("random")},className:""},o.createElement("label",null,"Random Opponent"),o.createElement("input",{type:"radio",name:"selectMode",className:"float-left mr-3 mt-1",value:"random",checked:"random"==this.state.opponentSelectMode,onChange:this.changeOpponentSelectMode})))),o.createElement(v.Z,{xs:12,sm:5,className:"pr-3"},o.createElement("div",{className:"w-100 game-mode-help-text md-up px-3 py-2",style:{backgroundColor:"#c2ab3a",minHeight:"148px",border:"1px solid black"}},o.createElement("p",null,c)))),o.createElement(g.Z,null,o.createElement(v.Z,{xs:12,sm:6,className:"text-left"},n,a),o.createElement(v.Z,{xs:12,sm:6,className:"text-right"},o.createElement("input",{className:"mt-3 d-inline-block text-white text-center go-button",type:"submit",value:r,style:{},disabled:!this.state.opponentId&&"open"!=this.state.opponentSelectMode&&"join"!=this.state.opponentSelectMode&&"random"!=this.state.opponentSelectMode})))));return o.createElement(s.Z,{parentMenu:this,content:l,styles:{backgroundColor:"var(--water)"},additionalClasses:"text-black"})}}])&&O(t.prototype,n),r&&O(t,r),p}(o.Component)},5181:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>h});var o=n(7294),r=n(5697),a=n.n(r),s=n(361),i=n.n(s);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const h=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(d,e);var t,n,r,s,c,h=(s=d,c=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=m(s);if(c){var n=m(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return p(this,e)});function d(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),(t=h.call(this,e)).callback=t.callback.bind(f(t)),t.afterCallback=t.afterCallback.bind(f(t)),t.renderSelect=t.renderSelect.bind(f(t)),t.renderList=t.renderList.bind(f(t)),t.linkList=t.linkList.bind(f(t)),t.state={value:e.value||null,label:e.label||"",items:e.items||[]},e.parentObj&&e.refName?e.parentObj[e.refName]=f(t):e.parentObj&&(e.parentObj.dataBrowser=f(t)),t}return t=d,r=[{key:"propTypes",get:function(){return{value:a().any,id:a().string,view:a().string,label:a().string,labelClass:a().string,className:a().string,items:a().array,links:a().array,parentObj:a().object,refName:a().string,beforeText:a().string,callback:a().func,afterCallback:a().func,afterArgKey:a().any,onSelect:a().func,emptyOption:a().string,deleteEmpty:a().bool,afterLinks:a().array,afterKeys:a().object,afterKeysSep:a().string,afterParentheses:a().bool,beforeLinks:a().bool,hideIfEmpty:a().bool,disabled:a().bool,emptyVal:a().any,additionalClasses:a().string}}}],(n=[{key:"callback",value:function(e){var t;t=e.target.hasAttribute("data-key")?e.target.getAttribute("data-key"):e.target.value,this.setState({value:t}),this.props.callback&&this.props.callback(t),this.render()}},{key:"afterCallback",value:function(){}},{key:"renderSelect",value:function(e,t){var n=this,r=this.callback,a=this.props.items;this.props.emptyOption&&(a=i()(this.props.items)).unshift({id:null,name:this.props.emptyOption});var s=a.map((function(e,t){return o.createElement("option",{key:t,value:e.id||n.props.emptyVal||"",onClick:n.props.onSelect||null},e.name)}));return o.createElement("div",{className:t},o.createElement("label",{className:this.props.labelClass},this.state.label),o.createElement("select",{onChange:r,id:e,value:this.state.value||""},s))}},{key:"linkList",value:function(e,t,n,r){var a=this.props[e].map((function(e,a){return o.createElement("li",{key:a,className:e.className},o.createElement("a",{className:"anchor underline",onClick:function(){return e.action(e.argKey?n[r][e.argKey]:t)}},e.label))}));return o.createElement("div",{className:"d-inline"},"[",o.createElement("ul",{className:"link-list px-1"},a),"]")}},{key:"renderList",value:function(e,t){var n,r=this,a=this.callback,s=this.props.items;if(this.props.deleteEmpty)for(var i in s)s[i].name||delete s[i];if(this.props.afterLinks)n=s.map((function(e,t){return o.createElement("li",{key:t},e.name," ",r.linkList("afterLinks",e.id,s,t))}));else if(this.props.beforeLinks)n=s.map((function(e,t){return o.createElement("li",{key:t},e.name," ",r.linkList("beforeLinks",e.id))}));else if(this.props.beforeText)n=s.map((function(e,t){return o.createElement("li",{key:t},r.props.beforeText," ",e.name)}));else{var c=null;for(var l in n=[],s){var u=s[l];if(u.buttons){var p=u.buttons.map((function(e,t){return o.createElement("li",{key:t,className:"mr-3 py-2"},o.createElement("a",{className:"button","data-type":e.type||"undefined","data-mode":e.mode||"undefined","data-id":e.id||"null",onClick:e.action},e.label))}));c=o.createElement("div",{"data-key":u.id},o.createElement("span",null,u.name),o.createElement("ul",{className:"item-buttons"},p))}else{var f="";if(this.props.afterKeys){var m=this.props.afterKeysSep||",",h=0;for(var d in this.props.afterKeys)u[d]&&(h&&(f+=m+" "),h++,f+=this.props.afterKeys[d].replace("%this%",u[d])+" "),f=f.trim();if(f.length){var y="",b="";this.props.afterParentheses&&(y="(",b=")"),f=" "+y+f+b}}c=o.createElement("a",{onClick:u.onSelect||a,className:"anchor underline","data-key":u.id},u.name),this.props.afterCallback&&(f=o.createElement("a",{className:"anchor",onClick:function(){return r.props.afterCallback(u[r.props.afterArgKey||d])}},f))}n.push(o.createElement("li",{key:l,className:u.className},c,f))}}return o.createElement("div",{className:t,id:this.props.id||null},o.createElement("label",{className:this.props.labelClass},this.state.label),o.createElement("ul",{id:e},n))}},{key:"render",value:function(){var e,t=this.props.view||"list",n="dataBrowser"+(this.props.disabled?" disabled ":" ")+(this.props.className||""),o=this.props.id||"";if(this.props.hideIfEmpty&&(!this.props.items||!this.props.items.length))return null;switch(t){case"select":e=this.renderSelect(o,n);break;case"list":default:e=this.renderList(o,n)}return e}}])&&l(t.prototype,n),r&&l(t,r),d}(o.Component)},7540:(e,t,n)=>{"use strict";n.d(t,{Z:()=>m});var o=n(7294),r=n(5697),a=n.n(r),s=n(6347);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?p(e):t}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const m=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(d,e);var t,n,r,i,m,h=(i=d,m=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=f(i);if(m){var n=f(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return u(this,e)});function d(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,d),(t=h.call(this,e)).onKeyDown=t.onKeyDown.bind(p(t)),t.closeForm=t.closeForm.bind(p(t)),t}return t=d,r=[{key:"propTypes",get:function(){return{parentMenu:a().object,content:a().any,styles:a().object,height:a().string,width:a().string,additionalClasses:a().string}}}],(n=[{key:"closeForm",value:function(){this.props.parentMenu.closeForm?this.props.parentMenu.closeForm():this.props.parentMenu.setState({formOpen:!1})}},{key:"onKeyDown",value:function(e){if(e.keyCode)switch(e.keyCode){case this.props.parentMenu.props.app.Config.KeyCodes.esc:this.closeForm()}}},{key:"render",value:function(){var e=this.props,t=e.content,n=e.parentMenu.props.app,r={};return e.styles&&(r=e.styles),o.createElement(s.Z,{id:e.parentMenu.id,app:n,content:t,height:e.height||"medium",width:e.width||"medium",open:e.parentMenu.state.formOpen,closeButton:!0,closeCallback:this.closeForm,onKeyDown:this.onKeyDown,styles:r,additionalClasses:"p-md-5 "+e.additionalClasses||0})}}])&&c(t.prototype,n),r&&c(t,r),d}(o.Component)},6347:(e,t,n)=>{"use strict";n.d(t,{Z:()=>f});var o=n(7294),r=n(5697),a=n.n(r);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(h,e);var t,n,r,s,f,m=(s=h,f=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=p(s);if(f){var n=p(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return l(this,e)});function h(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),(t=m.call(this,e)).state={},t.onKeyDown=t.onKeyDown.bind(u(t)),e.app.activeModal=u(t),t}return t=h,r=[{key:"propTypes",get:function(){return{app:a().object,open:a().bool,onKeyDown:a().func,closeButton:a().any,content:a().element,closeCallback:a().func,styles:a().object,height:a().string,width:a().string,additionalClasses:a().string,id:a().any}}}],(n=[{key:"onKeyDown",value:function(e){if(this.props.onKeyDown)return this.props.onKeyDown(e)}},{key:"componentDidMount",value:function(){this.modalContainer.focus()}},{key:"componentWillUnmount",value:function(){this.props.app.activeModal=null}},{key:"render",value:function(){var e=this,t=this.props.content,n=this.props,r=n.additionalClasses+" modal-wrapper";n.height&&(r+=" height-"+n.height),n.width&&(r+=" width-"+n.width);var a="";n.closeButton&&(a=o.createElement("a",{className:"close-button button",onClick:n.closeCallback},"X"));var s={};return n.styles&&(s=n.styles),o.createElement("section",{id:n.id||null,ref:function(t){e.modalContainer=t},className:"modal-container "+(n.open?" open":""),onKeyDown:this.onKeyDown},o.createElement("div",{className:"modal-overlay"}),o.createElement("div",{className:r,style:s},a,t))}}])&&i(t.prototype,n),r&&i(t,r),h}(o.Component)},1272:(e,t,n)=>{"use strict";n.d(t,{Z:()=>p});var o=n(7294),r=n(5697),a=n.n(r);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,n,r,s,p,f=(s=m,p=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=u(s);if(p){var n=u(this).constructor;e=Reflect.construct(t,arguments,n)}else e=t.apply(this,arguments);return l(this,e)});function m(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),f.call(this,e)}return t=m,r=[{key:"propTypes",get:function(){return{user:a().object,app:a().object,id:a().number,className:a().string}}}],(n=[{key:"render",value:function(){var e=this;if(!this.props.user||!this.props.user.id||!this.props.user.name)return"";var t=this.props.app;return o.createElement("a",{className:"userLink "+this.props.className,id:this.props.id,onClick:function(){return t.openUserProfile(e.props.user.id)}},this.props.user.name)}}])&&i(t.prototype,n),r&&i(t,r),m}(o.Component)},1555:(e,t,n)=>{"use strict";n.d(t,{Z:()=>f});var o=n(2122),r=n(9756),a=n(4184),s=n.n(a),i=n(7294),c=n(6792),l=["bsPrefix","className","as"],u=["xl","lg","md","sm","xs"],p=i.forwardRef((function(e,t){var n=e.bsPrefix,a=e.className,p=e.as,f=void 0===p?"div":p,m=(0,r.Z)(e,l),h=(0,c.vE)(n,"col"),d=[],y=[];return u.forEach((function(e){var t,n,o,r=m[e];if(delete m[e],"object"==typeof r&&null!=r){var a=r.span;t=void 0===a||a,n=r.offset,o=r.order}else t=r;var s="xs"!==e?"-"+e:"";t&&d.push(!0===t?""+h+s:""+h+s+"-"+t),null!=o&&y.push("order"+s+"-"+o),null!=n&&y.push("offset"+s+"-"+n)})),d.length||d.push(h),i.createElement(f,(0,o.Z)({},m,{ref:t,className:s().apply(void 0,[a].concat(d,y))}))}));p.displayName="Col";const f=p}}]);