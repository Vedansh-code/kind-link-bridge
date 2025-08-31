import matplotlib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.metrics import accuracy_score, classification_report
import joblib


file_path = file_path = r"C:\Users\kanis\OneDrive\Desktop\KANISHKA\PROJECT\orphnage\data\dataset3\orphanage_children_urgency.csv"
df = pd.read_csv(file_path)

X = df[['need_type','amount_required','percent_funded','num_sponsors','last_updated_days']]
y = df['criticality_label']

# Convert categorical feature (need_type) to numeric
X = pd.get_dummies(X, columns=['need_type'], drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
model = DecisionTreeClassifier(
    criterion='entropy',
    max_depth=6,  
    class_weight='balanced',
    random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

joblib.dump(model, 'orphanage_children_urgency_model.pkl')