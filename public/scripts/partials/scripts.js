(()=>{var o=document.querySelector("m-website-header > nav > ul"),e=o.querySelector(".affiliation__change"),t=document.createElement("button");t.innerHTML=e.innerHTML;t.className=e.className;var i=o.querySelector(".affiliation__dialog"),l=i.querySelectorAll(".affiliation__dialog--dismiss"),c=()=>{e.parentNode.replaceChild(t,e),t.addEventListener("click",()=>{i.showModal()}),l.forEach(a=>{a.addEventListener("click",()=>{i.close()})})},n=c;document.addEventListener("DOMContentLoaded",()=>{n()});})();
