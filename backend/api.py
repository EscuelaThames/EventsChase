import random
from flask import request, jsonify
from config import app, db
from werkzeug.security import generate_password_hash, check_password_hash
from models import Users, Credentials, Payment_Methods, Event, Ticket, Transaction

# CRUD operations for Users

# creating new user


@app.route("/create_user", methods=["POST"])
def create_user():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    address = request.json.get("address")
    phone_number = request.json.get("phoneNumber")

    # checking if any fields are empty
    if not first_name or not last_name or not email or not address or not phone_number:
        return (jsonify({"message": "You must include a first name, last name, email, address, and phone number"}), 400)

    new_user = Users(first_name=first_name, last_name=last_name,
                     email=email, address=address, phone_number=phone_number)

    # adding the user to the database
    try:
        db.session.add(new_user)
        db.session.flush()

        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"userId": new_user.user_id}), 201

# reading user information


@app.route("/get_user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    # querying database for user with id
    user = Users.query.get(user_id)

    # if user with id is not found
    if not user:
        return jsonify({"error": "User not found"}), 404

    # returning user
    return jsonify(user.to_json())

# updating user information


@app.route("/update_user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    # querying database for user with id
    user = Users.query.get(user_id)

    # if user is not found
    if not user:
        return jsonify({"error": "User not found"}), 404

    # examining the json request and updating any values that could change
    data = request.json
    user.first_name = data.get("firstName", user.first_name)
    user.last_name = data.get("lastName", user.last_name)
    user.email = data.get("email", user.email)
    user.address = data.get("address", user.address)
    user.phone_number = data.get("phoneNumber", user.phone_number)

    db.session.commit()

    return jsonify({"message": "User updated"}), 200

# deleting user information


@app.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    # querying database for user with id
    user = Users.query.get(user_id)

    # if user is not found
    if not user:
        return jsonify({"error": "User not found"}), 404

    # deleting user
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


# CRUD operations for Credentials

# helper validate credentials function
def validate_credentails(username, password):
    credentials = Credentials.query.filter_by(username=username).first()
    print("Fetched credentials:", credentials)

    # if credentials are found and are correct
    if credentials and check_password_hash(credentials.password_hash, password):
        return credentials
    else:
        # failure
        return None

# creating credentials for new users


@app.route("/create_credentials/<int:user_id>", methods=["POST"])
def create_credentials(user_id):
    # checking for user
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    username = request.json.get("username")
    password = request.json.get("password")

    # checking if any fields are empty
    if not username or not password:
        return (jsonify({"message": "You must include a username and password"}), 400,)

    # hashing password
    password_hash = generate_password_hash(password)

    credentials = Credentials(
        user_id=user_id, username=username, password_hash=password_hash)

    # attempting to add credentials to database
    try:
        db.session.add(credentials)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # success
    return jsonify({"message": "credentials created"}), 201

# reading credentials for login purposes


@app.route("/read_credentials", methods=["POST"])
def read_credentials():
    username = request.json.get("username")
    password = request.json.get("password")

    submitted_credentials = validate_credentails(username, password)

    if submitted_credentials:
        return jsonify({"userId": submitted_credentials.user_id}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

# updating username or password


@app.route("/update_credentials/<int:user_id>", methods=["PUT"])
def update_credentials(user_id):
    username = request.json.get("username")
    old_password = request.json.get("oldPassword")
    new_password = request.json.get("newPassword")

    # checking if any fields are empty
    if not username or not old_password or not new_password:
        return (jsonify({"message": "You must include a username, old password, and new password"}), 400)

    # validating credentails
    submitted_credentials = validate_credentails(username, old_password)

    # if credentials are wrong or do not match user

    if not submitted_credentials or submitted_credentials.user_id != user_id:
        return jsonify({"message": "Invalid old password"}), 401

    # correct credentials
    submitted_credentials.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Credentials updated"}), 200


# CRUD operations for Payment_Methods

# creating payment method for user
@app.route("/create_payment_method/<int:user_id>", methods=["POST"])
def create_payment_method(user_id):
    card_number = request.json.get("cardNumber")
    expiration_month = request.json.get("expirationMonth")
    expiration_year = request.json.get("expirationYear")
    cvv = request.json.get("cvv")
    billing_address = request.json.get("billingAddress")

    # checking if any fields are empty
    if not card_number or not expiration_month or not expiration_year or not cvv or not billing_address:
        return (jsonify({"message": "You must inlcude card number, expiration month, expiration year, cvv, and billing address"}), 400)

    payment_method = Payment_Methods(user_id=user_id, card_number=card_number, expiration_month=expiration_month,
                                     expiration_year=expiration_year, cvv=cvv, billing_address=billing_address)

    # adding payment method to database
    try:
        db.session.add(payment_method)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Payment method added"}), 201

# reading payment method details for user


@app.route("/get_payment_methods/<int:user_id>", methods=["GET"])
def get_payment_methods(user_id):
    payment_methods = Payment_Methods.query.filter_by(user_id=user_id).all()

    # returning payment methods in json format
    json_payment_methods = list(map(lambda x: x.to_json(), payment_methods))
    return jsonify({"paymentMethods": json_payment_methods}), 200

# updating the payment method details


@app.route("/update_payment_method/<int:payment_method_id>", methods=["PUT"])
def update_payment_method(payment_method_id):
    payment_method = Payment_Methods.query.get(payment_method_id)

    if not payment_method:
        return jsonify({"error": "Payment method not found"}), 404

     # examining the json request and updating any values that could change
    data = request.json
    payment_method.card_number = data.get(
        "cardNumber", payment_method.card_number)
    payment_method.expiration_month = data.get(
        "expirationMonth", payment_method.expiration_month)
    payment_method.expiration_year = data.get(
        "expirationYear", payment_method.expiration_year)
    payment_method.cvv = data.get("cvv", payment_method.cvv)
    payment_method.billing_address = data.get(
        "billingAddress", payment_method.billing_address)

    db.session.commit()

    return jsonify({"message": "Payment method updated", "payment_method": payment_method.to_json()}), 200

# deleting payment method from account


@app.route("/delete_payment_method/<int:payment_method_id>", methods=["DELETE"])
def delete_payment_method(payment_method_id):
    payment_method = Payment_Methods.query.get(payment_method_id)

    if not payment_method:
        return jsonify({"error": "Payment method not found"}), 404

    # deleting payment method
    db.session.delete(payment_method)
    db.session.commit()

    return jsonify({"message": "Payment method deleted"}), 200


# CRUD operations for Event (would be for admins)

# creating a new event
@app.route("/create_event", methods=["POST"])
def create_event():
    event_name = request.json.get("eventName")
    event_date = request.json.get("eventDate")
    event_type = request.json.get("eventType")
    capacity = request.json.get("capacity")

    if not event_name or not event_date or not event_type or not capacity:
        return (jsonify({"message": "You must include event name, event date, event type, and capacity"}), 400)

    new_event = Event(event_name=event_name, event_date=event_date,
                      event_type=event_type, capacity=capacity)

    # adding the event to the database
    try:
        db.session.add(new_event)
        db.session.flush()

        # creating tickets for the event based off the capacity of the event
        for i in range(1, capacity + 1):
            ticket = Ticket(event_id=new_event.event_id,
                            seat_number=str(i), price=50, status='Avalible', name=new_event.event_name)
            db.session.add(ticket)

        db.session.commit()
        return jsonify({"message": "Event and tickets created"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400

# reading all events


@app.route('/events', methods=['GET'])
def list_events():
    events = Event.query.all()
    json_events = list(map(lambda x: x.to_json(), events))
    return jsonify({"events": json_events}), 200

# reading event details


@app.route("/get_event/<int:event_id>", methods=["GET"])
def get_event(event_id):
    # querying database for event with id
    event = Event.query.get(event_id)

    # if user with id is not found
    if not event:
        return jsonify({"error": "Event not found"}), 404

    # returning event
    return jsonify(event.to_json())

# updating event information


@app.route("/update_event/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    # querying database for event with id
    event = Event.query.get(event_id)

    # if user is not found
    if not event:
        return jsonify({"error": "Event not found"}), 404

    # examining the json request and updating any values that could change
    data = request.json
    event.event_name = data.get("eventName", event.event_name)
    event.event_date = data.get("eventDate", event.event_date)
    event.event_type = data.get("eventType", event.event_type)
    event.capacity = data.get("capacity", event.capacity)

    db.session.commit()

    return jsonify({"message": "Event updated", "updated event": event.to_json()}), 200

# deleting an event


@app.route("/delete_event/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    # querying database for user with id
    event = Event.query.get(event_id)

    # if event is not found
    if not event:
        return jsonify({"error": "Event not found"}), 404

    # deleting event
    db.session.delete(event)
    db.session.commit()

    return jsonify({"message": "Event deleted"}), 200

# CRUD operations for ticket

# read tickets for event


@app.route('/list_tickets/<int:event_id>', methods=["GET"])
def list_event_tickets(event_id):
    tickets = Ticket.query.filter_by(event_id=event_id).all()
    json_tickets = list(map(lambda x: x.to_json(), tickets))
    return jsonify({"tickets": json_tickets}), 200

# read all the tickets the user has


@app.route('/tickets/<int:user_id>', methods=["GET"])
def list_user_tickets(user_id):
    tickets = Ticket.query.filter_by(user_id=user_id).all()
    json_tickets = list(map(lambda x: x.to_json(), tickets))
    return jsonify({"tickets": json_tickets}), 200

# assign a ticket to a user and create transaction


@app.route('/assign_ticket/<int:ticket_id>', methods=['PUT'])
def assign_ticket(ticket_id):  # TODO add mutliple ticket functionality
    ticket = Ticket.query.get(ticket_id)
    user_id = request.json.get("userId")
    payment_method_id = request.json.get("paymentMethodId")

    # checking for existence
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    if not user_id:
        return jsonify({"error": "User not found"}), 404

    # assigning userID
    ticket.user_id = user_id
    ticket.status = 'Sold'

    # generating transaction entry
    new_transaction = Transaction(ticket_id=ticket_id, user_id=user_id,
                                  price=ticket.price, payment_method_id=payment_method_id)

    db.session.add(new_transaction)

    try:
        db.session.commit()
        return jsonify({"message": "Ticket assigned and transaction recorded successfully", "price": ticket.price}), 200
    except Exception as e:
        db.session.rollback()
        print(str(e))
        return jsonify({"error": str(e)}), 400

# unassign a ticket (remove from account)


@app.route("/remove_ticket/<int:ticket_id>", methods=["PUT"])
def remove_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    user_id = request.json.get("userId")
    payment_method_id = request.json.get("paymentMethodId")

    # checking for existence
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    if not user_id:
        return jsonify({"error": "User not found"}), 404

    # removing the userID
    ticket.user_id = None

    # resetting status
    ticket.status = 'Avalible'

    # indicating refund
    price = -ticket.price

    new_transaction = Transaction(
        ticket_id=ticket_id, user_id=user_id, price=price, payment_method_id=payment_method_id)
    db.session.add(new_transaction)

    try:
        db.session.commit()
        return jsonify({"message": "Ticket has been removed and you have been refunded to specified payment method", "price": price}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# CRUD operations for transactions

# read transaction history for a user


@app.route('/get_transactions/<int:user_id>', methods=["GET"])
def list_transactions(user_id):
    transactions = Transaction.query.filter_by(user_id=user_id).all()

    # returning payment methods in json format
    json_transactions = list(map(lambda x: x.to_json(), transactions))
    return jsonify({"transactions": json_transactions}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=8000)
