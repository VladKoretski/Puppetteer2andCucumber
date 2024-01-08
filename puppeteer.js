const puppeteer = require("puppeteer");
const { randomNumberGenerator } = require("./lib/util");
const { clickElement, clickSetOfElements } = require("./lib/commands");


const weekDaySelector = [
  "body > nav > a:nth-child(2)",
  "body > nav > a:nth-child(3)",
  "body > nav > a:nth-child(4)",
  "body > nav > a:nth-child(5)",
  "body > nav > a:nth-child(6)",
  "body > nav > a:nth-child(7)",
];

const timeSelector = [
  "body > main > section:nth-child(1) > div:nth-child(2) > ul > li:nth-child(1) > a",
  "body > main > section:nth-child(1) > div:nth-child(2) > ul > li:nth-child(2) > a",
  "body > main > section:nth-child(1) > div:nth-child(2) > ul > li:nth-child(3) > a",
  "body > main > section:nth-child(1) > div:nth-child(3) > ul > li > a",
  "body > main > section:nth-child(2) > div:nth-child(2) > ul > li > a",
  "body > main > section:nth-child(2) > div:nth-child(3) > ul > li > a",
];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defauiltViewport: null,
    args: ["--start-maximized"],
    devtools: true,
  });

  const page = await browser.newPage();
  await page.goto("https://qamid.tmweb.ru/client/", { timeout: 120000 });
  const dayToGo = randomNumberGenerator(0, 5);
  let element = await page.waitForSelector(weekDaySelector[dayToGo]);
  await element.click();
  const timeToGo = randomNumberGenerator(0, 5);
  element = await page.waitForSelector(timeSelector[timeToGo]);
  await element.click();
  await page.waitForTimeout(10000);

  const disabledChairSelector =
    "span.buying-scheme__chair.buying-scheme__chair_standart.buying-scheme__chair_taken";
   
  await page.waitForTimeout(20000);
   element = await page.waitForSelector(disabledChairSelector);
   await element.click();
   await page.waitForTimeout(10000);
  
  //clickElement(page, disabledChairSelector);

  //Кнопка бронирования недоступна
  const bottonSelector = "body > main > section > div > button";
 element = await page.waitForSelector(bottonSelector);
 await element.click();
 await page.waitForTimeout(10000);

  //await page.waitForTimeout(20000);
  //clickElement(page, bottonSelector);
  //const attribute = await page.$$("", (el) => el.map (() => x.getAttribute ()));

  //const attr = await page.$$eval(bottonSelector, (el) =>
  //  el.map((x) => x.getAttribute("acceptin-button"))
  ///  );

  /*
  elementList = await page.$$(
    "span.buying-scheme__chair.buying-scheme__chair_standart"
  );
clickSetOfElements (elementList, 5);
  //
  // for (let i = 0; i <= 6; i++) {
  // await elementList[i].click();
 //}

  const button = await page.waitForSelector("body > main > section > button");
  await button.click();
  //let buttonSel = "body > main > section > button";
  //clickElement (page, buttonSel);*/
})();
