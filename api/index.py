from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.impute import SimpleImputer
from models import decision_tree, neural_network
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
import joblib  # Import joblib to save the model to a file
import pickle


app = Flask(__name__)
CORS(app)
#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
loss_functions = {
    'mean_squared_error': mean_squared_error,
    'mean_absolute_error': mean_absolute_error
}


#? *** UPLOAD ***
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:                             # Check if the file is in the request
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']                                # Get the file from the request
    if file.filename == '':                                     # Check if the file has a name
        return jsonify({"error": "No file selected"}), 400

    try:
        global DF
        DF = pd.read_csv(file)
        DF = DF.select_dtypes(exclude=['object'])       # Drop non-numeric columns
        return jsonify(DF.to_dict(orient="records"))    # Convert the DataFrame to a dictionary and return it as JSON 
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#? *** TRAIN ***
@app.route('/api/train-nn', methods=['POST'])  
def train_model():
    return neural_network.train_model();                                                                    

# @app.route('/api/train-dt', methods=['POST'])  
# def train_model_dt():
#     return decision_tree.train_model(); 

@app.route('/api/train-tree', methods=['POST'])
def train_tree():
    print('working')

    FE_data = request.json                        # Get the JSON data from the request
    global feat_cols, label_cols
    feat_cols = FE_data.get('X')                   # Get the features from the JSON data
    label_cols = FE_data.get('y')                  # Get the label from the JSON data
    # print('feat_cols: ', feat_cols)     
    # print('label_cols: ', label_cols)   
    
    DF_mod = DF                                   #copy the dataframe                    

    #* PREPROCESS
    imputer = SimpleImputer(strategy=FE_data.get('settings')['imputer'])
    DF_mod[feat_cols] = imputer.fit_transform(DF_mod[feat_cols]) 
    DF_mod.dropna(axis=0, inplace=True)
    # print('DF_mod: ', DF_mod)

    X = DF_mod[feat_cols]                       # Features
    y = DF_mod[label_cols]                      # Label             

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    #* TRAIN
    global tree_model
    tree_model = DecisionTreeRegressor()
    tree_model.fit(X_train, y_train)

    #* COMPILATION
    y_predict = tree_model.predict(X_test)
    if FE_data.get('settings')['loss'] == 'mean_absolute_error':
        loss = mean_absolute_error(y_test, y_predict)
    else:
        loss = mean_squared_error(y_test, y_predict)



    #* SAVE MODEL
    joblib.dump(tree_model, 'model.pkl')

    return jsonify({'loss': loss})


#
#
#
# Load your pre-trained model
# model = joblib.load("model.pkl")

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json                       # Get the JSON data from the request
    
    print(data)  # Print the received data
    print('//')

    # # Load the pre-trained model
    # # model = joblib.load("model.pkl")

    # # Extract features from the received data
    features = pd.DataFrame([data])
    print('features: ', features)
    print('//')


    # print('label_cols: ', label_cols)
    predicted_value = tree_model.predict(features)
    
    print('predicted_value: ', predicted_value)


    # # Make predictions
    # # predictions = model.predict(features)

    # print('Inputs:', inputs)
    # return jsonify({'inputs': inputs})



    # Convert the predicted value to a list
    predicted_value_list = predicted_value.tolist()

    return jsonify({'prediction': predicted_value_list})


# @app.route('/api/download/<path:filename>', methods=['GET'])
# def download_file(filename):
#     return send_file(filename, as_attachment=True)










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