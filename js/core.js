/*
	
*/

coreJs	= function() { 
	var $	= this;
	this.queryDisplayElement		= 'object';
	this.queryDetailWrapper		= 'details';
	this.queryDisplayWrapper	= 'article';
	this.mainInput						= 'mainInput';
	this.mainOutput					= 'mainOutput';	
	this.dataValidator					= {'q' : /^.+/};
	this.queryList						= new QueryList();
	this.titleString						= document.getElementsByTagName('title')[0].innerHTML;
	
	// Shortcut to getElementById
	this.getNode						= function(id) {
		if (id == undefined || id == null) {
			return false;
		}
		var	obj	= document.getElementById(id);
		return obj
	}
	

	
	//Page title manipulation
	this.setTitle			= function(string) {
		string	= (string == undefined || string == null || string == '')? cJ.titleString : string;
		document.getElementsByTagName('title')[0].innerHTML	= string;
	}

	this.appendTitle			= function(string) {
		string	= (string == undefined || string == null || string == '')? cJ.titleString : string;
		document.getElementsByTagName('title')[0].innerHTML	+= " - "+ string;
	}
	
	this.prependTitle			= function(string) {
		string	= (string == undefined || string == null || string == '')? cJ.titleString : string;
		var	obj			= document.getElementsByTagName('title')[0];
		obj.innerHTML	= string + "- "+ obj.innerHTML;
	}
	
	//Input label
	this.setInputLabel	 		= function(string) {
		string	= (string == undefined || string == null || string == '')? cJ.inputName : string;
		var	obj	= $.getNode($.mainInput);
		obj.setAttribute('placeholder',string);
		obj.parentNode.getElementsByTagName('label')[0].innerHTML	= string ;
	}
	//Header
	this.setHeader	 			= function(string) {
		string						= (string == undefined || string == null || string == '')? cJ.titleString : string;
		var	obj					= document.getElementsByTagName('h1')[0];
		obj.innerHTML 			= string.link(String(document.location).split("?")[0]) ;
	}
	//Output related
	this.getOutput				= function(id) {
		id	= (id == undefined || id == null || id == '')? cJ.mainOutput : id;
		return this.getNode(id);
	}
	this.setOutput				= function(string,id) {
		var obj				= $.getOutput(id);
		obj.innerHTML	= string;
	}
	this.addOutput				= function(string,id) {
		var obj				= $.getOutput(id);
		obj.innerHTML	+= string;
	}
	
	//Input related
	
	var getMainInput 			= function(id) {
		id	= (id == undefined || id == null || id == '')? cJ.mainInput : id;
		var obj	=document.getElementById(id);
		return {'q'	: String(obj.value).match($.dataValidator['q'])};
	}

	var getUrlInput				= function() {
		var args	= String(document.location).replace(location.hash,'').split('?').pop().split("&");
		var obj		= {}
		for(var arg in args) {
			arg		= args[arg].split("=")
			obj[arg[0]]	= ($.dataValidator[arg[0]] == undefined)? arg[1] : arg[1].match($.dataValidator[arg[0]]);
		}
		return obj;	
	}
	
	var getInput					= function() {
		obj			= getUrlInput();
		if (getMainInput().q != null && getMainInput().q.length > 0 ) {
			obj['q']	=	getMainInput().q;
		} else {
			if (obj.q != null) $.getNode($.mainInput).value	= obj.q;
		}
		
		return obj;
	}
	
	//Event related
	this.bindEvent	= function(element,event,callback,capture) {
		if (element.loaded) {
			callback();
			return false;
		}
		if (window.addEventListener) {
			element.addEventListener(event, callback,capture);
		} else {
			element.attachEvent('on'+event, callback);
		}
	}
	
	//Main routine
	this.processData	= function() {
		$.buildFilterForm();
		//Clear output
		$.setOutput('');
		data	= getInput();
		if ( data == undefined || data.q == null || data.q == '' ) {
			$.setOutput("<h2>No data to process. Data input should match "+$.dataValidator['q'].source+"</h2>");
			return false;
		}
		$.dataProcessor(data);
		return false;
	}
	
	
	//Build filtering
	this.buildFilterForm	= function() {
		var	filterFormNode				= document.createElement('form');
		filterFormNode.setAttribute('action','');
		filterFormNode.setAttribute('method','get');
		
		for (category in $.queryList.categories) {
			var	obj								= $.queryList.categories[category];
			var	catNode						= document.createElement('input');
			catNode.type						= 'checkbox';
			catNode.checked					= 'checked';
			catNode.id							= "filter_" + obj.name;
			catNodeLabel						= document.createElement('label');
			catNodeLabel.innerHTML		= obj.name.replace("_"," ");
			$.bindEvent(catNode,'change',toggleFilter,false);
			catNodeLabel.setAttribute('for',catNode.id);
			filterFormNode.appendChild(catNode);
			filterFormNode.appendChild(catNodeLabel);
		}
		
		if ($.getNode('dataFilter') != null) {
			$.getNode('inputForm').removeChild($.getNode('dataFilter'));
		}	
		filterFormNode.id	= "dataFilter";
		
		$.getNode('inputForm').appendChild(filterFormNode);
	}
	
	//Complete the page
	this.setupPage	= function() {
		$.setTitle();
		$.setHeader();
		$.setInputLabel();
		if ($.showTools == true) {
			buildToolSection();
		}
	}
	
	this.bootstrap	= function(profile) {
		profile					= (profile == undefined || profile == null || profile == '')? cJ.profile : profile;
		profileNode			= document.createElement('script');
		profileNode.src		= "js/profiles/"+profile+".js";
		profileNode.type	= "text/javascript";
		document.getElementsByTagName('head')[0].appendChild(profileNode);
		if(profileNode.loaded) {
			$.setupPage();
			$.processData();
		} else {
			
			$.bindEvent(profileNode,'load', $.setupPage, false);
			$.bindEvent(profileNode,'load', $.processData, false);

		}
		return false;
	}
}


