# Shopping List
This is an app I built (quite casually) using React, TypeScript, and Next.js. It's a web app that simulates a shopping list, but much more efficient than a paper note. The application integrates with a Realtime Database via Firebase, a project by Google. Additionally, it features a user-friendly design.

## How to Use?
To check and test it out, you can view the deployed version on Vercel by visiting https://shopping-list-micheltorres.vercel.app, or you can build the project locally (using your own database!).

## Building the App
If you prefer the second option, clone the project using git clone or download the .zip file available on GitHub. Then, use your preferred package manager to build the project in the root directory where the imported files are located on your machine.

I like to use Yarn. If you have it installed, run the following command in the terminal:

```batch
yarn run build
```

It also works with other package managers, such as the popular NPM. If that's your preference, use this:

```batch
npm run build
```

## Running the Project Locally
Once you've built the app, simply start the application with:

```batch
yarn run dev
```

Or

```batch
npm run dev
```

Next.js will output a message in the terminal with a link to open the app on a local network. By copying this link into your browser's address bar, the app will load, but note that at this stage it won't have a private database to store your shopping list items. The items will be saved to a public database I’ve made available in a `.tsx` file.

## Setting Up Your Database
If you'd like to go further and configure your own database to store only your shopping list items, navigate to the `{root-project-folder}/src/db` directory and locate the `index.tsx` file. At the top of the file, set the `appSettings.databaseURL` variable to the link of your Firebase database. It needs to be publicly accessible to work directly with the code, so if you prefer an implementation with password protection and authentication, you will need to adjust the settings accordingly.

For further information, refer to Firebase's documentation: https://firebase.google.com/docs?hl=en.