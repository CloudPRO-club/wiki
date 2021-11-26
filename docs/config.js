const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://cloudpro-club.github.io/',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '',
    logoLink: 'https://cloudpro-club.github.io/',
    title:
      "<a href=''><img class='img-responsive' src='' alt='Learn logo' /></a>",
    githubUrl: 'https://github.com/CloudPRO-club/wiki/tree/main/docs',
    helpUrl: '',
    tweetText: '',
    social: `<li>
		    <a href="https://twitter.com/" target="_blank" rel="noopener">
		      <div class="twitterBtn">
		        <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/twitter-brands-block.svg' alt={'Twitter'}/>
		      </div>
		    </a>
		  </li>
			<li>
		    <a href="https://discordapp.com/invite/" target="_blank" rel="noopener">
		      <div class="discordBtn">
		        <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/discord-brands-block.svg' alt={'Discord'}/>
		      </div>
		    </a>
		  </li>`,
    links: [{ text: '', link: '' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      'business_case',
      'business_goals',
      'constraints',
      'assumptions',
      'system_requirements',
      'target_architecture',
      'architecture_components',
      'ui_components',
    ],
    collapsedNav: [
    ],
    links: [{ text: 'CloudPro', link: 'https://github.com/CloudPRO-club' }],
    frontline: false,
    ignoreIndex: true,
    title:
      "",
  },
  siteMetadata: {
    title: '',
    description: '',
    ogImage: null,
    docsLocation: 'tree/main/docs',
    favicon: '',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: '',
      short_name: '',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
