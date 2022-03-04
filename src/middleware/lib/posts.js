import { getApolloClient } from '@/middleware/lib/apollo-client'

import { updateUserAvatar } from '@/middleware/lib/users'
import { sortObjectsByDate } from '@/middleware/lib/datetime'

import {
  QUERY_ALL_POSTS,
  QUERY_PAGED_POSTS,
  QUERY_POST_BY_SLUG,
  QUERY_POSTS_BY_AUTHOR_SLUG,
  QUERY_POST_SEO_BY_SLUG,
  MUTATION_CREATE_COMMENT,
} from '@/middleware/data/posts'

/**
 * setComment
 */

export async function setComment({ content = '' }) {
  const apolloClient = getApolloClient()

  const data = await apolloClient.mutate({
    mutation: MUTATION_CREATE_COMMENT,
    variables: {
      author: `anonymous-${Math.floor(Math.random() * 10000)}`,
      content: content,
    },
  })

  return {
    success: data?.data.createComment.success,
  }
}

/**
 * postPathBySlug
 */

export function postPathBySlug(slug) {
  return `/blog/${slug}`
}

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const apolloClient = getApolloClient()
  const apiHost = new URL(process.env.WORDPRESS_GRAPHQL_ENDPOINT).host

  let postData
  let seoData

  try {
    postData = await apolloClient.query({
      query: QUERY_POST_BY_SLUG,
      variables: {
        slug,
      },
    })
  } catch (e) {
    console.log(
      `[posts][getPostBySlug] Failed to query post data: ${e.message}`
    )
    throw e
  }

  const post = [postData?.data.post].map(mapPostData)[0]

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === true) {
    try {
      seoData = await apolloClient.query({
        query: QUERY_POST_SEO_BY_SLUG,
        variables: {
          slug,
        },
      })
    } catch (e) {
      console.log(
        `[posts][getPostBySlug] Failed to query SEO plugin: ${e.message}`
      )
      console.log(
        'Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.'
      )
      throw e
    }

    const { seo = {} } = seoData?.data?.post

    post.metaTitle = seo.title
    post.metaDescription = seo.metaDesc
    post.readingTime = seo.readingTime

    // The SEO plugin by default includes a canonical link, but we don't want to use that
    // because it includes the WordPress host, not the site host. We manage the canonical
    // link along with the other metadata, but explicitly check if there's a custom one
    // in here by looking for the API's host in the provided canonical link

    if (seo.canonical && !seo.canonical.includes(apiHost)) {
      post.canonical = seo.canonical
    }

    post.og = {
      author: seo.opengraphAuthor,
      description: seo.opengraphDescription,
      image: seo.opengraphImage,
      modifiedTime: seo.opengraphModifiedTime,
      publishedTime: seo.opengraphPublishedTime,
      publisher: seo.opengraphPublisher,
      title: seo.opengraphTitle,
      type: seo.opengraphType,
    }

    post.article = {
      author: post.og.author,
      modifiedTime: post.og.modifiedTime,
      publishedTime: post.og.publishedTime,
      publisher: post.og.publisher,
    }

    post.robots = {
      nofollow: seo.metaRobotsNofollow,
      noindex: seo.metaRobotsNoindex,
    }

    post.twitter = {
      description: seo.twitterDescription,
      image: seo.twitterImage,
      title: seo.twitterTitle,
    }
  }

  return {
    post,
  }
}

/**
 * getAllPosts
 */

export async function getAllPosts() {
  const apolloClient = getApolloClient()

  const data = await apolloClient.query({
    query: QUERY_ALL_POSTS,
  })

  const posts = data?.data.posts.edges.map(({ node = {} }) => node)

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  }
}

/**
 * getPagedPosts
 */

export async function getPagedPosts({ offset = 0, size = 100 }) {
  const apolloClient = getApolloClient()

  const data = await apolloClient.query({
    query: QUERY_PAGED_POSTS,
    variables: {
      offset: offset,
      size: size,
    },
  })

  const posts = data?.data.posts.edges.map(({ node = {} }) => node)

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
    pagination: { ...data?.data.posts.pageInfo.offsetPagination },
  }
}

/**
 * getPostsByAuthorSlug
 */

export async function getPostsByAuthorSlug(slug) {
  const apolloClient = getApolloClient()

  let postData

  try {
    postData = await apolloClient.query({
      query: QUERY_POSTS_BY_AUTHOR_SLUG,
      variables: {
        slug,
      },
    })
  } catch (e) {
    console.log(`Failed to query post data: ${e.message}`)
    throw e
  }

  const posts = postData?.data.posts.edges.map(({ node = {} }) => node)

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  }
}

/**
 * getRecentPosts
 */

export async function getRecentPosts({ count }) {
  const { posts } = await getAllPosts()
  const sorted = sortObjectsByDate(posts)
  return {
    posts: sorted.slice(0, count),
  }
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error(
      `Failed to sanitize excerpt: invalid type ${typeof excerpt}`
    )
  }

  let sanitized = excerpt

  // If the theme includes [...] as the more indication, clean it up to just ...

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;')

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.')
  sanitized = sanitized.replace('.&hellip;', '.')

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '')

  return sanitized
}

/**
 * mapPostData
 */

export function mapPostData(post = {}) {
  const data = { ...post }

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    }
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar)
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node
  }
  return data
}
