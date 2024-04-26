from flask import request, jsonify
from config import app, db
from models import Users

## CRUD operations for Users

# creating new user

# reading user information
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    # querying database for user with id
    user = Users.query.get(user_id)
    
    # converting to json if found
    if user:
        return jsonify(user.to_json())
    
    # if not found
    return jsonify({"error": "User not found"}), 404

# updating user information

# deleting user information


## CRUD operations for Credentials

# creating credentials for new users

# reading credentials for login purposes

# updating username or password

# deleting credentials


## CRUD operations for Payment_Methods

# creating payment method for user

# reading payment method details for user

# updating the payment method details

# deleting payment method from account


## CRUD operations for Event (would be for admins)

# creating a new event

# reading event details

# updating event information

# deleting an event


## CRUD operations for ticket

# create a ticket for an event (admin)

# read tickets for customer

# update the details of a ticket (admin)

# delete a ticket (remove from account)


## CRUD operations for transactions

# create a transaction when ticket is purchased

# read transaction history

# update transaction information (admin)

# delete (upon account deletion?)



@app.route('/users', methods=['GET'])
def list_users():
    users = Users.query.all()
    users_list = [{"first_name": user.first_name, "last_name": user.last_name, "email": user.email, "phone_number": user.phone_number} for user in users]
    return jsonify(users_list)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True,port=8000)