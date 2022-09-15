

  function openNav(){
    document.getElementById('cart').style.width="450px";
    document.getElementById('cart').style.height="100%"
  }
  function closeNav(){
    document.getElementById('cart').style.width="0px"
  };


  function openSearch(){
    document.getElementById('search').style.display="block"
  }
  function closeSearch(){
    document.getElementById('search').style.display="none"
  };

function changeColor(){
  document.getElementById('change').style.display="block"
  document.getElementById('reset').style.display="none"
};
  function getPrice(){
    document.getElementById('cart').innerHTML+= document.getElementsByClassName("price")
    document.getElementById('cart').style.width="100%"
  };

  function showMore(){
    document.getElementById('offersShadow').style.display="block"
    document.getElementById('show').style.display="none"
  };
  function showLess(){
    document.getElementById('offersShadow').style.display="none"
    document.getElementById('show').style.display="block"
  }
  function openList(){
    document.getElementsByClassName('list-info').style.width="100%"
    document.getElementsByClassName('list-info').style.display="block"
  }

 //init
slides = document.getElementsByClassName("slide");
containerWidth = 500;

Array.prototype.forEach.call(slides, function (el, i) {//set the initial position of each slide
  el.style.left = (i * containerWidth) + "px";
});

window.moveSlides = function (direction) {
  run = true;
  tracker = containerWidth; //500 in this example. We make a separate variable so we can decrement it

  if (((direction == "next" && (parseInt(slides[0].style.left) <= (0 - (containerWidth * (slides.length - 1)))))) //compare against 2nd-to-last slide's index, otherwise it'll go 1 slide too far
     || (direction == "prev" && (parseInt(slides[0].style.left) >= 0))) { run = false; }

  if (run) {
    var slideInterval = setInterval(function () {
      moveRate = 4; //set the speed here (use numbers that the container's width can be divided by without a remainder)
        Array.prototype.forEach.call(slides, function (el, i) {
          if (tracker <= 0) {
             clearInterval(slideInterval)
          } else {
            el.style.left = (direction == "next") ? (parseInt(el.style.left) - moveRate) + "px" : (parseInt(el.style.left) + moveRate) + "px";
          }
        });
        tracker -= moveRate;
    }, 1);
  }
}
  const THRESHOLD = 20;

class SwipeSlider {
  constructor(slider) {
    this.startX = 0;
    this.oldX = 0;
    this.position = 0;
    this.snapPosition = 0;
    this.isDown = false;
    this.userHasSwiped = false;

    // Init
    this.cacheElements(slider);
    this.setDimensions();
    this.setIndicator();
    this.bindHandlers();
  }

  cacheElements(slider) {
    this.slider = slider;
    this.items = this.slider.querySelectorAll('.slider-item');
    this.indicator = slider.parentNode.querySelector('.slider-indicator');
    this.indicatorBar = slider.parentNode.querySelector('.slider-indicator-bar');
  }

  setDimensions() {
    const spacing = 20; // TODO: get dynamically
    const sliderWidth = this.slider.offsetWidth;
    const itemWidth = this.items[0].offsetWidth;
    const itemsWidth = this.items.length * itemWidth;

    this.itemWidth = itemWidth;
    this.maxAllowedW = sliderWidth < itemsWidth ? sliderWidth - itemsWidth - spacing : 0;
  }

  setIndicator() {
    if (!this.indicator) return;

    const times = (this.items.length * this.itemWidth) / this.slider.offsetWidth;
    const length = this.indicatorBar.offsetWidth / times;

    this.indicator.style.width = `${length}px`;
  }

  // Calculate

  calculateBoundaries(position, bounce = true) {
    const bounceMargin = bounce ? this.itemWidth / 4 : 0;

    if (position > bounceMargin) return bounceMargin;
    if (position < this.maxAllowedW - bounceMargin) return this.maxAllowedW - bounceMargin;

    return position;
  }

  calculateSnapPosition(position, swipeNext) {
    let snapPosition = (~~(position / this.itemWidth) - swipeNext) * this.itemWidth;

    if (snapPosition < this.maxAllowedW) snapPosition = this.maxAllowedW;
    return snapPosition;
  }

