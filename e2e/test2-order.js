const nsAppium = require("nativescript-dev-appium");
const assert = require("chai").assert;
const expect = require("chai").expect;
const addContext = require('mochawesome/addContext');

describe("2. Start test create order on GrowERP-restaurant App", () => {
    let driver;
    let isAndroid;
    let password = 'Moqui123!';
    let username = 'test@antwebsystems.com';

    before(async function() {
        nsAppium.nsCapabilities.testReporter.context = this;
        driver = await nsAppium.createDriver();
        isAndroid = driver.isAndroid;
    });

    beforeEach(async function () {
        console.log("Reset App before start new case!");
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

    /*
       Scenario: Check all order menu icons on the Dashboard screen.
       Given I am on the Dashboard page
       When I access to the restaurant application.
       When I click the Order, Prepare, Server and Bill icon from the dashboard.
       Then I should go to the selected page.
    */
    it("Check all order menu icons on the Dashboard screen.", async function () {
        driver.wait("3000");

        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();
        const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        await allFields[1].click().sendKeys(password);
        await allFields[0].click().sendKeys(username);

        await driver.driver.hideDeviceKeyboard("Done");
        const logInButton = await driver.findElementByClassName(driver.locators.button);
        await logInButton.click();
        driver.wait("5000");

        //check buttons menu in dashboard
        const checkDashboardScreens = await driver.findElementByText("Dashboard", "contains");
        assert.isTrue(await checkDashboardScreens.isDisplayed());
        driver.wait("1000");
        const checkOrderbuttons = await driver.findElementByText("Order", "contains");
        assert.isTrue(await checkOrderbuttons.isDisplayed());
        driver.wait("1000");
        const checkPreparebuttons = await driver.findElementByText("Prepare", "contains");
        assert.isTrue(await checkPreparebuttons.isDisplayed());
        driver.wait("1000");
        const checkServebuttons = await driver.findElementByText("Serve", "contains");
        assert.isTrue(await checkServebuttons.isDisplayed());
        driver.wait("1000");
        const checkBillbuttons = await driver.findElementByText("Bill", "contains");
        assert.isTrue(await checkBillbuttons.isDisplayed());
        driver.wait("1000");
        const selectOrdermenu = await driver.findElementByXPath("//*[@text = 'Order']");
        await selectOrdermenu.click();
        driver.wait("2000");
        const checkOrderTitle = await driver.findElementByText("Orders (Take/Serve/Bill)", "contains");
        assert.isTrue(await checkOrderTitle.isDisplayed());
        driver.wait("1000");
        const orderbacktodashboard = await driver.findElementByXPath("//*[@text = 'Orders (Take/Serve/Bill)']");
        await orderbacktodashboard.click();

        driver.wait("1000");
        const selectPreparemenu = await driver.findElementByXPath("//*[@text = 'Prepare']");
        await selectPreparemenu.click();
        driver.wait("2000");
        const checkPrepareTitle = await driver.findElementByText("Preparation Area", "contains");
        assert.isTrue(await checkPrepareTitle.isDisplayed());
        driver.wait("1000");
        const preparebacktodashboard = await driver.findElementByXPath("//*[@text = 'Preparation Area']");
        await preparebacktodashboard.click();
        driver.wait("1000");
    });


    //Feature: As an employee, I want to create new order to new customer by enter telephone number.
    it("Employee can place an order for new customer.", async function () {
        let TELEPHONE = '0903012010NewCustomer';
        let NUMGUEST = '2';
        let TABLESCLECT = '2';
        driver.wait("3000");

        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();
        const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        await allFields[1].click().sendKeys(password);
        await allFields[0].click().sendKeys(username);

        await driver.driver.hideDeviceKeyboard("Done");
        const logInButton = await driver.findElementByClassName(driver.locators.button);
        await logInButton.click();
        driver.wait("5000");
        /*const imageviewElement = await driver.findElementsByClassName("android.widget.ImageView");
        await imageviewElement[1].click();*/
        // Open SideDrawer
        const imageviewElement = await driver.findElementByClassName("android.widget.ImageView");
        await imageviewElement.click();
        driver.wait("2000");
        const orderMenuElement = await driver.findElementsByXPath("//android.widget.TextView");
        await orderMenuElement[2].click();
        const selectTable = await driver.findElementByXPath("//*[@text = '"+TABLESCLECT+"']");
        await selectTable.click();
        driver.wait("10000");
        const allOrderFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        await allOrderFields[0].click().sendKeys(TELEPHONE);
        await allOrderFields[2].click().sendKeys(NUMGUEST);
        await driver.driver.hideDeviceKeyboard("Done");
        const continueButton = await driver.findElementByClassName(driver.locators.button);
        await continueButton.click();

        const orderTableLabel = await driver.findElementByText("Order for Table: Inside-"+TABLESCLECT, "contains");
        assert.isTrue(await orderTableLabel.isDisplayed());

        const selectDrinksButtons = await driver.findElementByXPath("//*[@text = 'Drinks']");
        await selectDrinksButtons.click();
        driver.wait("1000");
        const checkDrinks = await driver.findElementByXPath("//*[@text = 'Cola']");
        await checkDrinks.click();
        driver.wait("1000");
        await checkDrinks.click();
        driver.wait("2000");
        const continueOrderButton = await driver.findElementByXPath("//*[@text = 'CONTINUE']");
        await continueOrderButton.click();
        driver.wait("1000");
        const checkPrepareTitle = await driver.findElementByText("Cola", "contains");
        assert.isTrue(await checkPrepareTitle.isDisplayed());
        driver.wait("1000");
        const saveOrder = await driver.findElementByXPath("//*[@text = 'SAVE ORDER']");
        await saveOrder.click();

        /*
        Scenario: Create new order for new customer
        Given I am on the order page
        When I access to the restaurant application.
        When I click the order icon from the dashboard.
        When I provide customer information.
        When I click on the "Continue" button
        Then I should see the page to select the food menu.
         */
    });


    /*
        Comment out for now: No need to go deep to do the actions since it take some times to do the process.

       Scenario: Create new order.
       Given I am on the order page
       When I access to the restaurant application.
       When I click the order icon from the dashboard.
       When I provide customer information and add food/drink to an order.
       When I click on the "Save Order" button.
       When I click on the "Prepare" button.
       Then I should see my order list.
    it("Admin can place an order.", async function () {

    });

        Scenario: Create new order.
        Given I am on the order page
        When I access to the restaurant application.
        When I click the order icon from the dashboard.
        When I provide customer information and add food/drink to an order.
        When I click on the "Save Order" button.
        When I click on the "Prepare" button.
        Then I should see my order list.

    it("Employee can place an order.", async function () {

    });

        Feature: As an employee, I want to create new order to existing customer by enter telephone number.
        Scenario: Create new order for new customer
        Given I am on the order page
        When I access to the restaurant application.
        When I click the order icon from the dashboard.
        When I provide existing customer information with telephone number.
        When I click on the "Continue" button
        Then I should see the page to select the food menu.
    it("Employee can place an order for existing customer(using the telephone number).", async function () {
    });
    */


    // Feature: As an employee, I want to create new order to existing customer by enter the member ID.
    /*
        Scenario: Create new order for new customer
        Given I am on the order page
        When I access to the restaurant application.
        When I click the order icon from the dashboard.
        When I provide existing customer information with telephone number.
        When I click on the "Continue" button
        Then I should see the page to select the food menu.

    it("Employee can place an order for existing customer(using the member ID).", async function () {

    });
    */


    // Feature: As an employee, I want to view the menu that ready to serve.
    /*
        Scenario: Be able to view the menu that ready to serve.
        Given I am on the order preparation page
        When I access to the restaurant application.
        When I click the preparation icon from the dashboard.
        When I click the "Done" button from the order prepare list.
        Then I should not see that order item on the order prepare list and I should see this order in the "Serve" page.

    it("Employee can view the menu that ready to serve).", async function () {

    });
     */
});
