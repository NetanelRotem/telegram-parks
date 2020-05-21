var express = require("express");
var getUrl = require("./googleHelper");
const fetch = require("node-fetch");
const geolib = require("geolib");
var app = express();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN; // "1224601107:AAHjkdZEF13j4aPKaevbni5gW42xxRSMTBc";
const bot = new TelegramBot(token, { polling: true });
bot.on("location", (msg) => {
  console.log(msg, "location is here!!!!");

  const {
    location: { longitude, latitude },
  } = msg;
  const url = getUrl(latitude, longitude);
  try {
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        const { results } = json;
        results.forEach((element) => {
          const {
            geometry: {
              location: { lat, lng },
            },
            name,
            vicinity,
          } = element;
          console.log(lat, lng);
          var keyboard = {
            inline_keyboard: [
              [
                {
                  text: `${name}`,
                  url: `https://waze.com/ul?ll=${lat},${lng}`,
                },
              ],
            ],
          };
          const distance = geolib.getDistance(
            { latitude, longitude },
            { latitude: lat, longitude: lng }
          );
          var data = {
            reply_markup: JSON.stringify(keyboard),
          };
          bot.sendMessage(
            msg.chat.id,
            `${vicinity} __ ${distance / 1000} Km `,
            data,
            function (isSuccess) {
              console.log(isSuccess);
            }
          );
        });
      });
  } catch (rr) {
    console.log(rr);
  }
});
bot.on("message", (msg) => {
  if (msg.location) {
    return;
  }
  console.log(msg);
  //anything
  bot.sendMessage(msg.chat.id, "אפה אתה? שלח מיקום!", {
    text: "Can i get your location please. Click on the button below",
    reply_markup: {
      keyboard: [
        [
          {
            text: "Send Location",
            inline_keyboard_button: true,
            request_location: true,
          },
        ],
      ],
    },
  });
});
module.exports = app;
