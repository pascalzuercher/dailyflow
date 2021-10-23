const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.myLinks');
    const navLinks = document.querySelectorAll('.myLinks a');
    
    burger.addEventListener('click',()=> {
        
        nav.classList.toggle('nav-active');

        
    navLinks.forEach((link, index) => {
      if(link.style.animation){
        link.style.animation = ''
      }
        else{
        link.style.animation = `navLinkFade 0.75s ease forwards`;
       }
      });
      
      burger.classList.toggle('toggle')

    });
  } 

  navSlide();