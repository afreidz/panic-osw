##  😨 Panic OS Widgets
These are my own personal OS widgets for use with linux in an X11 window manager setting.  I developed them for my wants but maybe you will get some use out of this repo to make something for yourself.  The widgets are rendered using [GTK](https://www.gtk.org/)+[WebKit2](https://webkitgtk.org/) via [NodeGTK](https://github.com/romgrk/node-gtk).
### Directory-Structure/Architecture
* **/cli** this is the source directory for a bin that can be used to manage most aspects of the widgets.  It is a [nodejs](https://nodejs.org/en/) process.  It includes an initial setup command, commands for starting/stopping various processes, and commands for opening and closing the widgets (which can be bound to hotkeys thru the preferred window manager methods).
* **/app** this is the source directory for the front-end widgets.  It provides a long-running process hooked into [GTK](https://www.gtk.org/) to create bare-bones app windows containing [WebKit2](https://webkitgtk.org/) webviews for the widget UI.  When signaled, this process will build or show an existing gtk window for a widget. It also houses the UI components which are built using [svelte](https://svelte.dev/) javascript framework to manage updating the UI when data changes occur.
* **/server** this is source directory for the nodejs server that acts as the backend for the widgets.  It leverages express+websockets for both IPC communication to the cli/gtk as well as the front-end webview.
* ****/lib** are directories of shareable code for anything at that level or below in the directory structure.
### Dependencies/Assumptions
* **(Arch-)Linux:** As I mentioned these are my personal widgets. I have only developed them to work on my setup.  I run Arch btw 😊. Initially I supported the darwin (mac) platform but decided that only 1 of the widgets works as intended on darwin (mac), so I may just create a separate project for it. [See more about ArchLinux](https://archlinux.org/)
* **NodeJS/NPM:** I know javascript so I guess I might as well use it for all the things.  [Express](https://expressjs.com/) is easy to setup, and with a few safeguards in place, can be restricted to internal traffic only. [Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) are a nice real-time way of handling communication across cli/app/server.  Surprisingly, there are some half-decent npm modules for making cli apps too.  [See more about NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
* **GTK:** Leveraging GTK allows me to use WebKit2 webviews for the widgets.  Early on in this project I defaulted to [Electron](https://www.electronjs.org/) which is a go-to for many to use web technologies to render desktop apps (cross platform).  Much has been made about the resource constraints for electron and odds are that most linux users already have GTK (and GTKWebKit2 by extension).  So depending on a prebuilt binary of electron doesnt make a ton of sense if I am only building this for my linux setup.  As such, GTK is a better option.  [See more about GTK in the NodeJS context.](https://github.com/romgrk/node-gtk)
* **App Deps:** This list may change so I will keep it generic.  There are some app-level dependencies that are necessary to get the data used in the widgets.  Most of them are handled thru `npm` however there are quite a few instances of the server issuing bash commands to get sytem information.  The cli setup command should check to see if they are all satisfied and print which ones are not.  I may also build in something to install them if the system is ArchLinux+yay.
### Installation
Assuming you have read the Dependencies/Assumptions (you are running linux, have node/npm/gtk installed) you can install everything with the following steps:
* Clone this repo
* run `npm install` from the project folder
* run `npm i -g .` from the project folder to symlink the cli
* run `panicosw setup` (note: `panicosw` is the default bin name, you can change it [here](https://github.com/afreidz/panic-osw/blob/90d8d74bfa7df0dbe18e09c70b6d0af6008a4c18/consts.js#L9) if you dont like that)

### Widgets
Once you have installed everything, a basic config file will be created in `~/.config/panicosw` (there are more configurations options at `http://127.0.0.1:{port from setup}/settings`).  You now should have access to the following wigets:
* **bar** - a minimal top bar that will only work with [i3wm](https://i3wm.org/).  It will show, "mode," workspaces, and a clock.  I like things simple for a bar.
* **launcher** - a rofi/alfred-like fuzzy search box to raise or launch snap/.desktop apps (those are the only 2 types of apps/functions I have accounted for). Its pretty basic as well to keep its utility known and its performance fast.
* **locker** - a screen locker that accepts a password for the current user to close itself.  It leverages PAM to authenticate.  It is also largely dependent on the window manager settings to make it function as a true screen locker.  I wouldn't put any stock in it's "security" as a true screen lock, but it serves its purpose for my setting.
* **dash** - a "splash screen" that displays a bunch of system information in a "HUD" like display.  The sub-widgets (for lack of better term) are all things I find useful.  Some of them are entirely specific to me.  As such, I have tried to hide as many of those under a setting that I wont publicize so that others need not concern themselves with my unique situation.  The layout (which leverages css-grid) is an exercise in trial and error.  So I dont think I will be interested in making changes to this myself.  But feel free to fork and move/create sub-widgets to suit your needs.
### CLI Details
* `panicosw setup` - this will check all the non-`npm` app dependencies and configure the bare minimum options to run everything needed.
* `panicosw open` - this will open the widget with the following options:
	* `-w`,`--window` - the widget to open, either `"locker"`,`"dash"`,`"bar"`,`"launch"`
	* example: `panicosw open -w locker`
*  `panicosw close` - this will close the widget with the following options:
	* `-w`,`--window` - the widget to open, either `"locker"`,`"dash"`,`"bar"`,`"launch"`
	* example: `panicosw close -w launch`
* `panicosw run` - this will run the processes needed to back the widgets. it has the following options:
	* `-c`,`--command` - the process to spawn, either `"server"`, `"app"`,`"build"` (which will one time compile the front end when the source code has changed)
	* example: `panicosw run -c server -c app` (note: this is the default for `panicosw run`).
* `panicosw kill` - this will kill the process with the following options:
	* `-c`,`--command` - the process to kill, either `"server"`, `"app"`
	* example: `panicosw kill -c server -c app` (note: this is the default for `panicosw kill`).
* `panicosw launch` - this will raise or run an application.  It is used within the launch widget but it can be used standalone.  It has the following options:
	* `-t`,`--type` - search for existing running app by type.  either `"class"` or `"title"`
	* `-s`,`--search` - the string to use to search using the type above
	* `-c`,`--command` - a command to run if the search yields no results
	* eample: `panicosw launch -t "title" -s "Sublime Code" -c subl`
### i3wm suggested config
If you are using i3wm, this is how I wire up the cli commands to hotkeys and other such settings

**Autostart** - run everything and immediately spawn the bar
```
exec --no-startup-id panicosw run && panicosw open -w bar
```
**Open Dash** - use a "mode" to capture `escape` to close the widget and bind the mode to a hotkey
```
bindsym $mod+space mode "launch"; exec --no-startup-id panicosw open -w launch
mode "launch" {
	bindsym Escape mode "default"; exec --no-startup-id panicosw close -w launch
}
```
**Open Launch** - use a "mode" to capture `escape` to close the widget and bind the mode to a hotkey
```
bindsym $mod+grave mode "dash"; exec --no-startup-id panicosw open -w dash
mode "dash" {
	bindsym Escape mode "default"; exec --no-startup-id panicosw close -w dash
}
```
**Lock the Screen** - a simple hotkey binding to launch a particular widget
```
bindsym $mod+Shift+l exec --no-startup-id panicosw open -w locker
```
### Picom suggested config
If you use `picom` compositor (particularly with rounded corners and blur) there are a few settings that might be helpful
```
blur-background-exclude = [
	"window_type = 'dialog'",
];

shadow-exclude = [
	"window_type = 'splash'",
	"window_type = 'dialog'",
]

rounded-corners-exclude = [
	"window_type = 'dock'",
	"window_type = 'splash'",
	"window_type = 'dialog'",
];

wintypes: {
	dock = { shadow: false },
	splash = { shadow: false },
	dialog = { shadow: false },
	utility = { shadow: false },
};
```
### Misc Notes
The widgets leverage EWMH to make suggestions to the window manager about how to handle the window.  The types used are `dock` for the **bar** widget, `splash` for the **dash** widget, `dialog` for the **locker** and the **launch** widget.
### TODO
- [ ] investigate potential memory leaks
- [ ] maybe a weather widget?
