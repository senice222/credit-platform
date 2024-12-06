import styles from './Samples.module.scss'

const Samples = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Настройки</h1>
            
            <div className={styles.tabSection}>
                <div className={styles.tabHeader}>Шаблоны уточнений</div>
                <div className={styles.tabDescription}>
                    Здесь вы можете настроить шаблонные ответы для уточнения
                </div>
            </div>

            <div className={styles.samplesHeader}>
                <div className={styles.columnName}>Название шаблона</div>
                <button className={styles.addButton}>
                    <span>+</span> Добавить шаблон
                </button>
            </div>

            <div className={styles.samplesList}>
                <div className={styles.sampleItem}>
                    <span>Шаблон 1</span>
                    <div className={styles.actions}>
                        <button className={styles.iconButton}>📋</button>
                        <button className={styles.iconButton}>✏️</button>
                    </div>
                </div>
                <div className={styles.sampleItem}>
                    <span>Шаблон 2</span>
                    <div className={styles.actions}>
                        <button className={styles.iconButton}>📋</button>
                        <button className={styles.iconButton}>✏️</button>
                    </div>
                </div>
                <div className={styles.sampleItem}>
                    <span>Шаблон 3</span>
                    <div className={styles.actions}>
                        <button className={styles.iconButton}>📋</button>
                        <button className={styles.iconButton}>✏️</button>
                    </div>
                </div>
            </div>

            <div className={styles.pagination}>
                <button className={styles.paginationButton}>← Назад</button>
                <div className={styles.paginationNumbers}>
                    <span className={styles.active}>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>...</span>
                    <span>8</span>
                    <span>9</span>
                    <span>10</span>
                </div>
                <button className={styles.paginationButton}>Далее →</button>
            </div>
        </div>
    )
}

export default Samples