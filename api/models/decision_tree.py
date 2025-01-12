from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
import joblib


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for feature columns, label columns, and the model
tree_model = None
feat_cols = []
label_cols = []


class TrainTreeRequest(BaseModel):
    X: List[str]
    y: str
    settings: Dict[str, Optional[Dict]]


# @app.post("/api/py/train-tree")
def train_tree(request_data: TrainTreeRequest, df: pd.DataFrame):
    global feat_cols, label_cols, tree_model

    # Parse request data
    feat_cols = request_data.X
    label_cols = request_data.y
    settings = request_data.settings

    # Preprocess the DataFrame
    try:
        imputer = SimpleImputer(strategy=settings.get("imputer", "mean"))
        df[feat_cols] = imputer.fit_transform(df[feat_cols])
        df.dropna(axis=0, inplace=True)

        X = df[feat_cols]  # Features
        y = df[label_cols]  # Label

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        max_leaf_nodes = settings["tree"].get("maxLeafNodes", None)
        use_random_forest = settings["tree"].get("useRandomForest", False)

        if use_random_forest:
            tree_model = RandomForestRegressor(
                max_leaf_nodes=int(max_leaf_nodes) if max_leaf_nodes else None,
                n_estimators=100,
                random_state=0
            )
        else:
            tree_model = DecisionTreeRegressor(
                max_leaf_nodes=int(max_leaf_nodes) if max_leaf_nodes else None,
                random_state=0
            )

        tree_model.fit(X_train, y_train)

        # Evaluate the model
        y_predict = tree_model.predict(X_test)
        loss = (
            mean_absolute_error(y_test, y_predict)
            if settings.get("loss") == "mean_absolute_error"
            else mean_squared_error(y_test, y_predict)
        )

        # Save the model
        joblib.dump(tree_model, "model.pkl")

        return {"loss": loss}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_tree_model():
    return tree_model
    # try:
    #     if not tree_model:
    #         return {"message": "Model not trained or loaded yet."}
    #     return {"message": "Model is available."}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5328)









# from flask import Flask, jsonify, request, send_file
# from flask_cors import CORS
# import numpy as np
# import tensorflow as tf
# import pandas as pd
# from sklearn.impute import SimpleImputer
# from sklearn.metrics import mean_squared_error, mean_absolute_error
# from sklearn.model_selection import train_test_split
# from sklearn.tree import DecisionTreeRegressor
# from sklearn.ensemble import RandomForestRegressor
# import joblib 


# app = Flask(__name__)
# CORS(app)
# #  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

# tree_model = None


# @app.route('/api/train-tree', methods=['POST'])
# def train_tree(DF):
#     # TODO: Implement comparison of max_leaf_nodes
#     # def get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y):
#     #     model = DecisionTreeRegressor(max_leaf_nodes=max_leaf_nodes, random_state=0)
#     #     model.fit(train_X, train_y)
#     #     preds_val = model.predict(val_X)
#     #     mae = mean_absolute_error(val_y, preds_val)
#     #     return(mae)    

#     FE_data = request.json 
#     global feat_cols, label_cols
#     feat_cols = FE_data.get('X')                 
#     label_cols = FE_data.get('y')                  

    
#     DF_mod = DF                                                     

#     #* PREPROCESS
#     imputer = SimpleImputer(strategy=FE_data.get('settings')['imputer'])
#     DF_mod[feat_cols] = imputer.fit_transform(DF_mod[feat_cols]) 
#     DF_mod.dropna(axis=0, inplace=True)

#     X = DF_mod[feat_cols]                       # Features
#     y = DF_mod[label_cols]                      # Label             

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     #* TRAIN
#     global tree_model
#     max_leaf_nodes = FE_data.get('settings')['tree']['maxLeafNodes']
#     isRandomForest = FE_data.get('settings')['tree']['useRandomForest']

#     if isRandomForest:
#         tree_model = RandomForestRegressor(max_leaf_nodes=int(max_leaf_nodes), n_estimators=100, random_state=0)
#     else:
#         tree_model = DecisionTreeRegressor(max_leaf_nodes=int(max_leaf_nodes), random_state=0)


#     tree_model.fit(X_train, y_train)

#     #* COMPILATION
#     y_predict = tree_model.predict(X_test)
#     if FE_data.get('settings')['loss'] == 'mean_absolute_error':
#         loss = mean_absolute_error(y_test, y_predict)
#     else:
#         loss = mean_squared_error(y_test, y_predict)



#     #* SAVE MODEL
#     joblib.dump(tree_model, 'model.pkl')

#     return jsonify({'loss': loss})

# def get_tree_model():
#     # if tree_model is None:
#     #     # Optionally, reload the model from disk if it's not in memory
#     #     tree_model = joblib.load('model.pkl')
#     return tree_model




# #!  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
# if __name__ == '__main__':
#     app.run(debug=True, port=5328)