import useSWR from 'swr';
import style from './Companies.module.scss'
import { fetcher, url } from '../../core/axios';
import { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
    const { data } = useSWR(`${url}/application/getAll`, fetcher);
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const getCompanyStats = () => {
        if (!data) return []

        return Object.values(
            data.reduce((acc, application) => {
                if (!acc[application.inn]) {
                    acc[application.inn] = {
                        name: application.name,
                        inn: application.inn,
                        applicationsCount: 0,
                        activeApplicationsCount: 0
                    }
                }

                acc[application.inn].applicationsCount += 1
                if (application.status !== 'Рассмотрена' && application.status !== "Отклонена") {
                    acc[application.inn].activeApplicationsCount += 1
                }

                return acc
            }, {})
        )
    }

    const filteredData = getCompanyStats().filter(company => {
        const term = searchTerm.toLowerCase()
        return (
            (company.name && company.name.toLowerCase().includes(term)) ||
            (company.inn && company.inn.includes(term))
        )
    })

    if (!data) return <Loader />

    return (
        <div className={style.wrapper}>
            <div className={style.topDiv}>
                <h2>Все компании</h2>
            </div>
            <div className={style.topWrapper}>
                <p></p>
                <div className={style.searchBar}>
                    <input
                        type="text"
                        placeholder="Поиск по компании или ИНН"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className={style.container}>
                <table className={style.usersTable}>
                    <thead>
                        <tr>
                            <th>Компания</th>
                            <th className={style.rightAlign}>Количество заявок</th>
                            <th className={style.rightAlign} style={{ paddingRight: "58px" }}>Активных заявок</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((company, index) => (
                            <tr key={index} onClick={() => navigate(`/companies/${company.inn}`)}>
                                <td>
                                    {company.name}<br /> <span>ИНН {company.inn}</span>
                                </td>
                                <td className={style.rightAlign}>{company.applicationsCount}</td>
                                <td className={style.rightAlign}>
                                    <div className={style.flexEnd}>
                                        {company.activeApplicationsCount}
                                        <button className={style.next} onClick={() => navigate(`/companies/${company.inn}`)}>
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
    )
}

export default Companies