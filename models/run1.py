#DONOR-NGO/ORPHANGE RECOMMENDATION SYSTEM - CONTENT BASED RECOMMENDATION(COSINE SIMILARITY)

import pandas as pd
import numpy as np
import random
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split, GridSearchCV
from surprise import accuracy
import re


random.seed(42)
np.random.seed(42)


# Load datasets
path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphnage\data\dataset1"
donors = pd.read_csv(f"{path}/donor_profiles.csv")
ngos = pd.read_csv(f"{path}/ngo_profiles.csv")
orphanages = pd.read_csv(f"{path}/orphanage_profiles.csv")
interactions = pd.read_csv(f"{path}/donor_item_interactions.csv")


# Item profiles
all_items = pd.concat([
    ngos.rename(columns={"ngo_id": "item_id", "need_categories": "categories"}),
    orphanages.rename(columns={"orphanage_id": "item_id", "need_categories": "categories"})
], ignore_index=True)
all_items.set_index('item_id', inplace=True)


# Donor-item matrix
donor_item_matrix = interactions.pivot_table(
    index='donor_id', columns='item_id', values='interaction_score', fill_value=0)


# Surprise dataset
reader = Reader(rating_scale=(0, 3))
data = Dataset.load_from_df(interactions[['donor_id', 'item_id', 'interaction_score']], reader)
trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

# SVD Hyperparameter Tuning
param_grid = {
    'n_factors': [50, 100],
    'n_epochs': [20, 30],
    'lr_all': [0.005, 0.01],
    'reg_all': [0.02, 0.05]
}
gs = GridSearchCV(SVD, param_grid, measures=['rmse', 'mae'], cv=3)
gs.fit(data)

print("Best SVD Parameters (RMSE):", gs.best_params['rmse'])
svd = SVD(**gs.best_params['rmse'], random_state=42)
svd.fit(trainset)
predictions = svd.test(testset)
print("CF RMSE (Tuned):", accuracy.rmse(predictions, verbose=False))
print("CF MAE (Tuned):", accuracy.mae(predictions, verbose=False))


# Hybrid Recommendation Function
def hybrid_recommend(donor_id, top_k=10, alpha=0.5):
    if donor_id not in donor_item_matrix.index:
        return interactions['item_id'].value_counts().head(top_k).index.tolist()

    interacted_items = donor_item_matrix.loc[donor_id][donor_item_matrix.loc[donor_id] > 0].index
    donor_profile = donors.loc[donors['donor_id'] == donor_id].iloc[0]

    hybrid_scores = {}
    donor_cats = set(re.split(r'[,|]', donor_profile['preferred_categories']))
    for item_id, item_row in all_items.iterrows():
        cf_score = svd.predict(donor_id, item_id).est
        item_cats = set(re.split(r'[,|]', item_row['categories']))
        content_score = len(donor_cats.intersection(item_cats))
        if donor_profile['location'] == item_row['location']:
            content_score += 1
        content_score /= 3.0
        hybrid_scores[item_id] = alpha * cf_score + (1 - alpha) * content_score * 3
    hybrid_series = pd.Series(hybrid_scores).sort_values(ascending=False)
    hybrid_series = hybrid_series[~hybrid_series.index.isin(interacted_items)]
    return hybrid_series.head(top_k)

# Evaluate Top-K Hit Rate
def evaluate_topk(recommendations, interactions, k=10):
    hits, total = 0, 0
    for donor, rec_list in recommendations.items():
        top_items = set(rec_list[:k])
        actual_items = set(interactions[interactions['donor_id'] == donor]['item_id'].tolist())
        if not actual_items.isdisjoint(top_items):
            hits += 1
        total += 1
    return hits / total if total > 0 else 0


# Tune alpha
alpha_values = np.linspace(0.1, 0.9, 9)
best_alpha, best_hit_rate = 0.5, 0

for alpha_val in alpha_values:
    recs = {donor: list(hybrid_recommend(donor, top_k=10, alpha=alpha_val).index) for donor in donors['donor_id']}
    hit_rate = evaluate_topk(recs, interactions)
    print(f"Alpha {alpha_val:.1f} -> Hit Rate: {hit_rate:.4f}")
    if hit_rate > best_hit_rate:
        best_hit_rate = hit_rate
        best_alpha = alpha_val


# Final Recommendations
final_recs = {donor: list(hybrid_recommend(donor, top_k=10, alpha=best_alpha).index) for donor in donors['donor_id']}
print(f"Final Top-10 Hit Rate with alpha={best_alpha:.1f}: {evaluate_topk(final_recs, interactions):.4f}")
