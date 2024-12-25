import { useNavigate } from 'react-router-dom'
import styles from './ApplicationDetails.module.scss'
import { ArrowLink } from '../../pages/DetailedApplication/Svgs'
import { ConfigProvider, DatePicker, notification, Tooltip } from "antd";
import ruRU from "antd/es/locale/ru_RU";
import StatusDropdown from '../../pages/DetailedApplication/StatusDropdown/StatusDropdown';
import { fetcher, url } from '../../core/axios';
import { Calendar } from '../../pages/DetailedApplication/Svgs';
import { useSWRConfig } from 'swr';
import { useState } from 'react';

const ApplicationDetails = ({ data }) => {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const disabledDate = (current) => {
        return current && current.valueOf() < Date.now();
    };

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

    const downloadFile = async (fileUrl, description) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Получаем расширение из URL файла
            const extension = fileUrl.split('.').pop();
            // Формируем имя файла из description и расширения
            link.download = `${description}.${extension}`;
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const renderFile = (file, description) => {
        if (!file) return null;

        // Handle case when file is an array
        const fileUrl = Array.isArray(file) ? file[0] : file;
        
        // Extract filename from URL and get its extension
        const filename = fileUrl?.split('@')[1];
        const fileExt = filename?.split('.').pop()?.toUpperCase();

        return (
            <tr>
                <td>
                    <div className={styles.fileInfo}>
                        <div>
                            <div className={styles.fileName}>{description}</div>
                        </div>
                    </div>
                </td>
                <td>{fileExt}</td>
                <td>
                    <a 
                        href={`${fileUrl}`}
                        download
                        className={styles.downloadButton}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 12.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V12.5M14.1667 8.33333L10 12.5M10 12.5L5.83333 8.33333M10 12.5V2.5"
                                stroke="#0B7D5F" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Скачать
                    </a>
                </td>
            </tr>
        );
    };

    const downloadAllFiles = async () => {
        try {
            const files = [
                ...(data.actSverki ? [{ url: data.actSverki, name: 'Акт сверки' }] : []),
                ...(data.fileAct ? [{ url: data.fileAct, name: 'Акт' }] : []),
                ...(data.fileExplain ? [{ url: data.fileExplain, name: 'Пояснение' }] : []),
                ...(data.cart60file ? [{ url: data.cart60file, name: 'Карточка 60 счета' }] : []),
                ...(data.allDocuments?.map(file => ({ url: file, name: 'Все документы' })) || []),
                ...(data.previousDocuments?.map(file => ({ url: file, name: 'Предыдущие документы' })) || [])
            ];

            files.forEach(file => {
                const link = document.createElement('a');
                link.href = `${file.url}`;
                
                // Получаем расширение из URL файла
                // const extension = file.url.split('.').pop();
                // Используем понятное название + расширение
                console.log(file.name)
                link.download = `${file.name}`;
                
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } catch (error) {
            console.error('Ошибка при скачивании файлов:', error);
        }
    };
    const [selectedFilter, setSelectedFilter] = useState("");

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const getFilteredFiles = () => {
        const files = [];
        
        // Добавляем только существующие файлы
        if (data.actSverki && data.actSverki.length > 0) {
            files.push({ file: data.actSverki, description: 'Акт сверки' });
        }
        if (data.fileAct && data.fileAct.length > 0) {
            files.push({ file: data.fileAct, description: 'Акт' });
        }
        // if (data.fileExplain && data.fileExplain.length > 0) {
        //     files.push({ file: data.fileExplain, description: 'Пояснение' });
        // }
        if (data.cart60file && data.cart60file.length > 0) {
            files.push({ file: data.cart60file, description: 'Карточка 60 счета' });
        }
        if (data.allDocuments && data.allDocuments.length > 0) {
            files.push(...data.allDocuments.map(file => ({ file, description: 'Все документы' })));
        }
        if (data.previousDocuments && data.previousDocuments.length > 0) {
            files.push(...data.previousDocuments.map(file => ({ file, description: 'Предыдущие документы' })));
        }

        // Если выбран фильтр, возвращаем только соответствующие файлы
        if (selectedFilter) {
            return files.filter(item => {
                switch (selectedFilter) {
                    case 'act': return item.description === 'Акт';
                    case 'cart60': return item.description === 'Карточка 60 счета';
                    case 'actSverki': return item.description === 'Акт сверки';
                    // case 'explain': return item.description === 'Пояснение';
                    case 'allDocs': return item.description === 'Все документы';
                    case 'previousDocs': return item.description === 'Предыдущие документы';
                    default: return false;
                }
            });
        }

        return files;
    };

    return (
        <div className={styles.twoBlocks}>
            <div className={styles.wrapper}>
                <div className={styles.companyBlock}>
                    <div className={styles.infoItem}>
                        <p className={styles.label}>Компания</p>
                        <div
                            className={styles.linkBlock}
                            onClick={() => navigate(`/companies/${data?.inn}`)}
                        >
                            <p className={styles.value}>{data?.name}</p>
                            <ArrowLink style={{ stroke: "#067647" }} />
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <p className={styles.label}>ИНН</p>
                        <div
                            className={styles.linkBlock}
                            onClick={() => navigate(`/all-applications?inn=${data?.inn}`)}
                        >
                            <p className={styles.value}>{data?.inn}</p>
                            <ArrowLink style={{ stroke: "#067647" }} />
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <p className={styles.label}>Статус</p>
                        <StatusDropdown data={data} />
                    </div>

                    <div className={styles.infoItem}>
                        <p className={styles.label}>Срок ответа</p>
                        {!data.dateAnswer ? (
                            <div onClick={(e) => e.stopPropagation()}>
                                <ConfigProvider locale={ruRU}>
                                    <DatePicker
                                        disabledDate={disabledDate}
                                        inputReadOnly
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(date) => dateOnChange(date, data.owner, data._id)}
                                        className={styles.datePicker}
                                        placeholder="Выбрать дату"
                                    />
                                </ConfigProvider>
                            </div>
                        ) : (
                            <Tooltip title="Дата уже выставлена" placement="bottom">
                                <button className={styles.btnDate} onClick={(e) => e.stopPropagation()}>
                                    <Calendar />
                                    {data.dateAnswer}
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className={styles.report}>
                    <h2>Ответы на заявку</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.answersTable}>
                            <thead>
                                <tr>
                                    <th>Вопрос</th>
                                    <th>Ответ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Наличие дополнительных соглашений</td>
                                    <td style={{ color: "#535862" }}>{data?.demandsOrganization ? 'Да' : 'Нет'}</td>
                                </tr>
                                {
                                    data?.lastDateActSverki && (
                                        <tr>
                                            <td>Дата последнго акта сверки</td>
                                            <td style={{ color: "#535862" }}>{data?.lastDateActSverki}</td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td>Период карточки 60 счета</td>
                                    <td style={{ color: "#535862" }}>{data?.cart60file && '15.02.23 - 12.04.24'}</td>
                                </tr>
                                <tr>
                                    <td>Ранее предъявлялись требования к этой организации?</td>
                                    <td style={{ color: "#535862" }}>{data?.previousDocuments?.length > 0 ? 'Да' : 'Нет'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={styles.reportChanges}>
                <div className={styles.filesHeader}>
                    <h2>Загруженные клиентом файлы</h2>
                    <div className={styles.actions}>
                        <select className={styles.filterSelect} onChange={handleFilterChange}>
                            <option value="">Фильтр по типу</option>
                            <option value="act">Акт</option>
                            <option value="cart60">Карточка 60 счета</option>
                            <option value="actSverki">Акт сверки</option>
                            <option value="explain">Пояснение</option>
                            <option value="allDocs">Все документы</option>
                            <option value="previousDocs">Предыдущие документы</option>
                        </select>
                        <button className={styles.downloadAll} onClick={downloadAllFiles}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M6.66675 13.3333L10.0001 10M10.0001 10L13.3334 13.3333M10.0001 10V17.5M16.6667 13.9524C17.6847 13.1117 18.3334 11.8399 18.3334 10.4167C18.3334 7.88536 16.2814 5.83333 13.7501 5.83333C13.568 5.83333 13.3976 5.73833 13.3052 5.58145C12.2185 3.73736 10.2121 2.5 7.91675 2.5C4.46497 2.5 1.66675 5.29822 1.66675 8.75C1.66675 10.4718 2.36295 12.0309 3.48921 13.1613"
                                    stroke="white"
                                    strokeWidth="1.66667"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Скачать все вместе
                        </button>
                    </div>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.filesTable}>
                        <thead>
                            <tr>
                                <th>Файл</th>
                                <th>Тип файла</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredFiles().map(({ file, description }) => 
                                renderFile(file, description)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ApplicationDetails 