from config import db
from sqlalchemy.dialects.mysql import ENUM

class Users(db.Model):
    __tablename__ = 'Users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    address = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(10), nullable=False)
    
   # serializing model for front end
    def to_json(self):
        return {
            'userId': self.user_id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'address': self.address,
            'phoneNumber': self.phone_number
        }
    
class Credentials(db.Model):
    __tablename__ = 'Credentials'
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id', ondelete='CASCADE'), primary_key=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # serializing model for front end
    def to_json(self):
        return {
            'userId': self.user_id,
            'username': self.username,
            'passwordHash': self.password_hash
        }

class Payment_Methods(db.Model):
    __tablename__ = 'Payment_Methods'
    payment_method_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    card_number = db.Column(db.String(16), nullable=False)
    expiration_month = db.Column(db.Integer, nullable=False)
    expiration_year = db.Column(db.Integer, nullable=False)
    cvv = db.Column(db.Integer, nullable=False)
    billing_address = db.Column(db.String(255), nullable=False)
    
    # checking the constraints 
    __table_args__ = (
        db.CheckConstraint('expiration_month >= 1 AND expiration_month <= 12', name='check_expiration_month'),
        db.CheckConstraint('cvv >= 100 AND cvv <= 999', name='check_cvv'),
    )
    
    # serializing model for front end
    def to_json(self):
        return {
            'paymentMethodId': self.payment_method_id,
            'userId': self.user_id,
            # Mask the card number, only show the last 4 digits
            'cardNumber': '**** **** **** ' + self.card_number[-4:],
            'expirationMonth': self.expiration_month,
            'expirtationYear': self.expiration_year,
            'billingAddress': self.billing_address
        }
    
class Event(db.Model):
    __tablename__ = 'Event'
    event_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_name = db.Column(db.String(255), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    event_type = db.Column(ENUM('Concert', 'Game', 'Conference', 'Convention', 'Show', 'Other'), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, default=10000)

    # checking the constraints 
    __table_args__ = (
        db.CheckConstraint('capacity <= 20000', name='check_capacity'),
    )
    
    # serializing model for front end
    def to_json(self):
        return {
            'eventId': self.event_id,
            'eventName': self.event_name,
            'eventDate': self.event_date,
            'eventType': self.event_type,
            'capacity': self.capacity
        }
    
class Ticket(db.Model):
    __tablename__ = 'Ticket'
    ticket_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id', ondelete='CASCADE'))
    event_id = db.Column(db.Integer, db.ForeignKey('Event.event_id'), nullable=False)
    seat_number = db.Column(db.String(5))
    price = db.Column(db.Integer, nullable=False)
    
    # serializing model for front end
    def to_json(self):
        return {
            'ticketId': self.ticket_id,
            'userId': self.user_id,
            'eventId': self.event_id,
            'seatNumber': self.seat_number,
            'price': self.price
        }
    
class Transaction(db.Model):
    __tablename__ = 'Transaction'
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ticket_id = db.Column(db.Integer, db.ForeignKey('Ticket.ticket_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('Payment_Methods.payment_method_id'), nullable=False)
    payment_date = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    price = db.Column(db.Integer, nullable=False)
    
    # serializing model for front end
    def to_json(self):
        return {
            'transaction_id': self.transaction_id,
            'ticket_id': self.ticket_id,
            'user_id': self.user_id,
            'paymentMethodId': self.payment_method_id,
            'paymentDate': self.payment_date,
            'price': self.price
        }