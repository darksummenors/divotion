import styles from './Page.module.css';

/** TODO (login step): mocking a login form. */
export default function LoginPage() {
  return (
    <div className={styles.page}>
      <title>Inloggen - Gydo's Verdant</title>
      <header className={styles.intro}>
        <h1 className={styles.title}>Inloggen</h1>
        <p className={styles.lead}>Het inlogformulier volgt nog...</p>
      </header>
    </div>
  );
}
