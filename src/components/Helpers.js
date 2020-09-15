//Helpers.js

export const sanitizeBooleans = (value) => {
	if (typeof value == 'object' || typeof value=='array') {
		for (var i in value) {
			value[i] = sanitizeBooleans(value[i]);
		}
		return value;
	}
	if (value == 'False') {
		value = false;
	}
	if (value == 'True') {
		value = true;
	}
	return value
};

export const PIECES = {
	1: { name: 'Marshal', move: 1, count: 1, rackOrder: 2},
	2: { name: 'General', move: 1, count: 1, rackOrder: 3},
	3: { name: 'Colonel', move: 1, count: 2, rackOrder: 4},
	4: { name: 'Major', move: 1, count: 3, rackOrder: 5},
	5: { name: 'Captain', move: 1, count: 4, rackOrder: 6},
	6: { name: 'Lieutenant', move: 1, count: 4, rackOrder: 7},
	7: { name: 'Sergeant', move: 1, count: 4, rackOrder: 8},
	8: { name: 'Miner', move: 1, count: 5, defuse: true, rackOrder: 9},
	9: { name: 'Scout', move: 9, count: 8, rackOrder: 10},
	S: { name: 'Spy', move: 1, count: 1, capture: 1, rackOrder: 11},
	F: { name: 'Flag', move: 0, count: 1, flag: true, rackOrder: 1},
	B: { name: 'Bomb', move: 0, count: 6, rackOrder: 12}
};

export const keyCodes = {backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,pausebreak:19,capslock:20,esc:27,space:32,pageup:33,pagedown:34,end:35,home:36,leftarrow:37,uparrow:38,rightarrow:39,downarrow:40,insert:45,delete:46,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,leftwindowkey:91,rightwindowkey:92,selectkey:93,numpad0:96,numpad1:97,numpad2:98,numpad3:99,numpad4:100,numpad5:101,numpad6:102,numpad7:103,numpad8:104,numpad9:105,multiply:106,add:107,subtract:109,decimalpoint:110,divide:111,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123,numlock:144,scrolllock:145,semicolon:186,equalsign:187,comma:188,dash:189,period:190,forwardslash:191,graveaccent:192,openbracket:219,backslash:220,closebracket:221,singlequote:222};

export const layouts = [{id: "Deboer1",name: "Deboer1",value:'[5,9,9,6,9,5,8,1,9,5,6,7,"B","S",2,9,4,4,3,9,7,"B",7,4,3,6,"B",6,5,7,9,8,"B",9,8,"B","F","B",8,8]'},{id: "Aggressive",name: "Aggressive",value:'[1,5,6,8,9,5,9,9,9,5,7,9,3,3,2,9,7,"B","B",6,4,9,4,"S",5,6,"B",7,6,9,4,8,8,8,7,"B","F","B","B",8]'},{id: "Counter-Aggressive",name: "Counter-Aggressive",value:'["B",2,"S",3,9,6,8,3,9,6,7,"B",8,5,4,1,9,9,4,9,"B",7,"B",9,9,6,7,5,9,5,"F","B",7,"B",5,8,8,8,6,4]'},{id: "Deboer2",name: "Deboer2",value:'[5,9,7,2,5,9,9,1,9,5,6,9,4,6,"B",9,4,4,3,8,7,3,"S",8,"B",9,5,6,6,"B",8,"B",7,"B",7,9,8,8,"B","F"]'},{id: "Deboer3",name: "Deboer3",value:'[9,3,6,9,5,9,2,8,9,5,1,9,4,3,9,5,"B",6,"B",6,5,7,4,"S",4,6,"B",7,"B",7,8,9,8,8,7,"B","F","B",8,9]'},{id: "Deboer4",name: "Deboer4",value:'[2,5,9,7,9,9,9,8,5,9,8,9,3,4,"B",6,1,4,6,3,"B",5,"S",4,6,9,5,6,"B",7,7,9,8,"B",7,8,8,"B","F","B"]'},{id: "Shoreline Bluff Variation",name: "Shoreline Bluff Variation",value:'[9,9,"B","F","B","B",7,9,9,9,4,2,3,"B",1,4,"B",8,3,4,6,7,5,5,8,8,5,9,5,6,9,7,8,6,9,"S",7,"B",6,8]'},{id: "Spy Guard",name: "Spy Guard",value:'[7,8,6,4,7,9,6,4,7,8,"B","B",1,3,"B","B",3,2,"B","B",6,"S",5,7,5,8,9,5,9,9,"F",4,5,9,9,9,6,9,8,8]'},{id: "Bomb Barrier",name: "Bomb Barrier",value:'["B",2,1,9,7,6,7,6,6,"B",3,"S","B",5,7,9,9,"B",6,5,"B",4,8,8,3,4,9,4,7,9,"F","B",8,8,8,5,9,9,5,9]'},{id: "B22",name: "B22",value:'[5,9,2,"B",7,7,9,9,7,7,3,1,9,3,"B",6,9,6,9,8,"B",8,"S",4,5,"B",8,5,6,9,"F","B",4,8,4,5,"B",8,9,6]'},{id: "Flood",name: "Flood",value:'[9,9,8,4,"B","B",7,7,"B","B",2,3,"S",8,5,3,5,5,4,7,"B",1,6,8,8,4,5,6,6,6,"F","B",9,9,9,9,9,9,8,7]'}];

