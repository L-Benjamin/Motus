import json

def filter(m):
    return len(m) in [6,7,8] 

with open("ods6.txt",'r') as f:
    content = f.read()
words = [m for m in content.split("\n") if filter(m)]
with open("dict.json", "w") as f:
    json.dump(words, f)