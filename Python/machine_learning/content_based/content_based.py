from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pandas import Series
"""A class that handles data and sorts by text similarity using cosine similarity.

    This classes purposes is to sort the data based on cosine similarity
    and provide utility functions to be used by the API. It also contains methods to generate 
    statistical information.

    Typical usage example:
    cb = ContentBased("itemID", databaseTable, [featureOne, featureTwo, etc,])
    RecommendationList = cb.getRecommendation(10)
"""

class ContentBased:
    """Content-based classed to process the data, and provide recommendations. Uses Cosine Similarity.

    This class takes intializes the the class atrributes with the provided data then calls
    it's own method sort_frame() to process and sort the Dataframe data. The data is is maintained as a dataframe sorted by
    cosine similarity with the lowest indexs being the most similar.

    Attributes:
        selected_key(string): The key which to generate recommendations for.
        df(df/list): Dataframe to process.
        selected_features(string): Features on which to execute text similarity algorithms.
    """
    def __init__(self, pkey_col, selected_key ,df, selected_features):
        """Class intializer. Calls the sort_frame() function."""
        self.selected_key = selected_key
        self.selected_features = selected_features
        self.sorted_df = df
        self.pkey_col = pkey_col
        self.sort_frame()

    def sort_frame(self):
        recommendation_index = None

        for key, index in zip(self.sorted_df[self.pkey_col], self.sorted_df.index):
            if str(key) == self.selected_key:
                recommendation_index = index

        self.sorted_df['combined_features'] = self.sorted_df[self.selected_features].apply(lambda x: str(x), axis=1)

        # vectorize and process cosine similarity and append to dataframe
        cv = CountVectorizer()
        count_matrix = cv.fit_transform(self.sorted_df["combined_features"])
        cos_similarity = cosine_similarity(count_matrix)
        score_series = Series(cos_similarity[recommendation_index])
        self.sorted_df['Cosine Similarity'] = score_series

        self.sorted_df.sort_values(by=['Cosine Similarity'], inplace=True, ascending=False)



    def get_recommendations(self, num_of_rec, sort_method=None):
        df_for_api = self.sorted_df

        if sort_method is not None:
            df_for_api.sort_values(by=['Cosine Similarity', sort_method], inplace=True, ascending=False)

        # Drop columns for aesthetics
        df_for_api.drop(['combined_features'], axis=1, inplace=True)
        df_for_api.drop(['Cosine Similarity'], axis=1, inplace=True)
        df_for_api.drop([self.pkey_col], axis=1, inplace=True)  # hide primary key from the recommendations

        return df_for_api.iloc[1:num_of_rec+1].fillna('').to_dict('records')
