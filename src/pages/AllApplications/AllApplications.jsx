import style from './AllApplications.module.scss'
import { DatePicker, ConfigProvider, notification } from 'antd';
import ruRU from 'antd/es/locale/ru_RU'
import { Calendar } from '../../components/Svgs/Svgs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, url } from '../../core/axios'
import Loader from '../../components/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'

const AllApplications = () => {
    const { data } = useSWR(`${url}/application/getAll`, fetcher);
    const [searchInput, setSearchInput] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState('')
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const query = new URLSearchParams(location.search);
    const filterInn = query.get('inn');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const months = [
        { value: 0, label: 'Январь' },
        { value: 1, label: 'Февраль' },
        { value: 2, label: 'Март' },
        { value: 3, label: 'Апрель' },
        { value: 4, label: 'Май' },
        { value: 5, label: 'Июнь' },
        { value: 6, label: 'Июль' },
        { value: 7, label: 'Август' },
        { value: 8, label: 'Сентябрь' },
        { value: 9, label: 'Октябрь' },
        { value: 10, label: 'Ноябрь' },
        { value: 11, label: 'Декабрь' }
    ];

    function generateYearSequence(start, end) {
        const years = [];
        for (let year = start; year <= end; year++) {
            years.push(year.toString());
        }
        return years;
    }
    const years = [...generateYearSequence(2024, new Date().getFullYear())];

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    useEffect(() => {
        if (filterInn) {
            setSearchInput(filterInn);
        }
    }, [filterInn]);

    const handleChangeCompany = (event) => {
        setCompany(event.target.value);
    };
    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
    };

    const filteredData = Array.isArray(data) ? (
        data
            .filter((application) => {
                const statusMatch = status ? application.status === status : true;
                const companyMatch = company ? application.name === company : true;
                const searchMatch = searchInput ? (
                    application.normalId.toString().includes(searchInput.toLowerCase()) ||
                    application.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                    application.inn.toLowerCase().includes(searchInput.toLowerCase())
                ) : true;

                const date = new Date(application.createdAt);
                const yearMatch = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;
                const monthMatch = selectedMonth ? date.getMonth() === parseInt(selectedMonth) : true;

                return statusMatch && companyMatch && searchMatch && yearMatch && monthMatch;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ) : [];


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

    const statuses = [
        { value: 'В работе', label: 'В работе' },
        { value: 'На уточнении', label: 'На уточнении' },
        { value: 'Отклонена', label: 'Отклонена' },
        { value: 'На рассмотрении', label: 'На рассмотрении' },
        { value: 'Рассмотрена', label: 'Рассмотрена' },
    ]

    const statusStyles = {
        'Создана': style.created,
        'В работе': style.inactive,
        'На уточнении': style.onClarification,
        'Отклонена': style.blocked,
        'На рассмотрении': style.active,
        'Рассмотрена': style.active,
    }

    if (!data) return <Loader />

    return (
        <div className={style.wrapper}>
            <div className={style.topDiv}>
                <h2>Все заявки</h2>
            </div>
            <div className={style.topWrapper}>
                <div className={style.selects}>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label" style={{ fontFamily: "Inter" }}>
                            Компании
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={company}
                            label="Компании"
                            style={{ fontFamily: "Inter", width: "150px" }}
                            onChange={handleChangeCompany}
                        >
                            <MenuItem value="">Все компании</MenuItem>
                            {Array.isArray(data) && [...new Set(data.map(item => item.name))].map((name, i) => (
                                <MenuItem key={i} style={{ fontFamily: "Inter" }} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label" style={{ fontFamily: "Inter" }}>Статус</InputLabel>
                        <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            style={{ width: "153px", fontFamily: "Inter" }}
                            value={status}
                            label="Статус"
                            onChange={handleChangeStatus}
                        >
                            <MenuItem value="">Все статусы</MenuItem>
                            {statuses.map((item, i) => (
                                <MenuItem key={i} style={{ fontFamily: "Inter" }} value={item.value}>{item.value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label" style={{ fontFamily: "Inter" }}>Год</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={handleYearChange}
                            label="Выберите год"
                            style={{ fontFamily: "Inter", width: "150px" }}
                        >
                            <MenuItem value="">Все года</MenuItem>
                            {years.map((year, i) => (
                                <MenuItem key={i} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-helper-label" style={{ fontFamily: "Inter" }}>Месяц</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            label="Выберите месяц"
                            style={{ fontFamily: "Inter", width: "150px" }}
                        >
                            <MenuItem value="">Все месяцы</MenuItem>
                            {months.map((month, i) => (
                                <MenuItem key={i} value={month.value}>
                                    {month.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className={style.searchBar}>
                    <input
                        type="text"
                        placeholder="Поиск по номеру заказа, компании или ИНН"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
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
                            <th className={style.thRight} style={{ paddingRight: '114px' }}>Срок ответа</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((application, i) => (
                            <tr key={i} onClick={() => navigate(`/application/${application._id}`)}>
                                <td >№{application.normalId}</td>
                                <td >{application.name}<br /> <span>ИНН {application.inn}</span></td>
                                <td className={style.flexEnd}><span className={statusStyles[application.status.trim()]}>{application.status}</span></td>
                                <td className={style.flexEnd}>
                                    <div>
                                        {
                                            !application.dateAnswer ? (
                                                <div onClick={(e) => e.stopPropagation()}>
                                                    <ConfigProvider locale={ruRU} >
                                                        <DatePicker
                                                            inputReadOnly
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(date) => dateOnChange(date, application.owner, application._id)}
                                                        />
                                                    </ConfigProvider>
                                                </div>
                                            ) : <Tooltip title="Дата уже выставлена" placement="bottom">
                                                <button className={style.btnDate} onClick={(e) => e.stopPropagation()}>
                                                    <Calendar />
                                                    {application.dateAnswer}
                                                </button>
                                            </Tooltip>
                                        }
                                        <button className={style.next}>
                                            <svg
                                                width={20}
                                                height={20}
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    style={{ stroke: "#067647" }}
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
    )
}

export default AllApplications