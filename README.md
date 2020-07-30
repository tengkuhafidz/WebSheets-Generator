# WebSheets Generator

This is a Gatsby template for creating listing websites based on Google sheets data.

## Getting Started 🚀

### Pre-setup Requirements

1. Install [NodeJs](https://nodejs.org/en/download/)
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
3. Install [Gatsby](https://www.gatsbyjs.org/docs/glossary/yarn/) `yarn global add gatsby-cli`
4. Create [Google API key](https://developers.google.com/sheets/api/guides/authorizing#APIKey)
5. Enable [Google Sheets API](https://console.developers.google.com/apis/library/sheets.googleapis.com?project=websheets&folder&organizationId)

### Preparing the Project

1. Clone this repo `git clone https://github.com/tengkuhafidz/websheets.git`
2. Run `yarn install` to download dependencies
3. Make a copy of the [google sheets template](https://docs.google.com/spreadsheets/d/17c2Fy1D5k2P7BkjmJoFIY_eohHBMM806_lHCYKzRtqM/edit#gid=72026853) and **set it to public**.
4. The sheet names (`site`, `listing`) and header names (1st row of each sheet) should NOT be changed.
5. Fill in the google sheets with the site's data and item listings details
   - Ensure to not leave any fields empty. Write `nil` to indicate no value instead

### Running on Dev Environment

1. Create `.env.development` file on the project root

   - Include `GATSBY_SHEET_API_KEY`="Google-Sheets-Api-Key-With-Quatations"
   - Include `GATSBY_SHEET_ID`=Google-Sheets-Id-With-Quotations"
     - _Where is the [Google Sheets Id](https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id)?_

2. Run `yarn start`
   - Your site will run at `http://localhost:8000`
   - You graphiql will run at`http://localhost:8000/___graphql`

### Running on Prod Environment

1. Create `.env.production` file on the project root
   - Include `GATSBY_SHEET_API_KEY`=Google-Sheets-Api-Key-Here
   - Include `GATSBY_SHEET_ID`=Google-Sheets-Id-Here
     - _Where is the [Google Sheets Id](https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id)?_
2. Run `yarn build`
3. Run `yarn serve`
   - Your site will run at `http://localhost:9000`

## Troubleshooting

Having an issue? The following are common setup mistakes that might have caused it. Please ensure that the following are set properly.

- Google Sheets MUST be set to **public**
- [Google API](https://console.developers.google.com/apis/library/sheets.googleapis.com?project=websheets&folder&organizationId) MUST be **enabled**
- The value of environment variables MUST be in between double quotations

## Underlying Tech

- Typescript
- TailwindCSS
- Sheets API

The following setup have been configured in this project:

- Dark Mode
- Social Share
- SEO
- PWA and offline capabilities
- Site metadata
- eslint & prettier
- husky

## TODO

WebSheets

- [ ] Create a landing page to guide user on generating their own site
- [ ] allow user to customise permalink
- [ ] Create a demo version where users can switch site templates via google sheets

## What's inside? 🧐

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── static
    ├── .gitignore
    ├── .eslintrc.js
    ├── .prettierrc.js
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── LICENSE
    ├── yarn-lock.json
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── README.md
