// REQUIRE .env FILE
require("dotenv").config();

// REQUIRE REQUEST
let request = require("request");

// REQUIRE MOMENT
const moment = require("moment");

// REQUIRE FILE SYSTEMS
const fs = require("fs");

// LINK KEY PAGE
const key = require("./keys.js");

// INITIALIZE SPOTIFY
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

// OMDB AND BANDS IN TOWN API'S
let omdb = (keys.omdb);
let bandsintown = (keys.bandsintown);

// TAKE USER COMMAND AND INPUT
let userInput = process.argv(2);
let userQuery = process.argv.slice(3).join(" ");

// APP LOGIC
function userCommand(userInput, userQuery) {
    // make a decision based on the command
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I don't understand");
            break;
    }
}
userCommand(userInput, userQuery);

function concertThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);
    // USE REQUEST AS OUR QUERY URL USING OUR USER QUERY VARIABLE AS THE PARAMETERS OF OUR 
    request("https://rest.bandsintown.com/artist/" + userQuery + "/events?app_id=" + bandsintown response, body) {
        //IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
        if (!erorr && response.statusCode === 200) {
            // CAPTURE DATA AND USE JSON TO FORMAT
            let userBand = JSON.parse(body);
            //PARSE DATA AND USE FOR LOOP TO ACCESS PATHS TO DATA
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

                    //CONSOLE DESIRED DATA USING E6 SYNTAX
                    console.log(`\nBA DA BOP! That's for you...\n\nArtist:${userBand[i].lineup[0]} \nVenue: ${userBand.venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)

                    //MOMENT.JS TO FORMAT THE DATE MM/DD/YYY
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    };
}

function spotifyThisSong() {
    console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);

    // IF USER QUERY NOT FOUND, PASS VALUE OF "ACE OF BASE"
    if (!userQuery) { type: 'track', query: userQuery, limit: 1}
}

function movieThis()

function doThis()