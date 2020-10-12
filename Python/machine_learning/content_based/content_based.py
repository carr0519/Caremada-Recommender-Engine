from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pandas import Series, DataFrame


class ContentBased:
    def __init__(self, selected_key, movies, filter_list):
        if not isinstance(selected_key, str) or not isinstance(movies, DataFrame) or not \
                (filter_list and isinstance(filter_list, list)):
            raise TypeError('Invalid parameter set; expected: str, DataFrame, list')
        self.selected_key = selected_key
        self.movies = movies
        self.filter_list = filter_list
        self.sorted_similar_movies = []
        self.data_frame = None

    def filter(self):
        df = {}
        for filter in self.filter_list:
            df[filter] = self.movies[filter]

        self.data_frame = DataFrame(df)
        self.data_frame['combined_features'] = self.data_frame[self.filter_list].apply(lambda x: ' '.join(x), axis=1)

        if self.data_frame is None:
            raise ValueError('')
        return self._cosine_similarity()

    def _cosine_similarity(self):
        cv = TfidfVectorizer(use_idf=False)
        movie_index = self.data_frame[self.data_frame.Title == self.selected_key].index[0]

        count_matrix = cv.fit_transform(self.data_frame['combined_features'])
        cosine_sim = cosine_similarity(count_matrix, count_matrix)
        score_series = Series(cosine_sim[movie_index]).sort_values(ascending=False)
        top_10 = list(score_series.iloc[1:11].index)

        for i in top_10:
            self.sorted_similar_movies.append(self.movies.iloc[i][1:])
        return self.sorted_similar_movies
