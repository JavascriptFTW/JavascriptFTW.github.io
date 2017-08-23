$(document).ready(function() {

	const DEG_RAD_CONST = Math.PI * 2;
	const SCROLL_COEFF = 0.05;


	var $window = $(window);

	var $body = $(document.body);

	var $titleContainer = $(".title-container");

	var $head = $(".title");
	var $subhead = $("<p class='title-sub'>Inventor of the potato</p>");

	$titleContainer.append($subhead);
	$body.append($titleContainer);

	var $frameContainer = $(".frame-container");

	var $bubbleContainer = $(".bubble-container");

	var $navControls = $(".nav-bar-controls");

	var $exitFrame = $navControls.find("#exit-frame");

	var $unscrollFrame = $navControls.find("#unscroll-frame");

	$exitFrame.css("opacity", "0");
	$unscrollFrame.css("opacity", "0");



	var scrollMomentum = 0;

	var subheadMsg = [
		"Inventor of the potato",
		"Homosapien extroardinaire",
		"Your best nightmare",
		"Your worst best friend",
		"LOL",
		"A cat",
		"Not an alien",
		"Java !== JavaScript",
		"The meta guy",
		"..."
	];



	class Bubble {
		constructor(cfg) {
			this.$element = $("<div class='bubble'></div>");
			this.$title = $("<p class='bubble-title'>" + cfg.title + "</p>");
			this.titleText = cfg.title;
            
			this.$element.append(this.$title);
			$bubbleContainer.append(this.$element);
            
			this.relPos = {
				x: cfg.x,
				size: cfg.size
			};
            
			this.pxPos = {
				x: null,
				y: 0,
				size: null
			};
            
			this.$element.click(this.onClickWrapper.bind(this));
            
			this.calcPos();
            
			this.uid = Date.now();
		}
		onClickWrapper() {
			this.onClick();
		}
		onClick() {
            
		}
		calcPos() {
			this.pxPos.size = parseFloat(this.$element.width());
			this.pxPos.x = this.relPos.x / 100 * parseFloat(this.$element.parent().width()) - this.pxPos.size / 2;
			this.pxPos.y = 0;
            
			this.pxPos.x = window.innerWidth / 2 + (this.pxPos.x - window.innerWidth / 2) * (1 + 1/window.innerWidth * window.innerHeight / 10);
            
			if (this.index === undefined) {
				this.index = $bubbleContainer.children().length - 1;
			}
            
			var elementEmWidth = Math.max(Math.min(this.titleText.length + 1, 10), 8);
			if (window.innerWidth < 1100) {
				if (this.index % 2 === 0) {
					this.pxPos.y = window.innerHeight * 0.17;
				}

				this.pxPos.x = window.innerWidth / 2 + (this.pxPos.x - window.innerWidth / 2) * 1.1;
			}
            
			this.$element.css({
				"top": "0px",
				"left": this.pxPos.x + "px",
				"width": elementEmWidth + "em",
				"height": elementEmWidth + "em"
			});
            
			var elementSize = parseFloat(this.$element.css("width"));
            
			this.$title.css({
				"top": elementSize / 2 - parseFloat(this.$title.css("height")) / 2,
				"left": elementSize / 2 - parseFloat(this.$title.css("width")) / 2
			});
		}
		update() {
            
		}
	}
    
    
    
	var activeFrame = null;
    
    
    
	class LinkBubble extends Bubble {
		constructor(cfg) {
			super(cfg);
            
			this.source = cfg.source;
            
			this.cosSeed = Math.random() * 360 / DEG_RAD_CONST;
            
			this.frameAppended = false;
            
			this.$frameWrapper = $("<div class='frame-wrapper'></div>");
			this.$frame = $("<iframe class='frame-content'></iframe>");
            
			this.$frame.attr({
				/* seamless: "seamless", */
				frameborder: "0",
				scrolling: "no",
				src: this.source
			})
            
			this.$frameWrapper.append(this.$frame);
            
			this.$frameContents = this.$frame.contents().find("html");
            
			this.wrapperTop = parseFloat($frameContainer.css("top"));
            
			this.$frameWrapper.css({
				"top": this.wrapperTop + "px"
			});
            
			this.frameScroll = 0;
            
			this.frameHeight = 0;
            
            this.$frame.load(this.$frameLoad.bind(this))
		}
        $frameLoad() {
            $(this.$frame.contents()).mousewheel(scrollListener);
        }
		drift() {
			this.cosSeed += 0.03;
			this.cosSeed %= 360;
			this.$element.css({
				"top": this.pxPos.y + (Math.cos(this.cosSeed) * this.pxPos.size / 15) + "px"
			});
		}
		onClick() {
			this.$frameWrapper.css("z-index", 1);
            
			if (activeFrame && activeFrame.uid !== this.uid) {
				scrollMomentum = 0;
				activeFrame.deactivate(true);
			}
            
			activeFrame = this;
            
			if (!this.frameAppended) {
				$frameContainer.append(this.$frameWrapper);
				this.frameAppended = true;
			}
            
			this.$frame.stop().animate({
				"opacity": "1"
			}, {
				duration: 1500
			});
			$titleContainer.addClass("up");
            
			// Magicks!
			this.animateIn();
            
			$exitFrame.stop().animate({
				"opacity": 1
			}, 1000);
			$exitFrame.css("cursor", "pointer");
		}
		animateIn() {
			/* Don't even ask me why this method works. I don't even know, it just works. This scares me */
			if (parseFloat(this.$frameWrapper.css("top")) > 0) {
				this.$frameWrapper.css("top", "0px");
				setTimeout(this.animateIn.bind(this), 1);
			}
		}
		unscroll() {
			setTimeout(this._unscroll.bind(this), 1)
		}
		_unscroll(times) {
			scrollMomentum = 0;
			times = times + 1 || 0;
			this.frameScroll += 1.2 * times;
			if (-this.frameScroll > 0) {
				setTimeout(this._unscroll.bind(this, times), 7)
			} else {
				this.frameScroll = 0;
				this.scrolled = false;
				$unscrollFrame.stop().animate({
					"opacity": 0
				}, 1000);
				$unscrollFrame.css("cursor", "default");
			}
		}
		addScroll(amount) {
            if (this.wrapperTop + this.frameHeight < window.innerHeight) {
                return;
            }
            
			if (-this.frameScroll > 500 && $unscrollFrame.css("opacity") === "0") {
				$unscrollFrame.animate({
					"opacity": 1
				}, 1000);
				$unscrollFrame.css("cursor", "pointer");
			}
            

            this.frameScroll += amount;
            
            let pos = this.wrapperTop + this.frameScroll + this.frameHeight;
            
            if (pos < window.innerHeight - 20) {
                console.log("Hi", pos)
                this.frameScroll = window.innerHeight - 20 - this.wrapperTop - this.frameHeight;
            } else if (this.frameScroll > 0) {
                this.frameScroll = 0;
            }
            
            
			if (-this.frameScroll > 0) {
				this.scrolled = true;
			}
		}
		deactivate(instant) {
			instant = instant || false;
			this.$frameWrapper.css("z-index", -1);
			this.unscroll();
			$titleContainer.removeClass("up");
            
			setTimeout(this._deactivate.bind(this), 1500 * instant + 1);
            
			$exitFrame.animate({
				"opacity": 0
			}, 1000);
            
			$unscrollFrame.stop().animate({
				"opacity": 0
			}, 1000);
			$exitFrame.css("cursor", "default");
		}
		_deactivate() {
			this.$frame.animate({
				"opacity": 0
			}, 1000, function() {
				this.$frameWrapper.css({
					"top": window.innerHeight - parseFloat($frameContainer.css("top")) / 2 + "px"
				});
			}.bind(this));
		}
		update() {
			if (this.frameAppended) {
				var frameDocHeight = this.$frame.contents().find("html").height();
                console.log(frameDocHeight)
				if (this.frameHeight !== frameDocHeight) {
					this.frameHeight = frameDocHeight;
					this.$frame.height(frameDocHeight);
				}
			}
            
			this.$frame.css("top", this.frameScroll + "px");
            
			this.drift();
		}
	}
    

    
	var bubbles = [
		new LinkBubble({
			x: 30,
			size: 7,
			source: "resume.html",
			title: "Resume"
		}),
		new LinkBubble({
			x: 40,
			size: 7.5,
			source: "about.html",
			title: "About Me"
		}),
		new LinkBubble({
			x: 50,
			size: 6.5,
			source: "blog/index.html",
			title: "My Blog"
		}),
		new LinkBubble({
			x: 60,
			size: 7,
			source: "work.html",
			title: "My Work"
		}),
		new LinkBubble({
			x: 70,
			size: 7.5,
			source: "contact.html",
			title: "Contact Me"
		})
	];
    
    
	$exitFrame.click(function() {
		scrollMomentum = 0;
		if (activeFrame) {
			activeFrame.deactivate();
		}
	});
    
	$unscrollFrame.click(function() {
		scrollMomentum = 0;
		if (activeFrame && activeFrame.scrolled) {
			activeFrame.unscroll();
		}
	});
    
	$subhead.click(function() {
		$subhead.text(subheadMsg[Math.floor(Math.random() * subheadMsg.length)])
	});
    
    
    
	function updatePage() {
		for (var i = 0; i < bubbles.length; i ++) {
			bubbles[i].update();
		}
        
		if (activeFrame) {
			activeFrame.addScroll(scrollMomentum);
			scrollMomentum *= 0.9;
		}
        
		setTimeout(updatePage, 10);
	}
    
    function scrollListener(event) {
        if (activeFrame) {
            scrollMomentum += event.originalEvent.wheelDelta * SCROLL_COEFF;
        }
    }

	$body.mousewheel(scrollListener);

	setTimeout(updatePage, 1);
    
	$(window).resize(function() {
		for (var i = 0; i < bubbles.length; i ++) {
			bubbles[i].calcPos();
		}
	});
});
