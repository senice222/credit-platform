import PathComponent from '../../components/PathComponent/PathComponent'
import style from './DetailedCompany.module.scss'
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

const DetailedCompany = () => {
    const { inn } = useParams()
    const { data } = useSWR(`${url}/application/inn/${inn}`, fetcher);
    const [selectedStatus, setSelectedStatus] = useState('Все статусы');
    const [searchTerm, setSearchTerm] = useState('');
    const activeApplications = data?.filter(item => item.status !== "Рассмотрена" && item.status !== "Отклонена")
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };
    const handleChange = (value) => {
        setSelectedStatus(value);
    };

    const handleInnClick = (inn) => {
        navigate(`/all-applications?inn=${inn}`);
    };

    const filteredData = data && (
        data?.filter(item => {
            const statusMatch = selectedStatus === 'Все статусы' || item.status === selectedStatus;
            const searchTermLower = searchTerm.toLowerCase();
            const normalIdMatch = item.normalId.toString().toLowerCase().includes(searchTermLower);

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
    console.log(data)
    if (!data) return <Loader />

    return (
        <div className={style.DetailedApplication}>
            <PathComponent first={"На компании"} path={"/companies"} second={"Заявка №12312944"} />
            <div className={style.topContainer}>
                <h1>Профиль компании {data[0].name}</h1>
            </div>
            <div className={style.company}>
                <div className={style.item}>
                    <p className={style.name}>ИНН</p>
                    <div className={style.linkBlock} onClick={() => handleInnClick(data[0].inn)}>
                        <p className={style.companyName}>{data[0].inn}</p>
                        <ArrowLink style={{ stroke: "#079455" }} />
                    </div>
                </div>
                <div className={style.item}>
                    <p className={style.name}>Всего заявок</p>
                    <div className={style.linkBlock}>
                        <p className={style.active}>{data.length}</p>
                    </div>
                </div>

                <div className={style.item}>
                    <p className={style.name}>Активных заявок</p>
                    <div className={style.linkBlock}>
                        <span className={style.active}>{activeApplications.length}</span>
                    </div>
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
                            {filteredData.map((application, i) => (
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

export default DetailedCompany