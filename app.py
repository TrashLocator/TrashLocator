from flask import Flask,session,request,redirect,url_for
from flask import render_template
import csv, shelve, time, json
import os,hashlib


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

if __name__=="__main__":
    app.debug=True
    app.run(host='0.0.0.0',port=5000)
    
