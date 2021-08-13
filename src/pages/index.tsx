import { GetStaticProps } from 'next';
import { Post } from '../components/post'
import Prismic from '@prismicio/client'
import Head from 'next/head';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  const [ nextPage, setNextPage ] = useState(postsPagination.next_page)
  const [ posts, setPosts ] = useState<Post []>(postsPagination.results)
  const [currentPage, setCurrentPage] = useState(1);

  async function HandleNextPage() {
    if (currentPage !== 1 && nextPage === null)
      return

    const response = await fetch(nextPage)

    const nextPostResponse = await response.json()

    setCurrentPage(nextPostResponse.page);

    setNextPage(nextPostResponse.next_page)

    const newPosts = nextPostResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });


    setPosts(([...posts, ...newPosts]))
  }

  return(
    <>

      <Head>Home | spacetraveling</Head>

      <div className={styles.container}>

        <Header />

        {
          posts.map(post => (
            <Post
              key={post.uid}
              title={post.data.title}
              subtitle={post.data.subtitle}
              author={post.data.author}
              createdAt={post.first_publication_date}
              id={post.uid}
            />
          ))
        }

        {nextPage && (
          <button
            onClick={HandleNextPage}
            className={styles.morePosts}
          >
            Carregar mais posts
          </button>
        )}
    </div>
    </>
  )
}

export const getStaticProps:GetStaticProps = async ({ preview = false }) => {

  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const posts = postsResponse.results.map(post => {
    return{
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page
      }
    },
    revalidate: 1800,
  }

};
