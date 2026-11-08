import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

np.random.seed(42)

diseases = [
    "Heart & BP Health",
    "Type-2 Diabetes",
    "Stroke Risk",
    "Kidney Health",
    "Liver Health",
    "Parkinson's Disease"
]

# 12 distinct clinical biomarkers and symptoms
features = [
    "chest_pressure",       # 0: Heart/BP
    "breathlessness",       # 1: Heart/BP
    "high_fasting_sugar",   # 2: Diabetes
    "extreme_thirst",       # 3: Diabetes
    "facial_droop_speech",  # 4: Stroke
    "unilateral_weakness",  # 5: Stroke
    "foamy_urine_edema",    # 6: Kidney
    "elevated_creatinine",  # 7: Kidney
    "jaundice_yellowing",   # 8: Liver
    "right_upper_pain",     # 9: Liver
    "resting_tremor",       # 10: Parkinson's
    "motor_rigidity"        # 11: Parkinson's
]

# High-discrimination clinical signature matrix
# Distinct hallmark symptoms are weighted heavily (~0.85 - 0.95), non-related are ~0.05
disease_signatures = {
    "Heart & BP Health":   [0.92, 0.88, 0.05, 0.05, 0.08, 0.10, 0.05, 0.05, 0.02, 0.02, 0.02, 0.05],
    "Type-2 Diabetes":     [0.05, 0.05, 0.95, 0.92, 0.02, 0.08, 0.12, 0.10, 0.05, 0.02, 0.02, 0.02],
    "Stroke Risk":         [0.10, 0.08, 0.05, 0.02, 0.94, 0.92, 0.02, 0.02, 0.02, 0.02, 0.10, 0.08],
    "Kidney Health":       [0.08, 0.12, 0.10, 0.05, 0.02, 0.05, 0.94, 0.92, 0.08, 0.05, 0.02, 0.02],
    "Liver Health":        [0.05, 0.05, 0.05, 0.05, 0.02, 0.02, 0.08, 0.05, 0.94, 0.90, 0.02, 0.02],
    "Parkinson's Disease": [0.02, 0.02, 0.02, 0.02, 0.10, 0.12, 0.02, 0.02, 0.02, 0.02, 0.95, 0.92]
}

data = []
labels = []

# Generate 700 patient profiles per disease class
samples_per_class = 700
for dis, weights in disease_signatures.items():
    for _ in range(samples_per_class):
        patient_row = []
        for w in weights:
            prob = np.clip(w + np.random.normal(0, 0.04), 0.01, 0.99)
            score = np.random.choice([2, 1, 0], p=[prob * 0.75, prob * 0.25, 1.0 - prob])
            patient_row.append(score)
        data.append(patient_row)
        labels.append(dis)

df = pd.DataFrame(data, columns=features)
df["target"] = labels

X = df.drop("target", axis=1)
y = df["target"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
acc = accuracy_score(y_test, preds) * 100
print(f"Refined Model Accuracy: {acc:.2f}%\n")
print(classification_report(y_test, preds))

os.makedirs("modules", exist_ok=True)
joblib.dump(model, "modules/symptom_model.pkl")
print("Saved high-performance symptom model to modules/symptom_model.pkl")