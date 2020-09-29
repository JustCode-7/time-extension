# Time Extension

> Manage your Time Account with ease

## Project Structure

This Project consists of two main parts 
1. Popup
2. Content Scripts

### The Popup
This is the UI part of the extensions. It is created with StencilJS.

### Content Scripts
These scripts get bundled and injected into the Website. The defined functions
 get called from the UI to interact with the page itself and extract Information
 to be shown in the Popup.

### Connection Based Messaging

We use Connection Based Messaging to communicate between the Extension and the
 Webpage. 

It is used to 
- navigate inside the page 
- extract data 
- insert data and interact with the page 

The Popup is not always rendered and active, thus we have to use the
 background-script as a message broker.

Webpage <=> Background Script <=> Popup

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#Connection-based_messaging


### State Handling

The Popup handles all the state by utilizing `@reduxjs/toolkit`.

## Requirements

- NodeJs and npm
- Web-Browser, preferably Chrome for local development


## Local Development

```bash
npm run stencil:start
```

Create new components:

```bash
npx stencil generate <dir?>/<new-component>
```

The `stencil-router` does not work here, the Extension basically loads a local
file, instead of serving the content via a 'server'.  

## BUILD

Build for Production:
```bash
npm run build
```

## TEST

```bash
npm run stencil:test
```

```bash
npx jest
```

## LINT

```
npm run lint
```

# Popup - Framework considerations

1. Stencil  
    `+` Typescript support out of the box  
    `+` Easy to set up  
    `-` Styling inside the Shadow-Dom means duplicating a lot of CSS  
    `-` Currently, does not support source maps.  

2. Svelte
    `+` Very lightweight
    `+` Simple and easy, very good and interactive tutorial 
    `-` Typescript-Setup with webpack did not work. (when including exported interfaces/functions)
    `-` Webstorm does not support Svelte in combination with Typescript.
 
3. React
    `+` The most popular SPA-Framework at the moment.
    `-` CRA is very opinionated and does not support much configuration (e.g setting the src-directory) > ejecting would be required
    `-` IMO Changes too fast.

4. Angular
    `+` TS support out of the box
    `+` Very  
    `-` IMO too heavyweight for the popup. 

5. VueJs

