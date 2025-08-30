#DONOR-NGO/ORPHANGE RECOMMENDATION SYSTEM - CONTENT BASED RECOMMENDATION(COSINE SIMILARITY)

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy

# -----------------------------
# Load Data
# -----------------------------
path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphange\data\dataset1"
donors = pd.read_csv(f"{path}\\donor_profiles.csv")
ngos = pd.read_csv(f"{path}\\ngo_profiles.csv")
orphanages = pd.read_csv(f"{path}\\orphanage_profiles.csv")
interactions = pd.read_csv(f"{path}\\donor_item_interactions.csv")

# -----------------------------
# 1. Content-Based Recommender
# -----------------------------
def content_based_recommender(donors, ngos, orphanages, weight_num=0.3):
    # unify items
    ngos["item_id"] = ngos["ngo_id"]
    orphanages["item_id"] = orphanages["orphanage_id"]
    items = pd.concat([
        ngos[["item_id", "need_categories", "location", "num_beneficiaries"]],
        orphanages[["item_id", "need_categories", "location", "num_children"]].rename(columns={"num_children":"num_beneficiaries"})
    ])
    
    # TF-IDF for categories and location separately
    vectorizer_cat = TfidfVectorizer()
    vectorizer_loc = TfidfVectorizer()
    
    cat_vecs = vectorizer_cat.fit_transform(items["need_categories"])
    loc_vecs = vectorizer_loc.fit_transform(items["location"])
    item_vecs = np.hstack([cat_vecs.toarray(), loc_vecs.toarray()])
    
    donor_cat_vecs = vectorizer_cat.transform(donors["preferred_categories"])
    donor_loc_vecs = vectorizer_loc.transform(donors["location"])
    donor_vecs = np.hstack([donor_cat_vecs.toarray(), donor_loc_vecs.toarray()])
    
    cosine_scores = cosine_similarity(donor_vecs, item_vecs)
    
    # Add normalized numeric feature
    scaler = MinMaxScaler()
    items['num_scaled'] = scaler.fit_transform(items[['num_beneficiaries']])
    cosine_scores += items['num_scaled'].values.reshape(1, -1) * weight_num
    
    return cosine_scores, items

# -----------------------------
# 2. Collaborative Filtering
# -----------------------------
def collaborative_filtering(interactions, donors, items):
    reader = Reader(rating_scale=(0,3))
    data = Dataset.load_from_df(interactions[["donor_id", "item_id", "interaction_score"]], reader)
    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)
    
    svd = SVD()
    svd.fit(trainset)
    
    # Evaluate CF
    predictions = svd.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    mae = accuracy.mae(predictions, verbose=False)
    print(f"Collaborative Filtering -> RMSE: {rmse:.4f}, MAE: {mae:.4f}")
    
    # full donor-item prediction
    cf_scores = np.zeros((len(donors), len(items)))
    for i, donor in enumerate(donors["donor_id"]):
        for j, item in enumerate(items["item_id"]):
            cf_scores[i, j] = svd.predict(donor, item).est
    return cf_scores

# -----------------------------
# 3. Hybrid Recommender
# -----------------------------
def hybrid_recommender(donors, ngos, orphanages, interactions, alpha=0.5, beta=0.5, top_k=10):
    cosine_scores, items = content_based_recommender(donors, ngos, orphanages, weight_num=0.3)
    cf_scores = collaborative_filtering(interactions, donors, items)
    
    # Hybrid score
    hybrid_scores = alpha * cosine_scores + beta * cf_scores
    
    recommendations = {}
    for i, donor in enumerate(donors["donor_id"]):
        top_idx = np.argsort(hybrid_scores[i])[::-1][:top_k]
        recs = [(items.iloc[idx]["item_id"], hybrid_scores[i, idx]) for idx in top_idx]
        recommendations[donor] = recs
        
    return recommendations, items, hybrid_scores

# -----------------------------
# 4. Top-K Evaluation
# -----------------------------
def evaluate_topk(recommendations, interactions, k=10):
    hits = 0
    total = 0
    for donor, rec_list in recommendations.items():
        top_items = [item for item, score in rec_list[:k]]
        actual_items = interactions[interactions["donor_id"]==donor]["item_id"].tolist()
        for item in actual_items:
            if item in top_items:
                hits += 1
        total += len(actual_items)
    hit_rate = hits/total if total>0 else 0
    print(f"Top-{k} Hit Rate: {hit_rate:.4f}")

# -----------------------------
# 5. Run Hybrid Recommender
# -----------------------------
recs, items, hybrid_scores = hybrid_recommender(donors, ngos, orphanages, interactions, alpha=0.6, beta=0.4, top_k=10)
evaluate_topk(recs, interactions, k=10)