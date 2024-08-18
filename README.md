# leetcode-habit-builder


# TODO
1. Add build step to put it into a dist folder
2. Replace @types/chrome with chrome-types

# References
https://developer.chrome.com/docs/extensions/develop


# Tips

To make good extensions you really need to understand when to use content scripts, and when to use service workers. understand when to use web accessible resources, popup.html, sidepanel.html, or when to insert UI elements into a webpage. And finally you must be good with JavaScript.

Content scripts require you to understand the DOM specifically, how a page is rendered, and in what order events fire and why, and the event loop.

Service workers are a different paradigm and require you to understand networking, windowing, frames, lifetimes, storage, and a host of other ideas.

Additionally the way you build extensions is different from building a normal web app, which makes it trickier for new devs to figure out a good workflow to juggle all these ideas.

I recommend starting with just plain JavaScript and building some simple extensions with a popup.html. When you’ve done so, look at using a simple framework like Svelte which pairs nicely with extensions.

Extensions can be challenging because they are much more powerful than a typical website/web-app, so there is a learning curve because you are literally extending the browser functionality

