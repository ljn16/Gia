from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
# 
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
import joblib


app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 

DF = None
feat_cols = None
label_cols = None
scaler_X = None
scaler_y = None
nn_model = None
tree_model = None
model = None
history = None


# #? *** UPLOAD ***
# Upload endpoint
@app.post("/api/py/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        global DF
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        DF = pd.read_csv(file.file)
        DF = DF.select_dtypes(exclude=["object"])
        return DF.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# #? *** TRAIN ***
class TrainRequest(BaseModel):
    X: list
    y: list
    settings: dict
#
@app.post("/api/py/train-tree")
def train_tree(request_data: TrainRequest):
    global DF, feat_cols, label_cols, tree_model

    if DF is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded. Please upload a dataset first.")

    # Parse request data
    feat_cols = request_data.X
    label_cols = request_data.y
    settings = request_data.settings

    try:
        # Validate columns
        if not set(feat_cols + label_cols).issubset(DF.columns):
            raise HTTPException(status_code=400, detail="Invalid columns in request.")

        # Preprocess the DataFrame
        df = DF.copy()
        imputer = SimpleImputer(strategy=settings.get("imputer", "mean"))
        df[feat_cols] = imputer.fit_transform(df[feat_cols])
        df.dropna(axis=0, inplace=True)

        X = df[feat_cols]
        y = df[label_cols].values.ravel() 

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        max_leaf_nodes = settings.get("tree", {}).get("maxLeafNodes", None)
        use_random_forest = settings.get("tree", {}).get("useRandomForest", False)

        if use_random_forest:
            tree_model = RandomForestRegressor(
                max_leaf_nodes=int(max_leaf_nodes) if max_leaf_nodes else None,
                n_estimators=100,
                random_state=0,
            )
        else:
            tree_model = DecisionTreeRegressor(
                max_leaf_nodes=int(max_leaf_nodes) if max_leaf_nodes else None,
                random_state=0,
            )

        tree_model.fit(X_train, y_train)

        # Evaluate the model
        y_predict = tree_model.predict(X_test)
        loss = (
            mean_absolute_error(y_test, y_predict)
            if settings.get("loss") == "mean_absolute_error"
            else mean_squared_error(y_test, y_predict)
        )

        joblib.dump(tree_model, "model.pkl")
        return {"loss": loss}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/py/train-nn")
async def train_nn(data: TrainRequest):
    try:
        global feat_cols, label_cols, scaler_X, scaler_y, nn_model, history

        feat_cols = data.X
        label_cols = data.y
        settings = data.settings

        DF_mod = DF[[*feat_cols, *label_cols]]

        # Preprocess data
        imputer = SimpleImputer(strategy=settings["imputer"])
        DF_mod[feat_cols] = imputer.fit_transform(DF_mod[feat_cols])
        DF_mod.dropna(axis=0, inplace=True)

        scaler_X = MinMaxScaler()
        scaler_y = MinMaxScaler()

        X_scaled = scaler_X.fit_transform(DF_mod[feat_cols])
        y_scaled = scaler_y.fit_transform(DF_mod[label_cols].values.reshape(-1, 1))

        X_train, X_valid, y_train, y_valid = train_test_split(
            X_scaled, y_scaled, test_size=0.2, random_state=42
        )

        # Define and train the model
        nn_model = tf.keras.Sequential()
        nn_model.add(tf.keras.layers.Input(shape=[len(feat_cols)]))
        for layer in settings["nn"]["layers"]:
            nn_model.add(
                tf.keras.layers.Dense(layer["units"], activation=layer["activation"])
            )
        nn_model.add(tf.keras.layers.Dense(len(label_cols)))

        nn_model.compile(
            optimizer=tf.keras.optimizers.Adam(), loss="mean_squared_error"
        )

        history = nn_model.fit(
            X_train,
            y_train,
            epochs=int(settings["nn"]["epochs"]),
            batch_size=settings["nn"]["batchSize"],
        )

        # Test prediction for 3 bedrooms and 2 bathrooms
        new_data = np.array([[3, 2]])
        new_data_df = pd.DataFrame(new_data, columns=feat_cols)
        new_data_scaled = scaler_X.transform(new_data_df)
        predicted_price_scaled = nn_model.predict(new_data_scaled)
        predicted_price = scaler_y.inverse_transform(predicted_price_scaled)

        return {
            "loss": history.history["loss"][-1],
            # "predicted_price": f"Predicted price for a house with 3 bedrooms and 2 bathrooms: ${predicted_price[0][0]:,.2f}",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# #? *** PREDICT ***
class PredictRequest(BaseModel):
    mlModel: str
    inputs: dict
#
@app.post("/api/py/predict")
async def predict(data: PredictRequest):
    try:
        global nn_model, scaler_X, scaler_y, feat_cols

        print(data.mlModel)
        print(data.inputs)
        if data.mlModel == "decision_tree":
            features = pd.DataFrame([data.inputs], columns=feat_cols).astype(float)
            predicted_price = tree_model.predict(features)
            predicted_value = predicted_price.tolist()
        elif data.mlModel == "neural_network":
            features = pd.DataFrame([data.inputs], columns=feat_cols).astype(float)
            new_data_scaled = scaler_X.transform(features)
            predicted_price_scaled = nn_model.predict(new_data_scaled)
            predicted_price = scaler_y.inverse_transform(predicted_price_scaled)
            predicted_value = predicted_price.tolist()
        else:
            raise HTTPException(status_code=400, detail="Invalid model type")

        return {"prediction": predicted_value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 




# #  ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   ***   *** 
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5328)


# Run the app with `uvicorn`:
# uvicorn filename:app --reload


