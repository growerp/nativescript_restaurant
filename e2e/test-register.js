const nsAppium = require("nativescript-dev-appium");
const assert = require("chai").assert;
const addContext = require('mochawesome/addContext');

describe("1. Start test register, login and forgot your password functions on GrowERP-restaurant App", () => {
    let driver;
    let isAndroid;

    before(async function() {
        nsAppium.nsCapabilities.testReporter.context = this;
        driver = await nsAppium.createDriver();
        isAndroid = driver.isAndroid;
    });

    after(async function () {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });
    it("Test Registration", async function () {
      let PASSWORD = '!qazxsw2';
      let USERNAME = 'test080@gmail.com';
      let firstName = 'Test user';
      let lastName = 'Doe';
      let restaurantName = 'Restaurant test';
      var signUpbotton = "[@name = 'Not have an account Sign Up now!']";
      var currencyLabelElement = "Australian Dollar [AUD]";
      var checkDisplayDashboard = "[@text = 'Dashboard']";
      //Check regsiter screens
      if(!driver.findElementByXPathIfExists("//*[@text = 'Not have an account Sign Up now!']")){
        const regsiterButton = await (driver.findElementByXPath("//*[@text = 'Not have an account Sign Up now!']"));
        await regsiterButton.click();
      }
      // Regsiter
      const registerFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
      await registerFields[0].click().sendKeys(restaurantName);
      await driver.driver.hideDeviceKeyboard("Done");
      const dropdown = await driver.findElementByXPath("//android.widget.TextView[@index=0]");
      await dropdown.click();
      const currencyLabel = await driver.findElementByText(currencyLabelElement);
      await currencyLabel.click();
      await registerFields[1].click().sendKeys(firstName);
      await registerFields[2].click().sendKeys(lastName);
      await registerFields[3].click().sendKeys(USERNAME);
      await registerFields[4].click().sendKeys(PASSWORD);
      await driver.driver.hideDeviceKeyboard("Done");
      await registerFields[5].click().sendKeys(PASSWORD);
      await driver.driver.hideDeviceKeyboard("Done");
      const registButton = await driver.findElementByClassName(driver.locators.button);
      await registButton.click();
      const alertOkButton = await driver.findElementByXPath("//*[@text = 'OK']");
      await alertOkButton.click();
      //Re Login
      const loginFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
      await loginFields[1].click().sendKeys(PASSWORD);
      await loginFields[0].click().sendKeys(USERNAME);
      await driver.driver.hideDeviceKeyboard("Done");
      const logInButton = await driver.findElementByClassName(driver.locators.button);
      await logInButton.click();
      //Check dashBoard
      /*const dashBoardLabel = await driver.findElementByXPath("//android.widget.TextView[@index=0]");
      const dashBoard = await dashBoardLabel.text();
      expect(dashBoard).to.equal(checkDisplayDashboard, "can't Login.");
      if(!driver.findElementByXPathIfExists(driver.findElementByText(checkDisplayDashboard))){

      }*/
      // Open SideDrawer
      const imageviewElement = await driver.findElementByClassName("android.widget.ImageView");
      await imageviewElement.click();
      // Open Logout
      const logoutButton = await driver.findElementByXPath("//*[@text = 'Logout']");
      await logoutButton.click();
    });

    it("Test Log-in to the restaurant app", async function () {
        // Re-launch app
        await driver.resetApp();
        driver.wait("3000");

        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();

        let PASSWORD = '!qazxsw2';
        let USERNAME = 'att.chumm@gmail.com';
        if (isAndroid) {
            var userNameLabelElement = "[@text='User Name/Email']";
        } else {
            var loginButtonElement = "[@name='LOGIN']";
            var userNameLabelElement = "[@name='User Name/Email']";
        }

        if (isAndroid) {
            const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
            await allFields[1].click().sendKeys(PASSWORD);
            await allFields[0].click().sendKeys(USERNAME);
        } else {
            const passField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("securetextfield"), 10000);
            await passField.click().sendKeys(PASSWORD);
            const usernameField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("textfield"), 10000);
            await usernameField.click().sendKeys(USERNAME);
        }
        await driver.driver.hideDeviceKeyboard("Done");
        if (isAndroid) {
            const logInButton = await driver.findElementByClassName(driver.locators.button);
            await logInButton.click();
        } else {
            const logInButton = await driver.findElementByXPath("//" + driver.locators.button + loginButtonElement);
            await logInButton.click();
        }
        // Fix me to check the current login user.

    });

    it("Forgot your password function", async function () {
        // Re-launch app
        await driver.resetApp();
        driver.wait("3000");

        const forgotPassword = await driver.findElementByXPath("//*[@text = 'Forgot your password?']");
        await forgotPassword.click();
        //Fix me : add assert to check if dialog is present

    });
});
