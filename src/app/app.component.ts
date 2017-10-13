import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { ConferenceDataProvider } from '../providers/conference-data/conference-data';
import { UserDataProvider } from '../providers/user-data/user-data';

export interface PageInterface {
  title: string;
  name: string;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
  // template: `<ion-nav root="MenuPage"></ion-nav>`
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  appPages: PageInterface[] = [
    { title: 'Schedule', name: 'TabsPage', index: 0, icon: 'calendar' },
    { title: 'Speakers', name: 'TabsPage', index: 1, icon: 'contacts' },
    { title: 'Map', name: 'TabsPage', index: 2, icon: 'map' },
    { title: 'About', name: 'TabsPage', index: 3, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', name: 'AccountPage', icon: 'person' },
    { title: 'Support', name: 'SupportPage', icon: 'help' },
    { title: 'Logout', name: 'TabsPage', icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', icon: 'log-in' },
    { title: 'Support', name: 'SupportPage', icon: 'help' },
    { title: 'Signup', name: 'SignupPage', icon: 'person-add' }
  ];

  rootPage: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public menu: MenuController,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public confData: ConferenceDataProvider,
    public userData: UserDataProvider,
  ) {
    this.storage.get('hasSeenTutorial')
    .then((hasSeenTutorial) => {
      console.log('hasSeenTutorial', hasSeenTutorial);
      if (hasSeenTutorial) {
        this.rootPage = 'TabsPage';
      } else {
        this.rootPage = 'TutorialPage';
      }
      this.platformReady();
    });

    confData.load();



  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openTutorial() {
    this.nav.setRoot('TutorialPage');
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  openPage(page: PageInterface) {
    console.dir(page);
    console.log(`page index ${page.index}`);

    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      console.log("okok");
      console.dir(this.nav);
      this.nav.setRoot(page.name);
      // this.rootPage = page.name;
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
  }
}
