# Create an API using node js, express js, and MongoDB with the following structure ---
# Routes:
/posts
## GET: to get posts (should be only available for logged-in users) (pass token via Authorization header.)
## POST: to create posts
## DELETE: to delete posts (should be only available for creators of post)
## PUT: to update posts (should be only available for creators of post)
# users
## GET: to get users
# Schema --->
# posts 
 ## { createdBy: ObjectId(userId), createdAt, updatedAt, message, comments: [{ sentBy:
## ObjectId(userId), sentAt, liked: [ObjectId(userId)] }] }
# users 
 ## {name, email (unique), mobile, password(hashed) }
# When you get all posts you should also get user details in place of createdBy, comments: [{ sentBy }]
# and liked fields.
Host your API on a free server and create a good postman collection for it. Then submit a response as:
Github link, Heroku link, postman collection link.
For authentication use only JWT tokens with Refresh Token System and Use Cache Like Redis, M
Cache. Recommended Redis
## you Have to Store Refresh Token in Cache Memory and Host it to any Server.
Keep Express App and Server Separate.