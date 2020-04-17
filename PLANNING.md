# WEBSTIE PLANNING

## **List of frontend features that we want**

### We will need pages for nonuser, user and admin 
1. Homepage 
    * User account creation & log in 
3. Box office page to collect tickets
4. Purchasing a ticket for a performance
5. Create productions/performances?
6. If we do the above then: reviewing and approving production requests


## **Tasks to do**
- Create user flow diagram ?? naaaaaah do we need this is effort
- Create er diagram (database diagram)
- Make/find a comprehensive list of things uob does bad to show that we've fixed it


## Database ideas
- what are we doing for tickets/bookings
- users are of different types: normal, admin, producer 
    (do we want to include this, yes will help with filling in pages)

1. User table
    * UserID
    * Name
    * And stuff
2. Productions table -> stores info about a production
    * ID 
    * Name
    * Producer
    * Director
    * isReveiwed
    * And stuff
3. Shows table -> stores info about each show in each production
    * ID = ProductionID_something? -> this might be a bad idea but lol
    * ProductionID
    * Date
    * Time
4. ProductionTickets Table -> stores ticket prices
    * ID
    * ProductionID
    * Member stuff
    * Price
5. Booking -> stores info about ticket booking and selling shiz
    * ID
    * ProductionID
    * ShowID
    * TicketType = ProductionTicketID
    * hasCollected