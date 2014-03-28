connection = MongoClient()
db = connection.database

def loginfo(loc, lev):
        db.login.insert({'location':loc, 'level':lev})
        return True
    
