module.exports = {
  env: {
    browser: true,
    es6: true,
    webextensions: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "prettier/react",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  ignorePatterns: ["node_modules/"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: ".",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    "react",
    "import",
    "react-hooks",
    "prettier",
  ],
  rules: {
    "react-hooks/rules-of-hooks": "error", // to make 'react-hooks' work
    "react-hooks/exhaustive-deps": "warn", // to make 'react-hooks' work
    "react/prop-types": 0, // prop-types rule
    "no-empty": 0,


  },
  settings: {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                           // default to latest and warns if missing
                           // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      {"property": "freeze", "object": "Object"},
      {"property": "myFavoriteWrapper"}
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      {"name": "Link", "linkAttribute": "to"}
    ]
  }
};

/**
 * https://github.com/airbnb/javascript User Manual for 'airbnb'
 * https://github.com/leonidlebedev/javascript-airbnb/
 * https://github.com/airbnb/javascript/tree/master/react
 * https://github.com/yannickcr/eslint-plugin-react
 * https://github.com/leonidlebedev/javascript-airbnb/tree/master/react
 */