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

import APIBaseURL from "../../APIBaseURL";
import { DateTime } from "luxon";
import Day from "../../scripts/Day";
import React from "react";
import moment from "moment";

const palette = [
	"#FF9AA2",
	"#FFB7B2",
	"#FFDAC1",
	"#E2F0CB",
	"#B5EAD7",
	"#C7CEEA",
	"#FF99DD",
];

export default () => {
	const location = useLocation();

	const [data, setData] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true);
	const { year, month } = useParams();

	const getData = async () => {
		const response = await fetch(`${APIBaseURL}/${year}/${month}`);
		const json = await response.json();

		if (!json.success) throw new Error("Server error", json.message);

		let { data } = json;

		data = data.sort(({ day: a }, { day: b }) => a - b);

		return data;
	};

	React.useEffect(() => {
		getData().then((data) => {
			setData(data);
			setIsLoading(false);
		});
	}, [location]);

	React.useEffect(() => {
		if (isLoading)
			getData().then((data) => {
				setData(data);
				setIsLoading(false);
			});
	}, [isLoading]);

	const handleEditEvent = async ({ day, eventId }) => {
		const title = window.prompt("Please enter the new title of the event.");

		if (!title) return;

		await Day({ year, month, day }).changeEvent(eventId).to(title);
		setIsLoading(true);
	};

	const handleDeleteEvent = async ({ day, eventId }) => {
		if (!window.confirm("Are you sure you want to delete this event?"))
			return;

		await Day({ year, month, day }).removeEvent(eventId);
		setIsLoading(true);
	};

	const handleNewEvent = async (day) => {
		const title = window.prompt("Please enter the title of the event.");

		if (!title) return;

		await Day({ year, month, day }).addEvent(title);
		setIsLoading(true);
	};

	const renderEvents = ({ day, events }, dayIndex) =>
		events.map((event, eventIndex) => (
			<Event
				onClick={() => handleEditEvent({ day, eventId: event.id })}
				color={palette[(dayIndex + eventIndex) % palette.length]}
			>
				<DeleteEventCapture
					onClick={(e) => {
						e.stopPropagation();
						handleDeleteEvent({ day, eventId: event.id });
					}}
				/>
				{event.title}
			</Event>
		));

	const renderDay = (day, index) => (
		<Cell.Wrapper disabled={!day}>
			{day && (
				<React.Fragment>
					<Cell.Number>{day.day}</Cell.Number>
					<Cell.Body>
						{day.events &&
							renderEvents(
								{ day: day.day, events: day.events },
								index
							)}

						{/* I don't love `day.day`. Should probably change the structure of this on the backend. */}
						<NewEventCapture
							onClick={() => handleNewEvent(day.day)}
						/>
					</Cell.Body>
				</React.Fragment>
			)}
		</Cell.Wrapper>
	);

	// Need to add month title etc.

	const linkToPreviousMonth = () => {
		const dt = DateTime.local(+year, +month, 1).minus({ months: 1 });
		return `/${dt.year}/${dt.month}`;
	};

	const linkToNextMonth = () => {
		const dt = DateTime.local(+year, +month, 1).plus({ months: 1 });
		return `/${dt.year}/${dt.month}`;
	};

	console.log(data);

	return data ? (
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
				{[
					...Array(
						moment(
							`${month < 10 ? 0 : ""}${month}-01`,
							"MM-DD"
						).day()
					).fill(null),
					...data,
				].map(renderDay)}
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
