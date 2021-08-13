import { FiUser, FiCalendar, FiClock } from 'react-icons/fi'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss'

interface InfoPostProps {
  createdAt: string;
  author: string;
  timerPost?: number;
}

export function InfoPost({ author, createdAt, timerPost }: InfoPostProps){

  const dataPost = format(new Date(createdAt),"dd MMM yyyy" ,{ locale: ptBR  })

  return(
    <div className={styles.containerInfosPost}>

      <FiCalendar color="#BBBBBB" size={16} />
      <span>{dataPost}</span>

      <FiUser color="#BBBBBB" size={16} />
      <span>{author}</span>

      {
        timerPost && (
          <>
            <FiClock color="#BBBBBB" size={16} />
            <span>{timerPost} min</span>
          </>
        )
      }
    </div>
  )
}
