import React, { Component } from 'react';
import { MdPersonPin } from "react-icons/md";
let apiConf = require('../apiGoogleconfig.json');

export default class AppNav extends Component {

  render(){
     
    return (
      <div>
        <nav className="flex items-center justify-between flex-wrap bg-red-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <MdPersonPin className="mt-1 mx-2 text-3xl " />
            <span className="font-semibold text-2xl tracking-tight">Connected | From a Distance</span>
          </div>
          
          <div className="flex flex-wrap items-center text-center sm:m-auto md:mr-5 text-white">
            
            <a className="bg-red-400 hover:bg-red-300 font-bold py-2 sm:mt-5 md:m-auto px-4 border-b-4 border-red-600 hover:border-red-400 rounded" href={apiConf.calendarURL}>View Calendar</a>
           
          </div>
        </nav>
      </div>
    );
  }
}

