/**
 * Get the time difference in seconds
 */
export function timeDifference (string: string, start:number, end:number) {
    const elapsed = (end - start) / 1000;
    console.log(`${string} It took ${elapsed} seconds.`);
}

/**
 * Create a cross platform solution for opening a deep link
 */
export async function openDeepLinkUrl(url:string) {
    const prefix = 'wdio://';

    if (driver.isAndroid) {
        // Life is so much easier
        return driver.execute('mobile:deepLink', {
            url: `${ prefix }${ url }`,
            package: 'com.wdiodemoapp',
        });
    }

    // We can use `driver.url` on iOS simulators, but not on iOS real devices. The reason is that iOS real devices
    // open Siri when you call `driver.url('')` to use a deep link. This means that real devices need to have a different implementation
    // then iOS sims
    // iOS sims and real devices can be distinguished by their UDID. Based on these sources there is a diff in the UDIDS
    // - https://blog.diawi.com/2018/10/15/2018-apple-devices-and-their-new-udid-format/
    // - https://www.theiphonewiki.com/wiki/UDID
    // iOS sims have more than 1 `-` in the UDID and the UDID is being
    const simulatorRegex = new RegExp('(.*-.*){2,}');

    // Check if we are a simulator
    if ('udid' in driver.capabilities && simulatorRegex.test( driver.capabilities.udid as string )){
        await driver.url(`${ prefix }${ url }`);
    } else {
        // Else we are a real device and we need to take some extra steps
        // Launch Safari to open the deep link
        await driver.execute('mobile: launchApp', { bundleId: 'com.apple.mobilesafari' });

        // Add the deep link url in Safari in the `URL`-field
        // This can be 2 different elements, or the button, or the text field
        // Use the predicate string because  the accessibility label will return 2 different types
        // of elements making it flaky to use. With predicate string we can be more precise
        const addressBarSelector = 'label == "Address" OR name == "URL"';
        const urlFieldSelector = 'type == "XCUIElementTypeTextField" && name CONTAINS "URL"';
        const addressBar = $(`-ios predicate string:${ addressBarSelector }`);
        const urlField = $(`-ios predicate string:${ urlFieldSelector }`);

        // Wait for the url button to appear and click on it so the text field will appear
        // iOS 13 now has the keyboard open by default because the URL field has focus when opening the Safari browser
        if (!(await driver.isKeyboardShown())) {
            await addressBar.waitForDisplayed();
            await addressBar.click();
        }

        // Submit the url and add a break
        await urlField.setValue(`${ prefix }${ url }\uE007`);
    }

    /**
     * PRO TIP:
     * if you started the iOS device with `autoAcceptAlerts:true` in the capabilities then Appium will auto accept the alert that should
     * be shown now. You can then comment out the code below
     */
    // Wait for the notification and accept it
    // When using an iOS simulator you will only get the pop-up once, all the other times it won't be shown
    try {
        const openSelector = 'type == \'XCUIElementTypeButton\' && name CONTAINS \'Open\'';
        const openButton = $(`-ios predicate string:${ openSelector }`);
        // Assumption is made that the alert will be seen within 2 seconds, if not it did not appear
        await openButton.waitForDisplayed({ timeout: 2000 });
        await openButton.click();
    } catch (e) {
        // ignore
    }
}

export const selectDropDown = async(elements : Promise<WebdriverIO.ElementArray>, value : string) =>{
    const element = await elements;
    for (let i = 0; i < element.length; i++)
    {
        const elem = await (element[i]).getAttribute('value');
        if (elem === value){
            await (element[i]).click();
            break;
        }
    }

}

export const setText = async(element : Promise<WebdriverIO.Element>, text : string[]) =>{
    const elem = await element;
   elem.sendKeys(text);

}

export const setValue = async(element : Promise<WebdriverIO.Element>, text : string[]) =>{
    const elem = await element;
   elem.setValue(text);

}

export const addValue = async(element : Promise<WebdriverIO.Element>, text : string[]) =>{
    const elem = await element;
   elem.addValue(text);

}

export const clearValue = async(element : Promise<WebdriverIO.Element>, text : string[]) =>{
    const elem = await element;
   elem.clearValue();

}

export const selectByVisibleText = async(element : Promise<WebdriverIO.Element>, text : string) =>{
    const elem = await element;
    elem.selectByVisibleText(text);

}

export const navigateToActivity = async(appPackage: string,appActivity: string) =>{
    await driver.startActivity(appPackage, appPackage  + "." + appActivity);
}

export const click = async(element : Promise<WebdriverIO.Element>) =>{
    const elem = await element;
   elem.click();

}

export const clickByText = async(text: string) =>{
    await (await $('//*[@text="${text}"]')).click();

}

export const acceptAlert = async() =>{
    await driver.acceptAlert();

}

export const dismissAlert = async() =>{
    await driver.dismissAlert();

}

export const getAlertText = async() : Promise<string> =>{
    return await driver.getAlertText();

}
export const getValue = async(element : Promise<WebdriverIO.Element>) : Promise<string> =>{
    const elem = await element;
    return elem.getText();

}

export const androidScrollToEnd = async(attempts: number, speed: number)=>
{
    await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(${attempts},${speed})');
}
export const androidScrollForward = async()=>
{
    await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollForward()');
}

export const androidScrollBackward = async()=>
{
    await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollBackward()');
}

export const androidScrollIntoView = async(text: string)=>
{
    await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrolltextIntoView(${text})');
}
export const iOSScrollDown = async()=>
{
    await driver.execute('mobile: scroll', {direction: "down"});
}

export const iOSScrollDownElement = async(elementToClick: Promise<WebdriverIO.Element>,elementToScroll: Promise<WebdriverIO.Element>)=>
{
    const elemClick = await elementToClick;
    elemClick.click();

    const elemScroll = await elementToScroll;

    await driver.execute('mobile: scroll', {element: elemScroll.elementId, direction: "down"});
}


export const iOSScrollUp = async()=>
{
    await driver.execute('mobile: scroll', {direction: "up"});
}
export const iOSScrollUpElement = async(elementToClick: Promise<WebdriverIO.Element>,elementToScroll: Promise<WebdriverIO.Element>)=>
{
    const elemClick = await elementToClick;
    elemClick.click();

    const elemScroll = await elementToScroll;
    
    await driver.execute('mobile: scroll', {element: elemScroll.elementId, direction: "up"});
}


export const waitForElementDisplayed = async(element :Promise<WebdriverIO.Element>, wait : number ):Promise<boolean|void> =>
{
    const elem = await element;
    return elem.waitForDisplayed({
        timeout: wait,
    });
}

export const getElements = async(element :Promise<WebdriverIO.Element>):Promise<WebdriverIO.ElementArray> =>
{
    const elem = await element;
    return $$(elem);
}

export const iOSPickValue = async(element :Promise<WebdriverIO.Element>, value: string) =>{
    const elem = await element;
    elem.addValue(value);
}

export const deleteSession = async() =>{
    await driver.deleteSession();
}





