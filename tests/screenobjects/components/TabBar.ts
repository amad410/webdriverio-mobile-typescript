import { click, waitForElementDisplayed } from "../../helpers/Utils";

export default class TabBar {
    static async openHome () {
        await click($('~Home'));
    }

    static async openWebView () {
        await click($('~Webview'));
    }

    static async openLogin () {
        await click($('~Login'));
    }

    static async openForms () {
        await click($('~Forms'));
    }

    static async openSwipe () {
        await click($('~Swipe'));
    }

    static async openDrag () {
        await click($('~Drag'));
    }

    static async waitForTabBarShown ():Promise<boolean|void> {
       return waitForElementDisplayed($('~Home'), 20000);
    }
}
