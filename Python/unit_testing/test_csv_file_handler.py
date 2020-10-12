import unittest
import pandas as pd
from data.csv_file_handler import CsvFileHandler


class TestCsvFileHandler(unittest.TestCase):

    def setUp(self):
        self.movies = CsvFileHandler("..\\data", "sample_movie_dataset.csv")
        self.user_profiles = CsvFileHandler("..\\data", "user_profile_logs.csv")

    def test_constructor(self):
        self.assertIsInstance(CsvFileHandler("..\\data", "sample_movie_dataset.csv"), CsvFileHandler)   # valid path and file
        self.assertIsInstance(CsvFileHandler("..\\data", "user_profile_logs.csv"), CsvFileHandler)      # valid path and file
        self.assertRaises(ValueError, CsvFileHandler, "..\\data", "non_existent_file.csv")  # valid path, invalid file
        self.assertRaises(ValueError, CsvFileHandler, "none\\existent\\path", "sample_movie_dataset.csv") # invalid path, valid file
        self.assertRaises(ValueError, CsvFileHandler, "..\\data", "text_file.txt") # valid path and file but not a csv
        self.assertRaises(TypeError, CsvFileHandler, None, "text_file.txt")  # testing null arguments
        self.assertRaises(TypeError, CsvFileHandler, "..\\data", None)  # testing null arguments
        self.assertRaises(TypeError, CsvFileHandler, None, None)  # testing null arguments

    def test_get_data_frame(self):
        self.assertIsInstance(self.movies.get_data_frame(), pd.core.frame.DataFrame)
        self.assertIsInstance(self.user_profiles.get_data_frame(), pd.core.frame.DataFrame)

    def test_extract_data(self):
        self.assertIsNone(self.movies.extract_data())
        self.assertIsNone(self.user_profiles.extract_data())


if __name__ == '__main__':
    unittest.main()
