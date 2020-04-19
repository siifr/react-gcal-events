
import React, { Component } from 'react';
import { format, parseISO, formatDistanceToNow, formatDistance, isToday } from 'date-fns';
import { MdLink, MdDateRange, MdSchedule, MdSubject } from "react-icons/md";

const curTime = new Date();
const apiConf = require('../apiGoogleconfig.json');

export default class EventsHandler extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loading: true,
      defaultEvents: "5",
      eventsToday: ''
    };
  }

  async componentDidMount() {
    var maxResults = this.state.defaultEvents;
    (!this.state.eventsToday) ? maxResults = this.state.defaultEvents : maxResults = this.state.eventsToday
    const url = `https://www.googleapis.com/calendar/v3/calendars/${apiConf.clientId}/events?key=${apiConf.apiKey}&orderBy=startTime&maxResults=${maxResults}&singleEvents=true&timeMin=${curTime.toISOString(true)}`

    fetch(url) //grabs calendar data
      .then(res => res.json())
      .then(json => {
        this.setState({
          loading: false,
          events: json,
        })
      });


  }



  render() {
    //unused
    let urlOptions = {
      orderBy: 'startTime',
      maxResults: this.maxResults,
      singleEvents: 'true'
    }
    //displays custom block if either data is loading or no results found
    if (this.state.loading || !this.state.events.items) {
      return (
        <div>
          <section className="sm:w-auto md:w-3/6 md:max-w-medium m-auto flex flex-wrap mt-20 bg-gray-100 shadow-lg">
            <div className="bg-red-500 w-full py-5 rounded rounded-b-none text-white border-b-2 border-red-700">
              <h2 className="z-10 relative text-2xl absolute text-white text-center"><b>
                {(this.state.loading) ? 'Loading events...' : 'No events!'}</b></h2>
            </div>
            <div className="flex flex-wrap m-auto text-center">
              <div className="mb-5 px-10 py-5 rounded">

                {(this.state.loading) ? <div className="loader"></div> : 'Please contact calendar owner'}

              </div>
            </div>
          </section>
        </div>
      )
    }
    return (
      <div>
        {this.state.events.items.map((event) => {

          let startTime = parseISO(event.start.dateTime);
          let endTime = parseISO(event.end.dateTime);

          const eStart = () => { return format(startTime, "h:mm a") };
          const eEnd = () => { return format(endTime, "h:mm a") };

          if (!event.description) {
            event.description = "No description";
          }
          if (!event.location.includes('http://' || 'https://')) {
            event.location = "https://" + event.location; //replaces link with https
          }
          const descFormat = {
            html: "/<[^>]+>/g, ''",
            spaces: "/&nbsp;/g, ' '"
          }

          event.description = event.description.replace(/<[^>]+>/g, ''); //removes html tag
          event.description = event.description.replace(/&nbsp;/g, ' '); //removes non-break spaces tag

          return (
            <div key={event.id}>
              <section className="sm:w-1/1 md:w-3/6 md:max-w-medium m-auto flex flex-wrap mt-20 bg-gray-100 shadow-lg">
                <div className="bg-red-500 w-full px-10 py-5 rounded rounded-b-none text-white border-b-2 border-red-700">
                  <a target="_blank" rel="noopener noreferrer" href={event.htmlLink}><h2 className="text-2xl py-2"><u><b>{event.summary}</b></u></h2></a>
                  <span className="text-gray-100"><MdDateRange className="float-left mr-3 mt-1" />
                    {(isToday(startTime)
                      ? `Today @ ${eStart()} - ${eEnd()}`
                      : `${format(startTime, "EEE MMMM do, h:mm a")} - ${eEnd()}`)}
                  </span><br />
                  <MdSchedule className="float-left mr-3 mt-1" />
                  {
                    ((curTime <= endTime && isToday(endTime))) //if curTime isBefore endTime of event
                      ? `Happening now: ${formatDistance(curTime, endTime)} remaining` //display happening now till event end
                      : `Event begins ${formatDistanceToNow(startTime, { addSuffix: true })}` //display roughly how much time until event start
                  }
                  <br />
                </div>
                <div className="w-full">
                  <div className="pl-10 py-5">{(["#Free", "Free", "free"].some(free => event.description.includes(free)) ?
                    <span className="bg-red-500 px-3 py-1 border-b-2 border-red-700 rounded text-white"><b>Free</b></span>
                    : '')}
                    {(event.description.includes("RSVP")
                      ? <span className="bg-red-500 px-3 py-1 border-b-2 border-red-700 ml-2 rounded text-white"><b>RSVP</b></span>
                      : '')}
                  </div>
                  <div className="mb-5 px-10 pb-10 pt-5 w-full rounded">
                    <MdSubject className="float-left mr-3 mt-1" />
                    <p id="description" className="text-gray-700 flex flex-wrap">{event.description}</p>
                  </div>
                </div>
                <div className="flex flex-auto m-auto">
                  <a target="_blank" rel="noopener noreferrer" className="m-auto mb-5 text-center bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded" href={event.location}><MdLink className="float-left mr-3 mt-1" />Attend This Event</a>
                </div>
              </section>
            </div>
          )
        })
        };
      </div >
    )
  }
}