# -*- coding: utf-8 -*-
"""
Created on Sat Oct  3 23:01:15 2015

@author: bspeice
"""

import pandas as pd
import matplotlib.pyplot as plt

dmv_per_capita = pd.read_csv('datasets/DMV Per Capita.csv')

interesting_counties = ['Orleans', 'Queens', 'Bronx', 'Ontario', 'Saratoga', 'Tompkins', 'TOTAL NYS']

dmv_index = dmv_per_capita.set_index(['County'])
dmv_counties = dmv_index.loc[interesting_counties]
dmv_reindex = dmv_counties.reset_index()

fig = plt.figure()
ax = plt.subplot()
ax.bar(dmv_reindex['index'], dmv_reindex['DMV Count'])
fig.show()