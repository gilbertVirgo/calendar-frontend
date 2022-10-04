import {
	Cell,
	DayName,
	DeleteEventCapture,
	Event,
	Grid,
	MonthName,
	NewEventCapture,
} from "./styles";
import { Link, useLocation, useParams } from "react-router-dom";

import { DateTime } from "luxon";
import React from "react";

const palette = [
	"#FF9AA2",
	"#FFB7B2",
	"#FFDAC1",
	"#E2F0CB",
	"#B5EAD7",
	"#C7CEEA",
	"#FF99DD",
];

// having some sort of a cors problem which is stopping me from being able to POST
// but http://lucy-calendar.link should work now!

const APIBaseURL = `https://api.lucy-calendar.link`;

export default () => {
	const location = useLocation();

	const [mutableData, setMutableData] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true);
	const { year, month } = useParams();

	React.useEffect(() => {
		(async function () {
			const response = await fetch(
				`${APIBaseURL}/calendar/${year}/${month}`
			);
			const json = await response.json();

			if (!json.success) throw new Error("Server error", json.message);

			setMutableData(JSON.parse(json.data));
			setIsLoading(false);
		})();
	}, [location]);

	React.useEffect(() => {
		(async function () {
			if (!isLoading) {
				const response = await fetch(
					`${APIBaseURL}/calendar/${year}/${month}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ data: mutableData }),
					}
				);
				const json = await response.json();

				if (!json.success)
					throw new Error("Server error", json.message);
			}
		})();
	}, [mutableData]);

	const handleEditEvent = ({ day, eventIndex }) => {
		const title = window.prompt(
			"Please enter the new title of the event.",
			day.events[eventIndex].title
		);

		if (!title) return;

		let mutableDataCopy = { ...mutableData },
			indexOfDay = mutableDataCopy.days.findIndex(
				(val) => val.day === day.day
			);

		mutableData.days[indexOfDay].events[eventIndex].title = title;

		setMutableData(mutableDataCopy);
	};

	const handleDeleteEvent = ({ day, eventIndex }) => {
		if (!window.confirm("Are you sure you want to delete this event?"))
			return;

		let mutableDataCopy = { ...mutableData },
			indexOfDay = mutableDataCopy.days.findIndex(
				(val) => val.day === day.day
			);

		mutableData.days[indexOfDay].events.splice(eventIndex, 1);

		setMutableData(mutableDataCopy);
	};

	const handleNewEvent = (day) => {
		const title = window.prompt("Please enter the title of the event.");

		if (!title) return;

		let mutableDataCopy = { ...mutableData },
			indexOfDay = mutableDataCopy.days.findIndex(
				(val) => val.day === day
			);

		mutableData.days[indexOfDay].events.push({
			title,
		});

		setMutableData(mutableDataCopy);
	};

	const renderEvents = (day, dayIndex) =>
		day.events.map((event, eventIndex) => (
			<Event
				onClick={() => handleEditEvent({ day, eventIndex })}
				color={palette[(dayIndex + eventIndex) % palette.length]}
			>
				<DeleteEventCapture
					onClick={(event) => {
						event.stopPropagation();
						handleDeleteEvent({ day, eventIndex });
					}}
				/>
				{event.title}
			</Event>
		));

	const renderDay = (day, index) => (
		<Cell.Wrapper disabled={!day}>
			<Cell.Number>{day.day}</Cell.Number>
			<Cell.Body>
				{day && renderEvents(day, index)}

				{/* I don't love `day.day`. Should probably change the structure of this on the backend. */}
				<NewEventCapture onClick={() => handleNewEvent(day.day)} />
			</Cell.Body>
		</Cell.Wrapper>
	);

	if (
		mutableData &&
		(!mutableData.hasOwnProperty("days") ||
			!(typeof mutableData.days === "object"))
	) {
		throw new Error("Invalid `days` array. Cannot render calendar.");
	}

	// Need to add month title etc.

	const linkToPreviousMonth = () => {
		const dt = DateTime.local(+year, +month, 1).minus({ months: 1 });
		return `/${dt.year}/${dt.month}`;
	};

	const linkToNextMonth = () => {
		const dt = DateTime.local(+year, +month, 1).plus({ months: 1 });
		return `/${dt.year}/${dt.month}`;
	};

	return mutableData ? (
		<React.Fragment>
			<Grid>
				<MonthName>
					<Link to={linkToPreviousMonth()}>←</Link>{" "}
					{DateTime.local(+year, +month, 1).monthLong}{" "}
					<Link to={linkToNextMonth()}>→</Link>
				</MonthName>
				{[
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				].map((name) => (
					<DayName>{name}</DayName>
				))}
				{mutableData.days.map(renderDay)}
			</Grid>
		</React.Fragment>
	) : (
		<p>Loading...</p>
	);
};

/*

What works?
- Calendar data pulled in from backend.
- ... and displayed on frontend.

What next?
- Post changed data to backend (infrastructure is there already with the POST route)
- Styling (please!)

*/
