
import React, { Component } from 'react';
import moment from 'moment';
import { MdLink, MdDateRange, MdSchedule, MdSubject} from "react-icons/md";

const apiConf = require('../apiGoogleconfig.json');

const url = `https://www.googleapis.com/calendar/v3/calendars/${apiConf.clientId}/events?key=${apiConf.apiKey}&orderBy=startTime&maxResults=${apiConf.maxResults}&singleEvents=true&timeMin=${moment().toISOString()}`

export default class EventsHandler extends Component {

    constructor(props){
        super(props);

        this.state = {
          events: [],
          loading: true,
          isToday: false
        };
      }
     async componentDidMount () {
       //grabs calendar data in the form of JSON from api
      fetch(url)
      .then(res => res.json())
      .then (json => {
        this.setState({
          loading: false,
          events: json,
        })
      })
    }
    
    render() {
      
      // displays custom block if either data is loading or no results found
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
            const isToday = moment(event.start.dateTime).isSame(moment().toISOString(), 'day');
            const eStart = () => {return moment(event.start.dateTime).format("h:mm A")}
            const eEnd = () => {return moment(event.end.dateTime).format("h:mm A")}
  
            return (
              <div key={event.id}>
                <section className="sm:w-1/1 md:w-3/6 md:max-w-medium m-auto flex flex-wrap mt-20 bg-gray-100 shadow-lg">
                  <div className="bg-red-500 w-full pl-10 py-5 rounded rounded-b-none text-white border-b-2 border-red-700">
                    <a href={event.htmlLink}><h2 className="text-2xl py-2"><u><b>{event.summary}</b></u></h2></a>
                    <span className="text-gray-100"><MdDateRange className="float-left mr-3 mt-1" />
                      {((isToday)
                        ? `Today @ ${eStart()} - ${eEnd()}`
                        : moment(event.start.dateTime).format("ddd, MMMM Do, h:mm A") + ` - ${eEnd()}`)}
                    </span><br />
                    <MdSchedule className="float-left mr-3 mt-1" />Event begins {moment(event.start.dateTime).fromNow()}<br />
                  </div>
                  <div className={"flex flex-wrap " + ((!isToday) ? "" : "")}>
                    <div className="pl-10 py-5">{(event.description.indexOf("Free") === -1) ? ''
                      : <span className="bg-red-400 px-3 py-1 rounded text-white"><b>Free</b></span>}
                    </div>
                    <div className="mb-5 px-10 pb-10 pt-5 rounded">
                      <MdSubject className="float-left mr-3 mt-1" />
                      <p className="text-gray-700 flex flex-wrap whitespace-normal">{event.description}</p>
                    </div>
                    <a className="text-center m-auto mb-5 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded" href={event.location}><MdLink className="float-left mr-3 mt-1" />Attend This Event</a>
                  </div>
                  
                  
                  
                </section>
              </div>
            )
          })};
        </div>
      ); 
  }
}
