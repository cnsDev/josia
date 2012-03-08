_Note : This is still in dev, and does not work on all browsers (at least not as intended) due to drag and drop, and resize, not being available on some. Tested with firefox, supposedly works on chrome and safari

#JOSIA : Javascript Open Source Intelligence Aggregator

## A quick and dirty query aggregation tool writen in javascript

JOSIA basically provides a quick and dirty way of sending the same query (say for a domain name or IP address) to multiple sites, and display the results in a single window. 
It also provides a few, simple, string manipulation tools (url encode/decode, etc).
It is essentially a time saver during security investigations, letting you get all the data you might want in a single query. It is intended to take either keyboard input or input via GET queries. 

##What do I need to know?

This only works on Safari, Chrome and Firefox, and has only been tested on Firefox. The code is far from final, but is stable enough to not cause major issues. The API is another matter.

In real life, it's not as clean and simple as it could be, but it gets the job done. You can (relatively) easily add sites and create profiles to customise the tool.
On the plus side, we will do our best to keep the profiles up to date and useful. We do work with this tool, and with security, so that will be the main focus. 
There is nothing stopping your from creating a profile to search for lolcats. 

###Why

Well, it saves time, and saves typing. This isn't anything pretty, or smart, it is just meant to be practical. 
Since we use this on a daily basis, we also will provide profile files with (as much as possible) up to date links and query strings for the sites we tend to use.

###How does it work?

At the moment, it is intended to be file based, so you can drop it onto your work machine , fire up base.html in a browser, and you should be good to go (within certain definitions of good, and go). 

There are unfortunately some issues. The upside of living with these issues is that you don't need any external scripts, resources, or anything else to make this work. 
Working in security, that is usually seen as a big plus, so the focus was on making something standalone and small (ish).

The tradeoffs are browser compatibility : the Javascript is tested with Firefox, not with Safari or Chrome (at time of writing). Part of the rationale was that not all browsers are equal when it comes to investigating security issues, and we have tended to use Firefox. 
Opera and IE are completely unsupported because of the overhead and bloat in implementing drag and drop, and resize. 

That said, the core functionality may well work for most, if not all, browsers, you will loose some of the niceties, but there you go. 

###Ok. How does it work?

Well, on the surface, when you fire it up for the first time, you drop an IP address into the input field, hit search, and hopefully, you get results.
 You can then resize the windows (on Firefox, this is done by hovering over the bottom right-hand corner of the boxes with a dashed border.
You can also cycle through the boxes in two ways, flicking the box onto the background, or hitting the X button on boxes without other content.

You can also drop the content from one box into another. At the moment, and by design, you can drop the content from every other box into a given box once.
Be aware that any drag and drop will cause the page to reload to the original URL.

A tiny bit deeper, you can set up profiles (see js/profiles/ip.js for an example) with a list of queries, a validator/regex for input, and  make a few adjustments.


##I want to change or add a site.

Sure. The interface call is a bit ugly at the moment, and you should note you can only load one profile at the moment. 
Profiles are loaded from js/profiles, and .js is appended to the name you give. 

In term of the URL, there are two ways to get your query data in the URL :
* by default, it is appended to the end of the query string (i.e. http://www.example.com/?q= becomes http://www.example.com/?q=(your data here))
* or you can use the ${data} placeholder (i.e. http://www.example.com/${data}.html becomes http://www.example.com/(your data here).html)

When build the query, you can also make use of the date object, which has a couple of shorthands to the more likely strings you might need, and an accessor to the core object

```javascript
var date				= {}
date.raw				= new Date();
date.fullyear			= date.raw.getFullYear();
date.month			= date.raw.getMonth()+1;
date.day				= date.raw.getDate();
```

To change the profile loaded in the first place, you have two options :

* in base.html	: add the name to the cJ.boostrap() call added to the body onload attribute. 

**Example:**

```javascript
cJ.boostrap('personal');
```

* in js/boot.js		: change cJ.profile 
	
**Example:**

```javascript
cJ.profile	= 'personal';
```

If you just want to change an existing profile, to add a site, you will need to use (and yes, this is ugly.... and will be fixed) the following string :

**Example:**

```javascript
	//Argument should  be {'name' : name, 'query': url,'category' : category});
```
Yup, it's JSON. Potentially, you could load JSON data to populate the site list from elsewhere, such a server side script.

###I want to query something other than IP addresses.

Not a problem, set up a profile. Aside from the addQuery call list above, you will want to add a validator for the data, and set a couple of other things up

**Example:**

```javascript
cJ.queryList.addQuery({'name' :'name, 'query': [URL to which the input can be appended. You can also use a ${data} placeholder],'category' : 'category'});

cJ.dataValidator.q =  /.+/;

//These two are not necessary, but populate the page title, the header, and placeholder and label for the main input field
cJ.titleString		= "FooMatic - Seek random string";
cJ.inputName	= "Random string";
```

###Anything else?

Unfortunately, yes. Severa thingsl. 

First, this is still work in progress, and changes are to be expected. So if you plan of forking this, don't get too attached, or put in too much work. 

In day to day use, not all sites are friendly enough to allow the kind embedding being used. You can switch exactly how you embed (basically, iframe or object) in js/boot.js or your profile :

```javascript
cJ.queryDisplayElement	= 'iframe';
```
Google is a prime example of a site that would not work. You can of course use the tool to generate the queries anyway. 


##What are the tools in the tool section, and how do I get rid of them?

The tools are a few simple string manipulation tools. The same tools (and more) are available via such Firefox plugins as HackBar, but that's not necessarily something you want to have or use at work.
The best way to get to grips with them is experiment. Pop some input into the relevant field, and try the buttons. 

If you want to remove the tools, you can do so temporarily, or permanently. 
By clicking the X button in the tool section, you can remove it from view until the next reload. If you simply don't want to see the tools in the first place, simply edit js/boot.js :

```javascript
cJ.showTools			= false; // actually, you can use ANY value otherthan  true
```

##I don't like the look or the layout.

Change style/base.css, or create another css file and modify base.html to make use of it. 
There isn't much to the 'style' you couldn't get from the base.css. If there is, experiment, or contact us. 
Efforts have been made to style based on ID and/or location, should you want to change the actual elements in the page. 

#Who?
David Kaye[http://www.custodian.nl]
