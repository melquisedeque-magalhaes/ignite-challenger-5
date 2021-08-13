import Link from 'next/link'
import { InfoPost } from '../InfoPost'

import styles from './post.module.scss'

interface PostProps {
  title: string;
  subtitle: string;
  author: string;
  createdAt: string;
  id: string;
}

export function Post({ author, createdAt, subtitle, title, id }: PostProps){



  return(
    <Link href={`post/${id}`} key={id}>
      <a className={styles.post}>
        <strong>{title}</strong>
        <p>{subtitle}</p>

        <InfoPost author={author} createdAt={createdAt}  />

      </a>
    </Link>
  )
}
