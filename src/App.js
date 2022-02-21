/** @format */

import axios from "axios";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

const locales = {
	"en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

function App() {
	const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
	const [allEvents, setAllEvents] = useState([]);

	useEffect(() => {
		getEvents();
	}, []);

	async function getEvents() {
		let result = await axios.get("http://localhost:3004/calendar");
		setAllEvents(result.data);
	}

	async function handleAddEvent() {
		let calendarData = await axios.post("http://localhost:3004/calendar", {
			title: newEvent.title,
			allDay: true,
			start: newEvent.start,
			end: newEvent.end,
        });
		setAllEvents([...allEvents, newEvent]);
	}

	return (
		<div className="App">
			<div className="title">
                <h1>User-Calendar</h1>
            </div>

			<div className="inputs">
				<input type="text"placeholder="Add Title" style={{ width: "20%", marginRight: "10px" }} value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}/>
			
				<DatePicker
					placeholderText="Start Date"
					style={{ marginRight: "10px" }}
					selected={newEvent.start}
					onChange={(start) => setNewEvent({ ...newEvent, start })}
				/>
				<DatePicker
					placeholderText="End Date"
					selected={newEvent.end}
					onChange={(end) => setNewEvent({ ...newEvent, end })}
				/>
				<button stlye={{ marginTop: "10px" }} onClick={handleAddEvent}>
					Add Event
				</button>
			</div>
			<Calendar
				localizer={localizer}
				events={allEvents}
				startAccessor="start"
				endAccessor="end"
				style={{ height: 500, margin: "50px" }}
			/>
		</div>
	);
}

export default App;
