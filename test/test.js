const assert = require("assert");
const getMessage = require("../popup").getMessage;

const messages = [
    "It's never too late to start! Go and get hacking!",
    "One down, four to go! Keep going!",
    "Awesome work! You're almost halfway there!",
    "Don't stop now, you're closer to the finish line!",
    "Just one more, give it your best shot!",
    "You did it! Congratulations for completing Hacktoberfest 2018!"
];

function randomTotalCount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

describe("#getMessage", function () {
    it("returns the proper message based on number of total count", function() {
        var totalCount = randomTotalCount(0, 5);
        assert.equal(getMessage(totalCount), messages[totalCount]);
    });
});
