import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import Calendar from "./components/Calendar";
import { DateTime } from "luxon";
import React from "react";

function App() {
	const dt = DateTime.local();

	return (
		<React.Fragment>
			<Switch>
				<Route path="/:year/:month" component={Calendar} />
				<Redirect from="*" to={`/${dt.year}/${dt.month}`} />
			</Switch>
		</React.Fragment>
	);
}

export default App;
