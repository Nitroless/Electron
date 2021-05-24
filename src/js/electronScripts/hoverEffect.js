const {FluentRevealEffect} = require("fluent-reveal-effect");

FluentRevealEffect.applyEffect("#searchBox", {
    clickEffect: true,
	lightColor: "rgba(255,255,255,0.2)",
	gradientSize: 250
});

FluentRevealEffect.applyEffect(".quit-btns", {
    clickEffect: true,
	lightColor: "rgba(255,255,255,0.2)",
	gradientSize: 150
});