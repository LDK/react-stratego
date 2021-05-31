module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
		"node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
		'getter-return': 'error',
		'no-console': 'error',
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"react/no-direct-mutation-state": 'warn'
    },
	"settings": {
	    "react": {
	      "createClass": "createReactClass", // Regex for Component Factory to use,
	                                         // default to "createReactClass"
	      "pragma": "React",  // Pragma to use, default to "React"
	      "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
	      "version": "detect", // React version. "detect" automatically picks the version you have installed.
	                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
	                           // default to latest and warns if missing
	                           // It will default to "detect" in the future
	      "flowVersion": "0.53" // Flow version
	    }
	}
};
