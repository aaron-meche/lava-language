# Lava Coding Language
## What is it?
A web development language written and designed as a prettier, faster, and simpler version of HTML with more features and a cleaner, more concise syntax.
## How does it work?
The client launches an HTML file that runs this online compiler that then reads the lava pages stored on the web server and compiled them to HTML, then displaying the result to the client.
## How cam I get started?
1. Create a project folder
2. Create a standard HTML file
3. In that HTML file, link this online compiler (https://lava.baileo.us/[VERSION]/compile.js)
4. Create a folder named "content"
5. Install the "Lava Programming Language" extension from Visual Studio Code
6. Create a file named "home.lava" ("home" is the inital boot file for any Lava web application)
7. Start writing you code in the "home" file and voila! You have a running Lava Application!
## Version History
1. Version 1 Alpha
- Transition from Tiger (.tgr) to Lava (.lava) Completed
- New `define view` method of providing UI content to the client
- Code Modules! `define module` and `import module`
- Syntax reworked to reduce keywords
- New `lavatype` attribute
  - Will, in the future, be used in place of traditional HTML elements (button, input, etc.) with the standard Lava UI Library (custom libraries will also be a feature)
- More secure Lava feature implementation