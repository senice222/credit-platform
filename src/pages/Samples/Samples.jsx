import { useState } from 'react'
import styles from './Samples.module.scss'
import { AddClient } from '../../components/Modals/AddClientModal/AddClient'
import useSWR from 'swr'
import { fetcher, url } from '../../core/axios'
import Loader from '../../components/Loader/Loader'
import { useNavigate } from 'react-router-dom'

export const amountOfActive = (applications) => {
    return applications?.map(item => item.status !== "Отклонена" || "Рассмотрена").length
}

const Samples = () => {
    const [isAddClient, setAddClient] = useState(false)
    const { data: clients } = useSWR(`${url}/admin/clients/getClients`, fetcher)
    const navigate = useNavigate()
    if (!clients) return <Loader />
    
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
                            {clients?.map((client, index) => (
                                <tr key={index} onClick={() => navigate(`/clients/${client._id}`)}>
                                    <td>{client.name}</td>
                                    <td>{amountOfActive(client.applications)}</td>
                                    <td>{client.applications.length}</td>
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