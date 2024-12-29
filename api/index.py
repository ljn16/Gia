from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.impute import SimpleImputer
from models import decision_tree, neural_network

app = Flask(__name__)
CORS(app)
#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

# model = None
# feature_columns = []



#? *** TRAIN ***
@app.route('/api/train-nn', methods=['POST'])  
def train_model():
    return neural_network.train_model();                                                                    

@app.route('/api/train-dt', methods=['POST'])  
def train_model_dt():
    return decision_tree.train_model();   

#? *** PREDICT ***
# @app.route('/api/predict-nn', methods=['POST'])  
# @app.route('/api/train-dt', methods=['POST'])  

@app.route('/api/train', methods=['POST'])
def train():
    # global model, feature_columns, training_log
    # data = request.json                         # Get the JSON data from the request
    # DB = data.get('DB')                         # Get the database from the JSON data
    # feat_cols = data.get('X')                   # Get the features from the JSON data
    # label_cols = data.get('y')                  # Get the label from the JSON data

    # DB_data = pd.DataFrame(DB)#.select_dtypes(exclude=['object'])
    # DB_data = DB_data.dropna(axis=0)

    # X = DB_data[feat_cols]
    # y = DB_data[label_cols]

    # file = request.files['file']
    # data = pd.read_csv(file)
    # target_column = request.form['target_column']

    # # Separate features and target
    # X = data.drop(columns=[target_column])
    # y = data[target_column]

    # # Save feature columns
    # feature_columns = list(X.columns)

    # # Train-Test Split
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # # Train Decision Tree
    # clf = DecisionTreeClassifier()
    # clf.fit(X_train, y_train)

    # # Calculate loss
    # y_pred_proba = clf.predict_proba(X_test)
    # loss = log_loss(y_test, y_pred_proba)

    # # Store the model
    # model = clf

    # return jsonify({'loss': loss})
    return jsonify({'message': 'it works'})


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files: # Check if the file is in the request
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file'] # Get the file from the request

    if file.filename == '': # Check if the file has a name
        return jsonify({"error": "No file selected"}), 400

    try:
        # Process the CSV file
        # global_df = pd.read_csv(file)
        global global_df
        global_df = pd.read_csv(file)
        df = global_df
        # Example: return first 5 rows as JSON
        return jsonify(df.head().to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500




#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5328)



# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import log_loss

# app = Flask(__name__)
# CORS(app)

# # Store trained model and feature columns
# model = None
# feature_columns = []

# @app.route('/api/train', methods=['POST'])
# def train():
#     global model, feature_columns

#     file = request.files['file']
#     data = pd.read_csv(file)
#     target_column = request.form['target_column']

#     # # Separate features and target
#     # X = data.drop(columns=[target_column])
#     # y = data[target_column]

#     # # Save feature columns
#     # feature_columns = list(X.columns)

#     # # Train-Test Split
#     # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     # # Train Decision Tree
#     # clf = DecisionTreeClassifier()
#     # clf.fit(X_train, y_train)

#     # # Calculate loss
#     # y_pred_proba = clf.predict_proba(X_test)
#     # loss = log_loss(y_test, y_pred_proba)

#     # # Store the model
#     # model = clf

#     # return jsonify({'loss': loss})
#     return jsonify({'message': 'it works'})

# @app.route('api/predict', methods=['POST'])
# def predict():
#     global model, feature_columns

#     if model is None:
#         return jsonify({'error': 'Model not trained yet'}), 400

#     file = request.files['file']
#     data = pd.read_csv(file)

#     if not all(col in data.columns for col in feature_columns):
#         return jsonify({'error': 'Input data does not have the required features'}), 400

#     X = data[feature_columns]
#     predictions = model.predict(X)

#     return jsonify({'predictions': predictions.tolist()})


# #  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

# # Run the app
# if __name__ == '__main__':
#     app.run(debug=True, port=5328)