#FRAUD/FAKE NGO DETECTION - LOGISTIC REGRESSION CLASSIFIER

import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import matplotlib.pyplot as plt
import seaborn as sns


folder_path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphnage\data\dataset2"
file_path = os.path.join(folder_path, "fraud_fake_ngo_orphanage_weighted_realistic.csv")
df = pd.read_csv(file_path)


# Encode categorical column "entity_type"
le = LabelEncoder()
df['entity_type'] = le.fit_transform(df['entity_type'])   # NGO=1, Orphanage=0

# Features & Target
X = df[['entity_type','years_active','doc_verified','total_donations',
        'avg_donation_amount','donor_reviews_score','success_rate']]
y = df['label']
X_train, X_test, y_train, y_test = train_test_split( X, y, test_size=0.2, random_state=42, stratify=y)

# Feature scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)


print("Model Evaluation")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Confusion Matrix Heatmap
plt.figure(figsize=(5,4))
sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt="d", cmap="Blues",
            xticklabels=["Real","Fake"], yticklabels=["Real","Fake"])
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()



