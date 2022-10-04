import styled from "styled-components";

export const Grid = styled.section`
	position: relative;

	display: grid;
	grid-template-columns: repeat(7, 1fr);
	width: 100%;

	column-gap: 10px;
	row-gap: 10px;

	margin: 0 auto;
	min-width: 700px;
	max-width: 1200px;
`;

export const DayName = styled.h4`
	font-weight: 300;
	text-align: center;
	margin: 0;
`;

export const MonthName = styled.h2`
	margin: 30px 0;
	text-align: center;
	grid-column: 1 / -1;
	text-transform: uppercase;
	font-size: 100px;
`;

const buttonStyles = `
	appearance: none;
	border: none;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	display: none;
	width: 30px;
	height: 30px;
	border-radius: 30px;
	background-color: white;
`;

export const DeleteEventCapture = styled.button`
	${buttonStyles}
	margin-right: 10px;

	&::after {
		content: "🗑";
	}
`;

export const NewEventCapture = styled.button`
	${buttonStyles}
	position: absolute;
	right: 10px;
	bottom: 10px;

	&::after {
		content: "+";
	}
`;

export const Event = styled.div`
	flex: 1;
	box-sizing: border-box;
	padding: 10px;
	cursor: pointer;
	position: relative;

	${({ color }) => `background-color: ${color};`}

	&:hover {
		${DeleteEventCapture} {
			display: inline-block;
		}
	}
`;

export const Cell = {
	Wrapper: styled.div`
		grid-column: span 1;
		${({ disabled }) =>
			disabled && `visibility: hidden; pointer-events: none;`}
	`,
	Number: styled.p`
		margin: 0 0 5px;
		font-size: 10px;
	`,
	Body: styled.div`
		position: relative;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
		background-color: #eeeeee;
		height: 150px;
		border-radius: 3px;

		${Event} {
			backdrop-filter: hue-rotate(${({ hueRotate }) => hueRotate}deg);
		}

		&:hover {
			${NewEventCapture} {
				display: block;
			}
		}
	`,
};

export const DayNumber = styled.p`
	position: absolute;
	left: 0;
	top: -15px;
	margin: 0;
`;
