from flask import Flask,session,request,redirect,url_for
from flask import render_template
from datetime import date
from geopy import geocoders
import csv, shelve, time, json
import os,hashlib


app = Flask(__name__)
app.secret_key="secret key"

@app.route("/")
def index():
    if request.method == "GET":
        return render_template("index.html")
    else:
        button=request.form['button'].encode("utf8")
        if button == "Submit":
            loc=request.form['location'].encode("utf8")
            lev=request.form['trash'].encode("utf8")

@app.route("/map", methods=['GET','POST'])
def map(): 
    if request.method == "GET":
                return render_template("map.html")

    else:
        curdate = date.today().isoformat()
        type = request.form["type"]
        email = request.form["email"]
        image = request.form["photo"]
        address = request.args.address
        place, (lat, lng) = g.geocode(str(address)) 
        latitude = lat
        longitude = lng
        severity = request.form["trash"]
        return db.log(curdate,type,email,image,address,latitude,longitude,severity)
        
    return render_template("map.html")

@app.route("/heat", methods=['GET','POST'])
def heat(): 
    return render_template("heatmap.html")

@app.route("/about", methods=['GET','POST'])
def about(): 
    return render_template("about.html")    

if __name__=="__main__":
    app.debug=True
    app.run(host='0.0.0.0',port=8080)
    
