# webtech

### marking scheme:
https://csijh.gitlab.io/COMSM0104/cw/final/

### NOTES:
_im gonna add notes here to come back to so we don't forget_  
* **Using Express**: In the server lab Ian points out that there can be a huge security vulnerability while using Express (beign able to access the admin page thru browser). So we just need to be careful.

* All validators here:  
https://github.com/validatorjs/validator.js#validators

* I think ian talked about var vs consts somewhere (cant find it so have ignored thinking about that for now)

### THinsg ive done
(_things ive done cos it may look like a mess:_  ___(because it is a mess)___)  

**what is website_form**  
- So in folder *website_form* is a website(?) of a form asking for name & email that I made following a tutorial basically to learn things.  
- The gist is it's a node-express server, with pug templating engine, and bootstrap for frontend css.  
- To run it cd into the directory and then: ```node start.js```. It should show up on ```localhost:3000```.  

**what is our_site**  
This is our actual site. :P  
- ~~Has ians server with pug templating, and bootstrap css.~~
- To start our server is also the same, run ```node start.js```, and go to *localhost:8080*.   
or do ```npm start``` for it to update live changes.
- In the database folder, there is a create script that can be run with sqlite3 command line tool to initialise the database like so: ```sqlite3 -cmd ".read create.sql"``` (could make a JS thing to do this as well if we want). There is a database.js module in the folder that the main server will use to interact with the database (all it does atm is open it).
- Also in the database folder, there is the ```init_db.js``` script, which can be run with ```node``` to add some default test entries to the database.

