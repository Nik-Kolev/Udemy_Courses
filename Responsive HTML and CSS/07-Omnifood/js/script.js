///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions

const year = document.querySelector('.year')
year.textContent = new Date().getFullYear()

document.querySelector('.btn-mobile-nav').addEventListener('click', () => {
  document.querySelector('.header').classList.toggle('nav-open')
})

// Scroll animation

const links = document.querySelectorAll('a:link')
links.forEach(x => {
  x.addEventListener('click', (e) => {
    e.preventDefault()
    const href = x.getAttribute('href')

    //Scroll back to top
    if (href === '#') window.scrollTo({
      top: 0,
      behavior: "smooth"
    })

    // Scroll to href parts
    if (href !== '#' && href.startsWith('#')) {
      document.querySelector(href).scrollIntoView({ behavior: "smooth" })
    }

    //Remove nav-open class to close the nav bar
    if (x.classList.contains('main-nav-link')) {
      document.querySelector('.header').toggle('nav-open')
    }
  })
});

// Sticky nav

const observer = new IntersectionObserver((entries) => {
  !entries[0].isIntersecting ? document.body.classList.add('sticky') : document.body.classList.remove('sticky')

}, {
  root: null,
  threshold: 0,
  rootMargin: '-80px'
})

observer.observe(document.querySelector('.section-hero'))

function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

// https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js

/*
.no-flexbox-gap .main-nav-list li:not(:last-child) {
  margin-right: 4.8rem;
}

.no-flexbox-gap .list-item:not(:last-child) {
  margin-bottom: 1.6rem;
}

.no-flexbox-gap .list-icon:not(:last-child) {
  margin-right: 1.6rem;
}

.no-flexbox-gap .delivered-faces {
  margin-right: 1.6rem;
}

.no-flexbox-gap .meal-attribute:not(:last-child) {
  margin-bottom: 2rem;
}

.no-flexbox-gap .meal-icon {
  margin-right: 1.6rem;
}

.no-flexbox-gap .footer-row div:not(:last-child) {
  margin-right: 6.4rem;
}

.no-flexbox-gap .social-links li:not(:last-child) {
  margin-right: 2.4rem;
}

.no-flexbox-gap .footer-nav li:not(:last-child) {
  margin-bottom: 2.4rem;
}

@media (max-width: 75em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 3.2rem;
  }
}

@media (max-width: 59em) {
  .no-flexbox-gap .main-nav-list li:not(:last-child) {
    margin-right: 0;
    margin-bottom: 4.8rem;
  }
}
*/
