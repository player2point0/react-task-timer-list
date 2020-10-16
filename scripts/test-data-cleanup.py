import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import os
cwd = os.getcwd()

test_user_id = 'cpK1krQozFPaLdArErwjeynqLQB3'

cred = credentials.Certificate(cwd+'/flocus.json')
default_app = firebase_admin.initialize_app(cred)

db = firebase_admin.firestore.client(default_app)

docs = db.collection('tasks').where('userId', '==', test_user_id).get()

for doc in docs:
    id = doc.id
    #db.collection('tasks').document(id).delete()
    print(doc.to_dict()["name"])