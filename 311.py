import urllib2
import json
import random

def url():
    tmp = urllib2.urlopen('http://data.cityofnewyork.us/resource/erm2-nwe9.json')
    return tmp

def getItem():
    f = url()
    json_string = f.read()
    parsed_json = json.loads(json_string)
    a = []
    b = 0
    for x in parsed_json:
     if(parsed_json[b]['agency'] == 'DSNY'):   
         a.append(parsed_json[b])
     b = b + 1
    return a
    

     #a.append([c['created_date'],c['incident_address'] + c['incident_zip'],c['latitude'],c['longitude']])
    
    
    #stuff = parsed_json['results']
    #length = len(stuff)
    #item = stuff[random.randrange(0,length)]
    #f.close()
    #return [item['title'],item['listing_id'],item['price'],item['description'],item['url']]

