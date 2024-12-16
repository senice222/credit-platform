import styles from './ModuleCard.module.scss'

const ModuleCard = ({ icon, title, onClick }) => {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.title}>{title}</div>
        </div>
    )
}

export default ModuleCard
