from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pandas import Series, DataFrame


class ContentBased:
    def __init__(self, selected_key, dataset, filter_list):
        self.selected_key = selected_key
        self.dataset = dataset
        self.filter_list = filter_list
        self.sorted_similar_movies = []
        self.data_frame = None

    def filter(self):
        df = {}
        for filter in self.filter_list:
            df[filter] = self.dataset[filter]

        self.data_frame = DataFrame(df)
        self.data_frame['combined_features'] = self.data_frame[self.filter_list].apply(lambda x: str(x), axis=1)
        cv = TfidfVectorizer(use_idf=False)
        movie_index = None

        # change self.data_frame._id to be dynamic
        for key, index in zip(self.data_frame._id, self.data_frame.index):
            if str(key) == self.selected_key:
                movie_index = index

        count_matrix = cv.fit_transform(self.data_frame['combined_features'])
        cosine_sim = cosine_similarity(count_matrix, count_matrix)
        score_series = Series(cosine_sim[movie_index]).sort_values(ascending=False)
        top_10 = list(score_series.iloc[1:11].index)

        for i in top_10:
            self.sorted_similar_movies.append(self.dataset.iloc[i][1:])

        return self.sorted_similar_movies
