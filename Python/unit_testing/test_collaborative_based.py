import unittest
import numpy
from data.csv_file_handler import CsvFileHandler
from machine_learning.collaborative_based.collaborative_filtering import CollaborativeBased


class TestCollaborativeBased(unittest.TestCase):

    def setUp(self):
        self.user_profiles = CsvFileHandler("..\\data", "user_profile_logs.csv")
        self.user_profiles.extract_data()
        self.user_profiles_data_frame = self.user_profiles.get_data_frame()

        self.valid_cb = CollaborativeBased(self.user_profiles_data_frame, 3)
        self.valid_cb.generate_recommended_results()
        self.invalid_cb = CollaborativeBased(self.user_profiles_data_frame, -1)
        self.invalid_cb.generate_recommended_results()

    def test_constructor(self):
        self.assertIsInstance(self.valid_cb, CollaborativeBased)
        self.assertIsInstance(self.invalid_cb, CollaborativeBased)
        self.assertRaises(TypeError, CollaborativeBased, self.user_profiles_data_frame, "")
        self.assertRaises(TypeError, CollaborativeBased, self.user_profiles_data_frame, 3.14)
        self.assertRaises(TypeError, CollaborativeBased, self.user_profiles_data_frame, None)
        self.assertRaises(TypeError, CollaborativeBased, [], 1)
        self.assertRaises(TypeError, CollaborativeBased, None, 2)

    def test_filter(self):
        self.assertTrue(self.valid_cb.generate_recommended_results())
        self.assertFalse(self.invalid_cb.generate_recommended_results())

    def test_get_recommended_results(self):
        self.assertIsInstance(self.valid_cb.get_recommended_results(), list)
        self.assertEquals(self.invalid_cb.get_recommended_results(), [])


if __name__ == '__main__':
    unittest.main()
