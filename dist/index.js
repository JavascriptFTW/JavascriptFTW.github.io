(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {

	var DEG_RAD_CONST = Math.PI * 2;
	var SCROLL_COEFF = 0.05;

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

	var subheadMsg = ["Inventor of the potato", "Homosapien extroardinaire", "Your best nightmare", "Your worst best friend", "LOL", "A cat", "Not an alien", "Java !== JavaScript", "The meta guy", "..."];

	var Bubble = function () {
		function Bubble(cfg) {
			_classCallCheck(this, Bubble);

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

		_createClass(Bubble, [{
			key: "onClickWrapper",
			value: function onClickWrapper() {
				this.onClick();
			}
		}, {
			key: "onClick",
			value: function onClick() {}
		}, {
			key: "calcPos",
			value: function calcPos() {
				this.pxPos.size = parseFloat(this.$element.width());
				this.pxPos.x = this.relPos.x / 100 * parseFloat(this.$element.parent().width()) - this.pxPos.size / 2;
				this.pxPos.y = 0;

				this.pxPos.x = window.innerWidth / 2 + (this.pxPos.x - window.innerWidth / 2) * (1 + 1 / window.innerWidth * window.innerHeight / 10);

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
		}, {
			key: "update",
			value: function update() {}
		}]);

		return Bubble;
	}();

	var activeFrame = null;

	var LinkBubble = function (_Bubble) {
		_inherits(LinkBubble, _Bubble);

		function LinkBubble(cfg) {
			_classCallCheck(this, LinkBubble);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LinkBubble).call(this, cfg));

			_this.source = cfg.source;

			_this.cosSeed = Math.random() * 360 / DEG_RAD_CONST;

			_this.frameAppended = false;

			_this.$frameWrapper = $("<div class='frame-wrapper'></div>");
			_this.$frame = $("<iframe class='frame-content'></iframe>");

			_this.$frame.attr({
				/* seamless: "seamless", */
				frameborder: "0",
				scrolling: "no",
				src: _this.source
			});

			_this.$frameWrapper.append(_this.$frame);

			_this.$frameContents = _this.$frame.contents().find("html");

			_this.wrapperTop = parseFloat($frameContainer.css("top"));

			_this.$frameWrapper.css({
				"top": _this.wrapperTop + "px"
			});

			_this.frameScroll = 0;

			_this.frameHeight = 0;
			return _this;
		}

		_createClass(LinkBubble, [{
			key: "drift",
			value: function drift() {
				this.cosSeed += 0.03;
				this.cosSeed %= 360;
				this.$element.css({
					"top": this.pxPos.y + Math.cos(this.cosSeed) * this.pxPos.size / 15 + "px"
				});
			}
		}, {
			key: "onClick",
			value: function onClick() {
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
		}, {
			key: "animateIn",
			value: function animateIn() {
				/* Don't even ask me why this method works. I don't even know, it just works. This scares me */
				if (parseFloat(this.$frameWrapper.css("top")) > 0) {
					this.$frameWrapper.css("top", "0px");
					setTimeout(this.animateIn.bind(this), 1);
				}
			}
		}, {
			key: "unscroll",
			value: function unscroll() {
				setTimeout(this._unscroll.bind(this), 1);
			}
		}, {
			key: "_unscroll",
			value: function _unscroll(times) {
				scrollMomentum = 0;
				times = times + 1 || 0;
				this.frameScroll += 1.2 * times;
				if (-this.frameScroll > 0) {
					setTimeout(this._unscroll.bind(this, times), 7);
				} else {
					this.frameScroll = 0;
					this.scrolled = false;
					$unscrollFrame.stop().animate({
						"opacity": 0
					}, 1000);
					$unscrollFrame.css("cursor", "default");
				}
			}
		}, {
			key: "addScroll",
			value: function addScroll(amount) {
				if (this.wrapperTop + this.frameHeight < window.innerHeight) return;
				console.log(this.frameScroll);
				if (-this.frameScroll > 500 && $unscrollFrame.css("opacity") === "0") {
					$unscrollFrame.animate({
						"opacity": 1
					}, 1000);
					$unscrollFrame.css("cursor", "pointer");
				}

				if (this.frameScroll + amount >= 0) {
					this.frameScroll = 0;
				} else if (-(this.frameScroll + amount) > this.frameHeight - 500) {
					this.frameScroll = -this.frameHeight + 500;
				} else {
					this.frameScroll += amount;
				}

				if (-this.frameScroll > 0) {
					this.scrolled = true;
				}
			}
		}, {
			key: "deactivate",
			value: function deactivate(instant) {
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
		}, {
			key: "_deactivate",
			value: function _deactivate() {
				this.$frame.animate({
					"opacity": 0
				}, 1000, function () {
					this.$frameWrapper.css({
						"top": window.innerHeight - parseFloat($frameContainer.css("top")) / 2 + "px"
					});
				}.bind(this));
			}
		}, {
			key: "update",
			value: function update() {
				if (this.frameAppended) {
					var frameDocHeight = this.$frame.contents().find("html").height();

					if (this.frameHeight !== frameDocHeight) {
						this.frameHeight = frameDocHeight;
						this.$frame.height(frameDocHeight);
					}
				}

				this.$frame.css("top", this.frameScroll + "px");

				this.drift();
			}
		}]);

		return LinkBubble;
	}(Bubble);

	var bubbles = [new LinkBubble({
		x: 30,
		size: 7,
		source: "resume.html",
		title: "Resume"
	}), new LinkBubble({
		x: 40,
		size: 7.5,
		source: "about.html",
		title: "About Me"
	}), new LinkBubble({
		x: 50,
		size: 6.5,
		source: "blog/index.html",
		title: "My Blog"
	}), new LinkBubble({
		x: 60,
		size: 7,
		source: "work.html",
		title: "My Work"
	}), new LinkBubble({
		x: 70,
		size: 7.5,
		source: "contact.html",
		title: "Contact Me"
	})];

	$exitFrame.click(function () {
		scrollMomentum = 0;
		if (activeFrame) {
			activeFrame.deactivate();
		}
	});

	$unscrollFrame.click(function () {
		scrollMomentum = 0;
		if (activeFrame && activeFrame.scrolled) {
			activeFrame.unscroll();
		}
	});

	$subhead.click(function () {
		$subhead.text(subheadMsg[Math.floor(Math.random() * subheadMsg.length)]);
	});

	function updatePage() {
		for (var i = 0; i < bubbles.length; i++) {
			bubbles[i].update();
		}
		if (activeFrame) {
			activeFrame.addScroll(scrollMomentum);
			scrollMomentum *= 0.9;
		}

		setTimeout(updatePage, 10);
	}

	$body.mousewheel(function (event) {
		if (activeFrame) {
			scrollMomentum += event.originalEvent.wheelDelta * SCROLL_COEFF;
		}
	});

	setTimeout(updatePage, 1);

	$(window).resize(function () {
		for (var i = 0; i < bubbles.length; i++) {
			bubbles[i].calcPos();
		}
	});
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXHNjcmlwdHNcXGluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztBQ0FBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBVzs7QUFFNUIsS0FBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBTSxZQUFZLEdBQUcsSUFBSSxDQUFDOztBQUcxQixLQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXhCLEtBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTdCLEtBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU1QyxLQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEIsS0FBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7O0FBRXBFLGdCQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pDLE1BQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRTlCLEtBQUksZUFBZSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUU1QyxLQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5QyxLQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFMUMsS0FBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFbEQsS0FBSSxjQUFjLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUUxRCxXQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMvQixlQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFJbkMsS0FBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV2QixLQUFJLFVBQVUsR0FBRyxDQUNoQix3QkFBd0IsRUFDeEIsMkJBQTJCLEVBQzNCLHFCQUFxQixFQUNyQix3QkFBd0IsRUFDeEIsS0FBSyxFQUNMLE9BQU8sRUFDUCxjQUFjLEVBQ2QscUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxLQUFLLENBQ0wsQ0FBQzs7S0FJSSxNQUFNO0FBQ1gsV0FESyxNQUFNLENBQ0MsR0FBRyxFQUFFO3lCQURaLE1BQU07O0FBRVYsT0FBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNoRCxPQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQywwQkFBMEIsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ2pFLE9BQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzs7QUFFM0IsT0FBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLG1CQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXZDLE9BQUksQ0FBQyxNQUFNLEdBQUc7QUFDYixLQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDUixRQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7SUFDZCxDQUFDOztBQUVGLE9BQUksQ0FBQyxLQUFLLEdBQUc7QUFDWixLQUFDLEVBQUUsSUFBSTtBQUNQLEtBQUMsRUFBRSxDQUFDO0FBQ0osUUFBSSxFQUFFLElBQUk7SUFDVixDQUFDOztBQUVGLE9BQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXBELE9BQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFZixPQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUF6QkksTUFBTTs7b0NBMEJNO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNmOzs7NkJBQ1MsRUFFVDs7OzZCQUNTO0FBQ1QsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNwRCxRQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDdEcsUUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVqQixRQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFBLElBQUssQ0FBQyxHQUFHLENBQUMsR0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQzs7QUFFcEksUUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUM3QixTQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDcEQ7O0FBRUQsUUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRSxRQUFJLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxFQUFFO0FBQzdCLFNBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO01BQ3pDOztBQUVELFNBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUM7S0FDcEY7O0FBRUQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDakIsVUFBSyxFQUFFLEtBQUs7QUFDWixXQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSTtBQUMzQixZQUFPLEVBQUUsY0FBYyxHQUFHLElBQUk7QUFDOUIsYUFBUSxFQUFFLGNBQWMsR0FBRyxJQUFJO0tBQy9CLENBQUMsQ0FBQzs7QUFFSCxRQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7QUFFekQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDZixVQUFLLEVBQUUsV0FBVyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2xFLFdBQU0sRUFBRSxXQUFXLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUM7S0FDbEUsQ0FBQyxDQUFDO0lBQ0g7Ozs0QkFDUSxFQUVSOzs7U0FwRUksTUFBTTs7O0FBeUVaLEtBQUksV0FBVyxHQUFHLElBQUksQ0FBQzs7S0FJakIsVUFBVTtZQUFWLFVBQVU7O0FBQ2YsV0FESyxVQUFVLENBQ0gsR0FBRyxFQUFFO3lCQURaLFVBQVU7O3NFQUFWLFVBQVUsYUFFUixHQUFHOztBQUVULFNBQUssTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7O0FBRXpCLFNBQUssT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDOztBQUVuRCxTQUFLLGFBQWEsR0FBRyxLQUFLLENBQUM7O0FBRTNCLFNBQUssYUFBYSxHQUFHLENBQUMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQzVELFNBQUssTUFBTSxHQUFHLENBQUMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDOztBQUUzRCxTQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0FBRWhCLGVBQVcsRUFBRSxHQUFHO0FBQ2hCLGFBQVMsRUFBRSxJQUFJO0FBQ2YsT0FBRyxFQUFFLE1BQUssTUFBTTtJQUNoQixDQUFDLENBQUE7O0FBRUYsU0FBSyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQUssTUFBTSxDQUFDLENBQUM7O0FBRXZDLFNBQUssY0FBYyxHQUFHLE1BQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFMUQsU0FBSyxVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFekQsU0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDO0FBQ3RCLFNBQUssRUFBRSxNQUFLLFVBQVUsR0FBRyxJQUFJO0lBQzdCLENBQUMsQ0FBQzs7QUFFSCxTQUFLLFdBQVcsR0FBRyxDQUFDLENBQUM7O0FBRXJCLFNBQUssV0FBVyxHQUFHLENBQUMsQ0FBQzs7R0FDckI7O2VBakNJLFVBQVU7OzJCQWtDUDtBQUNQLFFBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ2pCLFVBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLEFBQUMsR0FBRyxJQUFJO0tBQzVFLENBQUMsQ0FBQztJQUNIOzs7NkJBQ1M7QUFDVCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXJDLFFBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNoRCxtQkFBYyxHQUFHLENBQUMsQ0FBQztBQUNuQixnQkFBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7QUFFRCxlQUFXLEdBQUcsSUFBSSxDQUFDOztBQUVuQixRQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN4QixvQkFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0MsU0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7S0FDMUI7O0FBRUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDMUIsY0FBUyxFQUFFLEdBQUc7S0FDZCxFQUFFO0FBQ0YsYUFBUSxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUM7QUFDSCxtQkFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7OztBQUFDLEFBRy9CLFFBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFakIsY0FBVSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUN6QixjQUFTLEVBQUUsQ0FBQztLQUNaLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDVCxjQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQzs7OytCQUNXOztBQUVYLFFBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xELFNBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyQyxlQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDekM7SUFDRDs7OzhCQUNVO0FBQ1YsY0FBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3hDOzs7NkJBQ1MsS0FBSyxFQUFFO0FBQ2hCLGtCQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLFNBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDaEMsUUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFO0FBQzFCLGVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDL0MsTUFBTTtBQUNOLFNBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFNBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3RCLG1CQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQzdCLGVBQVMsRUFBRSxDQUFDO01BQ1osRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNULG1CQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN4QztJQUNEOzs7NkJBQ1MsTUFBTSxFQUFFO0FBQ2pCLFFBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUNwRSxXQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5QixRQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUU7QUFDckUsbUJBQWMsQ0FBQyxPQUFPLENBQUM7QUFDdEIsZUFBUyxFQUFFLENBQUM7TUFDWixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1QsbUJBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDOztBQUVELFFBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ25DLFNBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0tBQ3JCLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFBLEFBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsRUFBRTtBQUNqRSxTQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7S0FDM0MsTUFBTTtBQUNOLFNBQUksQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDO0tBQzNCOztBQUVELFFBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtBQUMxQixTQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUNyQjtJQUNEOzs7OEJBQ1UsT0FBTyxFQUFFO0FBQ25CLFdBQU8sR0FBRyxPQUFPLElBQUksS0FBSyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixtQkFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFbEMsY0FBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0FBRTVELGNBQVUsQ0FBQyxPQUFPLENBQUM7QUFDbEIsY0FBUyxFQUFFLENBQUM7S0FDWixFQUFFLElBQUksQ0FBQyxDQUFDOztBQUVULGtCQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQzdCLGNBQVMsRUFBRSxDQUFDO0tBQ1osRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNULGNBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDOzs7aUNBQ2E7QUFDYixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUNuQixjQUFTLEVBQUUsQ0FBQztLQUNaLEVBQUUsSUFBSSxFQUFFLFlBQVc7QUFDbkIsU0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDdEIsV0FBSyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSTtNQUM3RSxDQUFDLENBQUM7S0FDSCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2Q7Ozs0QkFDUTtBQUNSLFFBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN2QixTQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFbEUsU0FBSSxJQUFJLENBQUMsV0FBVyxLQUFLLGNBQWMsRUFBRTtBQUN4QyxVQUFJLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQztBQUNsQyxVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUNuQztLQUNEOztBQUVELFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDOztBQUVoRCxRQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDYjs7O1NBN0pJLFVBQVU7R0FBUyxNQUFNOztBQWtLL0IsS0FBSSxPQUFPLEdBQUcsQ0FDYixJQUFJLFVBQVUsQ0FBQztBQUNkLEdBQUMsRUFBRSxFQUFFO0FBQ0wsTUFBSSxFQUFFLENBQUM7QUFDUCxRQUFNLEVBQUUsYUFBYTtBQUNyQixPQUFLLEVBQUUsUUFBUTtFQUNmLENBQUMsRUFDRixJQUFJLFVBQVUsQ0FBQztBQUNkLEdBQUMsRUFBRSxFQUFFO0FBQ0wsTUFBSSxFQUFFLEdBQUc7QUFDVCxRQUFNLEVBQUUsWUFBWTtBQUNwQixPQUFLLEVBQUUsVUFBVTtFQUNqQixDQUFDLEVBQ0YsSUFBSSxVQUFVLENBQUM7QUFDZCxHQUFDLEVBQUUsRUFBRTtBQUNMLE1BQUksRUFBRSxHQUFHO0FBQ1QsUUFBTSxFQUFFLGlCQUFpQjtBQUN6QixPQUFLLEVBQUUsU0FBUztFQUNoQixDQUFDLEVBQ0YsSUFBSSxVQUFVLENBQUM7QUFDZCxHQUFDLEVBQUUsRUFBRTtBQUNMLE1BQUksRUFBRSxDQUFDO0FBQ1AsUUFBTSxFQUFFLFdBQVc7QUFDbkIsT0FBSyxFQUFFLFNBQVM7RUFDaEIsQ0FBQyxFQUNGLElBQUksVUFBVSxDQUFDO0FBQ2QsR0FBQyxFQUFFLEVBQUU7QUFDTCxNQUFJLEVBQUUsR0FBRztBQUNULFFBQU0sRUFBRSxjQUFjO0FBQ3RCLE9BQUssRUFBRSxZQUFZO0VBQ25CLENBQUMsQ0FDRixDQUFDOztBQUdGLFdBQVUsQ0FBQyxLQUFLLENBQUMsWUFBVztBQUMzQixnQkFBYyxHQUFHLENBQUMsQ0FBQztBQUNuQixNQUFJLFdBQVcsRUFBRTtBQUNoQixjQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDekI7RUFDRCxDQUFDLENBQUM7O0FBRUgsZUFBYyxDQUFDLEtBQUssQ0FBQyxZQUFXO0FBQy9CLGdCQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLE1BQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDeEMsY0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ3ZCO0VBQ0QsQ0FBQyxDQUFDOztBQUVILFNBQVEsQ0FBQyxLQUFLLENBQUMsWUFBVztBQUN6QixVQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0VBQ3hFLENBQUMsQ0FBQzs7QUFJSCxVQUFTLFVBQVUsR0FBRztBQUNyQixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUcsRUFBRTtBQUN6QyxVQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7R0FDcEI7QUFDRCxNQUFJLFdBQVcsRUFBRTtBQUNoQixjQUFXLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3RDLGlCQUFjLElBQUksR0FBRyxDQUFDO0dBQ3RCOztBQUVELFlBQVUsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDM0I7O0FBRUQsTUFBSyxDQUFDLFVBQVUsQ0FBQyxVQUFTLEtBQUssRUFBRTtBQUNoQyxNQUFJLFdBQVcsRUFBRTtBQUNoQixpQkFBYyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLFlBQVksQ0FBQztHQUNoRTtFQUNELENBQUMsQ0FBQzs7QUFFSCxXQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUUxQixFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVc7QUFDM0IsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFHLEVBQUU7QUFDekMsVUFBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQ3JCO0VBQ0QsQ0FBQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdGNvbnN0IERFR19SQURfQ09OU1QgPSBNYXRoLlBJICogMjtcblx0Y29uc3QgU0NST0xMX0NPRUZGID0gMC4wNTtcblxuXG5cdHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG5cdHZhciAkYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG5cblx0dmFyICR0aXRsZUNvbnRhaW5lciA9ICQoXCIudGl0bGUtY29udGFpbmVyXCIpO1xuXG5cdHZhciAkaGVhZCA9ICQoXCIudGl0bGVcIik7XG5cdHZhciAkc3ViaGVhZCA9ICQoXCI8cCBjbGFzcz0ndGl0bGUtc3ViJz5JbnZlbnRvciBvZiB0aGUgcG90YXRvPC9wPlwiKTtcblxuXHQkdGl0bGVDb250YWluZXIuYXBwZW5kKCRzdWJoZWFkKTtcblx0JGJvZHkuYXBwZW5kKCR0aXRsZUNvbnRhaW5lcik7XG5cblx0dmFyICRmcmFtZUNvbnRhaW5lciA9ICQoXCIuZnJhbWUtY29udGFpbmVyXCIpO1xuXG5cdHZhciAkYnViYmxlQ29udGFpbmVyID0gJChcIi5idWJibGUtY29udGFpbmVyXCIpO1xuXG5cdHZhciAkbmF2Q29udHJvbHMgPSAkKFwiLm5hdi1iYXItY29udHJvbHNcIik7XG5cblx0dmFyICRleGl0RnJhbWUgPSAkbmF2Q29udHJvbHMuZmluZChcIiNleGl0LWZyYW1lXCIpO1xuXG5cdHZhciAkdW5zY3JvbGxGcmFtZSA9ICRuYXZDb250cm9scy5maW5kKFwiI3Vuc2Nyb2xsLWZyYW1lXCIpO1xuXG5cdCRleGl0RnJhbWUuY3NzKFwib3BhY2l0eVwiLCBcIjBcIik7XG5cdCR1bnNjcm9sbEZyYW1lLmNzcyhcIm9wYWNpdHlcIiwgXCIwXCIpO1xuXG5cblxuXHR2YXIgc2Nyb2xsTW9tZW50dW0gPSAwO1xuXG5cdHZhciBzdWJoZWFkTXNnID0gW1xuXHRcdFwiSW52ZW50b3Igb2YgdGhlIHBvdGF0b1wiLFxuXHRcdFwiSG9tb3NhcGllbiBleHRyb2FyZGluYWlyZVwiLFxuXHRcdFwiWW91ciBiZXN0IG5pZ2h0bWFyZVwiLFxuXHRcdFwiWW91ciB3b3JzdCBiZXN0IGZyaWVuZFwiLFxuXHRcdFwiTE9MXCIsXG5cdFx0XCJBIGNhdFwiLFxuXHRcdFwiTm90IGFuIGFsaWVuXCIsXG5cdFx0XCJKYXZhICE9PSBKYXZhU2NyaXB0XCIsXG5cdFx0XCJUaGUgbWV0YSBndXlcIixcblx0XHRcIi4uLlwiXG5cdF07XG5cblxuXG5cdGNsYXNzIEJ1YmJsZSB7XG5cdFx0Y29uc3RydWN0b3IoY2ZnKSB7XG5cdFx0XHR0aGlzLiRlbGVtZW50ID0gJChcIjxkaXYgY2xhc3M9J2J1YmJsZSc+PC9kaXY+XCIpO1xuXHRcdFx0dGhpcy4kdGl0bGUgPSAkKFwiPHAgY2xhc3M9J2J1YmJsZS10aXRsZSc+XCIgKyBjZmcudGl0bGUgKyBcIjwvcD5cIik7XG5cdFx0XHR0aGlzLnRpdGxlVGV4dCA9IGNmZy50aXRsZTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy4kZWxlbWVudC5hcHBlbmQodGhpcy4kdGl0bGUpO1xuXHRcdFx0JGJ1YmJsZUNvbnRhaW5lci5hcHBlbmQodGhpcy4kZWxlbWVudCk7XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMucmVsUG9zID0ge1xuXHRcdFx0XHR4OiBjZmcueCxcblx0XHRcdFx0c2l6ZTogY2ZnLnNpemVcblx0XHRcdH07XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMucHhQb3MgPSB7XG5cdFx0XHRcdHg6IG51bGwsXG5cdFx0XHRcdHk6IDAsXG5cdFx0XHRcdHNpemU6IG51bGxcblx0XHRcdH07XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuJGVsZW1lbnQuY2xpY2sodGhpcy5vbkNsaWNrV3JhcHBlci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy5jYWxjUG9zKCk7XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMudWlkID0gRGF0ZS5ub3coKTtcblx0XHR9XG5cdFx0b25DbGlja1dyYXBwZXIoKSB7XG5cdFx0XHR0aGlzLm9uQ2xpY2soKTtcblx0XHR9XG5cdFx0b25DbGljaygpIHtcbiAgICAgICAgICAgIFxuXHRcdH1cblx0XHRjYWxjUG9zKCkge1xuXHRcdFx0dGhpcy5weFBvcy5zaXplID0gcGFyc2VGbG9hdCh0aGlzLiRlbGVtZW50LndpZHRoKCkpO1xuXHRcdFx0dGhpcy5weFBvcy54ID0gdGhpcy5yZWxQb3MueCAvIDEwMCAqIHBhcnNlRmxvYXQodGhpcy4kZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpKSAtIHRoaXMucHhQb3Muc2l6ZSAvIDI7XG5cdFx0XHR0aGlzLnB4UG9zLnkgPSAwO1xuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLnB4UG9zLnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgKyAodGhpcy5weFBvcy54IC0gd2luZG93LmlubmVyV2lkdGggLyAyKSAqICgxICsgMS93aW5kb3cuaW5uZXJXaWR0aCAqIHdpbmRvdy5pbm5lckhlaWdodCAvIDEwKTtcbiAgICAgICAgICAgIFxuXHRcdFx0aWYgKHRoaXMuaW5kZXggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHR0aGlzLmluZGV4ID0gJGJ1YmJsZUNvbnRhaW5lci5jaGlsZHJlbigpLmxlbmd0aCAtIDE7XG5cdFx0XHR9XG4gICAgICAgICAgICBcblx0XHRcdHZhciBlbGVtZW50RW1XaWR0aCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMudGl0bGVUZXh0Lmxlbmd0aCArIDEsIDEwKSwgOCk7XG5cdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCAxMTAwKSB7XG5cdFx0XHRcdGlmICh0aGlzLmluZGV4ICUgMiA9PT0gMCkge1xuXHRcdFx0XHRcdHRoaXMucHhQb3MueSA9IHdpbmRvdy5pbm5lckhlaWdodCAqIDAuMTc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnB4UG9zLnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDIgKyAodGhpcy5weFBvcy54IC0gd2luZG93LmlubmVyV2lkdGggLyAyKSAqIDEuMTtcblx0XHRcdH1cbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy4kZWxlbWVudC5jc3Moe1xuXHRcdFx0XHRcInRvcFwiOiBcIjBweFwiLFxuXHRcdFx0XHRcImxlZnRcIjogdGhpcy5weFBvcy54ICsgXCJweFwiLFxuXHRcdFx0XHRcIndpZHRoXCI6IGVsZW1lbnRFbVdpZHRoICsgXCJlbVwiLFxuXHRcdFx0XHRcImhlaWdodFwiOiBlbGVtZW50RW1XaWR0aCArIFwiZW1cIlxuXHRcdFx0fSk7XG4gICAgICAgICAgICBcblx0XHRcdHZhciBlbGVtZW50U2l6ZSA9IHBhcnNlRmxvYXQodGhpcy4kZWxlbWVudC5jc3MoXCJ3aWR0aFwiKSk7XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuJHRpdGxlLmNzcyh7XG5cdFx0XHRcdFwidG9wXCI6IGVsZW1lbnRTaXplIC8gMiAtIHBhcnNlRmxvYXQodGhpcy4kdGl0bGUuY3NzKFwiaGVpZ2h0XCIpKSAvIDIsXG5cdFx0XHRcdFwibGVmdFwiOiBlbGVtZW50U2l6ZSAvIDIgLSBwYXJzZUZsb2F0KHRoaXMuJHRpdGxlLmNzcyhcIndpZHRoXCIpKSAvIDJcblx0XHRcdH0pO1xuXHRcdH1cblx0XHR1cGRhdGUoKSB7XG5cdFx0XHRcblx0XHR9XG5cdH1cbiAgICBcbiAgICBcbiAgICBcblx0dmFyIGFjdGl2ZUZyYW1lID0gbnVsbDtcbiAgICBcbiAgICBcbiAgICBcblx0Y2xhc3MgTGlua0J1YmJsZSBleHRlbmRzIEJ1YmJsZSB7XG5cdFx0Y29uc3RydWN0b3IoY2ZnKSB7XG5cdFx0XHRzdXBlcihjZmcpO1xuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLnNvdXJjZSA9IGNmZy5zb3VyY2U7XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuY29zU2VlZCA9IE1hdGgucmFuZG9tKCkgKiAzNjAgLyBERUdfUkFEX0NPTlNUO1xuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLmZyYW1lQXBwZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy4kZnJhbWVXcmFwcGVyID0gJChcIjxkaXYgY2xhc3M9J2ZyYW1lLXdyYXBwZXInPjwvZGl2PlwiKTtcblx0XHRcdHRoaXMuJGZyYW1lID0gJChcIjxpZnJhbWUgY2xhc3M9J2ZyYW1lLWNvbnRlbnQnPjwvaWZyYW1lPlwiKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy4kZnJhbWUuYXR0cih7XG5cdFx0XHRcdC8qIHNlYW1sZXNzOiBcInNlYW1sZXNzXCIsICovXG5cdFx0XHRcdGZyYW1lYm9yZGVyOiBcIjBcIixcblx0XHRcdFx0c2Nyb2xsaW5nOiBcIm5vXCIsXG5cdFx0XHRcdHNyYzogdGhpcy5zb3VyY2Vcblx0XHRcdH0pXG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuJGZyYW1lV3JhcHBlci5hcHBlbmQodGhpcy4kZnJhbWUpO1xuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLiRmcmFtZUNvbnRlbnRzID0gdGhpcy4kZnJhbWUuY29udGVudHMoKS5maW5kKFwiaHRtbFwiKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy53cmFwcGVyVG9wID0gcGFyc2VGbG9hdCgkZnJhbWVDb250YWluZXIuY3NzKFwidG9wXCIpKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy4kZnJhbWVXcmFwcGVyLmNzcyh7XG5cdFx0XHRcdFwidG9wXCI6IHRoaXMud3JhcHBlclRvcCArIFwicHhcIlxuXHRcdFx0fSk7XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuZnJhbWVTY3JvbGwgPSAwO1xuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLmZyYW1lSGVpZ2h0ID0gMDtcblx0XHR9XG5cdFx0ZHJpZnQoKSB7XG5cdFx0XHR0aGlzLmNvc1NlZWQgKz0gMC4wMztcblx0XHRcdHRoaXMuY29zU2VlZCAlPSAzNjA7XG5cdFx0XHR0aGlzLiRlbGVtZW50LmNzcyh7XG5cdFx0XHRcdFwidG9wXCI6IHRoaXMucHhQb3MueSArIChNYXRoLmNvcyh0aGlzLmNvc1NlZWQpICogdGhpcy5weFBvcy5zaXplIC8gMTUpICsgXCJweFwiXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0b25DbGljaygpIHtcblx0XHRcdHRoaXMuJGZyYW1lV3JhcHBlci5jc3MoXCJ6LWluZGV4XCIsIDEpO1xuICAgICAgICAgICAgXG5cdFx0XHRpZiAoYWN0aXZlRnJhbWUgJiYgYWN0aXZlRnJhbWUudWlkICE9PSB0aGlzLnVpZCkge1xuXHRcdFx0XHRzY3JvbGxNb21lbnR1bSA9IDA7XG5cdFx0XHRcdGFjdGl2ZUZyYW1lLmRlYWN0aXZhdGUodHJ1ZSk7XG5cdFx0XHR9XG4gICAgICAgICAgICBcblx0XHRcdGFjdGl2ZUZyYW1lID0gdGhpcztcbiAgICAgICAgICAgIFxuXHRcdFx0aWYgKCF0aGlzLmZyYW1lQXBwZW5kZWQpIHtcblx0XHRcdFx0JGZyYW1lQ29udGFpbmVyLmFwcGVuZCh0aGlzLiRmcmFtZVdyYXBwZXIpO1xuXHRcdFx0XHR0aGlzLmZyYW1lQXBwZW5kZWQgPSB0cnVlO1xuXHRcdFx0fVxuICAgICAgICAgICAgXG5cdFx0XHR0aGlzLiRmcmFtZS5zdG9wKCkuYW5pbWF0ZSh7XG5cdFx0XHRcdFwib3BhY2l0eVwiOiBcIjFcIlxuXHRcdFx0fSwge1xuXHRcdFx0XHRkdXJhdGlvbjogMTUwMFxuXHRcdFx0fSk7XG5cdFx0XHQkdGl0bGVDb250YWluZXIuYWRkQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgIFxuXHRcdFx0Ly8gTWFnaWNrcyFcblx0XHRcdHRoaXMuYW5pbWF0ZUluKCk7XG4gICAgICAgICAgICBcblx0XHRcdCRleGl0RnJhbWUuc3RvcCgpLmFuaW1hdGUoe1xuXHRcdFx0XHRcIm9wYWNpdHlcIjogMVxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0XHQkZXhpdEZyYW1lLmNzcyhcImN1cnNvclwiLCBcInBvaW50ZXJcIik7XG5cdFx0fVxuXHRcdGFuaW1hdGVJbigpIHtcblx0XHRcdC8qIERvbid0IGV2ZW4gYXNrIG1lIHdoeSB0aGlzIG1ldGhvZCB3b3Jrcy4gSSBkb24ndCBldmVuIGtub3csIGl0IGp1c3Qgd29ya3MuIFRoaXMgc2NhcmVzIG1lICovXG5cdFx0XHRpZiAocGFyc2VGbG9hdCh0aGlzLiRmcmFtZVdyYXBwZXIuY3NzKFwidG9wXCIpKSA+IDApIHtcblx0XHRcdFx0dGhpcy4kZnJhbWVXcmFwcGVyLmNzcyhcInRvcFwiLCBcIjBweFwiKTtcblx0XHRcdFx0c2V0VGltZW91dCh0aGlzLmFuaW1hdGVJbi5iaW5kKHRoaXMpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dW5zY3JvbGwoKSB7XG5cdFx0XHRzZXRUaW1lb3V0KHRoaXMuX3Vuc2Nyb2xsLmJpbmQodGhpcyksIDEpXG5cdFx0fVxuXHRcdF91bnNjcm9sbCh0aW1lcykge1xuXHRcdFx0c2Nyb2xsTW9tZW50dW0gPSAwO1xuXHRcdFx0dGltZXMgPSB0aW1lcyArIDEgfHwgMDtcblx0XHRcdHRoaXMuZnJhbWVTY3JvbGwgKz0gMS4yICogdGltZXM7XG5cdFx0XHRpZiAoLXRoaXMuZnJhbWVTY3JvbGwgPiAwKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQodGhpcy5fdW5zY3JvbGwuYmluZCh0aGlzLCB0aW1lcyksIDcpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmZyYW1lU2Nyb2xsID0gMDtcblx0XHRcdFx0dGhpcy5zY3JvbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHQkdW5zY3JvbGxGcmFtZS5zdG9wKCkuYW5pbWF0ZSh7XG5cdFx0XHRcdFx0XCJvcGFjaXR5XCI6IDBcblx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdCR1bnNjcm9sbEZyYW1lLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGFkZFNjcm9sbChhbW91bnQpIHtcblx0XHRcdGlmICh0aGlzLndyYXBwZXJUb3AgKyB0aGlzLmZyYW1lSGVpZ2h0IDwgd2luZG93LmlubmVySGVpZ2h0KSByZXR1cm47XG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLmZyYW1lU2Nyb2xsKTtcblx0XHRcdGlmICgtdGhpcy5mcmFtZVNjcm9sbCA+IDUwMCAmJiAkdW5zY3JvbGxGcmFtZS5jc3MoXCJvcGFjaXR5XCIpID09PSBcIjBcIikge1xuXHRcdFx0XHQkdW5zY3JvbGxGcmFtZS5hbmltYXRlKHtcblx0XHRcdFx0XHRcIm9wYWNpdHlcIjogMVxuXHRcdFx0XHR9LCAxMDAwKTtcblx0XHRcdFx0JHVuc2Nyb2xsRnJhbWUuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcblx0XHRcdH1cbiAgICAgICAgICAgIFxuXHRcdFx0aWYgKHRoaXMuZnJhbWVTY3JvbGwgKyBhbW91bnQgPj0gMCkge1xuXHRcdFx0XHR0aGlzLmZyYW1lU2Nyb2xsID0gMDtcblx0XHRcdH0gZWxzZSBpZiAoLSh0aGlzLmZyYW1lU2Nyb2xsICsgYW1vdW50KSA+IHRoaXMuZnJhbWVIZWlnaHQgLSA1MDApIHtcblx0XHRcdFx0dGhpcy5mcmFtZVNjcm9sbCA9IC10aGlzLmZyYW1lSGVpZ2h0ICsgNTAwO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5mcmFtZVNjcm9sbCArPSBhbW91bnQ7XG5cdFx0XHR9XG4gICAgICAgICAgICBcblx0XHRcdGlmICgtdGhpcy5mcmFtZVNjcm9sbCA+IDApIHtcblx0XHRcdFx0dGhpcy5zY3JvbGxlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGRlYWN0aXZhdGUoaW5zdGFudCkge1xuXHRcdFx0aW5zdGFudCA9IGluc3RhbnQgfHwgZmFsc2U7XG5cdFx0XHR0aGlzLiRmcmFtZVdyYXBwZXIuY3NzKFwiei1pbmRleFwiLCAtMSk7XG5cdFx0XHR0aGlzLnVuc2Nyb2xsKCk7XG5cdFx0XHQkdGl0bGVDb250YWluZXIucmVtb3ZlQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgIFxuXHRcdFx0c2V0VGltZW91dCh0aGlzLl9kZWFjdGl2YXRlLmJpbmQodGhpcyksIDE1MDAgKiBpbnN0YW50ICsgMSk7XG4gICAgICAgICAgICBcblx0XHRcdCRleGl0RnJhbWUuYW5pbWF0ZSh7XG5cdFx0XHRcdFwib3BhY2l0eVwiOiAwXG5cdFx0XHR9LCAxMDAwKTtcbiAgICAgICAgICAgIFxuXHRcdFx0JHVuc2Nyb2xsRnJhbWUuc3RvcCgpLmFuaW1hdGUoe1xuXHRcdFx0XHRcIm9wYWNpdHlcIjogMFxuXHRcdFx0fSwgMTAwMCk7XG5cdFx0XHQkZXhpdEZyYW1lLmNzcyhcImN1cnNvclwiLCBcImRlZmF1bHRcIik7XG5cdFx0fVxuXHRcdF9kZWFjdGl2YXRlKCkge1xuXHRcdFx0dGhpcy4kZnJhbWUuYW5pbWF0ZSh7XG5cdFx0XHRcdFwib3BhY2l0eVwiOiAwXG5cdFx0XHR9LCAxMDAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy4kZnJhbWVXcmFwcGVyLmNzcyh7XG5cdFx0XHRcdFx0XCJ0b3BcIjogd2luZG93LmlubmVySGVpZ2h0IC0gcGFyc2VGbG9hdCgkZnJhbWVDb250YWluZXIuY3NzKFwidG9wXCIpKSAvIDIgKyBcInB4XCJcblx0XHRcdFx0fSk7XG5cdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdH1cblx0XHR1cGRhdGUoKSB7XG5cdFx0XHRpZiAodGhpcy5mcmFtZUFwcGVuZGVkKSB7XG5cdFx0XHRcdHZhciBmcmFtZURvY0hlaWdodCA9IHRoaXMuJGZyYW1lLmNvbnRlbnRzKCkuZmluZChcImh0bWxcIikuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgXG5cdFx0XHRcdGlmICh0aGlzLmZyYW1lSGVpZ2h0ICE9PSBmcmFtZURvY0hlaWdodCkge1xuXHRcdFx0XHRcdHRoaXMuZnJhbWVIZWlnaHQgPSBmcmFtZURvY0hlaWdodDtcblx0XHRcdFx0XHR0aGlzLiRmcmFtZS5oZWlnaHQoZnJhbWVEb2NIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMuJGZyYW1lLmNzcyhcInRvcFwiLCB0aGlzLmZyYW1lU2Nyb2xsICsgXCJweFwiKTtcbiAgICAgICAgICAgIFxuXHRcdFx0dGhpcy5kcmlmdCgpO1xuXHRcdH1cblx0fVxuICAgIFxuXG4gICAgXG5cdHZhciBidWJibGVzID0gW1xuXHRcdG5ldyBMaW5rQnViYmxlKHtcblx0XHRcdHg6IDMwLFxuXHRcdFx0c2l6ZTogNyxcblx0XHRcdHNvdXJjZTogXCJyZXN1bWUuaHRtbFwiLFxuXHRcdFx0dGl0bGU6IFwiUmVzdW1lXCJcblx0XHR9KSxcblx0XHRuZXcgTGlua0J1YmJsZSh7XG5cdFx0XHR4OiA0MCxcblx0XHRcdHNpemU6IDcuNSxcblx0XHRcdHNvdXJjZTogXCJhYm91dC5odG1sXCIsXG5cdFx0XHR0aXRsZTogXCJBYm91dCBNZVwiXG5cdFx0fSksXG5cdFx0bmV3IExpbmtCdWJibGUoe1xuXHRcdFx0eDogNTAsXG5cdFx0XHRzaXplOiA2LjUsXG5cdFx0XHRzb3VyY2U6IFwiYmxvZy9pbmRleC5odG1sXCIsXG5cdFx0XHR0aXRsZTogXCJNeSBCbG9nXCJcblx0XHR9KSxcblx0XHRuZXcgTGlua0J1YmJsZSh7XG5cdFx0XHR4OiA2MCxcblx0XHRcdHNpemU6IDcsXG5cdFx0XHRzb3VyY2U6IFwid29yay5odG1sXCIsXG5cdFx0XHR0aXRsZTogXCJNeSBXb3JrXCJcblx0XHR9KSxcblx0XHRuZXcgTGlua0J1YmJsZSh7XG5cdFx0XHR4OiA3MCxcblx0XHRcdHNpemU6IDcuNSxcblx0XHRcdHNvdXJjZTogXCJjb250YWN0Lmh0bWxcIixcblx0XHRcdHRpdGxlOiBcIkNvbnRhY3QgTWVcIlxuXHRcdH0pXG5cdF07XG4gICAgXG4gICAgXG5cdCRleGl0RnJhbWUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0c2Nyb2xsTW9tZW50dW0gPSAwO1xuXHRcdGlmIChhY3RpdmVGcmFtZSkge1xuXHRcdFx0YWN0aXZlRnJhbWUuZGVhY3RpdmF0ZSgpO1xuXHRcdH1cblx0fSk7XG4gICAgXG5cdCR1bnNjcm9sbEZyYW1lLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdHNjcm9sbE1vbWVudHVtID0gMDtcblx0XHRpZiAoYWN0aXZlRnJhbWUgJiYgYWN0aXZlRnJhbWUuc2Nyb2xsZWQpIHtcblx0XHRcdGFjdGl2ZUZyYW1lLnVuc2Nyb2xsKCk7XG5cdFx0fVxuXHR9KTtcbiAgICBcblx0JHN1YmhlYWQuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JHN1YmhlYWQudGV4dChzdWJoZWFkTXNnW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN1YmhlYWRNc2cubGVuZ3RoKV0pXG5cdH0pO1xuICAgIFxuICAgIFxuICAgIFxuXHRmdW5jdGlvbiB1cGRhdGVQYWdlKCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYnViYmxlcy5sZW5ndGg7IGkgKyspIHtcblx0XHRcdGJ1YmJsZXNbaV0udXBkYXRlKCk7XG5cdFx0fVxuXHRcdGlmIChhY3RpdmVGcmFtZSkge1xuXHRcdFx0YWN0aXZlRnJhbWUuYWRkU2Nyb2xsKHNjcm9sbE1vbWVudHVtKTtcblx0XHRcdHNjcm9sbE1vbWVudHVtICo9IDAuOTtcblx0XHR9XG4gICAgICAgIFxuXHRcdHNldFRpbWVvdXQodXBkYXRlUGFnZSwgMTApO1xuXHR9XG4gICAgXG5cdCRib2R5Lm1vdXNld2hlZWwoZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZiAoYWN0aXZlRnJhbWUpIHtcblx0XHRcdHNjcm9sbE1vbWVudHVtICs9IGV2ZW50Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSAqIFNDUk9MTF9DT0VGRjtcblx0XHR9XG5cdH0pO1xuICAgIFxuXHRzZXRUaW1lb3V0KHVwZGF0ZVBhZ2UsIDEpO1xuICAgIFxuXHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYnViYmxlcy5sZW5ndGg7IGkgKyspIHtcblx0XHRcdGJ1YmJsZXNbaV0uY2FsY1BvcygpO1xuXHRcdH1cblx0fSk7XG59KTtcbiJdfQ==