function QueryList	() {
	var $					= this;
	this.categories		= [{'name' : 'default','description' : "Default category"}];
	this.queries			= new Array;
	
	// obj should be {'name' : name,'description'	: description, 'parent' : parent}
	this.addCategory	= function(obj) {
		if (obj.name == undefined) {
			return false;
		}
		obj.name	= obj.name.toLowerCase().replace(" ","_").replace(/^\s*/,"").replace(/\s*$/,"");
		for (var category in $.categories) {
			if (obj.name == $.categories[category].name) {
				return false;
			}
		}
		$.categories.push(obj);
	}
	
	// Where obj : {'name' : name,'description'	: description, 'query' : query,'category'	: category}
	this.addQuery		= function(obj) {
		
		if (obj.name == undefined || obj.query == undefined) {
			return false;
		}
		for (var q in $.queries) {
			if (obj.name == $.queries[q].name) {
				return false;
			}
		}

		obj.name			= obj.name.replace(" ","_").replace(/^\s*/,"").replace(/\s*$/,"");
		obj.category	= obj.category.replace(" ","_").replace(/^\s*/,"").replace(/\s*$/,"");

		if(obj.category == undefined || obj.category == null || obj.category == '') {
			obj.category	= 'default';
		} else {
			$.addCategory({'name' : obj.category});
		}
		$.queries.push(obj)
	}
}



