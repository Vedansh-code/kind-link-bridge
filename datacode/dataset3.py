#UREGENCY AND PRIORITY PREDICTION SYSTEM - DECISION TREE CLASSIFIER

import pandas as pd
import random
from datetime import datetime, timedelta
import os

# Parameters
num_children = 2000
folder_path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphange\data\dataset4"
os.makedirs(folder_path, exist_ok=True)

# Generate dataset
rows = []
for i in range(1, num_children+1):
    child_id = f"C{i}"
    need_type = random.choice(['Food','Health'])  # only these two types
    request_date = datetime.now() - timedelta(days=random.randint(0,30))
    request_date_str = request_date.strftime("%Y-%m-%d")

    amount_required = random.randint(500, 5000) 
    percent_funded = round(random.uniform(0, 100),1)
    num_sponsors = random.randint(0,10)
    last_updated_days = random.randint(0,30)
    
    # Weighted score for criticality
    score = (1 - percent_funded/100)*0.4 + (1 - min(num_sponsors/10,1))*0.2 + min(last_updated_days/30,1)*0.4

    if score > 0.7:
        criticality_label = 'High'
    elif score > 0.3:
        criticality_label = 'Medium'
    else:
        criticality_label = 'Low'
    
    rows.append([
        child_id, need_type, request_date_str, amount_required,
        percent_funded, num_sponsors, last_updated_days, criticality_label
    ])

df = pd.DataFrame(rows, columns=[
    'child_id','need_type','request_date','amount_required',
    'percent_funded','num_sponsors','last_updated_days','criticality_label'
])

df.to_csv(os.path.join(folder_path,'orphanage_children_urgency.csv'), index=False)
print(f"Generated {len(df)} rows at {folder_path}")
    