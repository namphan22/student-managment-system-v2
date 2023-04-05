
// get element into file html
const modal = document.querySelector('.modal-custom');
const btn_closemodal = document.querySelector('.close-modal');
const btn_showmodal = document.querySelector('.show-modal');
const backdrop = document.querySelector('.backdrop');
const content = document.querySelector('.content');


// implement close modal function
const close_modal = function(){
    modal.classList.add('hidden');
    backdrop.classList.add('hidden');   
}

// implement open modal function
const open_modal = function(){
    console.log('Button clicked');
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');

}





// handle button close modal
btn_closemodal.addEventListener('click',close_modal);
btn_showmodal.addEventListener('click',open_modal);
// handle click out of modal box
backdrop.addEventListener('click',close_modal);

document.addEventListener('keydown',(e)=>{
    
    if(e.key === 'Escape'){
        if(!modal.classList.contains('hidden')){
            close_modal();
        }
    }
})

console.log('Connect to home.ejs file!');