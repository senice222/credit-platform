import { useState } from 'react'
import styles from './Samples.module.scss'
import { AddClient } from '../../components/Modals/AddClientModal/AddClient'

const Samples = () => {
    const [isAddClient, setAddClient] = useState(false)

    return (
        <>
            <AddClient
                isOpened={isAddClient}
                setOpened={() => setAddClient((prev) => !prev)}
            />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Все клиенты</h1>
                    <button className={styles.registerButton} onClick={() => setAddClient(true)}>
                        Зарегистрировать клиента
                    </button>
                </div>

                <div className={styles.searchContainer}>
                    <input
                        type="search"
                        placeholder="Поиск по клиенту"
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.clientsTable}>
                        <thead>
                            <tr>
                                <th>Клиент</th>
                                <th>Активных заявок</th>
                                <th>Всего заявок</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, index) => (
                                <tr key={index}>
                                    <td>Клиент</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>
                                        {/* <button className={styles.arrowButton}> */}
                                        {/* → */}
                                        {/* </button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Samples