import styles from "./header.module.scss"
import Link from 'next/link'

export default function Header() {
 return(

     <Link href="/">

       <div className={styles.logo}>
        <img  src="/images/Logo.svg" alt="logo" />
       </div>

    </Link>

 )
}
