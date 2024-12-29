from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.impute import SimpleImputer

app = Flask(__name__)
CORS(app)

@app.route('/api/train-nn', methods=['POST'])                                                                      
def train_model():
    global model, training_log
    data = request.json # Get the JSON data from the request
    DB = data.get('DB') # Get the database from the JSON data
    feat_cols = data.get('X')   # Get the features from the JSON data
    label_cols = data.get('y')   # Get the label from the JSON data
    advanced_options = data.get('advancedOptions') ### {'imputer': 'mean', 'layers': [{'units': 16, 'activation': 'relu'}], 'loss': 'meanSquaredError', 'optimizer': 'adam', 'batchSize': 32, 'epochs': 10}
    

    # Convert DB (JSON) into a pandas DataFrame
    DB_data = pd.DataFrame(DB)#.select_dtypes(exclude=['object'])
    # print('DB_data: ', DB_data)

    DB_train = DB_data.sample(frac=0.7, random_state=0)
    DB_valid = DB_data.drop(DB_train.index)


    # Scale to [0, 1]
    # max_ = DB_train.max(axis=0)
    # min_ = DB_train.min(axis=0)
    # DB_train = (DB_train - min_) / (max_ - min_)
    # DB_valid = (DB_valid - min_) / (max_ - min_)


    print('feat_cols: ', feat_cols)
    print('label_cols: ', label_cols)

    # Split features and target
    X_train = DB_train.drop(feat_cols, axis=1)
    X_valid = DB_valid.drop(feat_cols, axis=1)
    y_train = DB_train[feat_cols]
    y_valid = DB_valid[feat_cols]


    inputs = data.get('inputs')
    outputs = data.get('outputs')

    #TODO: imputer
    # Impute missing values in inputs
    imputer = SimpleImputer(strategy='mean')
    # imputer = SimpleImputer(strategy=advanced_options['imputer'])
    imputed_X_train = pd.DataFrame(imputer.fit_transform(X_train))
    imputed_X_valid = pd.DataFrame(imputer.transform(X_valid))

    # # Imputation removed column names; put them back
    # imputed_X_train.columns = X_train.columns
    # imputed_X_valid.columns = X_valid.columns

    # Reset the training log
    training_log = []

    # # Convert to numpy arrays
    X_np = np.array(inputs)
    y_np = np.array(outputs)

    # Define the model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(len(feat_cols),)),
        tf.keras.layers.Dense(16, activation=advanced_options['nn']['layers'][0]['activation']),
        tf.keras.layers.Dense(1)
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss='mean_squared_error'
    )

    # Train the model and log the loss per epoch
    class TrainingCallback(tf.keras.callbacks.Callback):
        def on_epoch_end(self, epoch, logs=None):
            training_log.append({
                'epoch': epoch,
                'loss': logs.get('loss')
            })

    # Train the model with the provided number of epochs
    model.fit(
        X_np, y_np,
        epochs=int(advanced_options['nn']['epochs']), 
        callbacks=[TrainingCallback()]
    )

    # Save the model to a file
    model.save('trained_model.keras')

    # Return training log
    return jsonify({'training_log': training_log})




# *****
if __name__ == '__main__':
    app.run(debug=True, port=5328)