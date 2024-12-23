from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.impute import SimpleImputer

from models import decision_tree, neural_network, random_forest


app = Flask(__name__)
CORS(app)

#? *** TRAIN ***
@app.route('/api/train-nn', methods=['POST'])  
def train_model():
    return neural_network.train_model();                                                                    








# *****
# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5328)