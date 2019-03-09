
Module.register('MMM-navbar', {

	defaults: {
		pages: 3,
	},

	getScripts: function () {
		return ["modules/MMM-navbar/jquery-3.1.1.js"];
	},

	getStyles: function () {
		return ["MMM-navbar.css", "font-awesome.css"];
	},

	start() {
		this.curPage = 1;
	},

	checkInterval: function() {
		
		var self = this;

		if (self.curPage === 1) {
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
				self.curPage = 1;
				self.sendNotification('SELECT_PAGE', 1);
				self.updateDom();
			}, 10*60*1000);
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
		} else if (notification === 'MAX_PAGES_CHANGED') {
			Log.log(`${this.name} received a notification to change the maximum number of pages to ${payload}`);
			this.config.pages = payload;
			if (payload - 1 < this.curPage) {
				this.curPage = payload - 1;
				this.checkInterval();
			}
			this.updateDom();
		} else if (notification === 'PAGE_INCREMENT') {
			Log.log(`${this.name} recieved a notification to increment pages!`);
			this.curPage = mod(this.curPage + 1, this.config.pages);
			this.updateDom();
			this.checkInterval();
		} else if (notification === 'PAGE_DECREMENT') {
			Log.log(`${this.name} recieved a notification to decrement pages!`);
			this.curPage = mod(this.curPage - 1, this.config.pages);
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

		var homebutton = document.createElement("span");
		var calendarbutton = document.createElement("span");
		var mediabutton = document.createElement("span");
		var screensaver = document.createElement("span");

		homebutton.className = "fa fa-home MMM-navbar";
		if (this.curPage === 0) {
			homebutton.className += " bright";
		}

		calendarbutton.className = "fa fa-calendar MMM-navbar";
		if (this.curPage === 1) {
			calendarbutton.className += " bright";
		}

		mediabutton.className = "fa fa-music MMM-navbar";
		if (this.curPage === 2) {
			mediabutton.className += " bright";
		}

		screensaver.className = "fa fa-desktop MMM-navbar";
		
		wrapper.appendChild(homebutton);
		wrapper.appendChild(calendarbutton);
		wrapper.appendChild(mediabutton);
		wrapper.appendChild(screensaver);

		homebutton.onclick = makeOnClickHandler(0);
		calendarbutton.onclick = makeOnClickHandler(1);
		mediabutton.onclick = makeOnClickHandler(2);
		
		screensaver.onclick = () => {
			this.sendSocketNotification('START_SCREENSAVER', null);
		};
	

		Log.info("NavBar created");

		return wrapper;

	}

});
