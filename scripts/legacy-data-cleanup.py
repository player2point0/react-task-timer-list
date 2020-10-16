import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime

import os
cwd = os.getcwd()

num_tasks_limit = 10
legacy_date = datetime.strptime('2020-10-01', '%Y-%m-%d')

cred = credentials.Certificate(cwd+'/flocus.json')
default_app = firebase_admin.initialize_app(cred)

db = firebase_admin.firestore.client(default_app)

docs = db.collection('tasks').order_by('dateCreated').limit(num_tasks_limit).get()

first_date = docs[0].to_dict()["dateCreated"]
last_date = docs[-1].to_dict()["dateCreated"]

print("delete {0} tasks between {1} and {2} Type DELETE to delete tasks".format(len(docs), first_date.strftime("%x"), last_date.strftime("%x")))

if(input() != "DELETE"): quit()

for doc in docs:
    id = doc.id
    #db.collection('tasks').document(id).delete()
    doc_created_at = doc.to_dict()["dateCreated"]
    print("ID:{0} DELETED {1}".format(id, doc_created_at))
