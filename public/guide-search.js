const form=document.getElementById('guide-search');
const input=document.getElementById('guide-query');
const rows=[...document.querySelectorAll('[data-search]')];
form.hidden=false;
form.addEventListener('submit',event=>event.preventDefault());
input.addEventListener('input',()=>{const words=input.value.toLocaleLowerCase().trim().split(/\s+/u).filter(Boolean);let count=0;for(const row of rows){const matches=words.every(word=>row.dataset.search.toLocaleLowerCase().includes(word));row.hidden=!matches;if(matches)count++;}document.getElementById('search-count').textContent=count+' public '+(count===1?'page':'pages');document.getElementById('search-empty').hidden=count>0;});
