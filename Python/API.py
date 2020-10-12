import sys
import json
import pandas as pd
from pprint import pprint
from bson.json_util import dumps
from pymongo import MongoClient
from bson.json_util import dumps
import pandas as pd
from pandas import DataFrame
from machine_learning.content_based.content_based import ContentBased

def connectMongoDBLocal():
    pass


if __name__ == "__main__":
    client = MongoClient('mongodb://localhost:27017/')
    db = client['moviesDB']
    collection = db['movies']

    result = collection.find()
    df = DataFrame(list(result))

    cb = ContentBased(sys.argv[2], df, filter_list=["Title", "Genre", "Director", "Actors"]).filter()

    print(dumps(list(cb[:10])))


















# import csv
# import json
# import pandas as pd
# from pymongo import MongoClient
#
# csvfile = open('C:\\Users\\Alex\\OneDrive\\Semester 6\\Indust App Dev\\Software_Project\\Python\\data\\sample_movie_dataset.csv')
# reader = csv.DictReader(csvfile)
# client = MongoClient('mongodb://localhost:27017/')
#
# db = client['moviesDB']
# collection = db['movies']
# header = ['Rank', 'Title', 'Genre', 'Description', 'Director', 'Actors', 'Year', 'Runtime (Minutes)', 'Rating', 'Votes', 'Revenue (Millions)', 'Metascore']
#
# for each in reader:
#     row = {}
#     for field in header:
#         row[field] = each[field]
#
#     collection.insert_one(row)
