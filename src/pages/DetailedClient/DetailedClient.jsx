import PathComponent from '../../components/PathComponent/PathComponent'
import style from './DetailedClient.module.scss'
import { ArrowLink } from "../DetailedApplication/Svgs";
import { Select, DatePicker, ConfigProvider, notification } from 'antd';
import ruRU from 'antd/es/locale/ru_RU'
import { useNavigate, useParams } from 'react-router-dom';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, url } from '../../core/axios';
import Loader from '../../components/Loader/Loader';
import { Calendar } from '../../components/Svgs/Svgs';
import { useState } from 'react';
import moment from 'moment';

const DetailedClient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: client } = useSWR(`${url}/admin/client/${id}`, fetcher);
    const [selectedStatus, setSelectedStatus] = useState('Все статусы');
    const [searchTerm, setSearchTerm] = useState('');
    const { mutate } = useSWRConfig()

    if (!client) return <Loader />;

    const handleStatusChange = (value) => {
        setSelectedStatus(value);
    };

    const handleCompanyClick = (inn) => {
        navigate(`/company/${inn}`);
    };

    const handleBlockClient = async () => {
        try {
            await fetcher(`${url}/admin/blockClient/${id}`, {
                method: 'POST'
            });
            notification.success({
                message: "Клиент успешно заблокирован"
            });
        } catch (error) {
            notification.error({
                message: "Ошибка при блокировке клиента"
            });
        }
    };

    const handleEditName = async () => {
        // Добавить логику изменения имени
    };

    const handleInnClick = (inn) => {
        navigate(`/all-applications?inn=${inn}`);
    };

    const filteredData = client.applications && (
        client.applications.filter(item => {
            const statusMatch = selectedStatus === 'Все статусы' || item.status === selectedStatus;
            const searchTermLower = searchTerm.toLowerCase();
            const normalIdMatch = item.id.toString().toLowerCase().includes(searchTermLower);

            return statusMatch && (normalIdMatch);
        })
    )

    const dateOnChange = (date, id, _id) => {
        try {
            mutate(`${url}/application/getAll`, fetcher(`${url}/application/set-date/${id}`, {
                method: 'POST',
                body: JSON.stringify({
                    _id,
                    date: date.toISOString(),
                }),
            }))
            notification.success({
                message: "Дата ответа успешно установлена.",
                duration: 2,
                style: { fontFamily: "Inter" }
            })
        } catch (e) {
            console.log(e)
        }
    };

    const statusStyles = {
        'В работе': style.inactive,
        'На уточнении': style.onClarification,
        'Отклонена': style.blocked,
        'На рассмотрении': style.active,
        'Рассмотрена': style.active
    }

    return (
        <div className={style.DetailedClient}>
            <PathComponent first={"Клиенты"} path={"/clients"} second={client.name} />
            
            <div className={style.header}>
                <h1>Профиль клиента {client.name}</h1>
                <div className={style.actions}>
                    <button onClick={handleBlockClient} className={style.blockButton}>
                        Заблокировать клиента
                    </button>
                    <button onClick={handleEditName} className={style.editButton}>
                        Изменить имя клиента
                    </button>
                </div>
            </div>

            <div className={style.clientInfo}>
                <div className={style.infoItem}>
                    <span className={style.label}>Статус клиента</span>
                    <span className={`${style.status} ${style.active}`}>Активный</span>
                </div>
                <div className={style.infoItem}>
                    <span className={style.label}>Всего заявок</span>
                    <span className={style.value}>{client.applications?.length || 0}</span>
                </div>
                <div className={style.infoItem}>
                    <span className={style.label}>Активных заявок</span>
                    <span className={style.value}>
                        {client.applications?.filter(app => 
                            app.status !== "Рассмотрена" && app.status !== "Отклонена"
                        ).length || 0}
                    </span>
                </div>
                <div className={style.infoItem}>
                    <span className={style.label}>Ссылка клиента</span>
                    <div className={style.linkContainer}>
                        <span className={style.link}>{client.botLink}</span>
                        <button className={style.copyButton}>
                            <CopyIcon />
                        </button>
                    </div>
                </div>
            </div>

            <div className={style.section}>
                <h2>Компании клиента</h2>
                <p className={style.subtitle}>Компании, с которых клиент {client.name} отправлял заявки</p>
                
                <table className={style.companiesTable}>
                    <thead>
                        <tr>
                            <th>Компания</th>
                            <th>Количество заявок</th>
                            <th>Активных заявок</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {client.companies?.map(company => (
                            <tr key={company.inn}>
                                <td>
                                    <div className={style.companyName}>
                                        {company.name}
                                        <span className={style.inn}>ИНН {company.inn}</span>
                                    </div>
                                </td>
                                <td>№{company.totalApplications}</td>
                                <td>№{company.activeApplications}</td>
                                <td>
                                    <button 
                                        className={style.arrowButton}
                                        onClick={() => handleCompanyClick(company.inn)}
                                    >
                                        <ArrowLink />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={style.section}>
                <h2>Заявки клиента</h2>
                <div className={style.filters}>
                    <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        style={{ width: 220 }}
                        options={[
                            { value: 'Все статусы', label: 'Все статусы' },
                            { value: 'В работе', label: 'В работе' },
                            { value: 'На уточнении', label: 'На уточнении' },
                            { value: 'Отклонена', label: 'Отклонена' },
                            { value: 'На рассмотрении', label: 'На рассмотрении' },
                            { value: 'Рассмотрена', label: 'Рассмотрена' },
                        ]}
                    />
                    <input
                        type="text"
                        placeholder="Поиск по номеру заявки"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={style.searchInput}
                    />
                </div>

                <table className={style.applicationsTable}>
                    <thead>
                        <tr>
                            <th>Номер заявки</th>
                            <th>Компания</th>
                            <th>Статус заявки</th>
                            <th>Срок ответа</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((application, i) => (
                            <tr key={i}>
                                <td>№{application.id}</td>
                                <td>
                                    <div className={style.companyName}>
                                        {application.companyName}
                                        <span className={style.inn}>ИНН {application.inn}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${style.status} ${style[application.status.toLowerCase()]}`}>
                                        {application.status}
                                    </span>
                                </td>
                                <td>{application.deadline || '—'}</td>
                                <td>
                                    <button 
                                        className={style.arrowButton}
                                        onClick={() => navigate(`/application/${application.id}`)}
                                    >
                                        <ArrowLink />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CopyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.16675 12.5H3.33341C2.89139 12.5 2.46746 12.3244 2.15478 12.0118C1.84209 11.6991 1.66675 11.2751 1.66675 10.8333V3.33329C1.66675 2.89127 1.84209 2.46734 2.15478 2.15465C2.46746 1.84196 2.89139 1.66663 3.33341 1.66663H10.8334C11.2754 1.66663 11.6994 1.84196 12.0121 2.15465C12.3247 2.46734 12.5001 2.89127 12.5001 3.33329V4.16663" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default DetailedClient