  moveIndicator(currPos) {
    if (!this.indicator) return;

    const indicatorPos = this.indicatorBar.offsetWidth - this.indicator.offsetWidth;
    const position = this.mapToRange(currPos, 0, this.maxAllowedW, 0, indicatorPos);

    this.indicator.style.left = `${position}px`;
  }

  // Helpers

  mapToRange(num, inMin, inMax, outMin, outMax) {
    return ((num - inMin) * (outMax - outMin)) / ((inMax - inMin) + outMin);
  }

  // Handlers

  bindHandlers() {
    // TODO: maybe add mousedwon and touchstart listeners here. Then add inside them
    // only the relevant move / end listeners (touch or mouse), and remove them on end
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.slider.addEventListener('touchend', (e) => this.handleEnd(e));

    this.slider.addEventListener('mousedown', (e) => this.handleMouseStart(e));
    this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.slider.addEventListener('mouseup', (e) => this.handleEnd(e));
    this.slider.addEventListener('mouseleave', (e) => this.handleEnd(e));

    this.slider.addEventListener('wheel', (e) => this.handleWheel(e));
    this.slider.addEventListener('click', (e) => this.handleClick(e));
    window.addEventListener('resize', () => this.handleResize());
  }

  // Start

  handleTouchStart(e) {
    if (e.touches.length > 1) return;

    this.handleStart(e);
  }

  handleMouseStart(e) {
    e.preventDefault();

    this.handleStart(e);
  }

  handleStart(e) {
    this.isDown = true;
    this.userHasSwiped = false;
    this.position = this.snapPosition;
    this.startX = (e.pageX || e.touches[0].pageX) - this.slider.offsetLeft;

    this.slider.classList.add('active');
  }

  // Move

  handleTouchMove(e) {
    if (e.touches.length > 1) return;

    this.handleMove(e);
  }

  handleMouseMove(e) {
    e.preventDefault();

    this.handleMove(e);
  }

  handleMove(e) {
    if (!this.isDown) return;

    const pageX = e.pageX || e.touches[0].pageX;
    const currX = pageX - this.slider.offsetLeft;
    const dist = currX - this.startX;

    if (Math.abs(dist) < THRESHOLD) return;

    const swipeNext = this.oldX - currX < 0 ? 0 : 1; // Swipe direction
    const accelerate = this.mapToRange(Math.abs(dist), THRESHOLD, window.innerWidth, 1, 3);
    const position = this.calculateBoundaries(this.position + (dist * accelerate));

    e.preventDefault();

    this.userHasSwiped = true;
    this.snapPosition = this.calculateSnapPosition(position, swipeNext);
    this.oldX = currX;

    this.moveIndicator(this.snapPosition);
    this.slider.setAttribute('style', `transform: translate3d(${position}px, 0, 0)`);
  }

  // End

  handleEnd() {
    this.isDown = false;

    this.slider.classList.remove('active');
    this.slider.setAttribute('style', `transform: translate3d(${this.snapPosition}px, 0, 0)`);
  }

  // Other Handlers

  handleWheel(e) {
    if (Math.abs(e.deltaX) < THRESHOLD) return;

    const step = 40;
    const sp = this.snapPosition + (step * Math.sign(e.deltaX));

    this.slider.classList.add('active'); // Will be removed on mouseleave
    this.snapPosition = this.calculateBoundaries(sp, false);
    this.slider.setAttribute('style', `transform: translate3d(${this.snapPosition}px, 0, 0)`);

    this.moveIndicator(this.snapPosition);
  }

  handleResize() {
    this.setIndicator();
    this.setDimensions();
		// TODO: Reposition slider at the right of the window,
		// when resizing and a slider has reached its end position
  }

  handleClick(e) {
    if (!this.userHasSwiped) return;

    e.preventDefault(); // Disallow click while swiping
    this.userHasSwiped = false;
  }
}


const sliders = document.querySelectorAll('.slider');
sliders.forEach((slider) => { new SwipeSlider(slider) });


