export const xyToId = function(x,y) {
	x = parseInt(x);
	y = parseInt(y);
	if (isNaN(x) || isNaN(y) || x<1 || y<1 || x>10 || y>10) {
		return null;
	}
	return (y-1) * 10 + x;  
}
export const idToXy = function(id) {
	if (isNaN(id) || id<1 || id>100) {
		return null;
	}
	var x = id % 10;
	if (x == 0) {
		x = 10;
	}
	var y = Math.floor((id - 1) / 10) + 1
	return {x: x, y: y};
}

export const getSpaceId = function(startX,startY,distance,direction) {
	var spaceId = false;
	switch (direction) {
		case 'east':
			spaceId = xyToId(startX+distance, startY);
		break;
		case 'west':
			spaceId = xyToId(startX-distance, startY);
		break;
		case 'south':
			spaceId = xyToId(startX, startY+distance);
		break;
		case 'north':
			spaceId = xyToId(startX, startY-distance);
		break;
	}
	return spaceId;
}

export const getVector = function(fromId,toId) {
	const from = idToXy(fromId);
	const to = idToXy(toId);
	var rv = {
		distance: Math.max(Math.abs(from.x-to.x),Math.abs(from.y-to.y))
	};
	if (from.y > to.y) {
		rv.direction = 'up';
	}
	else if (from.y < to.y) {
		rv.direction = 'down';
	}
	else if (from.x > to.x) {
		rv.direction = 'left';
	}
	else if (from.x < to.x) {
		rv.direction = 'right';
	}
	return rv;
}

export const time2TimeAgo = function(ts) {
    var seconds = (Date.now() - ts) / 1000;
    // a day
    if (seconds >= 24*3600) {
		var days = Math.floor(seconds/(24*3600));
		if (days > 1) {
			return days + " days ago";
		}
		else {
			return "yesterday";
		}
       return "yesterday";
    }

    if (seconds >= 3600) {
		var hrs = Math.floor(seconds/3600);
		if (hrs > 1) {
			return hrs + " hours ago";
		}
		else {
			return "an hour ago";
		}
       return "a few hours ago";
    }
    if (seconds >= 60) {
		var mins = Math.floor(seconds/60);
		if (mins > 1) {
			return mins + " minutes ago";
		}
		else {
			return "a minute ago";
		}
    }
	else {
		return "less than a minute ago";
	}
}