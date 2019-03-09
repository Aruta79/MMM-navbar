
Module.register('MMM-navbar', {

	defaults: {
		pages: [
			{ icon: "fas fa-home", name: "main" },
			{ icon: "fas fa-calendar", name: "calendar" },
			{ icon: "fas fa-music", name: "media" },
			{ icon: "fas fa-tools", name: "tools" },
		],
		defaultPage: 1,
		defaultInterval: 10*60*1000,
	},

	getScripts: function () {
		return ["modules/MMM-navbar/jquery-3.1.1.js"];
	},

	getStyles: function () {
		return ["MMM-navbar.css", "font-awesome5.css"];
	},

	start() {
		this.curPage = this.config.defaultPage;
	},

	checkInterval: function() {
		
		var self = this;

		if (self.curPage === self.config.defaultPage) {
			if (self.changeInterval != null)
			{
				console.log("Clearing page change interval");
				clearInterval(self.changeInterval);
				self.changeInterval = null;
			}					
		}
		else
		{
			console.log("Starting page change interval");
			self.changeInterval = setInterval(() => {
				self.curPage = self.config.defaultPage;
				self.sendNotification('SELECT_PAGE', self.config.defaultPage);
				self.updateDom();
			}, self.config.defaultInterval);
		}
	},
	
	notificationReceived(notification, payload) {
		/**
		 * Modulo that also works with negative numbers.
		 * @param {number} x The dividend
		 * @param {number} n The divisor
		 */
		const mod = (x, n) => ((x % n) + n) % n;

		if (notification === 'SELECT_PAGE') {
			Log.log(`${this.name} recieved a notification to change to page ${payload}`);
			this.curPage = payload;
			this.updateDom();
			this.checkInterval();
		}
/*		else if (notification === 'MAX_PAGES_CHANGED') {
			Log.log(`${this.name} received a notification to change the maximum number of pages to ${payload}`);
			this.config.pages = payload;
			if (payload - 1 < this.curPage) {
				this.curPage = payload - 1;
				this.checkInterval();
			}
			this.updateDom();
		}
*/		else if (notification === 'PAGE_INCREMENT') {
			Log.log(`${this.name} recieved a notification to increment pages!`);
			this.curPage = mod(this.curPage + 1, this.config.pages.length);
			this.updateDom();
			this.checkInterval();
		} else if (notification === 'PAGE_DECREMENT') {
			Log.log(`${this.name} recieved a notification to decrement pages!`);
			this.curPage = mod(this.curPage - 1, this.config.pages.length);
			this.updateDom();
			this.checkInterval();
		}
	},

	getDom: function () {

		var self = this;

		function makeOnClickHandler(a) {
			return function () {
				self.curPage = a;
				self.sendNotification('SELECT_PAGE', a);
				self.updateDom();
				
				self.checkInterval();
			};
		}

		var wrapper = document.createElement("div");
		wrapper.className = "MMM-navbar";

		self.config.pages.forEach(function(page) {
			var pageNode =  document.createElement("span");
			pageNode.className = page.icon + ' MMM-navbar';
			if (self.curPage == self.config.pages.indexOf(page)) {
				pageNode.className += ' bright';
			}
			pageNode.onclick = makeOnClickHandler(self.config.pages.indexOf(page));
			
			wrapper.appendChild(pageNode);
		}, self);
		
		var screensaver = document.createElement("span");
		screensaver.className = "fa fa-desktop MMM-navbar";
		screensaver.onclick = () => {
			this.sendSocketNotification('START_SCREENSAVER', null);
		};
		
		wrapper.appendChild(screensaver);

		Log.info("NavBar created");

		return wrapper;

	}

});
