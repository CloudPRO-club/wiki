module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-layout/gatsby-browser.js'),
      options: {"plugins":[],"component":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/src/templates/docs.js"},
    },{
      plugin: require('../node_modules/gatsby-plugin-mdx/gatsby-browser.js'),
      options: {"plugins":[],"gatsbyRemarkPlugins":[{"resolve":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-images","id":"018bd99b-813c-5251-a110-8d9c1f629336","name":"gatsby-remark-images","version":"6.1.0","modulePath":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-images/index.js","pluginOptions":{"plugins":[],"maxWidth":1035,"sizeByPixelDensity":true},"nodeAPIs":["pluginOptionsSchema"],"browserAPIs":["onRouteUpdate"],"ssrAPIs":[]},{"resolve":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-copy-linked-files","id":"cf104666-f93f-5e9d-9c2e-1bd9003e1e14","name":"gatsby-remark-copy-linked-files","version":"5.1.0","modulePath":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-copy-linked-files/index.js","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]}],"extensions":[".mdx",".md"],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs","commonmark":false},
    },{
      plugin: require('../node_modules/gatsby-remark-images/gatsby-browser.js'),
      options: {"plugins":[],"maxWidth":1035,"sizeByPixelDensity":true},
    },{
      plugin: require('../node_modules/gatsby-plugin-gtag/gatsby-browser.js'),
      options: {"plugins":[],"trackingId":null,"head":true,"anonymize":false},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