function QueryDisplay(query,output) {
	var $	= this;
	if (query.constructor == String) {
		this.container		= document.getElementById(query);
	} else if (query.constructor == Object) {
		query.name			= query.name.replace(" ","_");
		if (document.getElementById(query.name)) {
			this.container	= document.getElementById(query.name);
		} else {
			// Yes, this could (and likely should) be moved to a builder function.
			cNode								= document.createElement(cJ.queryDisplayWrapper);
			cNode.id							= query.name;
			cNode.className			= query.category;
			
			cNode.setAttribute('draggable',true);
			cJ.bindEvent(cNode,'dragstart',dragStart,false);
			cJ.bindEvent(cNode,'drop',dragInsert,false);
			cJ.bindEvent(cNode,'ondragover',dragAllow,false);
			
			detailsNode						= document.createElement(cJ.queryDetailWrapper);
			detailsNode.innerHTML	= '<h2> \
				<a href="'+query.url+'" title="'+ query.name +'">'+ query.name +'</a> \
				<a id="'+query.name+'_display"></a> \
			</h2> \
			<div class="info"> \
				<ul class="content"><li><button type="button" id="clear_'+query.name+'" title="Remove all content" onclick="removeEntry(event,\'all\');">X</button></li></ul> \
				<ul class="present"></ul>  \
			</div> \ ';
			
			cNode.appendChild(detailsNode);
			
			resultNode	= document.createElement(cJ.queryDisplayElement);
			if (resultNode.tagName.toLowerCase() == "object") {
				resultNode.setAttribute('data',query.url);
			} else {
				resultNode.setAttribute('src',query.url);
			}
			
			cNode.appendChild(resultNode);
			
			link						= document.createElement('a');
			link.href				= query.url;
			link.title				= 'Link for '+query.name;
			link.innerHTML	= link.title;
			
			cNode.appendChild(link);
			cJ.getOutput(output).appendChild(cNode);
			this.container	= cNode;
			query				= cNode.id

		}
	}
	if ($.container == undefined) return false;
	//Self populated values
	var node						= document.getElementById(query);
	this.id							= node.id;
	this.queryNode				= node.getElementsByTagName(cJ.queryDisplayElement)[0];
	this.url							= node.getElementsByTagName(cJ.queryDisplayElement)[0].nextSibling.href;
	this.contentNode			= node.getElementsByTagName('ul')[0]
	this.presentNode			= node.getElementsByTagName('ul')[1];
	
	//Listing functions
	this.contentList			= function () {
		return $.container.getElementsByTagName('ul')[0].getElementsByTagName('a');
	}
	this.presentList			= function () { 
		return $.container.getElementsByTagName('ul')[1].getElementsByTagName('a');
	}
	this.queryNodeList	= function () {
		return $.container.getElementsByTagName(cJ.queryDisplayElement);
	}
	
	//Convert a content or presence link to the container it refers to
	this.linkToNode			= function(link) {
		if (link == undefined || link.href == undefined || link.href == '') {
			return false;
		}
		var contentId	= link.href.split("#").pop().replace("_display",'');

		return document.getElementById(contentId);
	}
	
	//Add the content from another container 'recursively' (this is only 1 level deep)
	//Also populates the appropriate content and present entries 
	this.addEntry	= function(sourceId,recursive) {
		var sourceNode	= new QueryDisplay(sourceId);
		if (sourceNode == false || sourceNode.id == $.id) {
			return sourceNode;
		}
		 if (sourceNode == undefined || sourceNode == null) return false;
		if (recursive != false) {
			/* 
				This used to live at the end of the function.
				Probably,though, the expected behaviour is to copy over non-duplicated content regardless of whether the container is duplicated
				So now it lives here
			*/
			var sourceContent	= sourceNode.contentList();
			for(var link in sourceContent) {
				
				$.addEntry($.linkToNode(sourceContent[link]).id,false);
			}
		}
		contents	= $.contentList();
		// Duplicate content prevention
		for (link in contents) {
			var node	= $.linkToNode(contents[link]);
			if (node != undefined && node.id == sourceNode.id) {
				return false;
			}
		}
		var sourceNode	= new QueryDisplay(sourceId);
		//Add the actual content
		$.container.appendChild(sourceNode.queryNode.cloneNode(true));
		$.container.appendChild(sourceNode.queryNode.nextSibling.cloneNode(true));	
		//Handle the links
		contentLinkWrapper	= document.createElement('li');
		presentLinkWrapper	= document.createElement('li');
		
		contentLink	= document.createElement('a');
		presentLink	= document.createElement('a');
		
		contentLink.href	= '#'+sourceNode.id+'_display';
		presentLink.href	= '#'+$.id+'_display';
		
		contentLink.innerHTML = sourceNode.id;
		presentLink.innerHTML = $.id;
		
		contentLinkWrapper.appendChild(contentLink);
		presentLinkWrapper.appendChild(presentLink);	
		// Add a remove button to the content link
		contentLinkWrapper.innerHTML += "<button id='clear_"+sourceNode.id+"' type='button' title='Remove "+sourceNode.id+" from window ' onclick='removeEntry(event,\""+sourceNode.id+"\");' >x</button>";
		
		$.contentNode.appendChild(contentLinkWrapper);
		sourceNode.presentNode.appendChild(presentLinkWrapper);

		return true;
	}
	
	//Remove content from a container.
	//Also adjusts the content and present links
	this.removeEntry	= function(targetId) {
		if (targetId == 'all') {
			if ($.contentList().length == 0) {
				cJ.getOutput(output).appendChild($.container);
				return false;
			}
			
			for (var entry in $.contentList()) {
				if ($.contentNode.lastChild == $.contentNode.firstChild) continue;
				
				$.removeEntry($.linkToNode($.contentNode.lastChild.getElementsByTagName('a')[0]).id);
			}
			return false;
		}
		
		targetNode	= new QueryDisplay(targetId);
		nodeList		= $.queryNodeList();
		//Remove all the bits from self
		for (var node in nodeList) {
			link	= nodeList[node].nextSibling;
			if (link.href == targetNode.url && link.innerHTML.search(targetNode.id) > -1) {
				
				$.container.removeChild(link);
				$.container.removeChild(nodeList[node]);
				
				var links	= $.contentList();
				
				for (var link in links) {
					if ($.linkToNode(links[link]).id == targetNode.id) {
						$.contentNode.removeChild(links[link].parentNode);
					}
					
				}
				break;
			}
		}
		//And remove presence from the target
		targetPresence	= targetNode.presentList();
		for(var link in targetPresence) {
			if ($.linkToNode(targetPresence[link]).id == $.container.id) {
				targetNode.presentNode.removeChild(targetPresence[link].parentNode);
			}
		}
		
		return true;
	}
}




