
import React, { Component } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, formatDistance, formatDistanceStrict, isToday, startOfDay, endOfDay, getDay, addDays } from 'date-fns';
import { MdLink, MdDateRange, MdSchedule, MdSubject, MdNavigateNext, MdNavigateBefore, MdInfoOutline } from "react-icons/md";
import { Remarkable } from 'remarkable';

const apiConf = require('../apiGoogleconfig.json');

var md = new Remarkable({
  html: true,
  xhtmlOut: true,
  breaks: true,
  typographer: true,
  quotes: '“”‘’'
});

const initStartTime = new Date();
const initEndTime = endOfDay(initStartTime);
const initCurDay = getDay(initStartTime); // 20th
const endDay = endOfDay(initStartTime)

// init building days of week array starting from current initStartTime
const daysOfWeek = [];

const buildWeek = () => {
  for (let i = getDay(startOfWeek(initStartTime)); i <= getDay(endOfWeek(initStartTime));) {
    daysOfWeek.push(addDays(startOfWeek(initStartTime), i))
    i++;
  }
  console.log(daysOfWeek)
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

console.log('days Array: ' + daysOfWeek)
console.log('current dayTime of week: ' + initStartTime);
console.log('start of week: ' + startOfWeek(initStartTime));
console.log('end of week: ' + endOfWeek(initStartTime));
console.log("endofDay: " + initEndTime);
console.log('current day of week: ' + initCurDay);

export default class EventsHandler extends Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      loading: true,
      curDay: initCurDay, //20th
      selStart: initStartTime,
      selEnd: initEndTime,
      maxResults: ''
    };
  }

  async fetchEvents() {

    let maxResults = this.state.maxResults;
    // if(this.state.maxResults) maxResults = `&maxResults=${maxResults}`
    const selStartDay = this.state.selStart;
    const selEndDay = this.state.selEnd;

    const url = `https://www.googleapis.com/calendar/v3/calendars/${apiConf.clientId}/events?key=${apiConf.apiKey}&orderBy=startTime${maxResults}&singleEvents=true&timeMin=${selStartDay.toISOString(true)}&timeMax=${selEndDay.toISOString(true)}`

    //const url = 'dummy.json'
    fetch(url) //grabs calendar data
      .then(res => res.json())
      .then(json => {
        this.setState({
          loading: false,
          events: json,
        })
      });
  }
  componentDidMount() {
    this.fetchEvents()
    buildWeek()
  }

  render() {
    //make sure changing day does not go below 0 - sunday or above 6 - saturday

    const dayRight = () => {
      this.setState({
        curDay: this.state.curDay + 1, //21
        selStart: startOfDay(daysOfWeek[this.state.curDay]),
        selEnd: endOfDay(daysOfWeek[this.state.curDay]),
        loading: true
      })
      console.log('cur date start:' + startOfDay(daysOfWeek[this.state.curDay]))
      this.fetchEvents();
      console.log('curDay' + initCurDay)
      console.log('curDay state' + this.state.curDay)

      console.log(`start of curDay: ${startOfDay(daysOfWeek[this.state.curDay])}`)
      console.log(`end of curDay: ${endOfDay(daysOfWeek[this.state.curDay])}`)

    }

    const dayLeft = () => {
      this.setState({
        curDay: this.state.curDay - 1,
        selEnd: daysOfWeek[initCurDay],
        loading: true

      })
      this.fetchEvents();
    }

    //const whatDay = `${days[this.state.curDay]}`;
    const events = this.state.events.items;

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
    console.log(daysOfWeek[this.state.curDay])
    return (
      //main container div below    
      <div>
        <section className="w-full py-10">
          <a href="#" onClick={(r) => { r.preventDefault(); dayRight() }}><MdNavigateNext className="float-right" size="5em" /></a>
          <a href="#" onClick={(l) => { l.preventDefault(); dayLeft() }}><MdNavigateBefore className="float-left" size="5em" /></a>
          <div className="m-auto text-3xl text-center"><b>{days[this.state.curDay]}</b>
          </div>
          <div className="text-2xl m-auto text-center">{format(daysOfWeek[this.state.curDay], "MMMM do")}</div>
        </section>

        {events.map((event) => {

          let startTime = parseISO(event.start.dateTime);
          let endTime = parseISO(event.end.dateTime);

          const eStart = () => { return format(startTime, "h:mm a") };
          const eEnd = () => { return format(endTime, "h:mm a") };

          if (!event.description) {
            event.description = `No description provided, please see Event details ${<a href={event.htmlLink}>here</a>}`; //if no description provided, replace string
          }
          if (!event.location) {
            event.location = event.htmlLink; // if no link provided, replace with event calendar link
          }

          if (!event.location.includes("http://") && !event.location.includes("https://")) {
            var isLinkInvalid = true;
          }

          //removes html tag & non-break spaces
          //event.description = event.description.replace(/<[^>]+>/g, ''); 
          //event.description = event.description.replace(/&nbsp;/g, ' '); 
          return (
            <div key={event.id}>

              <section className=" slideDown sm:w-1/1 md:w-3/6 md:max-w-medium m-auto flex flex-wrap mt-10 bg-gray-100 shadow-lg">
                <div className="bg-red-500 w-full px-10 py-5 rounded rounded-b-none text-white border-b-2 border-red-700">
                  <a target="_blank" rel="noopener noreferrer" href={event.htmlLink}><h2 className="text-2xl py-2"><u><b>{event.summary}</b></u></h2></a>
                  <span className="text-gray-100"><MdDateRange className="float-left mr-3 mt-1" />
                    {
                      isToday(startTime)
                        ? `Today @ ${eStart()} - ${eEnd()}`
                        : `${format(startTime, "EEE MMMM do, h:mm a")} - ${eEnd()}`
                    }
                  </span><br />
                  <MdSchedule className="float-left mr-3 mt-1" />
                  {
                    (initStartTime >= startTime && isToday(startTime)) //if initStartTime isBefore endTime of event
                      ? `Happening now, ${formatDistance(initStartTime, endTime)} remaining` //display happening now till event end
                      : `Event begins in ${formatDistanceStrict(initStartTime, startTime)}` //display roughly how much time until event start 
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
                    <p id="description" className="text-gray-700 flex flex-wrap"
                      dangerouslySetInnerHTML={{ __html: md.render(event.description) }}></p>

                    {/* <p id="description" className="text-gray-700 flex flex-wrap">{md.render(event.description)}</p> */}
                  </div>
                </div>
                <div className="flex flex-auto m-auto">
                  <a className="m-auto " target="_blank"
                    rel="noopener noreferrer"
                    href={
                      (isLinkInvalid)
                        ? '#'
                        : event.location
                    }>
                    <button
                      onClick={
                        (isLinkInvalid)
                          ? (e) => {
                            e.preventDefault(); window.alert(event.location)
                          }
                          : () => { }
                      }
                      className="mb-5 text-center bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                      id={event.id}
                    >{
                        (isLinkInvalid)
                          ? <MdInfoOutline className="float-left mr-3 mt-1" />
                          : <MdLink className="float-left mr-3 mt-1" />
                      } Attend Event
                       </button>
                  </a>
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