const { clickElement, clickSetOfChairs } = require("./lib/commands.js");

const {
  randomNumberGenerator,
  ticketsReservation,
  selectDateAndTime,
} = require("./lib/util.js");

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

const buttonReservationSel = "body > main > section > button";
const buttonCodeSel = "body > main > section > div > button";
const textExpected = "Получить код бронирования";
const numberOfChairs = randomNumberGenerator(1, 10);
const dayToGo = randomNumberGenerator(0, weekDaySelector.length);
const timeToGo = randomNumberGenerator(0, timeSelector.length);
const chairSelector =
      "span.buying-scheme__chair.buying-scheme__chair_standart"; //Селектор стандартного места
const vipChairSelector = "span.buying-scheme__chair.buying-scheme__chair_vip";


let page;

describe("Go to the cinema tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await page.setDefaultNavigationTimeout(120000);
  });

  afterEach(() => {
    page.close();
  });

  //Happy paths 2 tests

  test("Test1. Regular chairs reservation test (Random number of chairs, random day and time)", async () => {
    const numberOfChairs = randomNumberGenerator(1, 10);
    const dayToGo = randomNumberGenerator(0, weekDaySelector.length);
    const timeToGo = randomNumberGenerator(0, timeSelector.length);
    const chairSelector =
      "span.buying-scheme__chair.buying-scheme__chair_standart"; //Селектор стандартного места

    //Выбор даты времени, забронированных мест
    await selectDateAndTime(
      page,
      weekDaySelector[dayToGo],
      timeSelector[timeToGo]
    );
    let elementList = await page.$$(chairSelector);
    await clickSetOfChairs(elementList, numberOfChairs, 11);
    await clickElement(page, buttonReservationSel);

    //Определение видимого элемента - кнопки с текстом "Получить код бронирования"
    await page.waitForSelector(buttonCodeSel, {
      visible: true,
    });
    const actual = await page.$eval(buttonCodeSel, (link) =>
      link.textContent.trim()
    );
    expect(actual).toContain(textExpected);
  });

  test("Test 2. Vip-chairs reservation (Two chairs, random day and time)", async () => {
    const numberOfChairs = randomNumberGenerator(1, 5);
    const dayToGo = randomNumberGenerator(0, weekDaySelector.length);
    const timeToGo = 0;
    const chairVIPSelector =
      "span.buying-scheme__chair.buying-scheme__chair_vip";

    //Выбор даты и времени и вип-мест
    await selectDateAndTime(
      page,
      weekDaySelector[dayToGo],
      timeSelector[timeToGo]
    );
    elementList = await page.$$(chairVIPSelector);
    await clickSetOfChairs(elementList, numberOfChairs, 1);
    await clickElement(page, buttonReservationSel);

    //Определение видимого элемента - кнопки с текстом "Получить код бронирования"
    await page.waitForSelector(buttonCodeSel, {
      visible: true,
    });
    const actual = await page.$eval(buttonCodeSel, (link) =>
      link.textContent.trim()
    );
    expect(actual).toContain(textExpected);
  });

  //Sad path
  test("Test 3. Reserved chairs reservation ", async () => {
    const row = randomNumberGenerator(1, 10);
    let seat = randomNumberGenerator(1, 10);
    const dayToGo = randomNumberGenerator(0, weekDaySelector.length);
    const timeToGo = 0;

    await selectDateAndTime(
      page,
      weekDaySelector[dayToGo],
      timeSelector[timeToGo]
    );

    await ticketsReservation(page, row, seat);

    await page.goto("http://qamid.tmweb.ru/client/index.php");

    await selectDateAndTime(
      page,
      weekDaySelector[dayToGo],
      timeSelector[timeToGo]
    );

    const classExist = await page.$eval(
      `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`,
      (el) => el.classList.contains("buying-scheme__chair_taken")
    );
    expect(classExist).toEqual(true);
  });
});