/* Short interlude to define the drag/drop related stuff */

var dragStart	= function(ev) {
	ev.dataTransfer.setData("Text",ev.target.id);
	ev.stopPropagation();
	return false;
}

var dragAllow	= function(ev) {
	ev.stopPropagation();
	ev.preventDefault();
	return false;
}

var dragInsert	= function(ev) {
	var data		= ev.dataTransfer.getData("Text");
	ev.preventDefault();
	// Drag insert is only done on the QueryDisplay... and from one, too.
	if (ev.target.tagName.toLowerCase() != cJ.queryDisplayWrapper || data.length == 0	) return false;
	var receiverNode	= new QueryDisplay(ev.target.id);
	if (receiverNode.addEntry(data) == true) {
		sourceNode	= new QueryDisplay(data);
		cJ.getNode(cJ.mainOutput).appendChild(sourceNode.container);
	}

	return false;
}

var dragDrop	= function(ev) {
	var data		= ev.dataTransfer.getData("Text");
	if (ev.target.tagName.toLowerCase() == cJ.getNode(cJ.mainOutput).tagName.toLowerCase()) {
		var contentNode	= new QueryDisplay(data);
	
		ev.target.appendChild(contentNode.container);
	}
	
	ev.preventDefault();
	ev.stopPropagation();
	return false;
}

/*
	Other reactive stuff
*/

//Remove entry buttons (to remove content from individual containers)
var removeEntry	= function(ev,data) {
	var receiver		= new QueryDisplay(new String(ev.target.parentNode.parentNode.parentNode.parentNode.parentNode.id));
	receiver.removeEntry(data);
	return false;
}

//Category based filtering
var toggleFilter		= function(ev) {
	var	category	= ev.target.id.replace("filter_","");
	var	nodeList	= document.getElementById("mainOutput").childNodes;
	for(var node in nodeList) {
			if (nodeList[node] != undefined && nodeList[node].className.search(category) > -1) {	
				if( nodeList[node].className.search('hidden') > -1) {
					nodeList[node].className  = nodeList[node].className.replace("hidden","");
				} else {
					nodeList[node].className += ' hidden ';
				}
			}
	}
}
//Generic data processor
function genericDataProcessor(data,list,output){
	list	= (list == undefined || list == null || list == '')? cJ.queryList : list;
				
	if (list.queries.length < 1) {
		cJ.setOutput("<h2>No queries defined</h2>");
		return false;
	}
	
	//We create a regex for the data placeholder. Makes life easier.
	var dataPlaceholder	= /\$\{data\}/;
	for(var query in list.queries) {
		query			= list.queries[query];
		if (query.query.search(dataPlaceholder) > -1) {
			query.url	= query.query.replace(dataPlaceholder,data.q);
		} else {
			query.url	=	query.query + data.q;
		}
		new QueryDisplay(query);
	}
	return false;
}


//Date stuff. This is here so it can be used in URLs as needed
var date				= {};
date.raw				= new Date();
date.fullyear			= date.raw.getFullYear();
date.month			= date.raw.getMonth()+1;
date.day				= date.raw.getDate();
