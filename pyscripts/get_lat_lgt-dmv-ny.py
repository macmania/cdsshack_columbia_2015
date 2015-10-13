'Department_of_Motor_Vehicle__DMV__Office_Locations.csv'


import os
import csv
import requests
import json
import time

api_key = os.environ['GOOGLE_DEV_API_KEY']
directory = os.environ['PROJECT_DIRECTORY']
opo_file = directory + '/' + 'js/datasets/Department_of_Motor_Vehicle__DMV__Office_Locations-NY.csv'
opo_file_write = directory + '/' + 'js/datasets/Department_of_Motor_Vehicle__DMV__Office_Locations-NY-geocode.csv'
google_geocode_request = 'https://maps.googleapis.com/maps/api/geocode/json?address='


#reader = csv.reader(open(self.file, 'rU'), dialect=csv.excel_tab)


opo_file = open(opo_file, 'rU')
opo_csv = csv.reader(opo_file, dialect=csv.excel_tab)
fieldnames = ['Office Name', 'latitude', 'longitude']
opo_file_write_file =open(opo_file_write, 'wb')
opo_csv_write = csv.DictWriter(opo_file_write_file, fieldnames=fieldnames)
opo_csv_write.writeheader()
keys = next(opo_csv)

for item_list in opo_csv:
    #print len(item)
    item = item_list [0].split(',')
    addressArray = item[4].replace(' ', '+') + '+' + item[6] + '+' + item[8] + '+' + item[9]
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
                               'Office Name':item[0].title(),
                               'latitude':latitude,
                               'longitude':longitude
                               })
    time.sleep(.1)

opo_file_write_file.close()
opo_file.close()
