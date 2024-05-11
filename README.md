Notes about this program

I used sqlalchemy a library that has a Object relational model (ORM)
I can interact with tables like objects in OOP. Some ORM's come with methods that cans horten long queries
It save a lot of time as ajustments to the database can be done withing VScode

In models.py I mirrored the structure of the tables I made in mysqlworkbench
each model has a funciton that seralizes itself to json so that data can be easliy sent to the web or apis

i had to make a good amount of adjustments to the er diagram as i was working on this project I noticed a lot simple things like ticket status, event name on the ticket would be very helpful

an attribute that I learned about that became very helpful was on delete cascade and set null
when I delete a foreign key on a table, the on delete attribute can cause other tables to delete themselves or set values to null

ticket CRUD is connected to events
