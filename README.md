# webtech

### marking scheme:
https://csijh.gitlab.io/COMSM0104/cw/final/

### NOTES:
_im gonna add notes here to come back to so we don't forget_  
* **Using Express**: In the server lab Ian points out that there can be a huge security vulnerability while using Express (beign able to access the admin page thru browser). So we just need to be careful.

* All validators here:  
https://github.com/validatorjs/validator.js#validators

* I think ian talked about var vs consts somewhere (cant find it so have ignored thinking about that for now)


**what is website_form**  
- So in folder *website_form* is a website(?) of a form asking for name & email that I made following a tutorial basically to learn things.  
- The gist is it's a node-express server, with pug templating engine, and bootstrap for frontend css.  
- To run it cd into the directory and then: ```node start.js```. It should show up on ```localhost:3000```.  

**what is our_site**  
This is our actual site. :P  
- ~~Has ians server with pug templating, and bootstrap css.~~
- To start our server is also the same, run ```npm start```, and go to *localhost:8080*. It will create and initialise the database automatically if it doens't exist.
- To force a database reinitialisation, run ```npm run-script init_db```.

