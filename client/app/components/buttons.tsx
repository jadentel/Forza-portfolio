import React from "react";

// Define a normal button component
export default function NormalButton({radius, text, destination, bg, fg}) {
    var light_bg = fg - 100;
    var buttonStyles = `flex justify-center w-full p-2 bg-forza-${bg} border-2 border-forza-${fg} text-forza-${fg} rounded-${radius} shadow-[0px_0px_0px_black]`;

    const buttonHover = ``;

    const buttonFocus = `focus:bg-forza-${fg} focus:text-forza-${bg}`;

    buttonStyles = buttonStyles + " " + buttonHover;
    buttonStyles = buttonStyles + " " + buttonFocus;

    // Set the box shadow transition
    const transition = `transition-all duration-300`;
    buttonStyles = buttonStyles + " " + transition;
    
	return (
	    <a href={destination} className={buttonStyles}>
		<h1>{text}</h1>
	    </a>
	)
}
