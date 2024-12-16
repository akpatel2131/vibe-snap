module.exports = {
  extends: ["stylelint-config-standard"],
  scripts: {
    "eslint": "eslint .",
    "eslint:fix": "eslint . --fix",
    "stylelint": "stylelint '**/*.{css,scss}'",
    "stylelint:fix": "stylelint '**/*.{css,scss}' --fix",
  },
  rules: {
    "color-hex-length": "short",
    "block-no-empty": true,
    "selector-class-pattern": null,
  },
};
