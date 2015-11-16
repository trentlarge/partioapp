# /both/collections directory

Collection declaration and insert/update/remove functions into this directory


### Why this exists both in server and client scope?

- **Client** client can hide/show UI controls based on access rights for user.

- **Server** is using these functions for allow/deny rules

So, we have centralized rules - when rule is changed here, it affects both client and server.


### Is it secure?

It's completelly secure to share this in "both" scope. If client changes any of these functions that will affect only client
For example, if remove operation is denied to user, and (bad, ugly) user changes this function in browser console, user's "Delete" button will be shown, but clicking on it will not have any effect because server side code is intact - server will deny delete operation.