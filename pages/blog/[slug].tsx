import { Heading, majorScale, Pane, Spinner } from 'evergreen-ui'
import fs from 'fs'
import matter from 'gray-matter'
import hydrate from 'next-mdx-remote/hydrate'
import renderTostring from 'next-mdx-remote/render-to-string'
import Head from 'next/head'
import { useRouter } from 'next/router'
import path from 'path'
import React, { FC } from 'react'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import { posts } from '../../content'
import { Post } from '../../types'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */
export function getStaticPaths() {
  const postsPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsPath)
  const slugs = filenames.map((name) => {
    const filePath = path.join(postsPath, name)
    const file = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(file)
    return data
  })

  return {
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: true, // false, 'blocking'
  }
}

export async function getStaticProps({ params }) {
  let post
  try {
    const postsPath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`)
    post = fs.readFileSync(postsPath, 'utf-8')
  } catch (e) {
    const cmsPosts = posts.published.map((p) => {
      const { data } = matter(p)
      return data
    })

    const match = cmsPosts.find((p) => p.slug === params.slug)
    post = match.content
  }

  const { data } = matter(post)
  const mdxSource = await renderTostring(post, { scope: data })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

export default BlogPost
