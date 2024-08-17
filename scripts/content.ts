
console.log("Test")

const titles: string[] = [];

function getTitles() {
    const storyBoard = document.querySelector('.storyboard')
    const mediaHeadings: NodeListOf<HTMLElement> = document.querySelectorAll('.media-heading');
    mediaHeadings.forEach((heading) => {
        titles.push(heading.innerText);
    });

    if (titles.length > 0) {
        const p = document.createElement("p");
        p.classList.add("color--important");
        p.textContent = "Today I did: " + titles.join(", ");
        if (storyBoard) storyBoard.appendChild(p)
    }
}


var observer = new MutationObserver(function(mutations){
    console.log("Inside observer: ", mutations);
    const mediaHeadings: NodeListOf<HTMLElement> = document.querySelectorAll('.media-heading');
    console.log("Media Headings: ", mediaHeadings);
    if(mediaHeadings.length > 0){
        getTitles();
        observer.disconnect(); // to stop observing the dom
    }
})

const homeApp = document.querySelector('#home-app')
if (homeApp) {
    observer.observe(homeApp, { 
        childList: true,
        subtree: true // needed if the node you're targeting is not the direct parent
    });
} else {
    console.log("No homeApp found")
}





// setTimeout(getTitles, 3000);

// Also call getTitles after the DOM is loaded
// document.addEventListener('DOMContentLoaded', getTitles);
