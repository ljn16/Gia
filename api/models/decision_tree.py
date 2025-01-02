from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.metrics import mean_absolute_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
import pandas as pd

app = Flask(__name__)
CORS(app)
#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

@app.route('/api/train-dt', methods=['POST'])  
def train_model_dt():                                                                  
    global model, training_log 
    data = request.json                         # Get the JSON data from the request
    DB = data.get('DB')                         # Get the database from the JSON data
    feat_cols = data.get('X')                   # Get the features from the JSON data
    label_cols = data.get('y')                  # Get the label from the JSON data
    advanced_options = data.get('advancedOptions') ##  ADVANCED OPTIONS:  {'imputer': 'mean', 'layers': [{'units': 16, 'activation': 'relu'}], 'loss': 'meanSquaredError', 'optimizer': 'adam', 'batchSize': 32, 'epochs': 10}


    DB_data = pd.DataFrame(DB)#.select_dtypes(exclude=['object'])
    DB_data = DB_data.dropna(axis=0)

    X = DB_data[feat_cols]
    y = DB_data[label_cols]

    print('DB: ', DB)
    # print('DB_data: ', DB_)

    train_X, val_X, train_y, val_y = train_test_split(X, y,random_state = 0)

    tree_model = DecisionTreeRegressor()
    DB_data.fit(train_X, train_y)
    val_predictions = DB_data.predict(val_X)

    # TODO 
    # compare MAE with differing values of max_leaf_nodes
    # for max_leaf_nodes in [5, 50, 500, 5000]:
    #     my_mae = get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y)
    #     print("Max leaf nodes: %d  \t\t Mean Absolute Error:  %d" %(max_leaf_nodes, my_mae))

    # TODO
    # leaf nodes
    # model = DecisionTreeRegressor(max_leaf_nodes=max_leaf_nodes, random_state=0)

    # TODO
    # add random forest model option

    loss = mean_absolute_error(val_y, DB_data)

    return jsonify({'loss': loss})





#!  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
if __name__ == '__main__':
    app.run(debug=True, port=5328)