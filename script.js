const themeBtn=document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{
document.body.classList.toggle("light");
themeBtn.textContent=document.body.classList.contains("light")?"☀️":"🌙";
});

