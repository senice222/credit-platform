import styles from './ModuleCard.module.scss'

const ModuleCard = ({ icon, title, url }) => {
    return (
        <div className={styles.card} onClick={() => window.location.replace(url)}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.title}>{title}</div>
        </div>
    )
}

export default ModuleCard
