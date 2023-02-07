var line1 = document.getElementById("line1");
var line2 = document.getElementById("line2");
var line3 = document.getElementById("line3");
var line4 = document.getElementById("line4");
var line5 = document.getElementById("line5");

var typewriter = new Typewriter(line1, {
	loop: false,
	delay: 35,
});
typewriter
	.typeString("Hello World!")
	.start()
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	});

var typewriter2 = new Typewriter(line2, {
	loop: false,
	delay: 35,
});
typewriter2
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	})
	.pauseFor(1000)
	.callFunction(function (state) {
		state.elements.cursor.style.display = "inline-block";
	})
	.pauseFor(1000)
	.typeString("This website is currently under construction.")
	.start()
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	});

var typewriter3 = new Typewriter(line3, {
	loop: false,
	delay: 35,
});
typewriter3
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	})
	.pauseFor(4500)
	.callFunction(function (state) {
		state.elements.cursor.style.display = "inline-block";
	})
	.pauseFor(1000)
	.typeString("Please be patient while i work on it.")
	.start()
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	});

var typewriter4 = new Typewriter(line4, {
	loop: false,
	delay: 35,
});
typewriter4
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	})
	.pauseFor(8000)
	.callFunction(function (state) {
		state.elements.cursor.style.display = "inline-block";
	})
	.pauseFor(1000)
	.typeString("For more of my projects, visit my github:")
	.start()
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	});

var typewriter5 = new Typewriter(line5, {
	loop: false,
	delay: 35,
});
typewriter5
	.callFunction(function (state) {
		state.elements.cursor.style.display = "none";
	})
	.pauseFor(11000)
	.callFunction(function (state) {
		state.elements.cursor.style.display = "inline-block";
	})
	.pauseFor(1000)
	.typeString(
		"<a href='https://github.com/infinitel8p'><i class='fa fa-github'></i></a> <a href='https://github.com/infinitel8p'>infinitel8p</a>"
	)
	.start();
