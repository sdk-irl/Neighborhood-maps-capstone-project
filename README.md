##FoodFinder App ReadME

This FoodFinder app is the capstone project for the Udacity Frontend Nanodegree course. 

There was no starter template for this project, but it was was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It uses HTML, CSS, JS, React, JSX, APIs, and implements service workers to work offline.

## APIs and libraries in use
- Google maps API (https://developers.google.com/maps/documentation/) to obtain the map and local data
- google-maps-react (https://www.npmjs.com/package/google-maps-react) to assist with writing the react code needed to render Google maps
- FourSquare developer API (https://developer.foursquare.com) used to obtain third-party information about the restaurant locations, in this case, days of the week the locations are open.

## Restaurant data
- Most restaurant data is currently hardcoded in location.json, but the app was built so that this could be changed and data could be obtained frm either Google or FourSquare as needed.

## Pull Requests
This is a graded project, so I will not accept pull requests prior to late-November 2018. 

## Original Create-React-App documentation
Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents



## Updating to New Releases

Create React App is divided into two packages:

- `create-react-app` is a global command-line utility that you use to create new projects.
- `react-scripts` is a development dependency in the generated projects (including this one).

You almost never need to update `create-react-app` itself: it delegates all the setup to `react-scripts`.

When you run `create-react-app`, it always creates the project with the latest version of `react-scripts` so you’ll get all the new features and improvements in newly created apps automatically.

To update an existing project to a new version of `react-scripts`, [open the changelog](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md), find the version you’re currently on (check `package.json` in this folder if you’re not sure), and apply the migration instructions for the newer versions.

In most cases bumping the `react-scripts` version in `package.json` and running `npm install` (or `yarn install`) in this folder should be enough, but it’s good to consult the [changelog](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md) for potential breaking changes.

We commit to keeping the breaking changes minimal so you can upgrade `react-scripts` painlessly.

