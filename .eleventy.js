module.exports = function (eleventyConfig) {
    return {
        dir: {
            input: "src/site",
            includes: "_includes",
            output: "dist"
        },
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    };
};
