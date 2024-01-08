const { expect } = require("chai");

module.exports = {
  //click элемента по селектору
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },

  //click нескольких элементов
  clickSetOfChairs: async function (elements, numberOfChairs, firstChair) {
    try {
      const upLevel = firstChair + numberOfChairs;
      for (let i = firstChair; i < upLevel; i++) {
        await elements[i].click();
      }
    } catch (error) {
      throw new Error(`There is no chair to pick out: ${elements}`);
    }
  },

  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },
  putText: async function (page, selector, text) {
    try {
      const inputField = await page.$(selector);
      await inputField.focus();
      await inputField.type(text);
      await page.keyboard.press("Enter");
    } catch (error) {
      throw new Error(`Not possible to type text for selector: ${selector}`);
    }
  },
};
