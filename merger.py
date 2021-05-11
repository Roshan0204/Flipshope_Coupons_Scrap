"""
 Python Script:
  Combine/Merge multiple CSV files using the Pandas library
"""
from os import chdir
import glob
import pandas as pdlib


# Produce a single CSV after combining all files
def produceOneCSV(list_of_files,csv_merge):

    for file in list_of_files:
       csv_in = open(file)
       for line in csv_in:
           csv_merge.write(line)
       csv_in.close()

# List all CSV files in the working dir

chdir("./csv_data")
extension = 'csv'
list_of_files = [i for i in glob.glob('*.{}'.format(extension))]
# print(list_of_files)
file_out = "coupons.csv"
csv_header = 'store,title,short_title,code,short_desc,description,expiry_date,expire_note'
csv_merge = open(file_out, 'w')
csv_merge.write(csv_header)
csv_merge.write('\n')
produceOneCSV(list_of_files,csv_merge)
csv_merge.close()