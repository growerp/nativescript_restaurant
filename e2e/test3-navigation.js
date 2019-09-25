const nsAppium = require("nativescript-dev-appium");
const assert = require("chai").assert;
const expect = require("chai").expect;
const addContext = require('mochawesome/addContext');

describe("3. Start test left menu and navigation screen on GrowERP-restaurant App", () => {
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
       Scenario: Check all menu icons on the Dashboard screen.
       Given I am on the SetUp page
       When I access to the restaurant application.
       When I click the set up icon from the dashboard.
       Then I should see 8 menu icons on the SetUp page.
    */
       it("Check all menu icons on the Dashboard screen.", async function () {
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

        const selectReportsmenu = await driver.findElementByXPath("//*[@text = 'Reports']");
        await selectReportsmenu.click();
        driver.wait("2000");
        const checkReportsTitle = await driver.findElementByText("Reports", "contains");
        assert.isTrue(await checkReportsTitle.isDisplayed());
        driver.wait("1000");
        const reportbacktodashboard = await driver.findElementByXPath("//*[@text = 'Reports']");
        await reportbacktodashboard.click();
        driver.wait("1000");

        const selectTasksmenu = await driver.findElementByXPath("//*[@text = 'Tasks']");
        await selectTasksmenu.click();
        driver.wait("2000");
        const checkTasksTitle = await driver.findElementByText("Tasks for me and given to others", "contains");
        assert.isTrue(await checkTasksTitle.isDisplayed());
        driver.wait("1000");
        const taskbacktodashboard = await driver.findElementByXPath("//*[@text = 'Tasks for me and given to others']");
        await taskbacktodashboard.click();
        driver.wait("1000");

        const selectHelpmenu = await driver.findElementByXPath("//*[@text = 'Help']");
        await selectHelpmenu.click();
        driver.wait("2000");
        const checkHelpTitle = await driver.findElementByText("Help", "contains");
        assert.isTrue(await checkHelpTitle.isDisplayed());
        driver.wait("1000");
        const helptodashboard = await driver.findElementByXPath("//*[@text = 'Help']");
        await helptodashboard.click();
        driver.wait("1000");
    });

    /*
      Scenario: Check all menu items on the left navigation.
      Given I am on the left navigation.
      When I access to the restaurant application.
      When I click the left navigation.
      Then I should see all menu items.
    */
    it("Check all menu items on the left navigation.", async function () {
        driver.wait("2000");
        const backToLogin = await driver.findElementByXPath("//*[@text = 'Back to Login']");
        await backToLogin.click();
        const allFields = await driver.driver.waitForElementsByClassName(driver.locators.getElementByName("textfield"), 10000);
        await allFields[1].click().sendKeys(password);
        await allFields[0].click().sendKeys(username);
        await driver.driver.hideDeviceKeyboard("Done");
        const logInButton = await driver.findElementByClassName(driver.locators.button);
        await logInButton.click();
        driver.wait("5000");
        const imageviewElement = await driver.findElementByClassName("android.widget.ImageView");
        await imageviewElement.click();
        driver.wait("2000");
        const orderButton = await driver.findElementByXPath("//*[@text = 'Orders (Take/Serve/Bill)']");
        await orderButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const preparationButton = await driver.findElementByXPath("//*[@text = 'Preparation Area']");
        await preparationButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const reportButton = await driver.findElementByXPath("//*[@text = 'Reports']");
        await reportButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const tasksButton = await driver.findElementByXPath("//*[@text = 'Tasks']");
        await tasksButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const myInfoButton = await driver.findElementByXPath("//*[@text = 'My Info']");
        await myInfoButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const employeeButton = await driver.findElementByXPath("//*[@text = 'Me, Company, Empl. & Customers.']");
        await employeeButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const locationButton = await driver.findElementByXPath("//*[@text = 'Locations']");
        await locationButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const productButton = await driver.findElementByXPath("//*[@text = 'Products']");
        await productButton.click();
        driver.wait("3000");
        await imageviewElement.click();
        driver.wait("3000");
        const categoriesButton = await driver.findElementByXPath("//*[@text = 'Categories']");
        await categoriesButton.click();
        driver.wait("3000");

        await imageviewElement.click();
        driver.wait("3000");
        const aboutButton = await driver.findElementByXPath("//*[@text = 'About']");
        await aboutButton.click();
        driver.wait("3000");
    });

    /*
       Scenario: Check all menu icons on the SetUp screen.
       Given I am on the SetUp page
       When I access to the restaurant application.
       When I click the SetUp icon from the dashboard.
       Then I should see 8 menu icons on the SetUp page.
    */
    it("Check all menu icons on the SetUp screen.", async function () {
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
        const checkSetUpbuttons = await driver.findElementByText("SetUp", "contains");
        assert.isTrue(await checkSetUpbuttons.isDisplayed());
        driver.wait("1000");
        const selectOrdermenu = await driver.findElementByXPath("//*[@text = 'SetUp']");
        await selectOrdermenu.click();
        driver.wait("1000");

        //Prep.Loc button
        const checkLocationButtons = await driver.findElementByText("Prep.Loc", "contains");
        assert.isTrue(await checkLocationButtons.isDisplayed());
        driver.wait("1000");
        const selectLocationmenu = await driver.findElementByXPath("//*[@text = 'Prep.Loc']");
        await selectLocationmenu.click();
        driver.wait("1000");
        const checkLocationTitle = await driver.findElementByText("Locations", "contains");
        assert.isTrue(await checkLocationTitle.isDisplayed());
        driver.wait("1000");
        const checkAreatab = await driver.findElementByText("PREPARATION AREA", "contains");
        assert.isTrue(await checkAreatab.isDisplayed());
        driver.wait("1000");
        const checkTableTitle = await driver.findElementByText("TABLE AREAS", "contains");
        assert.isTrue(await checkTableTitle.isDisplayed());
        driver.wait("1000");
        const locationToDashboard = await driver.findElementByXPath("//*[@text = 'Locations']");
        await locationToDashboard.click();
        driver.wait("1000");

        //Category button
        const checkCategoryButtons = await driver.findElementByText("Category", "contains");
        assert.isTrue(await checkCategoryButtons.isDisplayed());
        driver.wait("1000");
        const selectCategoryMenu = await driver.findElementByXPath("//*[@text = 'Category']");
        await selectCategoryMenu.click();
        driver.wait("1000");
        const checkCategoryTitle = await driver.findElementByText("Categories", "contains");
        assert.isTrue(await checkCategoryTitle.isDisplayed());
        driver.wait("1000");
        const categoryToDashboard = await driver.findElementByXPath("//*[@text = 'Categories']");
        await categoryToDashboard.click();
        driver.wait("1000");

        //Product button
        const checkProductButtons = await driver.findElementByText("Product", "contains");
        assert.isTrue(await checkProductButtons.isDisplayed());
        driver.wait("1000");
        const selectProductmenu = await driver.findElementByXPath("//*[@text = 'Product']");
        await selectProductmenu.click();
        driver.wait("1000");
        const checkProductTitle = await driver.findElementByText("Product", "contains");
        assert.isTrue(await checkProductTitle.isDisplayed());
        driver.wait("1000");
        const productToDashboard = await driver.findElementByXPath("//*[@text = 'Product']");
        await productToDashboard.click();
        driver.wait("1000");

        //Employee button
        const checkEmployeeButtons = await driver.findElementByText("Employee", "contains");
        assert.isTrue(await checkEmployeeButtons.isDisplayed());
        driver.wait("1000");
        const selectEmployeemenu = await driver.findElementByXPath("//*[@text = 'Employee']");
        await selectEmployeemenu.click();
        driver.wait("1000");
        const checkEmployeeTitle = await driver.findElementByText("Me, Company, Empl. & Customers.", "contains");
        assert.isTrue(await checkEmployeeTitle.isDisplayed());
        driver.wait("1000");
        const checkCustomerTab = await driver.findElementByText("CUSTOMER", "contains");
        assert.isTrue(await checkCustomerTab.isDisplayed());
        driver.wait("1000");
        const customerTab = await driver.findElementByXPath("//*[@text = 'CUSTOMER']");
        await customerTab.click();
        driver.wait("1000");
        const employeeToDashboard = await driver.findElementByXPath("//*[@text = 'Me, Company, Empl. & Customers.']");
        await employeeToDashboard.click();
        driver.wait("1000");

        //Upgrade button
        const checkUpgradeButtons = await driver.findElementByText("Upgrade", "contains");
        assert.isTrue(await checkUpgradeButtons.isDisplayed());
        driver.wait("1000");
        const selectUpgrademenu = await driver.findElementByXPath("//*[@text = 'Upgrade']");
        await selectUpgrademenu.click();
        driver.wait("1000");
        const checkUpgradeTitle = await driver.findElementByText("Upgrade", "contains");
        assert.isTrue(await checkUpgradeTitle.isDisplayed());
        driver.wait("1000");
        const upgradeToDashboard = await driver.findElementByXPath("//*[@text = 'Upgrade']");
        await upgradeToDashboard.click();
        driver.wait("1000");

    });

});