var plugins = [{
      name: 'gatsby-plugin-sitemap',
      plugin: require('/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-plugin-sitemap/gatsby-ssr'),
      options: {"plugins":[],"output":"/sitemap","createLinkInHead":true,"entryLimit":45000,"query":"{ site { siteMetadata { siteUrl } } allSitePage { nodes { path } } }","excludes":[]},
    },{
      name: 'gatsby-plugin-layout',
      plugin: require('/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-plugin-layout/gatsby-ssr'),
      options: {"plugins":[],"component":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/src/templates/docs.js"},
    },{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-mdx',
      plugin: require('/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-plugin-mdx/gatsby-ssr'),
      options: {"plugins":[],"gatsbyRemarkPlugins":[{"resolve":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-images","id":"018bd99b-813c-5251-a110-8d9c1f629336","name":"gatsby-remark-images","version":"6.1.0","modulePath":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-images/index.js","pluginOptions":{"plugins":[],"maxWidth":1035,"sizeByPixelDensity":true},"nodeAPIs":["pluginOptionsSchema"],"browserAPIs":["onRouteUpdate"],"ssrAPIs":[]},{"resolve":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-copy-linked-files","id":"cf104666-f93f-5e9d-9c2e-1bd9003e1e14","name":"gatsby-remark-copy-linked-files","version":"5.1.0","modulePath":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-remark-copy-linked-files/index.js","pluginOptions":{"plugins":[]},"nodeAPIs":[],"browserAPIs":[],"ssrAPIs":[]}],"extensions":[".mdx",".md"],"defaultLayouts":{},"lessBabel":false,"remarkPlugins":[],"rehypePlugins":[],"mediaTypes":["text/markdown","text/x-markdown"],"root":"/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs","commonmark":false},
    },{
      name: 'gatsby-plugin-gtag',
      plugin: require('/Users/urvl/Projects/_opens/cloudpro-club/wiki/docs/node_modules/gatsby-plugin-gtag/gatsby-ssr'),
      options: {"plugins":[],"trackingId":null,"head":true,"anonymize":false},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
