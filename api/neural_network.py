# import numpy as np
# import tensorflow as tf
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__) 
# CORS(app) 

# # Global state to hold the model after training
# model = None
# training_log = []

# @app.route('/api/train', methods=['POST'])                                                                      #? *** TRAIN [post] ***
# def train_model():
#     # global model, training_log  
#     # data = request.json # Get the JSON data from the request
#     # DB = data.get('DB') # Get the database from the JSON data
#     # X = data.get('X')   # Get the features from the JSON data
#     # y = data.get('y')   # Get the target from the JSON data
#     # advanced_options = data.get('advancedOptions')

#     # # Reset the training log
#     # training_log = []

#     # # Process inputs
#     # inputs = []
#     # for row in DB:
#     #     input_row = [float(row[feature]) if not np.isnan(float(row[feature])) else 0 for feature in X]      # Convert to float, replace NaN with 0
#     #     inputs.append(input_row) 
    
#     # outputs = []
#     # for row in DB:
#     #     output_value = [float(row[y]) if not np.isnan(float(row[y])) else 0]                                # Convert to float, replace NaN with 0
#     #     outputs.append(output_value)

#     # # Convert to numpy arrays
#     # X_np = np.array(inputs)
#     # y_np = np.array(outputs)

#     # # Define the model
#     # model = tf.keras.Sequential([
#     #     tf.keras.layers.Dense(16, activation=advanced_options['layers']['activation'], input_shape=(len(X),)),
#     #     tf.keras.layers.Dense(1)
#     # ])

#     # model.compile(
#     #     optimizer=tf.keras.optimizers.Adam(),
#     #     loss=advanced_options['loss']
#     # )

#     # # Train the model and log the loss per epoch
#     # class TrainingCallback(tf.keras.callbacks.Callback):
#     #     def on_epoch_end(self, epoch, logs=None):
#     #         training_log.append({
#     #             'epoch': epoch,
#     #             'loss': logs.get('loss')
#     #         })

#     # # Train the model with the provided number of epochs
#     # model.fit(X_np, y_np, epochs=advanced_options['epochs'], callbacks=[TrainingCallback()])

#     # # Return training log
#     # return jsonify({'training_log': training_log})
#     return jsonify({'status': 'it works'})


# @app.route('/api/predict', methods=['POST'])                                                              #? *** PREDICT [post] ***
# def predict():
#     global model
#     if model is None:
#         return jsonify({'error': 'Model is not trained yet!'}), 400

#     data = request.json
#     input_data = np.array(data.get('input')).reshape(1, -1)  # Reshape for single prediction
#     prediction = model.predict(input_data)
#     return jsonify({'prediction': prediction[0][0]})

# @app.route('/api/download_model', methods=['GET'])                                                        #? *** DOWNLOAD  [get] ***
# def download_model():
#     global model
#     if model is None:
#         return jsonify({'error': 'Model is not trained yet!'}), 400

#     # Save the model to a file
#     model.save('trained_model.h5')
#     return jsonify({'message': 'Model saved successfully!'})

# if __name__ == '__main__':
#     app.run(debug=True, port=5328)