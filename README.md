# sf6 rank watchrrr

A set of tools to provide Street Fighter 6 streamers with an overlay to watch their rank.

- [Usage](#usage)
  - [Server](#server)
  - [Client](#client)
  - [User script](#user-script)
- [Credits](#credits)

## Usage

### Server

Run the server using the following command:

    npm start

This will run the server on port 55743.

### Client

You can configure the following:

| Key  | Type   | Description                                                                                                                     |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| host | string | URI-encoded IP address of the [server](#server) to connect to including port, e.g. `0.0.0.87:55743` would be `0.0.0.87%3A55743` |

You can use the hosted version of the client, or you can run the client locally by serving the `./client` directory by running the following command:

    npm run client

You may have to set your browser to allow unsafe content by loading the page. To do this in Chrome, go into the Site settings, and set Insecure content to Allow.

### User script

You can configure the following:

| Key          | Type    | Description                                                                                                                       |
| ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| host         | string  | URI-encoded IP address of the [server](#server) to connect to including port, e.g. `10.0.0.87:55743` would be `10.0.0.87%3A55743` |
| refresh_time | integer | Refresh time in seconds. Minimum interval is 60.                                                                                  |

## Credits

- Images property of Capcom Co., Ltd.
- League Points data from [this spreadsheet](https://docs.google.com/spreadsheets/d/124KmfZzbTysS-qrZG5L-n2OXaepxdeHS4ipk3_043Rw/edit#gid=884923803)
