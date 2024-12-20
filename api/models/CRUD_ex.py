from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Link
@app.route("/api/python", methods=["GET"])
def hello_world():
    return "<h1>Hello, World!</h1>"
# GET
@app.route("/api/myGetReq", methods=["GET"])
def get_example():
    return jsonify({"message": "Get!"})
# POST
@app.route("/api/myPostReq", methods=["POST"])
def post_example():
    data = request.get_json()
    return jsonify({"received POST from FE": data}), 201
# PUT
@app.route("/api/myPutReq", methods=["PUT"])
def put_example():
    data = request.get_json()
    return jsonify({"received PUT from FE": data}), 201
# PATCH
@app.route("/api/myPatchReq", methods=["PATCH"])
def patch_example():
    return jsonify({"message": "Patch!"})
# DELETE
@app.route("/api/myDeleteReq", methods=["DELETE"])
def delete_example():
    return jsonify({"message": "Delete!"})




# *****
if __name__ == '__main__':
    app.run(debug=True, port=5328)