[x] Fix joining a room after completion breaking the leaderboard
[x] Fix failed state not showing in leaderboard
[x] Thinner failed bar
[x] Smaller text for leaderboard on smaller screens so everything will fit
[x] Add (you) to leaderboard score
[x] Create join room page
[x] Create room loading UI
[x] Disable CursorSelector before user loads
[x] Show errors left in the game UI
[x] Fix time stopping after completing a test
[x] Keep showing other cursors after completing a test
[x] Fix typer expanding beyond its max width when typing enough extra characters
[x] Open/close leaderboard
[x] Add debounce to typer resizing
[x] Add linting and formatting on commit
[x] Add aria-label to copy room link to clipboard
[x] Adjust cursor colors
[x] Rename error color to negative
[x] Broken view transition timing
[x] Timer doesn't hit 0 when a user has finished but the other user's timer is behind
[x] Add dark mode colors
[x] Add light/dark mode switch
[x] Is there any better way of initializing a theme?
[-] (Couldn't replicate this?) Missing results from leaderboard for new users (seems to be missing the last joined player?)
[x] Leaderboard resize on users leaving
[x] Add bottom padding to body/pages
[x] Join code on homepage doesn't make sense given that we copy room links
[x] Capitalization of room codes shouldn't matter
[x] Notify user if their color was taken when they joined a room
[x] lastScore needs to be reset after leaving a room
[x] Error page
[x] Animate state/page changes as often as possible for better UX/clarity
[x] Fix SCSS warnings
[ ] Figure out how to host locally
[ ] Show current user's WPM in game UI as well
[x] Small layout shift when user is done/has failed
[ ] Time doesn't update correctly when the tab is hidden?
[ ] Remove unnecessary 'complete' state from room
[ ] Some way of editing your color and username within the room
[ ] Room settings when created (i.e. test length, time limit, etc.)
[ ] Have a room admin (the person who created the room) who can change room settings
[ ] Add a basic header
[ ] Add active user count
[ ] Create a favicon
[ ] Domain name?
[ ] Figure out hosting
[ ] Some very fast layout shift on loading the homepage?
[ ] Some kind of congratulations on winning the room
[ ] Something negative for failing
[ ] Information/walkthrough for new users
[ ] Getting kicked out of a room from a socket change should send the user back to the homepage
[ ] calculate statistics in realtime as the user types
