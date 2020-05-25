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
- ~~Create er diagram (database diagram)~~
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


## UI:
* Have a search bar in the nav??!
* Home Page:  
    * clicking carousel should take you to the indv show page
* MODAL  
    * fix the cross button
        * make the cross button animate? like zoom in or fade in or what
    * make the modal close when clicking ESC key
    * ~~fix inline issues~~
    * add fade out when the modal is closed
    * ~~shade out background when clicked~~
    * should it have rounder edges instead of sharp?
    * make the remember me actually rememebr me
* Do we want a footer?
    * Can add social media links
    * Add contact us links here
* Fix the double scroll thing? it real uglyyy
* NAV BAR
    * Make it snazzy - LIKE JAMIE OLIVERS WEBSITE :)
    * Make the logo link to the home page
    * Make logo an image
    * Create dropdowns for the tabs
* header is diff colour from body -> do we want to change this
* Shows Page
    * Maybe search just on the shows page
    * Filter by show/date
    * would be cool for it to display alphabetically
* Box office page 
    * available to only admins and producers
    * displays the shows happening on that night
    * this is where you collect tickets and 