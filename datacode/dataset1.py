#DONOR-NGO/ORPHANGE RECOMMENDATION SYSTEM - CONTENT BASED RECOMMENDATION(COSINE SIMILARITY)

import pandas as pd
import numpy as np
import os
import random
from datetime import datetime, timedelta


# ----------------------------
# 1. Generate Dataset
# ----------------------------

path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphange\data\dataset1"
os.makedirs(path, exist_ok=True)

# Parameters
num_donors = 4000
num_ngos = 1000
num_orphanages = 1000
cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai']
categories = ['Education', 'Health', 'Food', 'Arts', 'Shelter']

# Donor Profiles
donor_rows = []
for i in range(1, num_donors+1):
    donor_id = f"D{i}"
    preferred_categories = ','.join(random.sample(categories, k=random.randint(1,2)))
    donation_range_min = random.randint(500, 1000)
    donation_range_max = random.randint(2000, 5000)
    location = random.choice(cities)
    preferred_type = random.choice(['NGO','Orphanage'])
    donor_rows.append([donor_id, preferred_categories, donation_range_min, donation_range_max , location, preferred_type])
donors_df = pd.DataFrame(donor_rows, columns=['donor_id','preferred_categories','donation_range_min','donation_range_max','location','preferred_type'])
donors_df.to_csv(os.path.join(path, 'donor_profiles.csv'), index=False)

# NGO Profiles
ngo_rows = []
for i in range(1, num_ngos+1):
    ngo_id = f"N{i}"
    need_categories = ','.join(random.sample(categories, k=random.randint(1,2)))
    num_beneficiaries = random.randint(50,500)
    description = f"Supports {num_beneficiaries} people in {need_categories}"
    location = random.choice(cities)
    ngo_rows.append([ngo_id, need_categories, num_beneficiaries, description, location])
ngos_df = pd.DataFrame(ngo_rows, columns=['ngo_id','need_categories','num_beneficiaries','description','location'])
ngos_df.to_csv(os.path.join(path, 'ngo_profiles.csv'), index=False)

# Orphanage Profiles
orphanage_rows = []
for i in range(1, num_orphanages+1):
    orphanage_id = f"O{i}"
    need_categories = ','.join(random.sample(categories, k=random.randint(1,2)))
    num_children = random.randint(5,100)
    description = f"Supports {num_children} children in {need_categories}"
    location = random.choice(cities)
    orphanage_rows.append([orphanage_id, need_categories, num_children, description, location])
orphanages_df = pd.DataFrame(orphanage_rows, columns=['orphanage_id','need_categories','num_children','description','location'])
orphanages_df.to_csv(os.path.join(path, 'orphanage_profiles.csv'), index=False)

# Interaction Log (denser and weighted)
interaction_rows = []
interactions_per_donor = 15  # increase interactions per donor

for donor in donors_df['donor_id']:
    donor_pref = donors_df[donors_df['donor_id']==donor]['preferred_categories'].values[0].split(',')
    preferred_type = donors_df[donors_df['donor_id']==donor]['preferred_type'].values[0]

    for _ in range(interactions_per_donor):
        if preferred_type == 'NGO':
            items_pool = ngos_df[ngos_df['need_categories'].apply(lambda x: any(cat in x for cat in donor_pref))]
            if len(items_pool) == 0:
                items_pool = ngos_df
            item = random.choice(items_pool['ngo_id'].tolist())
            match_score = 3 if any(cat in ngos_df.loc[ngos_df['ngo_id']==item,'need_categories'].values[0] for cat in donor_pref) else random.randint(0,2)
        else:
            items_pool = orphanages_df[orphanages_df['need_categories'].apply(lambda x: any(cat in x for cat in donor_pref))]
            if len(items_pool) == 0:
                items_pool = orphanages_df
            item = random.choice(items_pool['orphanage_id'].tolist())
            match_score = 3 if any(cat in orphanages_df.loc[orphanages_df['orphanage_id']==item,'need_categories'].values[0] for cat in donor_pref) else random.randint(0,2)

        timestamp = datetime.now() - timedelta(days=random.randint(0,30),
                                               hours=random.randint(0,23),
                                               minutes=random.randint(0,59))
        timestamp = timestamp.strftime("%Y-%m-%d %H:%M")
        interaction_rows.append([donor, item, match_score, timestamp])

interactions_df = pd.DataFrame(interaction_rows, columns=['donor_id','item_id','interaction_score','timestamp'])
interactions_df.to_csv(os.path.join(path, 'donor_item_interactions.csv'), index=False)

print(f"Generated datasets: donors={len(donors_df)}, NGOs={len(ngos_df)}, orphanages={len(orphanages_df)}, interactions={len(interactions_df)}")