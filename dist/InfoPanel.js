(self.webpackChunkreact_stratego=self.webpackChunkreact_stratego||[]).push([[201],{6270:(e,t,r)=>{"use strict";r.d(t,{Z:()=>p});var a=r(7294),n=r(5697),o=r.n(n),s=r(4772),l=r(1342);function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}var i=function(e){var t,r,n=(t=(0,l.c)({item:{type:"piece",rank:e.rank||null,game:e.game,color:e.color,tileSpace:e.tileSpace,fromX:e.fromX,fromY:e.fromY,fromId:e.fromId},canDrag:function(){return function(t,r,a,n){if(!(r&&r.state&&r.props.app&&r.props.app.state))return!1;if(!t)return!1;if(n)return!1;if(!r.props.app.state.currentUser||!r.props.app.state.currentUser.user_id)return!1;if(!r.state.started&&"drag"!=r.state.placementMode&&!e.placed)return!1;if(r.state.status&&"done"==r.state.status)return!1;var o=!0,s=r.props.app.state.currentUser.user_id;if(r.state.started){if(!r.props.app.Config.Pieces[t].move)return!1;var l=r.state.turn;o=r.state.players[l].id==s}return o}(e.rank,e.game,e.move,e.captured||!1)},collect:function(e){return{isDragging:!!e.isDragging(),canDrag:!!e.canDrag()}}}),r=2,function(e){if(Array.isArray(e))return e}(t)||function(e,t){var r=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null!=r){var a,n,o=[],s=!0,l=!1;try{for(r=r.call(e);!(s=(a=r.next()).done)&&(o.push(a.value),!t||o.length!==t);s=!0);}catch(e){l=!0,n=e}finally{try{s||null==r.return||r.return()}finally{if(l)throw n}}return o}}(t,r)||function(e,t){if(e){if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(e,t):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),o=n[0],i=o.isDragging,p=o.canDrag,u=n[1],m={color:e.color||"black",opacity:i?0:1};p&&e.game.state.started&&(m.cursor="move");var f=!1;e.rank&&(f=e.game.props.app.Config.Pieces[e.rank]),f&&!f.move&&e.game&&e.game.state.started&&(m.cursor="not-allowed");var d="";e.color&&(d="piece-"+e.color);var y="";return e.count&&(y=a.createElement("label",null,"x",e.count)),a.createElement("div",{ref:u,style:m,className:d+" "+(e.extraClass||"")},a.createElement(s.Z,{color:e.color,rank:e.rank,moveInfo:e.moveInfo||null,gameSpaceId:e.fromId||null,placed:e.placed||!1,captured:e.captured||!1,game:e.game,fromX:e.fromX,fromY:e.fromY,className:e.className}),y)};i.propTypes={placed:o().bool,captured:o().bool,rank:o().any,game:o().object,color:o().string,tileSpace:o().object,fromX:o().number,fromY:o().number,fromId:o().number,move:o().any,moveInfo:o().object,count:o().number,extraClass:o().string,className:o().string};const p=i},4772:(e,t,r)=>{"use strict";r.d(t,{Z:()=>f});var a=r(7294),n=r(5697),o=r.n(n),s=r(6713);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(y,e);var t,r,n,l,f,d=(l=y,f=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=m(l);if(f){var r=m(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return p(this,e)});function y(e){var t;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,y),(t=d.call(this,e)).state={captured:e.captured||!1,placed:e.placed||!1},e.rank&&e.game){var r=e.game.props.app.Config.Pieces[e.rank],a=r.name,n=r.rackOrder,o=r.move,s=r.capture,l=r.defuse;t.name=a,t.rackOrder=n,t.move=o,t.capture=s||null,t.defuse=l||!1}return t.pieceClicked=t.pieceClicked.bind(u(t)),t}return t=y,n=[{key:"propTypes",get:function(){return{captured:o().bool,placed:o().bool,rank:o().any,game:o().object,gameSpaceId:o().number,x:o().number,y:o().number,fromX:o().number,fromY:o().number,className:o().string,wrapperClass:o().string,color:o().string,moveInfo:o().object}}}],(r=[{key:"pieceClicked",value:function(){var e=this.props.game,t=e.props.app,r=t.gameBoard;if(this.props.placed&&this.props.gameSpaceId&&e&&"click"==e.state.placementMode&&!e.selectedRank&&!e.state.started)if(r.state.selectedSpace){var n=Math.ceil(parseInt(this.props.gameSpaceId)/10);(n<5?"red":n>6?"blue":"neutral")==t.tileRack.playerColor&&r.swapPieces(this.props.gameSpaceId,r.state.selectedSpace),r.highlightSpace(null),r.selectSpace(null),e.resetHelpText()}else r.selectSpace(this.props.gameSpaceId),r.highlightSpace(this.props.gameSpaceId),e.setHelpText("Click any space to move the selected tile there.");else if(this.props.placed||!e||e.state.started||"click"!=e.state.placementMode){if(this.props.placed&&e&&!e.state.started&&"erase"==e.state.placementMode)t.tileRack.returnTileToRack(e,t,this.props.gameSpaceId),e.resetHelpText();else if(t.isMobile&&e&&e.state.started&&this.props.placed&&e.state.turn==t.tileRack.playerColor&&t.tileRack.playerColor==this.props.color){r.selectSpace(this.props.gameSpaceId),r.highlightSpace(this.props.gameSpaceId),r.clearDroppables();var o=r.getValidMoveSpaces(this.props.fromX,this.props.fromY,this.props.color,this,e);for(var s in o){var l=o[s];l!=this.props.gameSpaceId&&(r.droppable[l]=!0,r.resetSpace(l))}o.length?2==o.length?e.setHelpText("Tap the highlighted square to move there."):1==o.length?e.setHelpText({headline:"No moves are available",subtext:"Please choose another piece."}):e.setHelpText("Tap any of the highlighted squares to move there."):e.setHelpText("No valid moves.  Try selecting another piece.")}}else{e.selectedRank=e.selectedRank!=this.props.rank?this.props.rank:null;var c=t.isMobile?"Tap":"Click";t.tileRack&&t.tileRack.remaining&&e.selectedRank?e.setHelpText(a.createElement("div",null,c+" a square to place a ",a.createElement("div",{className:"d-inline-block position-relative tileFace rank-"+this.props.rank}))):e.resetHelpText(),t.tileRack.setState({})}}},{key:"render",value:function(){var e="gamePiece text-center mx-auto"+(this.props.className||""),t="gamePiece-wrapper "+(this.props.wrapperClass||"");t=t.trim();var r="";e=e.trim();var n="";return this.props.moveInfo&&(r=" "+this.props.moveInfo.direction+"-"+this.props.moveInfo.distance),this.props.rank?n=a.createElement("div",{className:"tileFace rank-"+this.props.rank}):t+=" no-drag",a.createElement(s.Z,{in:this.props.moveInfo&&this.props.game.state.started,timeout:1e3,classNames:"piece-moving",appear:!0},a.createElement("div",{className:t+r,onClick:this.pieceClicked},a.createElement("div",{className:e+" "+this.props.color},n)))}}])&&c(t.prototype,r),n&&c(t,n),y}(a.Component)},6698:(e,t,r)=>{"use strict";r.d(t,{Z:()=>n});var a=r(7294);const n=function(e){var t=e.game,r=e.textClass,n=e.wrapperClass,o=e.textStyles,s=e.wrapperStyles,l=!1,c="";return void 0===n&&(n="d-table"),void 0===r&&(r="d-table-cell w-100 p-0 m-0 text-center"),void 0===s&&(s={}),void 0===o&&(o={}),t.state.helpText&&(l=t.state.helpText),t.state.helpSubtext&&(c=a.createElement("p",{className:"m-0 subtext"},t.state.helpSubtext)),l||(n+=" transparent"),a.createElement("div",null,a.createElement("div",{className:n,id:"help-bar",style:s},a.createElement("span",{className:r,style:o},l,c),a.createElement("a",{className:"text-white md-up",id:"help-bar-close",onClick:t.closeHelpBar},"X")),a.createElement("a",{className:"circle-link text-white",id:"help-bar-open",onClick:t.openHelpBar},"?"))}},3795:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>M});var a=r(7294),n=r(1272),o=r(6168),s=r(5697),l=r.n(s);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(y,e);var t,r,n,s,c,d=(s=y,c=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=f(s);if(c){var r=f(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return u(this,e)});function y(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,y),(t=d.call(this,e)).callback=t.callback.bind(m(t)),t.state={value:e.value||null,label:e.label||"",layout:e.layout||"horizontal"},t.onKeyDown=t.onKeyDown.bind(m(t)),t}return t=y,n=[{key:"propTypes",get:function(){return{value:l().any,game:l().object,disableArrows:l().bool,disabled:l().bool,hidden:l().bool,callback:l().func,layout:l().string,label:l().string,ulClass:l().string,liClass:l().string,labelClass:l().string,listLabelClass:l().string,name:l().string,options:l().array,className:l().string,id:l().any}}}],(r=[{key:"callback",value:function(e){var t=e.currentTarget.value;this.setState({value:t}),this.props.callback&&this.props.callback(e.currentTarget.value),this.render()}},{key:"onKeyDown",value:function(e){this.props.disableArrows&&e.keyCode<41&&e.keyCode>36&&e.preventDefault()}},{key:"render",value:function(){var e=this.props,t=this.state,r=this.callback,n=t.layout,s=this.props.options.map((function(n,o){return n.exclude?null:a.createElement("li",{className:e.liClass+" "+n.className||"",key:o,onClick:n.onSelect,"data-tip":n.tooltip},a.createElement("label",{className:e.labelClass},a.createElement("p",{className:"mt-3 mb-0"},n.key),a.createElement("input",{type:"radio",defaultChecked:n.value===t.value,tabIndex:"-1",value:n.value,name:e.name,disabled:e.disabled,onClick:r}),a.createElement("span",{className:"checkmark"})))})),l=e.ulClass+" "+n,c="optionIndicator text-center"+(e.disabled?" disabled ":" ")+(this.props.className||"");return e.hidden&&(c+=" d-none"),a.createElement("div",{className:c,id:e.id,onKeyDown:this.onKeyDown},a.createElement("label",{className:e.listLabelClass},this.state.label),a.createElement("ul",{className:l},s),a.createElement(o.Z,null))}}])&&i(t.prototype,r),n&&i(t,n),y}(a.Component);var y=r(6270);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e,t){return!t||"object"!==h(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function S(e){return(S=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const x=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(i,e);var t,r,n,o,s,c=(o=i,s=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=S(o);if(s){var r=S(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return v(this,e)});function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).state={highlight:!1,passable:e.passable||!0,occupied:e.occupied||!1,occupant:null},t.remaining=e.count||e.game.props.app.Config.Pieces[t.props.rank].count,t.state.remaining=t.remaining,t.onClick=t.props.onClick||function(){},t.empty=t.empty.bind(k(t)),t.populate=t.populate.bind(k(t)),t.rack=e.rack,t.app=e.rack.app,t.app.tileSpaces[e.rank]=k(t),t}return t=i,n=[{key:"propTypes",get:function(){return{rack:l().object,game:l().object,count:l().number,passable:l().bool,occupied:l().bool,onClick:l().func,name:l().string,rank:l().any}}}],(r=[{key:"populate",value:function(e){this.setState({occupant:e})}},{key:"empty",value:function(){this.setState({occupant:null})}},{key:"render",value:function(){var e=this.props.game.props.app.Config.Pieces[this.props.rank].rackOrder,t=e?" order-"+e:"",r=!this.remaining,n=this.props.game.selectedRank&&this.props.game.selectedRank==this.props.rank?" selected-rank":"";return r?a.createElement("div",{id:"tileSpace-"+this.props.rank,className:"tileSpace col-2 col-sm-1 col-md-4 col-lg-4 "+this.props.rank+t+(this.state.highlight?" highlight":"")}):a.createElement("div",{id:"tileSpace-"+this.props.rank,className:"tileSpace col-2 col-sm-1 col-md-4 col-lg-4 "+this.props.rank+t+n+(this.state.highlight?" highlight":""),onClick:this.onClick},a.createElement(y.Z,{color:this.rack.playerColor,rank:this.props.rank,placed:!1,game:this.props.game,tileSpace:this}),a.createElement("label",null,"x",this.state.remaining))}}])&&b(t.prototype,r),n&&b(t,n),i}(a.Component);var E=r(5975),C=r(682),w=r(4051),N=r(1555);function O(e){return(O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function j(e,t){return!t||"object"!==O(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const I=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(i,e);var t,r,n,o,s,c=(o=i,s=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=T(o);if(s){var r=T(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return j(this,e)});function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).remaining=e.remaining||40,t.spaces={},t.renderTileSpace=t.renderTileSpace.bind(_(t)),t.tileSpaces=t.tileSpaces.bind(_(t)),t.setReady=t.setReady.bind(_(t)),t.resetCounts=t.resetCounts.bind(_(t)),t.handleClick=t.handleClick.bind(_(t)),t.app=e.app,t.app.tileRack=_(t),t.app.tileSpaces={},t.state={allPlaced:!1},t.app.state.currentUser.user_id==t.app.state.activeGame.props.starter?t.playerColor="blue":t.playerColor="red",t}return t=i,n=[{key:"propTypes",get:function(){return{remaining:l().number,app:l().object,game:l().object,onChange:l().func,suggestions:l().array,inputName:l().string,placeholder:l().string}}}],(r=[{key:"componentDidMount",value:function(){this.app.tileRack=this}},{key:"renderTileSpace",value:function(e){return a.createElement(x,{id:"tileSpace-"+e,rack:this,key:e,rank:e,game:this.props.game})}},{key:"resetCounts",value:function(e){var t,r=this.props.app;if(e&&void 0!==e){for(t in e)"total"!=t&&(r.tileSpaces[t].remaining=e[t],r.tileSpaces[t].setState({remaining:e[t]}));void 0!==e.total&&(this.remaining=e.total,this.setState({allPlaced:this.remaining<1}))}else for(t in this.remaining=40,this.setState({allPlaced:!1}),r.Config.Pieces)r.tileSpaces[t].remaining=r.Config.Pieces[t].count,r.tileSpaces[t].setState({remaining:r.Config.Pieces[t].count})}},{key:"tileSpaces",value:function(){var e=[];for(var t in this.props.app.Config.Pieces)e.push(this.renderTileSpace(t));return this.spaces=e,e}},{key:"setReady",value:function(e){var t=this.app,r=this.props.game,a=r.state.players;a[this.playerColor].ready=e,r.setState({players:a}),t.saveActiveGame()}},{key:"componentWillUnmount",value:function(){this.app.tileRack=null,this.app.tileSpaces={}}},{key:"returnTileToRack",value:function(e,t,r){var a=t.gameBoard;void 0===r&&(r=a.state.selectedSpace);var n=a.state.spaces[r];if(n.props.children){var o=n.props.children.props.rank;t.tileSpaces[o].remaining++,this.remaining++,a.emptySpace(r),"click"==e.state.placementMode&&(a.selectSpace(null),a.highlightSpace(null)),t.tileSpaces[o].setState({remaining:t.tileSpaces[o].remaining}),this.setState({allPlaced:!1}),t.saveActiveGame()}}},{key:"handleClick",value:function(){}},{key:"render",value:function(){var e=this,t="",r="",n=this.props.game;return(0,E.fF)("TileRack rendering"),n.state.started||(this.remaining||!this.state.allPlaced||n.state.players[this.playerColor].ready?!this.remaining&&this.state.allPlaced&&(t=a.createElement(N.Z,{xs:12},a.createElement("a",{className:"go-button d-block red text-white text-center mx-auto my-md-3",tabIndex:"-1",onClick:function(){return e.setReady(!1)}},"I'm Not Ready!"))):t=a.createElement(N.Z,{xs:12},a.createElement("a",{className:"go-button d-block blue text-white text-center mx-auto my-md-3 glowing",tabIndex:"-1",onClick:function(){return e.setReady(!0)}},"I'm Ready!")),n.state.players.blue.ready&&n.state.players.red.ready&&(r=a.createElement(N.Z,{xs:12},a.createElement("a",{className:"go-button d-block text-white text-center mx-auto my-3 glowing",tabIndex:"-1",onClick:n.startGame},"START GAME")))),a.createElement(C.Z,{fluid:!0,className:"px-0",onClick:this.handleClick},a.createElement(w.Z,{noGutters:!0,className:"tileRack px-3 px-md-0 pt-2 pt-sm-3"},r,t,this.tileSpaces()))}}])&&R(t.prototype,r),n&&R(t,n),i}(a.Component);var Z=r(6698);const M=function(e){var t=e.game,r=e.app,o=e.playerColor,s="",l="",c=a.createElement(I,{game:t,app:r});if(r.isMobile&&(l=a.createElement(I,{game:t,app:r}),c=""),r.gameLoading)s=a.createElement(N.Z,{xs:{span:12,order:3},lg:{span:3,order:2},className:"px-0 tileRack-col bg-md-white mt-lg-3 mr-xl-auto game-loading"});else if(t.state.started){var i,p;if(t.state.turn&&t.state.status&&"done"!=t.state.status)i=a.createElement("h6",{className:"text-center mx-auto my-3 col-12 pt-3"},"Current Turn: ",a.createElement("br",{className:"sm-down"}),a.createElement("span",{className:"text-"+t.state.turn},t.state.players[t.state.turn].name));else if(t.state.status&&"done"==t.state.status){var u,m;t.state.winner_uid==t.props.starter?(u=t.props.starterName,m="text-blue"):(u=t.props.opponentName,m="text-red");var f={name:u,id:t.state.winner_uid},y=a.createElement(n.Z,{app:r,user:f,className:"anchor "+m});p=a.createElement("h5",{className:"text-center mx-auto mt-4"},y," is the winner!")}var h={red:[],blue:[]};for(var b in t.state.captured)for(var g in t.state.captured[b])h[b].push(t.state.captured[b][g]);s=a.createElement(N.Z,{xs:{span:12,order:1},sm:"4",lg:{span:3,order:2},className:"px-0 info-panel text-center mt-lg-3 mr-xl-auto h-sm-auto"},a.createElement(w.Z,{noGutters:!0},a.createElement(N.Z,{xs:4,sm:12},p,i),a.createElement(N.Z,{xs:8,sm:12},a.createElement(w.Z,{noGutters:!0},a.createElement("h4",{className:"mx-auto d-sm-block mt-3 my-sm-3 col-12"},"Captured"),a.createElement(N.Z,{xs:6,className:"px-3"},a.createElement("span",{className:"text-red"},a.createElement(n.Z,{app:r,user:t.state.players.red,className:"anchor"})),a.createElement("div",{className:"captured-tiles player-red mt-3 md-up"},h.red.length?h.red:"None"),a.createElement("span",{className:"captured-tiles player-red mt-3 sm-down"},h.red.length)),a.createElement(N.Z,{xs:6,className:"px-3"},a.createElement("span",{className:"text-blue"},a.createElement(n.Z,{app:r,user:t.state.players.blue,className:"anchor"})),a.createElement("div",{className:"captured-tiles player-blue mt-3 md-up"},h.blue.length?h.blue:"None"),a.createElement("span",{className:"captured-tiles player-blue mt-3 sm-down"},h.blue.length))))),a.createElement(Z.Z,{game:t,app:r,wrapperClass:"d-none d-sm-table w-100",wrapperStyles:{height:"8rem"}}),a.createElement("div",{className:"d-none"},a.createElement(I,{game:t,app:r})))}else s=a.createElement(N.Z,{xs:{span:12,order:3},lg:{span:3,order:2},className:"px-0 tileRack-col bg-md-white mt-lg-3 mr-xl-auto"},a.createElement(w.Z,{noGutters:!0,className:"pt-1 pt-md-3"},a.createElement(d,{id:"placementMode",className:"col-12 px-0 mb-md-3",layout:"horizontal",value:t.state.placementMode,disableArrows:!0,ulClass:"text-center px-0 pt-3 pt-md-0 mb-2 mb-md-0",liClass:"col-4 col-md-6 p-0 mx-auto h-50",disabled:t.state.players[o].ready,labelClass:"px-2 px-md-3",listLabelClass:"pb-2 md-up",options:[{key:"Click & Place",value:"click"},{key:"Keyboard",value:"keyboard",exclude:r.isMobile},{key:"Quick Load",value:"quick",onSelect:t.openQuickLoadModal},{key:"Erase",value:"erase"}],name:"placementMode",label:"Placement Mode",callback:t.modeChange}),l,a.createElement(N.Z,{xs:12,className:"mx-auto"},c)));return s}},1272:(e,t,r)=>{"use strict";r.d(t,{Z:()=>u});var a=r(7294),n=r(5697),o=r.n(n);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}const u=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(f,e);var t,r,n,s,u,m=(s=f,u=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,t=p(s);if(u){var r=p(this).constructor;e=Reflect.construct(t,arguments,r)}else e=t.apply(this,arguments);return i(this,e)});function f(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),m.call(this,e)}return t=f,n=[{key:"propTypes",get:function(){return{user:o().object,app:o().object,id:o().number,className:o().string}}}],(r=[{key:"render",value:function(){var e=this;if(!this.props.user||!this.props.user.id||!this.props.user.name)return"";var t=this.props.app;return a.createElement("a",{className:"userLink "+this.props.className,id:this.props.id,onClick:function(){return t.openUserProfile(e.props.user.id)}},this.props.user.name)}}])&&l(t.prototype,r),n&&l(t,n),f}(a.Component)}}]);