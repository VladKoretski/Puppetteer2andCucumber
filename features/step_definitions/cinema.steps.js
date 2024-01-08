const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { setDefaultTimeout } = require("cucumber");
const {
  randomNumberGenerator,
  selectDateAndTime,
  ticketsReservation,
  checkIfChairsAreReserved,
} = require("../../lib/util.js");
const { clickElement, getText } = require("../../lib/commands.js");

const weekDaySelector = [
  "body > nav > a:nth-child(2)",
  "body > nav > a:nth-child(3)",
  "body > nav > a:nth-child(4)",
  "body > nav > a:nth-child(5)",
  "body > nav > a:nth-child(6)",
  "body > nav > a:nth-child(7)",
];

const timeSelector = [
  "body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a",
  "body > main > section:nth-child(2) > div.movie-seances__hall > ul > li > a",
];

let ticketHintSel = "p.ticket__hint";
let expectedText =
  "Покажите QR-код нашему контроллеру для подтверждения бронирования.";
let vipChairSelector = "span.buying-scheme__chair.buying-scheme__chair_vip";
const buttonReservationSel = "body > main > section > button";
const givenDay = 4;
const givenMovie = 0;
const givenRow = 3;
const givenChair = 2;

setDefaultTimeout(60 * 1000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});
//Givens
Given("user is on {string} page", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru/client${string}`, {
    setTimeout: 20000,
  });
});

//Whens
When("user selects a day and a movie", async function () {
  const dayToGo = randomNumberGenerator(0, weekDaySelector.length);
  const timeToGo = randomNumberGenerator(0, timeSelector.length);
  await selectDateAndTime(
    this.page,
    weekDaySelector[dayToGo],
    timeSelector[timeToGo]
  );
});

When("selects a row and books one regular-chair", async function () {
  const rowToReserve = randomNumberGenerator(1, 10);
  const chairToReserve = randomNumberGenerator(1, 10);
  await ticketsReservation(this.page, rowToReserve, chairToReserve);
});

When("selects a row and books two regular-chairs", async function () {
  const rowToReserve = randomNumberGenerator(1, 10);
  const chairToReserve = randomNumberGenerator(1, 9);
  await ticketsReservation(
    this.page,
    rowToReserve,
    chairToReserve,
    chairToReserve + 1
  );
});

When("books one VIP-chair", async function () {
  await clickElement(this.page, vipChairSelector);
  await clickElement(this.page, buttonReservationSel);
});

When("user select the given row and the given chair", async function () {
  await ticketsReservation(this.page, givenRow, givenChair);
});

When("user selects the given day and the given movie", async function () {
  await selectDateAndTime(
    this.page,
    weekDaySelector[givenDay],
    timeSelector[givenMovie]
  );
});

When(
  "Having checked that given row and given chair is taken tries select them",
  async function () {
    // await checkIfChairsAreReserved(this.page, givenRow, givenChair);
    try {
      await ticketsReservation(this.page, givenRow, givenChair);
    } catch (error) {
      expect(error).to.be.an("error");
      expect(error.message).to.be.equal("Chairs are not available");
    }
  }
);

When("user select a booked chair", async function () {
  await clickElement(
    this.page,
    "span.buying-scheme__chair.buying-scheme__chair_vip.buying-scheme__chair_taken"
  );
});

//Thens
Then("user receives the confirmation and qr-code", async function () {
  const actual = await getText(this.page, ticketHintSel);
  expect(actual).contain(expectedText);
});

Then(
  "user see the button-to-reserve disabled {string}",
  async function (string) {
    const actual = String(
      await this.page.$eval("button", (button) => {
        return button.disabled;
      })
    );
    const expected = await string;
    expect(actual).contains(expected);
  }
);