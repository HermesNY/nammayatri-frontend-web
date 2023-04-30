import React, { FC, MouseEventHandler } from "react";

interface Props {
	onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Cta: FC<Props> = ({ onClick }) => {
	return (
		<button
			className=" bg-yellow-400 text-zinc-900 hover:bg-yellow-500"
			onClick={onClick}
		>
			Get Started
		</button>
	);
};

export default Cta;
