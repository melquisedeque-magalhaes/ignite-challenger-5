import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client'
import Header from '../../components/Header';
import { useRouter } from 'next/router'
import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { InfoPost } from '../../components/InfoPost';
import { info } from 'console';
import { useEffect } from 'react';
import { CalculateReadPost } from '../../utils/CalculateReadPost';
import { useState } from 'react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter()

  if(router.isFallback){
    return (
      <div className={styles.fallbackContainer}>
        <h1>Carregando...</h1>
      </div>
    )
  }

  const [ timePost, setTimePost ] = useState(0)

  useEffect(() => {
    setTimePost(CalculateReadPost(post.data))
  },[])

  return(
    <>
      <div className={styles.container}>
        <Header />
      </div>

      <div className={styles.post}>

      <img src={post.data.banner.url} alt="image" />

        <div className={styles.content}>
          <h1>{post.data.title}</h1>

          <InfoPost
            author={post.data.author}
            createdAt={post.first_publication_date}
            timerPost={timePost}
          />

          <div className={styles.postMain}>


            {post.data.content.map(info => (
              <div key={info.heading}>

                <h2>{info.heading}</h2>

                <div>{
                  info.body.map(( body, index ) => (
                    <p key={index}>
                      {body.text}
                    </p>
                  ))}
                </div>

              </div>
            ))}


          </div>

        </div>
      </div>
    </>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(Prismic.Predicates.at('document.type', 'post'));

  const paths = posts.results.map(post => ({
    params: { slug: post.uid }
  }))

  return {
    paths,
    fallback: true
  }
};


export const getStaticProps: GetStaticProps = async ({params, previewData}) => {

  const slug = params.slug

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref || null,
  });

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      first_publication_date: response.first_publication_date,
      post
    },
    revalidate: 1800,
  }

};
