module.exports = {
    "root": true,
    "extends": ["google"],
    parser: 'babel-eslint',
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {

        }
    },
    "rules": {
        "semi": 2,
        "require-jsdoc": 0,
        "valid-jsdoc": [1, {
            "prefer": {
                "return": "returns"
            },
            "requireReturn": false
        }],
        "keyword-spacing": 2,
        "max-len": 0,
        "object-curly-spacing": [2, "always"],
        "brace-style": 0
    },
    "env": {
        "browser": true,
        "es6": true
    }
};
