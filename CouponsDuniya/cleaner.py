import json
uniqueUrlsDict={}
finalDict=[]
with open("url.json","r") as jsonFile:
    jsonData = json.load(jsonFile)
    #print(jsonData)
    for urlDict in jsonData:
        print(urlDict)
        uniqueUrlsDict[urlDict["url"]]="."

print (len(uniqueUrlsDict))
for key,value in uniqueUrlsDict.items():
    finalDict.append({"url":key})

with open("urlsUnique.json","w") as jsonFileToWrite:
    json.dump(finalDict,jsonFileToWrite,indent=4)