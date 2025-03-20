import pandas as pd
from sklearn.metrics import confusion_matrix
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import numpy as np
import matplotlib.pyplot as plt

# Load the dataset
file_path = "C:\\Users\\vinay\\Downloads\\stress_level_data.csv"  # Update this path if needed
data = pd.read_csv(file_path)

# Rename columns to match the dataset structure
data.rename(columns={'Heart_Rate': 'Heart Rate', 'Temperature': 'Temperature (F)', 
                     'Blood_Pressure': 'Blood Pressure', 'Stress': 'Stress Level'}, inplace=True)

# Split the 'Blood Pressure' column into 'Systolic' and 'Diastolic'
data[['Systolic', 'Diastolic']] = data['Blood Pressure'].str.split('/', expand=True)
data['Systolic'] = pd.to_numeric(data['Systolic'])
data['Diastolic'] = pd.to_numeric(data['Diastolic'])

# Drop the original 'Blood Pressure' column
data = data.drop(columns=['Blood Pressure'])

# Define features (X) and target (y)
X = data[['Heart Rate', 'Temperature (F)', 'Systolic', 'Diastolic']]
y = data['Stress Level']

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train a Random Forest classifier
model = RandomForestClassifier(random_state=42)
model.fit(X_train_scaled, y_train)

# Prediction function
def predict_stress(heart_rate, temperature, systolic, diastolic):
    # Create a DataFrame for the input parameters
    input_data = pd.DataFrame([[heart_rate, temperature, systolic, diastolic]],
                              columns=['Heart Rate', 'Temperature (F)', 'Systolic', 'Diastolic'])
    # Standardize the input data
    input_data_scaled = scaler.transform(input_data)
    # Predict stress level using the trained model
    prediction = model.predict(input_data_scaled)
    return "Stress" if prediction[0] == 1 else "No Stress"

# Collect input from the user
Heart_Rate = int(input("Enter Heart Rate (bpm): "))
Temperature = float(input("Enter body Temperature (°F): "))
Systolic = int(input("Enter Systolic blood pressure: "))
Diastolic = int(input("Enter Diastolic blood pressure: "))

# Call the prediction function and print the result
stress_level = predict_stress(Heart_Rate, Temperature, Systolic, Diastolic)
print(f"Result: {stress_level}")

# Make predictions
y_pred = model.predict(X_test_scaled)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

# Output model evaluation
print(f'Accuracy: {accuracy:.2f}')
print('Classification Report:')
print(report)


unique, counts = np.unique(y_pred, return_counts=True)
labels = ["No Stress", "Stress"]
plt.figure(figsize=(6, 6))
plt.pie(counts, labels=labels, autopct='%1.1f%%', startangle=140, colors=['lightblue', 'lightcoral'])
plt.title('Distribution of Predicted Stress Levels')
plt.show()

cm = confusion_matrix(y_test, y_pred)

# Visualize the confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=["No Stress", "Stress"], yticklabels=["No Stress", "Stress"])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()