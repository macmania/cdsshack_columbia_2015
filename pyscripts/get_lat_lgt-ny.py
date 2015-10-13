import os
import csv
import requests
import json
import time

api_key = os.environ['GOOGLE_DEV_API_KEY']
directory = os.environ['PROJECT_DIRECTORY']
opo_file = directory + '/' + 'js/datasets/IDNYC_Enrollment_Centers_10-3-2015.csv'
opo_file_write = directory + '/' + 'js/datasets/IDNYC_Enrollment_Centers_10-3-2015-geo-code.csv'
google_geocode_request = 'https://maps.googleapis.com/maps/api/geocode/json?address='


opo_file = open(opo_file)
opo_csv = csv.reader(opo_file)
fieldnames = ['Enrollment Center Name', 'latitude', 'longitude']
opo_file_write_file =open(opo_file_write, 'wb')
opo_csv_write = csv.DictWriter(opo_file_write_file, fieldnames=fieldnames)
opo_csv_write.writeheader()
keys = next(opo_csv)

for item in opo_csv:
    addressArray = item[1].replace(' ', '+') + '+' + item[3] + '+' + item[5] + '+' + item[6]
    url_request = google_geocode_request + addressArray + '&key=' + api_key
    response = requests.get(url_request)
    result = json.loads(response.text)
    
    print result
    if(result['status'] == 'OK'):
        results = result['results'][0]
        latitude = results['geometry']['location']['lat']
        longitude = results['geometry']['location']['lng']
        item.append(latitude)
        item.append(longitude)
        opo_csv_write.writerow({
                               'Enrollment Center Name':item[0],
                               'latitude':latitude,
                               'longitude':longitude
                               })
    time.sleep(.1)

opo_file_write_file.close()
opo_file.close()
