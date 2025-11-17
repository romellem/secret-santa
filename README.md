# Secret Santa

This is a project I wanted to make to create a bare-bones "[secret santa][1]" web application,
**and** heavily rely on LLMs. I first made this application in 2024 using [ChatGPT 4o+Canvas][2] and then improved it in 2025 using [OpenAI Codex gpt-5.1-codex][7].

I originally documented this in 2024, and kept that below. Afterwards I wrote some new thoughts around how this went in 2025.

## 2024 Thoughts

Overall, I'm feeling pretty _meh_ on the experience.

I'll leave my thoughts below, but if you want to see which prompts I used, look at the commit
history. For commits that I copied from ChatGPT, I prefix the prompt with `Prompt:` and then
paste in what I was feeding to ChatGPT.

### Overall

Using LLMs to generate moderately complex websites still seems fraught. The main problem
is that I needed to use some heavy debugging to guide things along, plus use "LLM-specific"
knowledge (e.g. what LLMs are good at) to arrive at a workable app.

I found the LLM often got "stuck" in some local maxima, and when it couldn't pull itself out,
I had to dig into a ton of code I was unfamiliar with (because I didn't write it), thus defeating
the purpose of me not spending brain power on this "toy" app. It felt like it would have been easier
to guide the LLM in smaller chunks to begin with: I would have made different data structure /
architecture decisions, and I think the app would have been easier to grok, whereas the finished
product feels like it was built by a junior developer. But of course, that still defeats the purpose of
offloading the cognition to the AI.

### Prompt

Here was my initial prompt to kick things off:

> I am a senior frontend developer, and I want you to help me build a static website.
>
> This website will be for a "secret santa" game, just something for me to use personally with
> members of my family. Here are my ideas of the site. I want you to validate these ideas, and
> if I miss something important, add to the ideas as well.
>
> - The site will operate entirely in the browser. There will be no server or database for this application.
> - I will use hash params (or query params if you think that would be better?) to store the application state.
> - The aid with size and obscure the application state, the params will be compressed with LZMA-JS (I'll give more details on this later).
> - The site will load in a "starting" state, which will be:
>   - A form to add people to my list
>   - Some fields to allow for selecting people that are disallowed from being secret santa partners (e.g., my brother and his wife shouldn't be paired, so I'll need a mechanism in the UI to set this behavior).
>   - After entering in the data, a button to submit the form and generate the pairs
> - After submitting the form, it will compute the pairs using an algorithm that makes sure we don't have any "simple" loops (e.g. Tom gives a gift to Sarah, and Sarah gives a gift to Tom), and follows the disallow list from before
> - This then gives an "admin" page, which shows all the people entered before, and a unique URL to send to that person with their pairing
> - The idea on the admin page is I won't know who the algorithm chose. The URLs have their state compressed, so it obscures the pairings
> - If you open the URLs for the individuals, it shows you that person's name, and who they are paired with.
>
> That is it! So I'll need 3 pages (I think).
>
> - Initial form
> - Admin page which shows all the pairings (loading from some URL state via hash params)
> - Individual pairing page (also loading from some URL state via hash params)
>
> Validate if these ideas make sense, and suggest if you think I missed some logical step.
>
> If everything sounds good to you, let's get started programming.
>
> This application will be a few files.
>
> - index.html - Will contain the CSS and HTML for the application
> - app.js - Will contain all the code to make this work
> - lzma.js - I'll provide this file, used to initialize the LZMA library
> - lzma_worker.js - the JS logic to implement LZMA compression / decompression

### Likes

- I was impressed that it was able to build a somewhat decent looking webpage from my initial prompt.
  I still had to tinker with the CSS, especially to make it look good on mobile.
- It was nice to have the project _immediately_ moving forward. Sometimes, when starting from scratch,
  you have a bit of writer's block. Getting some quick momemtum felt good.
- This took around 5ish hours I think? Which probably is faster than if I was doing everything by hand.
  However, if I was taking an extremely guided approach and just using something like [Copilot][6], maybe
  that would have been easier? That is, completely offloading my brain probably isn't a real possibility (yet),
  even for these toy apps. There is just too much of a likelihood that something breaks and the LLM isn't
  able to fix it without heavy handed intervention.

### Problems

- ChatGPT often would edit the wrong file. Like it would say
  _"Here are your changes to file `A`. Would you now like me to continue with file `B`?"_ And I'd say
  _"Yes,"_ and then it would start completely rewriting file `A` with `B`'s changes! When that would happen,
  I had to "expand" the correct file in the Canvas, and then give it the prompt again.
- I found it hard to continue my train of thought when I got to a point where I could run the code and
  saw that it was returning errors. If the LLM was able to immediately fix it, it wouldn't be clear what
  the change was, and sometimes, a more complete solution would make more sense once I dug into the code
  holistically.
- The whole process felt clunky. Typing out my thoughts, especially in a formatted manner, took a not
  insignificant amount of time. And afterward, copying the files over, I never entered any kind of "flow"
  state.
- It wasn't insightful in ways I wanted it to be. For example, I used an [LZMA][3] library to create
  the hash params, but the library is fairly old and thus doesn't offer a `Promise`-based API. Making
  one wouldn't be difficult, and if I was using the library directly, I probably would have quickly
  made some wrapper methods to promis-ify it. However, the LLM didn't do that: it dutifully used the API
  as-is, and once the application was stood up, refactoring that seemed more trouble than it was worth.
  I guess I'm trying to say, it didn't seem like the LLM had some long-term insight. Part of the value
  I think senior developers bring to the table is their experience that helps in those long-term decisions.
  The LLM felt very junior in this way: just churn out code that technically works, but maybe isn't the
  best for long-term stability.
- At one point, it really got stuck on the "[Hamilton path][4]" problem. One time I told it about a bug
  I was seeing (took a while to debug that, too), and when I told it how to fix it, it just
  [spat out some comments in the code][5] rather than actually implementing the fix. It was at this point
  that I thought the file was a bit too large, so I had to split things out to separate files so its context
  window wouldn't get overloaded. This was really lame and unintuitive.

## 2025 Thoughts

Using agentic workflows in 2025 made this so much better!

This year, I wanted to fix some bugs and make the site a little more visually appealing

Some immediate things I liked:

- Being able to run everything in a CLI locally. No more copy/pasting or awkwardly having the LLM use the wrong file. Giving the LLM a specific file with an `@/mention` is great.
- Multi-modal again is really cool. I took a screenshot of the site and was able to paste that in and tell it things I wanted to change. This seemed to work much better this time around.
- Design-wise, this iteration of LLMs seems more capable of making good looking sites. Of course, under the hood it seems like things are a bit of a mess (it didn't take a Systems approach to Design), but for these toy projects I don't really care about maintainability.

Some things I still didn't like

- I asked it to add some animating snow to the "individual pages" and it did terribly. I had to greatly guide it. Finally I realized that when it was trying to animate a percentage-based `transformY`, that meant it'd be translating the height _of the snowflake,_ not translating it across the height of the page. Things like this I'd expect the LLMs to know.
- Maybe it's Open AI, but I have a hard time still fully groking the code it spit out. I am not seeing an overall "organizational structure" to things. Maybe it is the lack of code comments? It is little things. Like in the `main.js` file, it has
    
    ```js
    async function loadStateFromURL() {
      const stateFromURL = await readStateFromHash();
      if (stateFromURL) {
        replaceApplicationState(stateFromURL);
      }
      renderCurrentPage();
    }
    
    initSetupPage();
    initAdminPage();
    
    window.addEventListener("load", loadStateFromURL);
    window.addEventListener("hashchange", loadStateFromURL);
    ```
    
    - If this site has 3 pages (setup, admin, and individual), why does it only have `initSetupPage` and `initAdminPage`?
        - When you look into each of these, you see those functions are mostly setting up event handlers, and since the Individual page doesn't have any inputs, that's why it doesn't have a function for that. But that is arbitrary. A better named function would have been `initEventListeners()` and handle all pages, or maybe that could have called `initEventListenersSetupPage()` and `initEventListenersAdminPage()`. Those event listeners too depending on the HTML structure. Namely, that the controls already exist on the page but are just hidden. That is an important implementation detail that I'd leave a comment for. The LLM didn't think to remark on that.
    - Why a `load` and `hashchange` listener? The `hashchange` was needed to fix a bug and make the admin page work more like an SPA, but you'd never know that by just looking at the code.
    - Why make `loadStateFromURL` impure? This function should be split in two - one that reads the state from the URL and returns it as a new value, and one that takes in that state as an argument and hydrates the local state and renders the page (e.g. 2nd one should be _pure_).
- Overall, the code still seems very disjointed and "junior." Although things moved way faster now, and the quality has increased, I wouldn't trust this to build any serious business.


[1]: https://en.wikipedia.org/wiki/Secret_Santa
[2]: https://openai.com/index/introducing-canvas/
[3]: https://github.com/LZMA-JS/LZMA-JS
[4]: https://binary-machinery.github.io/2021/02/03/secret-santa-graph.html
[5]: https://github.com/romellem/secret-santa/commit/8e23b0f2e89aef6f30af1f1c016b69cf1a668f78
[6]: https://github.com/features/copilot
[7]: https://openai.com/index/introducing-codex/
