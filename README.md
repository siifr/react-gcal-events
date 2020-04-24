
# react-gcal-events
This is a simple react app that displays events from a specified Google Calendar with some style!



## Features
1. Event Card:

Currently, this app displays a maximum of 5 events on the page.

This setting can be changed in
`
src/Components/EventsHandler.js:17
`
under the defaultEvents state declaration
```Javascript
 this.state = {
      events: [],
      loading: true,
      defaultEvents: "5", //modify this number here to display more results
      eventsToday: ''
    };
  }
```
- Attend Event:
  - An "Attend Event" button will include the **Location Link** from the Google Calendar event
  
- Tags: 
  - "Free" & "RSVP" will show up as badges if found in the description text of an event.

- Event date / time handling:

  - Each event will either display the date it happens (including the start and end time of the event) or if the event is today.

  - There is also a feature that shows how long until the event (from clients local time) and how much time remaining (if event is currently taking place)
> *note: This app utilizes the date-fns library for all of its time/date handling. Please refer to their documentation [here](https://date-fns.org/docs/Getting-Started) for more information*


## Setup & Installation
Once you've cloned the repo, run 

`
npm install
`

to grab all of the package dependencies.


Rename the file apiGoogleconfig.json.example, located in the /src/ directory to:

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
Once acquired, populate the CALENDAR_ID and API_KEY respectively in the apiGoogleconfig.json file.
> *Please refer to the Google Calendar API documentation [here](https://developers.google.com/calendar/v3/reference/events/list) for more information*

Save that file and run the following command to build the project:

`
npm run build
`

That will compile the code into the build folder.
This process might take a few moments as it compiles tailwind into styles/App.css.


For hosting, just point your domain name to the build folder

`
path_to_public_html/react-gcal-events/build
`

restart your webserver ie:

`
systemctl restart nginx
`
or
`
systemctl restart apache
`

and your app should be live!


## Notes
> This repo includes the color scheme and certain features made for the currently developed project.

> This project utilizes [Tailwindcss](https://tailwindcss.com/), which I would recommend checking out for a frontend framework.

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
