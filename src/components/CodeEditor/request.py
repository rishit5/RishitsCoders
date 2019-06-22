import requests
import json

data = {
            'client_secret': "a5c76cc2ad3f842de75958c0ed8fecfbad5ee26f",
            'async': "0",
            'source': 'print "Hello World!"',
            'lang': "PYTHON",
        }
r = requests.post("https://api.hackerearth.com/v3/code/compile/", data = data)
print r.text;