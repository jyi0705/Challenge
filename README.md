# Challenge 

Initial Steps:

1) git clone this repo using the terminal ($git clone https://github.com/jyi0705/Challenge.git)
2) Execute ($npm install) in the terminal to install all the dependencies needed for the project

How to run Exercise #1:
1) Using Google Chrome open up the file Exercise1/index.html (cmd+O)
2) Open up the dev tools using hot key (Command+Option+J on Mac) (Ctrl+Shift+J on Windows/Linux)
3) In the Console enter one of the following to execute each implementation: 
      - "instance1()" to run implementation #1
      - "instance2()" to run implementation #2
      - "instance3.componentWillMount()" to run implementation #3
4) OBSERVE CONSOLE SCRIPT!

How to run Exercise #2:
1) In terminal execute ($npm run test)
** NOTE - If you already have a modules.json in the project make sure to either delete it or re-run the test to make them all pass.
The reason why your test may not pass if there is already a modules.json file in the directory is because fs.unlinkSync is an async function that takes some time to unlink the existing modules.json from the test.  
