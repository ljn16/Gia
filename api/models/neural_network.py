# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import numpy as np
# import tensorflow as tf
# import pandas as pd
# from sklearn.impute import SimpleImputer
from api.models import neural_network
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.impute import SimpleImputer; from sklearn.metrics import mean_squared_error, mean_absolute_error; from sklearn.model_selection import train_test_split; 
import joblib 
# import pickle
from api.models import decision_tree
# from tensorflow.keras.callbacks import EarlyStopping
# from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

app = Flask(__name__)
CORS(app)


# @app.route('/api/train-nn', methods=['POST'])  
def train_nn():  
    # TODO: add early stopping
    early_stopping = tf.keras.callbacks.EarlyStopping(
        min_delta=0.001, # minimium amount of change to count as an improvement
        patience=20, # how many epochs to wait before stopping
        restore_best_weights=True,
    )

    FE_data = request.json 

    global feat_cols, label_cols, scaler_X, scaler_y
    feat_cols = FE_data.get('X')                 
    label_cols = FE_data.get('y')  

    settings = FE_data.get('settings')                

    
    DF_mod = DF[[*feat_cols, *label_cols]]

    #* PREPROCESS
    imputer = SimpleImputer(strategy=FE_data.get('settings')['imputer'])
    DF_mod[feat_cols] = imputer.fit_transform(DF_mod[feat_cols]) 
    DF_mod.dropna(axis=0, inplace=True)

    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()

    X_scaled = scaler_X.fit_transform(DF_mod[feat_cols])                            # Scale the features
    y_scaled = scaler_y.fit_transform(DF_mod[label_cols].values.reshape(-1, 1))     # Scale the target

    X_train, X_valid, y_train, y_valid = train_test_split(X_scaled, y_scaled, test_size=0.2, random_state=42)


    #* TRAIN
    global nn_model
    # Define the model
    nn_model = tf.keras.Sequential([
        # tf.keras.layers.Input(shape=(len(feat_cols),)), 
        tf.keras.layers.Input(shape=[len(feat_cols)],), 
        # for layer in settings['nn']['layers']:
        #     nn_model.add(tf.keras.layers.Dense(layer['units'], activation=layer['activation']))
        # for layer in settings['nn']['layers']:
        tf.keras.layers.Dense(16, activation='relu'),
        # *[
        #     tf.keras.layers.Dense(layer['units'], activation=layer['activation']) 
        #     for layer in settings['nn']['layers']
        # ],

        # tf.keras.layers.Dense(16, activation=settings['nn']['layers'][0]['activation']),
        # tf.keras.layers.Dense(1)
        tf.keras.layers.Dense(len(label_cols))
    ])


    nn_model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss='mean_squared_error'
    )

    # Train the model and log the loss per epoch
    # class TrainingCallback(tf.keras.callbacks.Callback):
    #     def on_epoch_end(self, epoch, logs=None):
    #         training_log.append({
    #             'epoch': epoch,
    #             'loss': logs.get('loss')
    #         })

    # Train the model
    global history
    history = nn_model.fit(
        X_train, y_train,
        epochs=int(settings['nn']['epochs']), 
        # callbacks=[TrainingCallback()]
        # callbacks=[early_stopping],
        batch_size=(settings['nn']['batchSize'])
    )

    # Make a prediction for 3 bedrooms and 2 bathrooms
    new_data = np.array([[3, 2]])  # Input features
    new_data_df = pd.DataFrame(new_data, columns=feat_cols)  # Ensure the correct feature names

    new_data_scaled = scaler_X.transform(new_data_df)  # Scale the input data
    predicted_price_scaled = nn_model.predict(new_data_scaled)  # Predict scaled price
    predicted_price = scaler_y.inverse_transform(predicted_price_scaled)  # Reverse scaling

    return jsonify({
        'loss: ' : history.history['loss'][-1],
        'predicted_price': f"Predicted price for a house with 3 bedrooms and 2 bathrooms: ${predicted_price[0][0]:,.2f}"
    })

# @app.route('/api/train-nn', methods=['POST'])                                                                      
# def train_model():
#     global model, training_log, feat_cols, label_cols
#     data = request.json # Get the JSON data from the request
#     DB = data.get('DB') # Get the database from the JSON data
#     feat_cols = data.get('X')   # Get the features from the JSON data
#     label_cols = data.get('y')   # Get the label from the JSON data
#     advanced_options = data.get('settings') 

#     DB_data = pd.DataFrame(DB)

#     DB_train = DB_data.sample(frac=0.7, random_state=0)
#     DB_valid = DB_data.drop(DB_train.index)


#     # Scale to [0, 1]
#     # max_ = DB_train.max(axis=0)
#     # min_ = DB_train.min(axis=0)
#     # DB_train = (DB_train - min_) / (max_ - min_)
#     # DB_valid = (DB_valid - min_) / (max_ - min_)


#     print('feat_cols: ', feat_cols)
#     print('label_cols: ', label_cols)

#     # Split features and target
#     X_train = DB_train.drop(feat_cols, axis=1)
#     X_valid = DB_valid.drop(feat_cols, axis=1)
#     y_train = DB_train[feat_cols]
#     y_valid = DB_valid[feat_cols]


#     inputs = data.get('inputs')
#     outputs = data.get('outputs')

#     #TODO: imputer
#     # Impute missing values in inputs
#     imputer = SimpleImputer(strategy='mean')
#     # imputer = SimpleImputer(strategy=advanced_options['imputer'])
#     imputed_X_train = pd.DataFrame(imputer.fit_transform(X_train))
#     imputed_X_valid = pd.DataFrame(imputer.transform(X_valid))

#     # # Imputation removed column names; put them back
#     # imputed_X_train.columns = X_train.columns
#     # imputed_X_valid.columns = X_valid.columns

#     # Reset the training log
#     training_log = []

#     # # Convert to numpy arrays
#     X_np = np.array(inputs)
#     y_np = np.array(outputs)

#     # Define the model
#     model = tf.keras.Sequential([
#         tf.keras.layers.Input(shape=(len(feat_cols),)),
#         tf.keras.layers.Dense(16, activation=advanced_options['nn']['layers'][0]['activation']),
#         tf.keras.layers.Dense(1)
#     ])

#     model.compile(
#         optimizer=tf.keras.optimizers.Adam(),
#         loss='mean_squared_error'
#     )

#     # Train the model and log the loss per epoch
#     class TrainingCallback(tf.keras.callbacks.Callback):
#         def on_epoch_end(self, epoch, logs=None):
#             training_log.append({
#                 'epoch': epoch,
#                 'loss': logs.get('loss')
#             })

#     # Train the model with the provided number of epochs
#     model.fit(
#         X_np, y_np,
#         epochs=int(advanced_options['nn']['epochs']), 
#         callbacks=[TrainingCallback()]
#     )

#     # Save the model to a file
#     model.save('trained_model.keras')

#     # Return training log
#     return jsonify({'training_log': training_log})




# *****
if __name__ == '__main__':
    app.run(debug=True, port=5328)