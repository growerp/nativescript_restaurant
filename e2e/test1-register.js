const nsAppium = require("nativescript-dev-appium");
const assert = require("chai").assert;
const expect = require("chai").expect;
const addContext = require('mochawesome/addContext');

describe("1. Start test register, login and forgot your password functions on GrowERP-restaurant App", () => {
    let driver;
    let isAndroid;
    let password = '!awstest12';
    let username = 'testapp'+ Math.floor(Math.random()*100000) + '@gmail.com';

    before(async function() {
        nsAppium.nsCapabilities.testReporter.context = this;
        driver = await nsAppium.createDriver();
        isAndroid = driver.isAndroid;
    });

    beforeEach(async function () {
        await driver.resetApp();
        driver.wait(3000);
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


    it("Register with the new email.", async function () {
        console.log('========= Register username : ', username)
        console.log('========= Register password : ', password)
        let firstName = 'Test user';
        let lastName = 'Doe';
        let restaurantName = 'Test Restaurant';
        // var signUpbotton = "[@name = 'Not have an account Sign Up now!']";
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
        await registerFields[3].click().sendKeys(username);
        await registerFields[4].click().sendKeys(password);
        await driver.driver.hideDeviceKeyboard("Done");
        await registerFields[5].click().sendKeys(password);
        await driver.driver.hideDeviceKeyboard("Done");
        const registButton = await driver.findElementByClassName(driver.locators.button);
        await registButton.click();
        const alertOkButton = await driver.findElementByXPath("//*[@text = 'OK']");
        await alertOkButton.click();
        //Re Login
        const loginFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        await loginFields[1].click().sendKeys(password);
        await loginFields[0].click().sendKeys(username);
        await driver.driver.hideDeviceKeyboard("Done");

        const logInButton = await driver.findElementByClassName(driver.locators.button);
        await logInButton.click();

        // Check if launch dashboard page.
        const dashBoardLabel = await driver.findElementByText("Dashboard", "exact");
        // expect(dashBoardLabelText).to.equal("Dashboard", "Unable to login with this user #"+username);
        assert.isTrue(await dashBoardLabel.isDisplayed(), 'Unable to login with this user :'+username);
    });

    it("Register with the existing email.", async function () {
        console.log('********** Register with the existing email.')
        let firstName = 'Test existing user';
        let lastName = 'Doe';
        let restaurantName = 'Test Existing Restaurant';
        var currencyLabelElement = "Australian Dollar [AUD]";
        // var checkDisplayDashboard = "[@text = 'Dashboard']";
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
        await registerFields[3].click().sendKeys(username);
        await registerFields[4].click().sendKeys(password);
        await driver.driver.hideDeviceKeyboard("Done");
        await registerFields[5].click().sendKeys(password);
        await driver.driver.hideDeviceKeyboard("Done");
        const registButton = await driver.findElementByClassName(driver.locators.button);
        await registButton.click();

        const errorDialog = await driver.findElementByText("Registration Error: Request failed with status code 400: Bad Request", "contains");
        assert.isTrue(await errorDialog.isDisplayed());

    });

    it("Check login to the restaurant app with valid data.", async function () {
        // password = '!awstest12';
        // username = 'testapp36018@gmail.com';
        console.log('========= Log-in username : ', username)
        console.log('========= Log-in password : ', password)

        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();

        if (isAndroid) {
            var userNameLabelElement = "[@text='User Name/Email']";
        } else {
            var loginButtonElement = "[@name='LOGIN']";
            var userNameLabelElement = "[@name='User Name/Email']";
        }

        if (isAndroid) {
            const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
            await allFields[1].click().sendKeys(password);
            await allFields[0].click().sendKeys(username);
        } else {
            const passField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("securetextfield"), 10000);
            await passField.click().sendKeys(password);
            const usernameField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("textfield"), 10000);
            await usernameField.click().sendKeys(username);
        }
        await driver.driver.hideDeviceKeyboard("Done");
        if (isAndroid) {
            const logInButton = await driver.findElementByClassName(driver.locators.button);
            await logInButton.click();
        } else {
            const logInButton = await driver.findElementByXPath("//" + driver.locators.button + loginButtonElement);
            await logInButton.click();
        }
        driver.wait(3000);
        const menuImage = await driver.findElementByClassName("android.widget.ImageView");
        await menuImage.click();

        const myInfo = await driver.findElementByXPath("//" + driver.locators.getElementByName("label") + "[@text='My Info']");
        await myInfo.click();

        const usernameLabel = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        const usernameText = await usernameLabel[0].text();
        expect(usernameText).to.equal(username, "Not logged with the same user");

    });

    it("Check login to the restaurant app with invalid data.", async function () {
        // console.log('========= Log-in username : ', username)
        // console.log('========= Log-in password : ', password)

        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();

        const testPassword = '!qazxsw2';
        const testUsername = 'ofbiztest02@gmail.com';

        if (isAndroid) {
            var userNameLabelElement = "[@text='User Name/Email']";
        } else {
            var loginButtonElement = "[@name='LOGIN']";
            var userNameLabelElement = "[@name='User Name/Email']";
        }

        if (isAndroid) {
            const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
            await allFields[1].click().sendKeys(testPassword);
            await allFields[0].click().sendKeys(testUsername);
        } else {
            const passField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("securetextfield"), 10000);
            await passField.click().sendKeys(testPassword);
            const usernameField = await driver.driver.waitForElementByClassName(driver.locators.getElementByName("textfield"), 10000);
            await usernameField.click().sendKeys(testUsername);
        }
        await driver.driver.hideDeviceKeyboard("Done");
        if (isAndroid) {
            const logInButton = await driver.findElementByClassName(driver.locators.button);
            await logInButton.click();
        } else {
            const logInButton = await driver.findElementByXPath("//" + driver.locators.button + loginButtonElement);
            await logInButton.click();
        }

        /* Fix me : Check with note
        const errorDialog = await driver.findElementByText("Login Error", "contains");
        assert.isTrue(await errorDialog.isDisplayed());*/

    });

    it("Forgot your password function", async function () {
        const forgotPassword = await driver.findElementByXPath("//*[@text = 'Forgot your password?']");
        await forgotPassword.click();

        // Check if dialog is present
        const errorDialog = await driver.findElementByText("Enter the email address you used to register for GrowERP-restaurant to reset your password.", "contains");
        assert.isTrue(await errorDialog.isDisplayed());
    });

});
