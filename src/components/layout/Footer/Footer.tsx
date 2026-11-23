import { Icon } from '../../ui/Icon/Icon'
import styles from './Footer.module.css'

const CONTACT = {
  name: 'Gydo Titulaer',
  email: 'gydo.titulaer@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gydotitulaer/',
  github: 'https://github.com/darksummenors/divotion',
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>Gydo's Verdant</p>
          <p className={styles.muted}>Een fictieve plantenwinkel voor Divotion.</p>
        </div>
        <div>
          <h2 className={styles.heading}>Gemaakt door {CONTACT.name}</h2>
          <ul className={styles.links}>
            <li>
              <a href={`mailto:${CONTACT.email}`}>
                <Icon name="mail" size={18} />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                <Icon name="external" size={18} />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer">
                <Icon name="external" size={18} />
                Broncode op GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.muted}>
          © {new Date().getFullYear()} {CONTACT.name} - Producten en illustraties zijn fictief.
        </p>
      </div>
    </footer>
  )
}
