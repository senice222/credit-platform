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
import { amountOfActive } from '../Samples/Samples';
import EditClientModal from '../../components/Modals/EditClientModal/EditClientModal';
import { BlockUser } from '../../components/Modals/BlockUser/BlockUser';

const DetailedClient = () => {
    const { id } = useParams()
    const { data } = useSWR(`${url}/admin/client/${id}`, fetcher);
    const [selectedStatus, setSelectedStatus] = useState('Все статусы');
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(false)
    const [isBlocked, setBlocked] = useState(false)
    // const activeApplications = data?.filter(item => item.status !== "Рассмотрена" && item.status !== "Отклонена")
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };
    const handleChange = (value) => {
        setSelectedStatus(value);
    };

    const filteredData = data?.applications ? (
        data?.applications.filter(item => {
            const statusMatch = selectedStatus === 'Все статусы' || item.status === selectedStatus;
            const searchTermLower = searchTerm.toLowerCase();
            const normalIdMatch = item.normalId.toString().toLowerCase().includes(searchTermLower);

            return statusMatch && (normalIdMatch);
        })
    ) : []
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
        "Заблокирован": style.blocked,
        "Активен": style.activeBadge,
        "Активный": style.activeBadge,
        'В работе': style.inactive,
        'На уточнении': style.onClarification,
        'Отклонена': style.blocked,
        'На рассмотрении': style.activeBadge,
        'Рассмотрена': style.activeBadge
    }
    if (!data) return <Loader />
    const appliedStatus = statusStyles[data.status];
    const isUserBlocked = data.status === "Заблокирован"
    return (
        <div className={style.DetailedApplication}>
            <EditClientModal
                isActive={isActive}
                setActive={() => setIsActive((prev) => !prev)}
                name={data.name}
                id={id}
            />
            <BlockUser
                data={data}
                isOpen={isBlocked}
                setOpen={() => setBlocked((prev) => !prev)}
                isUserBlocked={isUserBlocked}
            />
            <PathComponent first={"На клиентов"} path={"/clients"} second={`Клиент "${data?.name}"`} />
            <div className={style.topContainer}>
                <h1>Профиль компании {data?.name}</h1>
                <div className={style.actions}>
                    <button className={!isUserBlocked ? style.blockButton : style.editButton} onClick={() => setBlocked(true)}>
                        {isUserBlocked ? "Разблокировать клиента" : "Заблокировать клиента"}
                    </button>
                    <button className={style.editButton} onClick={() => setIsActive(true)}>
                        Изменить имя клиента
                    </button>
                </div>
            </div>
            <div className={style.company}>
                <div className={style.item}>
                    <p className={style.name}>Статус клиента</p>
                    <span className={appliedStatus}>{data?.status}</span>

                </div>
                <div className={style.item}>
                    <p className={style.name}>Всего заявок</p>
                    <div className={style.linkBlock}>
                        <p className={style.active}>{data?.applications?.length}</p>
                    </div>
                </div>

                <div className={style.item}>
                    <p className={style.name}>Активных заявок</p>
                    <div className={style.linkBlock}>
                        <span className={style.active}>{amountOfActive(data?.applications)}</span>
                    </div>
                </div>
                <div className={style.item}>
                    <p className={style.name}>Ссылка клиента</p>
                    <div className={style.linkBlock}>
                        <span className={style.active} style={{ color: "#067647" }}>{data?.botLink?.slice(0, 20)}...</span>
                    </div>
                </div>
            </div>

            <div className={style.wrapper}>
                <div className={style.topDiv}>
                    <h2>Компании клиента</h2>
                    <p className={style.name}>Компании, с которых клиент {data?.name} отправлял заявки</p>
                </div>

                <div className={style.container}>
                    <table className={style.usersTable}>
                        <thead>
                            <tr>
                                <th>Компания</th>
                                <th></th>
                                <th className={style.thRight}>Количество заявок</th>
                                <th className={style.thRight} style={{ paddingRight: "60px" }}>Активных заявок</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.companies?.map((application, i) => (
                                <tr key={i} onClick={() => navigate(`/companies/${application.inn}`)}>
                                    <td>{application.name}<br /> <span>ИНН {application.inn}</span></td>
                                    <td></td>
                                    <td className={style.flexEnd}>{application.applicationsCount}</td>
                                    <td className={style.flexEnd}>
                                        <div>
                                            <div style={{ marginRight: "25px", display: "flex", justifyContent: "center", alignItems: "center" }}>{application.activeApplicationsCount}</div>
                                            <button className={style.next} onClick={() => navigate(`/application/${application._id}`)}>
                                                <svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334"
                                                        stroke="white"
                                                        strokeWidth="1.66667"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={style.wrapper}>
                <div className={style.topDiv}>
                    <h2>Заявки компании</h2>
                </div>
                <div className={style.topWrapper}>
                    <Select
                        defaultValue="Все статусы"
                        onChange={handleChange}
                        style={{ width: 220, height: 44 }}
                        options={[
                            { value: 'Все статусы', label: 'Все статусы' },
                            { value: 'В работе', label: 'В работе' },
                            { value: 'На уточнении', label: 'На уточнении' },
                            { value: 'Отклонена', label: 'Отклонена' },
                            { value: 'На рассмотрении', label: 'На рассмотрении' },
                            { value: 'Рассмотрена', label: 'Рассмотрена' },
                        ]}
                    />
                    <div className={style.searchBar}>
                        <input
                            type="text"
                            placeholder="Поиск по номеру заявки"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className={style.container}>
                    <table className={style.usersTable}>
                        <thead>
                            <tr>
                                <th>Номер заявки</th>
                                <th>Компания</th>
                                <th className={style.thRight}>Статус заявки</th>
                                <th className={style.thRight} style={{ paddingRight: "100px" }}>Срок ответа</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((application, i) => (
                                <tr key={i} onClick={() => navigate(`/application/${application._id}`)}>
                                    <td>№{application.normalId}</td>
                                    <td>{application.name}<br /> <span>ИНН {application.inn}</span></td>
                                    <td className={style.flexEnd}><span className={statusStyles[application.status]}>{application.status}</span></td>
                                    <td className={style.flexEnd}>
                                        <div>
                                            {
                                                !application.dateAnswer ? (
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <ConfigProvider locale={ruRU} >
                                                            <DatePicker
                                                                disabledDate={disabledDate}

                                                                inputReadOnly
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(date) => dateOnChange(date, application.owner, application._id)}
                                                            />
                                                        </ConfigProvider>
                                                    </div>
                                                ) : <button className={style.btnDate} onClick={(e) => e.stopPropagation()}>
                                                    <Calendar />
                                                    {application.dateAnswer}
                                                </button>
                                            }
                                            <button className={style.next} onClick={() => navigate(`/application/${application._id}`)}>
                                                <svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334"
                                                        stroke="white"
                                                        strokeWidth="1.66667"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DetailedClient