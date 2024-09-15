# User Scripts

Various user scripts have been added throughout the lifetime of this project.

- [✅ sf6-rank-watchrrr.user.js (if you want to run a local server)](#-sf6-rank-watchrrruserjs-if-you-want-to-run-a-local-server)
- [✅ sf6-rank-watchrrr.appwrite.user.js (if you don't want to run a local server and you're ok with setting up a cloud database project on AppWrite)](#-sf6-rank-watchrrrappwriteuserjs-if-you-dont-want-to-run-a-local-server-and-youre-ok-with-setting-up-a-cloud-database-project-on-appwrite)
- [☣️ sf6-rank-watchrrr.kv-server.user.js (internal only)](#️-sf6-rank-watchrrrkv-serveruserjs-internal-only)

## ✅ sf6-rank-watchrrr.user.js (if you want to run a local server)

> TLDR: Run locally, less setup

This is the original user script and requires you to run the Node.js app locally. If you don't want to do this, it's recommended to look at the AppWrite option.

Once it's installed, login to the Buckler site and then visit this API URL: `https://www.streetfighter.com/6/buckler/api/en/card/YOUR_USER_ID` where `YOUR_USER_ID` is obviously your user ID. You can get this number from the address bar when visiting your own profile on Buckler. This is the URL for the current highest ranking Manon: `https://www.streetfighter.com/6/buckler/api/en/card/3708958378` where `3708958378` is this player's user ID.

You can configure the following **in the URL**:

| Key          | Type    | Description                                                                                                                       |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| host         | string  | URI-encoded IP address of the [server](#server) to connect to including port, e.g. `10.0.0.87:55743` would be `10.0.0.87%3A55743` |
| refresh_time | integer | Refresh time in seconds. Minimum interval is 60.                                                                                  |

## ✅ sf6-rank-watchrrr.appwrite.user.js (if you don't want to run a local server and you're ok with setting up a cloud database project on AppWrite)

> TLDR: Don't need to run anything but you need to set up a database in AppWrite

1. Set up a project on [AppWrite.io](https://appwrite.io). Copy the project ID and save it for later.
2. Create a database in your project. Name it `sf6-rank-watchrrr`. Copy the database ID and save it for later.
3. Create a collection. Name it `ranks`. Copy the collection ID and save it for later.

You can configure the following **in localStorage**:

| Key                    | Type    | Description                                                                   |
| ---------------------- | ------- | ----------------------------------------------------------------------------- |
| refresh_time           | integer | Refresh time in seconds. Should be at least 60. If omitted, uses default 120. |
| appwrite_project_id    | string  | Your AppWrite project ID                                                      |
| appwrite_database_id   | string  | Your project's database ID                                                    |
| appwrite_collection_id | string  | Your database's collection ID                                                 |

To set these values, run the following script on the API endpoint page, replacing your values accordingly:

```js
const projectId = "<MY_PROJECT_ID>";
const databaseId = "<MY_PROJECT_DATABASE_ID>";
const colletionId = "<MY_PROJECT_DATABASE_COLLECTION_ID>";

localStorage.setItem("refresh_time", 120);
localStorage.setItem("appwrite_project_id", projectId);
localStorage.setItem("appwrite_database_id", databaseId);
localStorage.setItem("appwrite_collection_id", collectionId);
```

## ☣️ sf6-rank-watchrrr.kv-server.user.js (internal only)

This is intended for internal use only so I don't forget. The dependency is not yet publicly available so don't try to use it.

You can configure the following **in localStorage**:

| Key       | Type   | Description             |
| --------- | ------ | ----------------------- |
| kv-server | string | **kv-server** hostname. |
| kv-token  | string | **kv-server** token.    |
