#DONOR-NGO/ORPHANGE RECOMMENDATION SYSTEM 

import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta
from sklearn.metrics.pairwise import cosine_similarity
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import re

path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphnage\data\dataset1"
os.makedirs(path, exist_ok=True)

# Parameters
num_donors = 400
num_ngos = 20
num_orphanages = 20
cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai']
categories = ['Education', 'Health', 'Food', 'Arts', 'Shelter']

# Donor Profiles
donor_rows = []
for i in range(1, num_donors + 1):
    donor_id = f"D{i}"
    preferred_categories = ','.join(random.sample(categories, k=random.randint(1, 2)))
    donation_range_min = random.randint(500, 1000)
    donation_range_max = random.randint(2000, 5000)
    location = random.choice(cities)
    preferred_type = random.choice(['NGO', 'Orphanage'])
    donor_rows.append([donor_id, preferred_categories, donation_range_min, donation_range_max, location, preferred_type])
donors_df = pd.DataFrame(donor_rows, columns=['donor_id', 'preferred_categories', 'donation_range_min', 'donation_range_max', 'location', 'preferred_type'])
donors_df.to_csv(os.path.join(path, 'donor_profiles.csv'), index=False)

# NGO Profiles
ngo_rows = []
for i in range(1, num_ngos + 1):
    ngo_id = f"N{i}"
    need_categories = ','.join(random.sample(categories, k=random.randint(1, 2)))
    num_beneficiaries = random.randint(50, 500)
    description = f"Supports {num_beneficiaries} people in {need_categories}"
    location = random.choice(cities)
    ngo_rows.append([ngo_id, need_categories, num_beneficiaries, description, location])
ngos_df = pd.DataFrame(ngo_rows, columns=['ngo_id', 'need_categories', 'num_beneficiaries', 'description', 'location'])
ngos_df.to_csv(os.path.join(path, 'ngo_profiles.csv'), index=False)

# Orphanage Profiles
orphanage_rows = []
for i in range(1, num_orphanages + 1):
    orphanage_id = f"O{i}"
    need_categories = ','.join(random.sample(categories, k=random.randint(1, 2)))
    num_children = random.randint(5, 100)
    description = f"Supports {num_children} children in {need_categories}"
    location = random.choice(cities)
    orphanage_rows.append([orphanage_id, need_categories, num_children, description, location])
orphanages_df = pd.DataFrame(orphanage_rows, columns=['orphanage_id', 'need_categories', 'num_children', 'description', 'location'])
orphanages_df.to_csv(os.path.join(path, 'orphanage_profiles.csv'), index=False)

# Generate Interaction Log
interaction_rows = []
for _ in range(10000):
    donor = random.choice(donors_df['donor_id'].tolist())
    preferred_type = donors_df[donors_df['donor_id'] == donor]['preferred_type'].values[0]
    if preferred_type == 'NGO':
        item = random.choice(ngos_df['ngo_id'].tolist())
    else:
        item = random.choice(orphanages_df['orphanage_id'].tolist())
    interaction_score = random.choices([0, 1, 2, 3], weights=[0.2, 0.5, 0.2, 0.1])[0]
    timestamp = datetime.now() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))
    timestamp = timestamp.strftime("%Y-%m-%d %H:%M")
    interaction_rows.append([donor, item, interaction_score, timestamp])

interactions_df = pd.DataFrame(interaction_rows, columns=['donor_id', 'item_id', 'interaction_score', 'timestamp'])
interactions_df.to_csv(os.path.join(path, 'donor_item_interactions.csv'), index=False)

print("Generated datasets:")
print(f"- donor_profiles.csv ({len(donors_df)} donors)")
print(f"- ngo_profiles.csv ({len(ngos_df)} NGOs)")
print(f"- orphanage_profiles.csv ({len(orphanages_df)} orphanages)")
print(f"- donor_item_interactions.csv ({len(interactions_df)} interactions)")

