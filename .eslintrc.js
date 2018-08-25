module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            // "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018
    },
    "plugins": [
        "react",
        "prettier"
    ],
    "rules": {
        "react/jsx-uses-vars": 1,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "prettier/prettier": "error"
    }
};
