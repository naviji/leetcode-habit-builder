# leetcode-habit-builder

# TODO

0. Sync chrome.storage instead of local storage
1. Indicator that the extension is active
2. Redirect to intended page after completing problem
3. Always detect completion
4. Use requests that check if the redirect is happening to our problem url
   if so, save the url somewhere to redirect once problem is submitted successfully
5. Add build step to put it into a dist folder
6. Replace @types/chrome with chrome-types
7. Add duolingo like addiction streaks
8. Add option to not show already solved problems
9. Add option to show me problems I have completed but did badly at?
10. Change the number of questions that I need to complete
11. Try reproducing and fix: it also recognizes that I solved the question no matter from which section of the problem i solved it from (i.e. solving the question from leetcode.com/problem/discussion doesn't trigger the extension)
12. Choose your own question mode
13. Fix the question vs redirection mismatch
    The problem seems to be the midnight alarm, changing the problem state but not the ui?
14. Add an exclusion list of websites
15. Add a cache for async storage calls

15. Use this idea
https://developer.chrome.com/docs/extensions/reference/api/storage#synchronous_response_to_storage_updates
We can take this idea even further. In this example, we have an options page that allows the user to toggle a "debug mode" (implementation not shown here). The options page immediately saves the new settings to storage.sync, and the service worker uses storage.onChanged to apply the setting as soon as possible.



check for reqeuests to submit url
.onRequestComplete
.executeScript to get the status text 
. then call unregister.


Whenever https://leetcode.com/problems/house-robber-ii/submissions/1364848449/
Add a script which checks the value of <span data-e2e-locator="submission-result">Accepted</span>



# Known issues
1. If you already solved the problem, clicking on submissions tab, and then clicking on a past submission will stop the redirection.
# References

https://developer.chrome.com/docs/extensions/develop
https://css-tricks.com/snippets/css/a-guide-to-flexbox/
