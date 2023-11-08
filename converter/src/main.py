import os
from dotenv import load_dotenv
from flask import Flask, request

# Get environment variables
load_dotenv(override=True)
PORT = os.getenv('PORT')
RUN_ENV = os.environ.get('RUN_ENV')

conversionTable = {
  'CAD': 0.72,
}

# Set up Flask app
app = Flask(__name__)

@app.route("/metadata", methods = ['GET'])
def metadata():
  return "[converter]: Running in " + RUN_ENV + " environment!"

@app.route("/convert", methods = ['POST'])
def convert():
  data = request.get_json()
  if data['currency'] not in conversionTable.keys():
    return "Currency not supported!", 400
  convertedAmount = conversionTable[data['currency']] * data['amount']
  print("[converter]: " + str(data['amount']) + data['currency'] + " converted to " + str(convertedAmount) + " USD")
  return {
    "convertedAmount": convertedAmount
  }

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=PORT)       
