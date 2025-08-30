#DONATION IMPACT PREDICTION SYSTEM - tree based regression 

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# Load dataset (example for Education)
df = pd.read_csv("education.csv")

# Drop unnecessary IDs
df = df.drop(["donation_id", "recipient_id"], axis=1)

# Encode recipient_type
le = LabelEncoder()
df["recipient_type"] = le.fit_transform(df["recipient_type"])

# Extract year/month from timestamp
df["timestamp"] = pd.to_datetime(df["timestamp"])
df["year"] = df["timestamp"].dt.year
df["month"] = df["timestamp"].dt.month
df = df.drop("timestamp", axis=1)

# Define features (X) and target (y)
X = df.drop("education_days_per_child", axis=1)
y = df["education_days_per_child"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print("MSE:", mean_squared_error(y_test, y_pred))
print("R² Score:", r2_score(y_test, y_pred))


