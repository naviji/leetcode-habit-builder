# leetcode-habit-builder

# TODO
0. Extract chooseProblems out of app and put it in common place
1. Add an alarm that fetches the next set of problems each day


1. Button Hover Effect on Solve button
1. Indicator that the extension is active
2. Show a congrats modal and +1 streak counter on successful problem submission
7. Add streaks
8. Add option to not show already solved problems
10. Change the number of questions that I need to complete
12. Choose your own question mode
13. Fix the question vs redirection mismatch
    The problem seems to be the midnight alarm, changing the problem state but not the ui?
14. Add an exclusion list of websites
15. Add a cache for async storage calls

16. Make it work in old UI?

15. Use this idea
https://developer.chrome.com/docs/extensions/reference/api/storage#synchronous_response_to_storage_updates
We can take this idea even further. In this example, we have an options page that allows the user to toggle a "debug mode" (implementation not shown here). The options page immediately saves the new settings to storage.sync, and the service worker uses storage.onChanged to apply the setting as soon as possible.

16. Optional toggle to don't ask solved questions
18. Script that takes problem links as input and gets the tag / name and difficulty from leetcode
19. Optional timer mode. (What's the penalty though? Loose streak maybe?)


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

https://github.com/haoel/leetcode