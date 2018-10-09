const assert = require("assert");
const getMessage = require("../popup").getMessage;
const getXHR = require("../popup").getXHR;

const messages = [
    "It is never too late to start.",
    "Still long way to go.",
    "Awesome, you are almost half way through.",
    "Almost there.",
    "Just one more to go.",
    "Congratulations, you have completed hacktoberfest 2018."
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
