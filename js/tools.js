/*
	This section covers the various string manipulation tools
	Not necessarily pretty, or smart, but useful to have at hand every now and again
*/

//Add the tool input and output to the coreJs framework

cJ.setToolOutput	= function(string) {
	cJ.getNode('toolOutput').value	= string;
}

cJ.getToolInput	= function(string) {
	return new String(cJ.getNode('toolInput').value);
}

//URL decoder/encoder .
var urlDecode	= function (){
	var data		= cJ.getToolInput();
	cJ.setToolOutput(unescape(data.replace(/\+/g," ")));
	return false;
}
var urlEncode	= function() {
	var data		= cJ.getToolInput();
	cJ.setToolOutput( escape(data));
	return false;
}

//CharCode stuff is straightforward (and the encoding is not, admittedly, all that useful... but there for completeness)
var charCodeDecode	= function() {
	var data	= cJ.getToolInput();
	var str		= new String;
	data			= data.split(",");
	for (ch in data) {
		str+=String.fromCharCode(data[ch]);
	}
	cJ.setToolOutput(str);
}

var charCodeEncode	= function() {
	var data	= cJ.getToolInput();
	var str		= new String;
	for (ch in data) {
		str+=data.charCodeAt(ch) + ",";
	}
	cJ.setToolOutput( str.replace(/,$/,''));
}

//UTF8 related
var utfEncode	= function () {
	var data		= cJ.getToolInput();
	data 			= data.replace("/\r\n/g","\n");
	var str			= new String;
	for (var n = 0; n < data.length; n++) {
		var c = data.charCodeAt(n);
		if (c < 128) {
			str += String.fromCharCode(c);
		}
		else if((c > 127) && (c < 2048)) {
			str += String.fromCharCode((c >> 6) | 192);
			str += String.fromCharCode((c & 63) | 128);
		}
		else {
			str += String.fromCharCode((c >> 12) | 224);
			str += String.fromCharCode(((c >> 6) & 63) | 128);
			str += String.fromCharCode((c & 63) | 128);
		}
	}
	cJ.setToolOutput(str);
}
 
var utfDecode	= function() {
	var data		= cJ.getToolInput();
	var str			= new String;
	var i 			= 0;
	var c = c1 = c2 = 0;
	while ( i < data.length ) {
		c = data.charCodeAt(i);
		if (c < 128) {
			str += String.fromCharCode(c);
			i++;
		}
		else if((c > 191) && (c < 224)) {
			c2 = data.charCodeAt(i+1);
			str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else {
			c2 = data.charCodeAt(i+1);
			c3 = data.charCodeAt(i+2);
			str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	cJ.setToolOutput(str);
}


var buildToolSection	= function() {
	tool		= document.createElement('aside');
	tool.id	= "toolSection";
	tool.innerHTML	= '<div class="field"> \
		<label for="toolInput">Input</label> \
		<textarea id="toolInput"  placeholder="Text for the various string manipulation routines"></textarea> \
		</div> \
		<ul id="toolSectionMenu"> \
			<li class="charCode"> \
				<button title="Character code encode" id="charCodeEncode" onclick="charCodeEncode();" type="">CharCode encode</button> \
				<button title="Character code decode" id="charCodeDecode" onclick="charCodeDecode();" type="button">CharCode decode</button> \
			</li> \
			<li class="URL"> \
				<button title="URL encode" id="urlEncode" name="urlEncode" onclick="urlEncode();" type="button">URL encode</button> \
				<button title="URL decode" id="urlDecode" name="urlDecode" onclick="urlDecode();" type="button">URL decode</button> \
			</li> \
			<li class="UTF"> \
				<button title="UTF-8 encode" id="utfEncode" name="utfEncode" onclick="utfEncode();" type="button">UTF-8 encode</button> \
				<button title="UTF-8 decode" id="utfDecode" name="utfDecode" onclick="utfDecode();" type="button">UTF-8 decode</button> \
			</li> \
		</ul> \
		<h3><button type="button" title="Remove tool section " onclick="event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);">X</button></h3> \
		<div class="field"> \
			<label for="toolOutput">Output</label> \
			<textarea id="toolOutput"  placeholder="Hopefully, some output will appear here" readonly="readonly"></textarea> \
		</div> \ ';
	cJ.getOutput().parentNode.insertBefore(tool,cJ.getOutput());
	return false;
}
