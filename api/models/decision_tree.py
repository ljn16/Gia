from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.metrics import mean_absolute_error
from sklearn.tree import DecisionTreeRegressor

app = Flask(__name__)
CORS(app)
# *****





# *****
if __name__ == '__main__':
    app.run(debug=True, port=5328)