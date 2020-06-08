# COMS32500 Web Technologies
## Ticketing website

**Usage**
- To start the server, run `npm start`. It will create and initialise the database automatically if it doesn't exist.
- Go to *localhost:8080* for HTTP or *localhost:8443* for HTTPS. 
- To force a database reinitialisation, you can run `npm run-script init_db`.

**Examples**
- There is an example user John Smith, who has made a couple of bookings already. You can log in as him with email `jsmith@gmail.com`, password `JohnPass444`.
- You are also able to register new users. Upon registering, a verification email will be sent, although verification isn't currently required for any site functions. As this is a development version, emails aren't actually sent to the target address, but are caught by the Ethereal service. You can view emails sent by the server by logging in at [ethereal](https://ethereal.email) with these credentials:
    - Email: `wilfred.goyette@ethereal.email`
    - Password: `Hj1T9CeqnTBQ1zm8dt`

