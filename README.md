# Time Extension

> Manage your Time Account with ease

## Project Structure

This Project consists of two main parts

1. Popup
2. Content Scripts

### The Popup

This is the UI part of the extensions. It is created with VueJS and Vuex.

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

The Popup handles all the state by utilizing `vuex`.

## Requirements

- node.js and npm
- Web-Browser, preferably Chrome for local development

## BUILD

To build and run the extension inside Chrome use the following command:

```bash
npm run build
```

## Local Development

To run vue: Start a local dev server to run vue, it comes with
Hot-Module-Replacement (HMR) out of the box.  
Note: Due to a lack of a connection-mock it is currently not very useful.

```bash
npm run serve
```

View the `package.json` for more preconfigured commands.

The `vue-router` does not work here, the generated Browser-Extension basically
tries to load a local file, because the files are not served by a convetional
server.

How to setup the chrome-extension:

- Go to `chrome://extensions/`
- Enable `Developer mode`
- Click `Load unpacked` and open the folder containing the build
  output (`time-extension/dist`)
- The icon may not appear in the navigation bar, you have to manually pin it via
  the extension-dropdown-menu

## TEST

```bash
npm run test
npm run test:vue
```

## LINT

```bash
npm run lint
npm run lint:vue
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
   `-` Typescript-Setup with webpack did not work. (when including exported
   interfaces/functions)  
   `-` Webstorm does not support Svelte in combination with Typescript.

3. React  
   `+` The most popular SPA-Framework at the moment.  
   `-` CRA is very opinionated and does not support much configuration (e.g
   setting the src-directory) > ejecting would be required  
   `-` IMO Changes too fast.

4. Angular  
   `+` TS support out of the box  
   `+` Offers many features    
   `-` IMO too heavyweight for the popup.

5. VueJs

