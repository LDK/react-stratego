//Helpers.js

export const sanitizeBooleans = (value) => {
	if (typeof value === 'object') {
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
/* eslint-disable */
// This is the only place we're allowed to call console.log
export const debug = (app,thing1,thing2,thing3,thing4,thing5) => {
	let things = 0;
	if (typeof thing1 != 'undefined') { things++; }
	if (typeof thing2 != 'undefined') { things++; }
	if (typeof thing3 != 'undefined') { things++; }
	if (typeof thing4 != 'undefined') { things++; }
	if (typeof thing5 != 'undefined') { things++; }
	if (things == 0) {
		return;
	}
	if (app && (app.debug || app.reportRenders)) {
		switch (things) {
			case 1:
				console.log(thing1);
			break;
			case 2:
				console.log(thing1,thing2);
			break;
			case 3:
				console.log(thing1,thing2,thing3);
			break;
			case 4:
				console.log(thing1,thing2,thing3,thing4);
			break;
			case 5:
				console.log(thing1,thing2,thing3,thing4,thing5);
			break;
		}
	}
	return;
};
/* eslint-enable */
export const time2TimeAgo = function(ts) {
    var seconds = (Date.now() - ts) / 1000;
    // a day
    if (seconds >= 24*3600) {
		var days = Math.floor(seconds/(24*3600));
		if (days > 1) {
			return days + " days ago";
		}
       return "yesterday";
    }

    if (seconds >= 3600) {
		var hrs = Math.floor(seconds/3600);
		if (hrs > 1) {
			return hrs + " hours ago";
		}
		return "an hour ago";
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
export const time2Date = function(ts) {
	var d = new Date(ts * 1000);
	const monthNames = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var month = monthNames[d.getMonth() + 1];
	var day = ("00" + d.getDate()).slice(-2);
	var year = d.getFullYear();
	return (month+' '+day+', '+year);
}