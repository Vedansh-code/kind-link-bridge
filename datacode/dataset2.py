#FRAUD/FAKE NGO DETECTION - LOGISTIC REGRESSION CLASSIFIER

import pandas as pd
import random
import os

# Parameters
num_entities = 2000
folder_path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphange\data\dataset3"
os.makedirs(folder_path, exist_ok=True)

#data generation
rows = []
for i in range(1, num_entities+1):
    entity_type = random.choice(['NGO','Orphanage'])
    entity_id = f"{'N' if entity_type=='NGO' else 'O'}{i}"
    is_real = random.choices([1,0], weights=[0.7,0.3])[0]

    if is_real:
        years_active = random.randint(5,30)
        doc_verified = 1
        total_donations = random.randint(50000,500000)
        avg_donation_amount = random.randint(500,5000)
        donor_reviews_score = round(random.uniform(3,5),1)
        success_rate = random.randint(70,100)
    else:
        years_active = random.randint(0,5)
        doc_verified = 0
        total_donations = random.randint(0,50000)
        avg_donation_amount = random.randint(100,5000)
        donor_reviews_score = round(random.uniform(0,3),1)
        success_rate = random.randint(0,50)

    # Normalize features (0-1)
    norm_years = years_active / 30
    norm_total_donations = total_donations / 500000
    norm_reviews = donor_reviews_score / 5
    norm_success = success_rate / 100
    score = (0.1*norm_years + 0.4*doc_verified + 0.1*norm_total_donations + 0.2*norm_reviews + 0.2*norm_success)
    label = 1 if score >= 0.3 else 0
    rows.append([ entity_id, entity_type, years_active, doc_verified, total_donations, avg_donation_amount, donor_reviews_score, success_rate, label ])


df = pd.DataFrame(rows, columns=[
    'entity_id','entity_type','years_active','doc_verified','total_donations','avg_donation_amount','donor_reviews_score','success_rate','label'])
df.to_csv(os.path.join(folder_path,'fraud_fake_ngo_orphanage_weighted_realistic.csv'), index=False)
print(f"Generated {len(df)} rows at {folder_path}")