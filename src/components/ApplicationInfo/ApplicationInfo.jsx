import PropTypes from 'prop-types'
import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss'
import { ArrowLink } from '../../pages/DetailedApplication/Svgs';
import StatusDropdown from '../../pages/DetailedApplication/StatusDropdown/StatusDropdown';
import { DatePicker, ConfigProvider, Tooltip } from "antd";
import ruRU from "antd/es/locale/ru_RU";
import { Calendar } from '../Svgs/Svgs';

const ApplicationInfo = ({ data, navigate, dateOnChange }) => {

    return (
        <div className={styles.company}>
            <div className={styles.item}>
                <p className={styles.name}>Компания</p>
                <div
                    className={styles.linkBlock}
                    onClick={() => navigate(`/companies/${data.inn}`)}
                >
                    <p className={styles.companyName}>{data.name}</p>
                    <ArrowLink />
                </div>
            </div>
            <div className={styles.item}>
                <p className={styles.name}>ИНН</p>
                <div
                    className={styles.linkBlock}
                    onClick={() => navigate(`/all-applications?inn=${data.inn}`)}
                >
                    <p className={styles.companyName}>{data.inn}</p>
                    <ArrowLink />
                </div>
            </div>
            <div className={styles.item}>
                <p className={styles.name}>Статус</p>
                <StatusDropdown data={data} />
            </div>
            <div className={styles.item}>
                <p className={styles.name}>Срок ответа</p>
                <div className={styles.linkBlock}>
                    <div className={styles.dateWrapper}>
                        {!data.dateAnswer ? (
                            <ConfigProvider locale={ruRU}>
                                <DatePicker
                                    inputReadOnly
                                    onChange={(date) =>
                                        dateOnChange(date, data.owner, data._id)
                                    }
                                />
                            </ConfigProvider>
                        ) : (
                            <Tooltip title="Дата уже выставлена" placement="bottom">
                                <button className={styles.btnDate}>
                                    <Calendar />
                                    <span className={styles.dateText}>до {data.dateAnswer}</span>
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ApplicationInfo.propTypes = {
    data: PropTypes.object,
}

export default ApplicationInfo;