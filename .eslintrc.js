module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    "plugin:@typescript-eslint/recommended",
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js','.jsx','.ts','.tsx']
      }
    },
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    }
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        "labelComponents": [],
        "labelAttributes": [],
        "controlComponents": [],
        "assert": "either",
        "depth": 25
      }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/button-has-type": "off",
    "react/destructuring-assignment": "off",
    "linebreak-style": [2, "windows"],
    "prefer-destructuring": "off",
    "react/no-array-index-key": "off",
    "no-use-before-define": "off",
    "no-alert": "off",
    "arrow-body-style": "warn",
    "no-unused-vars": "warn",
    "react/state-in-constructor": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "no-nested-ternary": "off",
    "no-console": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "import/extensions": [1, "never"],
    "no-else-return": "off",
    "quotes": [2, "single", { "allowTemplateLiterals": true }],
  },
};
