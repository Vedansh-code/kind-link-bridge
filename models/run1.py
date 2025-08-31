#DONOR-NGO/ORPHANGE RECOMMENDATION SYSTEM - CONTENT BASED RECOMMENDATION(COSINE SIMILARITY)

import pandas as pd
import numpy as np
import random
import re
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import joblib

# Reproducibility

random.seed(42)
np.random.seed(42)

# Load datasets

path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphnage\data\dataset1"
donors = pd.read_csv(f"{path}/donor_profiles.csv")
ngos = pd.read_csv(f"{path}/ngo_profiles.csv")
orphanages = pd.read_csv(f"{path}/orphanage_profiles.csv")
interactions = pd.read_csv(f"{path}/donor_item_interactions.csv")


# Prepare item profiles

all_items = pd.concat([
    ngos.rename(columns={"ngo_id": "item_id", "need_categories": "categories"}),
    orphanages.rename(columns={"orphanage_id": "item_id", "need_categories": "categories"})
], ignore_index=True)
all_items.set_index('item_id', inplace=True)


# Create donor-item matrix for cosine similarity

# One-hot encode item categories
categories = sorted(set([cat for sub in all_items['categories'].str.split(',') for cat in sub]))
item_category_matrix = pd.DataFrame(0, index=all_items.index, columns=categories)
for item_id, row in all_items.iterrows():
    for cat in row['categories'].split(','):
        item_category_matrix.loc[item_id, cat] = 1

# Compute cosine similarity between items
item_cosine_sim = pd.DataFrame(cosine_similarity(item_category_matrix),
                               index=item_category_matrix.index,
                               columns=item_category_matrix.index)

# Prepare data for SVD

reader = Reader(rating_scale=(0, 3))
data = Dataset.load_from_df(interactions[['donor_id', 'item_id', 'interaction_score']], reader)
trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

svd = SVD(n_factors=50, n_epochs=20, lr_all=0.005, reg_all=0.02, random_state=42)
svd.fit(trainset)
predictions = svd.test(testset)
print("SVD RMSE:", accuracy.rmse(predictions, verbose=False))
print("SVD MAE:", accuracy.mae(predictions, verbose=False))


# Hybrid recommendation function

def hybrid_recommend(donor_id, top_k=10, alpha=0.5):
    # Items donor has already interacted with
    interacted_items = set(interactions[interactions['donor_id'] == donor_id]['item_id'].tolist())  
    hybrid_scores = {}
    for item_id in all_items.index:
        if item_id in interacted_items:
            continue
        # CF score using SVD
        cf_score = svd.predict(donor_id, item_id).est
        # Content-based score using cosine similarity with items donor liked
        donor_items = list(interacted_items)
        if donor_items:
            content_score = item_cosine_sim.loc[item_id, donor_items].mean()
        else:
            content_score = 0
        # Final hybrid score
        hybrid_scores[item_id] = alpha * cf_score + (1 - alpha) * content_score * 3  # scale content to 0-3
    # Return top-K items
    hybrid_series = pd.Series(hybrid_scores).sort_values(ascending=False)
    return hybrid_series.head(top_k)


joblib.dump(svd, "svd_model.pkl")
joblib.dump(item_cosine_sim, "item_cosine_sim.pkl")
joblib.dump(all_items, "all_items.pkl")
joblib.dump(interactions, "interactions.pkl")