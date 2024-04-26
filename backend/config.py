from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://root:ubuntuubuntu@localhost/chaseEvents'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# making an instance of the database
db = SQLAlchemy(app)