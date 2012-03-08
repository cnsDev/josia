/*
	Pre-populated sites
	The list is not exhaustive, but at time of release, all links worked. 
	There is a fairly frequent issue when, for whatever reason, some sites stop working (i.e. google starts to prevent embedding).
	
	The syntax is hopefully obvious from the examples, but just in case :
		- to add any site, you need to set up a JSON-like object that specifies, at least, a url and a name. An optional category, used for filtering, can also be provided. 
		Technically, so can a description, but it doesn't do anything at the moment.
		
		There are two ways for the IP information to be put into the URL :
			- default : it is added on to the end
			- placeholder : by putting ${data} in the location the IP should be
			
		Duplicate names will NOT work, but will instead over-write one another (the last declared value for a given key will be the effective one). 
*/
 
//Known malicious
cJ.queryList.addQuery({'name' :'threat expert', 'query': 'http://www.threatexpert.com/reports.aspx?find=','category' : 'known malicious'});
cJ.queryList.addQuery({'name' :'malware_domains','query' :'http://www.malwaredomainlist.com/mdl.php?colsearch=All&quantity=50&search=','category' : 'known malicious'});
cJ.queryList.addQuery({'name' :'zeus_tracker','query' :'https://zeustracker.abuse.ch/monitor.php?search=','category' : 'known malicious'});

// Known Spammers
cJ.queryList.addQuery({'name' :'clean_mx','query' :'http://support.clean-mx.de/clean-mx/viruses.php?submit=query&ip=${data}','category' : 'known spammers'}); //Totally gratuitous use of the placeholder
cJ.queryList.addQuery({'name' :'spamhaus','query' :'http://www.spamhaus.org/query/bl?ip=','category' : 'known spammers'});

//Background check
cJ.queryList.addQuery({'name' :'project_honeypot','query' :'http://www.projecthoneypot.org/ip_','category' : 'background check'});			//What host has been doing
cJ.queryList.addQuery({'name' :'shodan','query' :'http://www.shodanhq.com/search?q=','category' : 'background check'});		//What is known to be running

//General information
cJ.queryList.addQuery({'name' :'robtex','query' :'http://www.robtex.com/r/x?q=','category' : 'general info'});
cJ.queryList.addQuery({'name' :'on_the_same_host','query' :'http://www.onthesamehost.com/?q=','category' : 'general info'});


//Also set some environment variables
cJ.titleString		= "IP Check";
cJ.inputName	= "IP address";

cJ.dataValidator.q =  /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/;


