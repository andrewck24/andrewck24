let windowHeight = $(window).height();
$(window).resize(() => {
  windowHeight = $(window).height();
});

const sectionArr = ["a.home", "a.about", "a.works", "a.contact"];
let previousIndex = -1;
let currentIndex = 0;
const toggle = () => {
  const currentPosition = $(this).scrollTop() + (0.35 * windowHeight);
  currentIndex = parseInt(currentPosition / windowHeight);
  if (currentIndex != previousIndex) {
    for (i = 0; i < sectionArr.length; i++) {
      if (i === currentIndex) {
        $(sectionArr[i]).addClass("toggled");
      } else {
        $(sectionArr[i]).removeClass("toggled");
      }
    }
    previousIndex = currentIndex;
  }
};

$(function() {
  toggle();
  $(window).scroll(toggle);
});

const openMenu = () => {
  const nav = document.getElementById("navbar");
  if (nav.className === "nav") {
    nav.className += " unfold";
  } else {
    nav.className = "nav";
  }
};