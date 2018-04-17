### Callstats.io WebRTC demo application UI ###

##### UI Libraries #####

Constructed based on two two views. Landing page, and meeting page. Each page has several components, and component handlers.  

```
    views           - All react view components
    handlers        - Corrosponding view  handler
```

### Usage ###
- Landing page
    - ``` AppLayout.js ``` of landing page contains html view for Landing page
    - Logic handler code is initialized from view class constructor
    - Divided in
        - content
        - footer
        - header
        - popup
- Meeting page
    - ``` AppLayout.js ``` of meeting page contains html view for Meeting page
    - Logic handler code is initialized from view class constructor
    - Divided in 
         - alert
         - content
         - header
         - loading
         - popup


### Functionality ###
- LandingPage
    - Can create a meeting
    - Can open a meeting
- MeetingPage
    - Can do a WebRTC audio+video conference and exchange messages
    - Can do screen share
