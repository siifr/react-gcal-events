
# react-gcal-events
This is a simple react app that displays events from a specified Google Calendar with some style!

This project utilizes [Tailwindcss](https://tailwindcss.com/), which I would recommend checking out for a frontend framework.




## Config
Rename the file apiGoogleconfig.json.example, located in the /src/ directory

`
/src/apiGoogleconfig.json
`

```Javascript
{
    "clientId": "CALENDAR_ID", 
    "apiKey": "API_KEY",
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    "calendarURL": "https://calendar.google.com/calendar/embed?src={clientId}"
}
```

You will need your Google Calendar ID and an API Key for this app to work.


## Available Scripts

In the project directory, you can run:

---

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

*note: compiles tailwindcss with every initial start

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

*note: compiles tailwindcss with build
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
