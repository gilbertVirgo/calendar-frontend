import APIBaseURL from "../APIBaseURL";
import uniqid from "uniqid";
export default ({ year, month, day }) => {
	const dayURL = `${APIBaseURL}/${year}/${month}/${day}`;

	const get = async () => (await (await fetch(dayURL)).json()).data;
	const patch = async (body) => {
		console.log({ body });

		await fetch(dayURL, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(body),
		});
	};

	return {
		addEvent: async (newTitle) => {
			const { events, _id, ...data } = await get();

			console.log({ data });

			await patch({
				...data,
				events: [
					...events,
					{
						id: uniqid(),
						title: newTitle,
					},
				],
			});
		},
		removeEvent: async (id) => {
			const { events, _id, ...data } = await get();

			await patch({
				...data,
				events: events.filter((event) => event.id !== id),
			});
		},
		changeEvent: (id) => ({
			to: async (newTitle) => {
				const { events, _id, ...data } = await get();

				await patch({
					...data,
					events: events.map((event) => {
						if (event.id === id) {
							// The event I'm looking for
							// Replace with new title
							return {
								id,
								title: newTitle,
							};
						} else return event;
					}),
				});
			},
		}),
	};
};
