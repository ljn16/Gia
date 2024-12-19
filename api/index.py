from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd

app = Flask(__name__)
CORS(app)


# @app.route("/api/python", methods=["GET"])
# def hello_world():
#     return "<h1>Hello, World!</h1>"

# # GET
# @app.route("/api/myGetReq", methods=["GET"])
# def get_example():
#     return jsonify({"message": "Get!"})
# # POST
# @app.route("/api/myPostReq", methods=["POST"])
# def post_example():
#     data = request.get_json()
#     return jsonify({"received POST from FE": data}), 201
# # PUT
# @app.route("/api/myPutReq", methods=["PUT"])
# def put_example():
#     data = request.get_json()
#     return jsonify({"received PUT from FE": data}), 201
# # PATCH
# @app.route("/api/myPatchReq", methods=["PATCH"])
# def patch_example():
#     return jsonify({"message": "Patch!"})
# # DELETE
# @app.route("/api/myDeleteReq", methods=["DELETE"])
# def delete_example():
#     return jsonify({"message": "Delete!"})

#***************************************************************
#***************************************************************
#? *** TRAIN ***
@app.route('/api/train', methods=['POST'])                                                                      
def train_model():
    global model, training_log 
    data = request.json # Get the JSON data from the request
    DB = data.get('DB') # Get the database from the JSON data
    X = data.get('X')   # Get the features from the JSON data
    y = data.get('y')   # Get the target from the JSON data
    advanced_options = data.get('advancedOptions') ##  ADVANCED OPTIONS:  {'imputer': 'mean', 'layers': [{'units': 16, 'activation': 'relu'}], 'loss': 'meanSquaredError', 'optimizer': 'adam', 'batchSize': 32, 'epochs': 10}

    inputs = data.get('inputs')
    outputs = data.get('outputs')


    # Reset the training log
    training_log = []

    # # Process inputs
    # inputs = []
    # for row in DB:
    #     input_row = [float(row[feature]) if not np.isnan(float(row[feature])) else 0 for feature in X]      # Convert to float, replace NaN with 0
    #     inputs.append(input_row) 
    
    
    # outputs = []
    # for row in DB:
    #     output_value = [float(row[y]) if not np.isnan(float(row[y])) else 0]                                # Convert to float, replace NaN with 0
    #     outputs.append(output_value)

    # # Convert to numpy arrays
    X_np = np.array(inputs)
    y_np = np.array(outputs)

    # Define the model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(len(X),)),
        tf.keras.layers.Dense(16, activation=advanced_options['layers'][0]['activation']),
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
            # print('PROGRESS: ', epoch, ' ', logs.get('loss'))

    # Train the model with the provided number of epochs
    model.fit(X_np, y_np, epochs=advanced_options['epochs'], callbacks=[TrainingCallback()])

    # Save the model to a file
    model.save('trained_model.keras')


    # Return training log
    return jsonify({'training_log': training_log})
    # return jsonify({
    #     'status': 'working',
    #     # 'DB': DB,
    #     # 'inputs': inputs,
    #     'outputs': outputs
    #     }), 201


# @app.route('/api/download', methods=['GET'])                                                                      
# def download_model():




# *****
# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5328)