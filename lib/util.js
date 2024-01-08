const { clickElement, clickSetOfElements } = require("./commands.js");

module.exports = {
  //генератор псевдослучайных чисел в промежутке min - max
  randomNumberGenerator: function (min, max) {
    const randomNumber = Math.floor(Math.random() * (max - min) + min);
    return randomNumber;
  },

  //выбор дня и времени
  selectDateAndTime: async function (page, daySel, timeSel) {
    await clickElement(page, daySel);
    await clickElement(page, timeSel);
  },

  //бронирование билетов
  ticketsReservation: async function (page, row, ...chairs) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {
      for (let i = 0; i < chairs.length; i++) {
        await clickElement(
          page,
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${chairs[i]})`
        );
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${chairs[i]}).buying-scheme__chair_selected`
        );
      }
    } catch (error) {
      throw new Error(`Chairs are not available`);
    }
    await clickElement(page, ".acceptin-button");
    await page.waitForSelector(".ticket__check-title");
    await clickElement(page, ".acceptin-button");
  },

  //проверка заняты ли места для sad path
  checkIfChairsAreReserved: async function (page, row, ...chairs) {
    await page.waitForSelector(".buying-scheme__wrapper");
    try {
      for (let i = 0; i < seats.length; i++) {
        await page.waitForSelector(
          `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${chairs[i]}).buying-scheme__chair_taken`
        );
      }
    } catch (error) {
      throw new Error("Chairs are not available");
    }
  },

  bookingCodButtonText: async function (
    page,
    daySel,
    timeSel,
    chairSel,
    chairs,
    clickButtonSel,
    testButtonSel
  ) {
    try {
      //Выбор даты и времени
      clickElement(page, daySel);
      clickElement(page, timeSel);
      //Выбор забронированных мест
      await page.waitForSelector(chairSel);
      let elements = await page.$$(chairSel);
      clickSetOfElements(elements, chairs);
      //Кнопка бронирования
      clickElement(page, clickButtonSel);

      //Определение видимого элемента - кнопки с текстом "Получить код бронирования"
      await page.waitForSelector(testButtonSel, { visible: true });
    } catch (error) {
      throw new Error("The given selector is not visible: ${testButtonSel}");
    }
  },
};
