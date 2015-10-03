# -*- coding: utf-8 -*-
import operator
import datetime as dt
import pandas as pd
import matplotlib.pyplot as plt

def build_date(year, month):
    return dt.date(year, month, 1)

data = pd.read_csv('datasets/Donate_Life_Organ_and_Tissue_Donor_Registry_Enrollment_by_County__Latest_Month.csv')

data['% Eligible Population Enrolled'] = data['% Eligible Population Enrolled'].replace('%','',regex=True).astype('float')/100

data.columns = [u'Year', u'Month', u'County', u'2010 Census Population', u'Population 18+ Estimate', u'Registry Enrollments', u'% Eligible Population Enrolled', u'OPO', u'Location']
total_nys = data[data['County'] == 'TOTAL NYS']
date_list = [build_date(y, m) for y, m in zip(total_nys['Year'], total_nys['Month'])]

county_list = data['County'].unique()
get_mean = lambda c: data[data['County'] == c]['% Eligible Population Enrolled'].mean()
avg = {c: get_mean(c) for c in county_list}
sorted_avg = sorted(avg.items(), key=operator.itemgetter(1))

lowest_3 = sorted_avg[2:5] # Remove Unknown and Out of State
lowest_counties = [x[0] for x in lowest_3]
highest_3 = sorted_avg[-3:]
highest_counties = [x[0] for x in highest_3]

for county in lowest_counties + highest_counties + ['TOTAL NYS']:
    plt.plot(date_list,
             data[data['County'] == county]['% Eligible Population Enrolled'],
             label=county)
plt.xlabel('Date')
plt.ylabel('% Eligible Population Enrolled')
plt.legend()
plt.savefig('County Breakout.png')