const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.myLinks');
    const navLinks = document.querySelectorAll('.myLinks a');
    
    burger.addEventListener('click',()=> {
        //Toggle Nav
        nav.classList.toggle('nav-active');

        //Animate Links
    navLinks.forEach((link, index) => {
      if(link.style.animation){
        link.style.animation = ''
      }
        else{
        link.style.animation = `navLinkFade 1s ease forwards`;
       }
      });
      //Burger Animation
      burger.classList.toggle('toggle')

    });
  } 

  navSlide();