import pymongo
from bson.objectid import ObjectId

import app
import config as conf


client = pymongo.MongoClient(conf.db)
db = client.TPIS

history = db.history

def log(date,type, email, address, lat, lng):
	history.insert({ "date" : date, "type" : type, "email": email, "address" : address, "lat" : lat, "lng" : lng})

#logging 311 api
#log(c['created_date'],'blah',c['incident_address'] + " " + c['incident_zip'],c['latitude'],c['longitude'])

def getLatLng():
    temp = history.find()
    return temp

#preparing coordinates for google maps
#for x in a:
#    temp = temp + "new google.maps.LatLng("+a[b]['latitude']+","+a[b]['longitude']+"), "