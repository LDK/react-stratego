(this["webpackJsonpreact-stratego"]=this["webpackJsonpreact-stratego"]||[]).push([[0],{35:function(e,t,a){},36:function(e,t,a){},55:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),s=a(26),r=a.n(s),i=(a(35),a(4)),o=(a(36),a(37),a(16)),d=a(2),u=a(10),l=a(9),j=a(1);function h(e){var t=Object(u.c)(),a=t.authState,c=t.oktaAuth,s=e.app,r=s.userInfo,i=s.setUserInfo,o=s.unregistered,d=s.setUnregistered,l=s.checkAuth;if(Object(n.useEffect)((function(){return l({authState:a,oktaAuth:c,userInfo:r,setUserInfo:i,setUnregistered:d})}),[a,c]),!a)return Object(j.jsx)("div",{children:"Loading authentication..."});var h=function(){return c.signInWithRedirect({originalUri:"/"})},b=function(){return a.isAuthenticated?null:Object(j.jsx)("div",{children:Object(j.jsx)("button",{onClick:h,children:"Login"})})},O="",p="",f="",g=function(e,t,a){return Object(j.jsxs)("div",{id:t,children:[Object(j.jsx)("h3",{children:a}),Object(j.jsx)("ul",{children:e.map((function(e){return Object(j.jsx)("li",{children:Object(j.jsx)("a",{href:"/game/"+e.id,children:e.title})},"game-".concat(t,"-").concat(e.id))}))})]})};return a.isAuthenticated?o?O=Object(j.jsx)("div",{children:Object(j.jsx)("p",{children:"If you are seeing this, I should really open a modal to create your profile, new user."})}):r?(O=Object(j.jsxs)("div",{children:[Object(j.jsxs)("p",{children:["Welcome, ",r.username,"!"]}),Object(j.jsx)("button",{onClick:function(){c.signOut()},children:"Logout"})]}),r.recent_games&&(p=g(r.recent_games,"recent-games","Recent Games")),r.active_games&&(f=g(r.active_games,"active-games","Active Games"))):O=Object(j.jsx)("div",{children:Object(j.jsx)("p",{children:"Loading user info..."})}):O=Object(j.jsxs)("div",{children:[Object(j.jsx)("p",{children:"You need to sign in to use the application!"}),Object(j.jsx)(b,{})]}),Object(j.jsxs)("div",{className:"page-home",children:[Object(j.jsx)("h1",{children:"Welcome to Stratego"}),O,f,p]})}var b=a(29),O=a(25),p=a(30),f=[43,44,47,48,53,54,57,58],g=function(e){var t,a,n=e.x,c=e.y,s=e.id,r=e.data;return f.includes(s)?Object(j.jsx)(O.a,{className:"game-space unpassable text-center","data-x":n,"data-y":c,"data-id":s,"data-passable":!1,children:"X"}):(e.data&&(t=e.data.rank,a=e.data.color),r&&console.log("game space",s,e.data,t,a),Object(j.jsxs)(O.a,{className:"game-space","data-x":n,"data-y":c,"data-id":s,children:[s,": ",a||""," ",t||"?"]}))},m=function(e){for(var t=e.y,a=e.spaces,n=1,c=[];n<=10;){var s=10*(t-1)+n;c.push(Object(j.jsx)(g,{y:t,x:n,id:s,data:a[s]},s)),n++}return Object(j.jsx)(b.a,{className:"board-row",children:c})},x=function(e){if(!e||!e.data)return null;var t=[],a={};e.data.spaces&&(a=JSON.parse(e.data.spaces));for(var n=1;n<=10;)t.push(Object(j.jsx)(m,{spaces:a,y:n},"row-"+n)),n++;return Object(j.jsxs)(p.a,{className:"game-board",children:[Object(j.jsxs)("p",{children:["game board, last checked ",e.lastChecked]}),t]})};function v(e){var t=Object(d.e)().game_id,a=Object(u.c)(),c=a.authState,s=a.oktaAuth,r=e.app,o=r.userInfo,l=r.setUserInfo,h=r.unregistered,b=r.setUnregistered,O=r.checkAuth,p=Object(n.useState)(!1),f=Object(i.a)(p,2),g=f[0],m=f[1],v=Object(n.useState)(!1),S=Object(i.a)(v,2),k=S[0],y=S[1],w=Object(n.useState)(null),I=Object(i.a)(w,2),_=I[0],U=I[1],A=Object(n.useState)(null),N=Object(i.a)(A,2),C=N[0],L=N[1],T=Object(n.useState)(null),G=Object(i.a)(T,2),J=G[0],Y=G[1],F=Object(n.useState)(null),P=Object(i.a)(F,2),R=P[0],B=P[1],D=Object(n.useState)(null),E=Object(i.a)(D,2),K=E[0],W=E[1],q=Object(n.useState)(Date.now()),H=Object(i.a)(q,2),M=H[0],Q=H[1],X=Object(n.useState)(null),z=Object(i.a)(X,2),V=z[0],Z=z[1],$=Object(n.useState)(!1),ee=Object(i.a)($,2),te=ee[0],ae=ee[1];if(Object(n.useEffect)((function(){return O({authState:c,oktaAuth:s,userInfo:o,setUserInfo:l,setUnregistered:b})}),[c,s]),!c)return Object(j.jsx)("div",{children:"Loading authentication..."});if(te)return Object(j.jsx)("div",{children:"Sorry, no game was found with that id."});if(c.isAuthenticated){if(h)return Object(j.jsx)("div",{children:Object(j.jsx)("p",{children:"If you are seeing this, I should really open a modal to create your profile, new user."})});if(o){g||k||function(e,t){if(!g){y(!0);var a={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e,userKey:t.key,user_id:t.id})};fetch("http://localhost:3002/game",a).then((function(e){e.ok?e.json().then((function(e){m(!0),y(!1),U(e.turn),L(e.starter_uid==t.id?"blue":"red"),Y(e.starter_uid==t.id?e.opponent_name:e.starter_name),W(e.starter_name),B(e.opponent_name),Q(Date.now()),console.log("setting game data"),Z(e)})):ae(!0)}))}}(t,o);var ne="";return _&&(ne=Object(j.jsxs)("p",{children:["red"==_?R:K,"'s turn."]})),Object(j.jsxs)("div",{className:"game-wrapper",children:["Game: ",t,". You are ",o.username,". Your opponent is ",J,". You use ",C," tiles.",ne,Object(j.jsx)(x,{data:V,lastChecked:M,color:C,turn:_})]})}return Object(j.jsx)("div",{children:Object(j.jsx)("p",{children:"Loading..."})})}return window.location="/",Object(j.jsx)("div",{children:Object(j.jsx)("p",{children:"You need to sign in to use the application!"})})}var S="dev-6379228.okta.com",k={clientId:"".concat("0oa2t6lqn7Qsg1T3g5d7"),issuer:"https://".concat(S,"/oauth2/default"),discoveryUri:"https://".concat(S,"/oauth2/default"),redirectUri:"http://localhost:3000/login-callback",endSessionRedirectUri:"http://localhost:3000/logout",scopes:["openid","profile","email"],requireHardwareBackedKeyStore:!1,pkce:!0},y=new l.OktaAuth(k),w=Object(l.toRelativeUrl)(window.location.href,window.location.origin);y.setOriginalUri(w);var I=function(){return Object(j.jsxs)("header",{children:[Object(j.jsx)("div",{children:"Stratego"}),Object(j.jsx)("ul",{className:"menu",children:Object(j.jsx)("li",{children:Object(j.jsx)(o.b,{to:"/",children:"Home"})})})]})},_=function(){var e=Object(n.useState)(null),t=Object(i.a)(e,2),a=t[0],c=t[1],s=Object(n.useState)(!1),r=Object(i.a)(s,2),l={userInfo:a,setUserInfo:c,unregistered:r[0],setUnregistered:r[1],checkAuth:function(e){var t=e.authState,a=e.oktaAuth,n=e.userInfo,c=e.setUserInfo,s=e.setUnregistered;t&&t.isAuthenticated?n&&n.username||a.token.getUserInfo().then((function(e){var t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userKey:e.sub,email:e.email})};fetch("http://localhost:3002/login",t).then((function(e){return e.json()})).then((function(t){c({email:t.email,id:t.user_id,key:e.sub,invite_available:t.invite_available,random_available:t.random_available,username:t.username,recent_games:t.recentGames,active_games:t.activeGames}),s(!t.user_id)}))})):c(null)}};return Object(j.jsx)("div",{className:"App",children:Object(j.jsxs)(o.a,{children:[Object(j.jsx)(I,{}),Object(j.jsxs)(u.b,{oktaAuth:y,restoreOriginalUri:function(){window.location="/"},children:[Object(j.jsx)(d.a,{exact:!0,path:"/",children:Object(j.jsx)(h,{app:l})}),Object(j.jsx)(d.a,{path:"/game/:game_id",children:Object(j.jsx)(v,{app:l})}),Object(j.jsx)(d.a,{path:"/login-callback",component:u.a})]})]})})},U=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,56)).then((function(t){var a=t.getCLS,n=t.getFID,c=t.getFCP,s=t.getLCP,r=t.getTTFB;a(e),n(e),c(e),s(e),r(e)}))};r.a.render(Object(j.jsx)(c.a.StrictMode,{children:Object(j.jsx)(_,{})}),document.getElementById("root")),U()}},[[55,1,2]]]);
//# sourceMappingURL=main.bcc24fc6.chunk.js.map