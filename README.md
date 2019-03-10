## MagicMirror Navigation module

My version of a navigation bar for Touchscreen's for [MagicMirror²](https://github.com/MichMich/MagicMirror).
This is based on [MM-navbar](https://github.com/chr1syy/MM-navbar/blob/master/README.md) by chr1syy, but made more generic and compatible with [MMM-Page-Selector](https://github.com/Veldrovive/MMM-Page-Selector)

## Installation
```
cd ~/MagicMirror/modules/
git clone https://github.com/Aruta79/MMM-navbar.git
```

## Usage

Add this to your config.js:
````
		{
			module: "MMM-navbar",
			position: "top_center",
			config: {
				pages: [
					{ icon: "fas fa-home", name: "main" },
					{ icon: "fas fa-calendar", name: "calendar" },
					{ icon: "fas fa-music", name: "media" },
					{ icon: "fas fa-tools", name: "tools" },
				]
			}
		},

````
In the **MMM-Page-Selector** page configuration, the **MMM-navbar** module should be included in _exclusions_, to make it visible on every page.

Configuration:
 - **pages** lists pages to switch to. They should be in the same order as defined in **MMM-Page-Selector**, as the notification "_SELECT_PAGE_" will be sent by page number
 - **icon** defines Font Awesome icon identifier
 
 The navigation bar also includes an additional icon to immediately trigger the screensaver using _xscreensaver_
