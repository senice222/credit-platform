import { Docs, Document, Pdf } from "../../pages/DetailedApplication/Svgs";
import PropTypes from 'prop-types'
import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss'
import HighlightedText from "../../pages/DetailedApplication/HighlightedText/HighlightedText";
import Loader from "../Loader/Loader";

const getFileExtension = (url) => {
    const pathname = new URL(url).pathname;
    const ext = pathname.substring(pathname.lastIndexOf("."));
    return ext;
};

const getFileNameFromUrl = (url) => {
    try {
        const pathname = new URL(url).pathname;
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        return fileName;
    } catch (err) {
        console.error('Error extracting file name from URL:', err);
        return 'Файл';
    }
};

const ChangesLog = ({ data }) => {

    const filesObj = {
        ".pdf": <Pdf />,
        ".docx": <Docs />,
    };

    if (!data) return <Loader />
    console.log(data.history)
    return (
        <div className={styles.reportChanges}>
            <h2>Изменения по заявке</h2>
            <div className={styles.item}>
                <div className={styles.log}>
                    <h3>Создана заявка №{data.normalId}</h3>
                </div>
                <div className={styles.log}>
                    <h3>Информация по акту:</h3>
                </div>
                {data.fileAct.map((item, i) => {
                    const fileName = item.startsWith('https') ? getFileNameFromUrl(item) : '';
                    const fileActExtension = getFileExtension(item);
                    const actFile = filesObj[fileActExtension];
                    return (
                        <div key={i}>
                            <p className={styles.companyName}>{data.name}</p>
                            <div className={styles.document}>
                                {actFile}
                                <div>
                                    <p className={styles.actName}>Акт: {fileName}</p>
                                    <p className={styles.download} onClick={() => window.open(item)}>
                                        Скачать
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
            <div className={styles.item}>
                <div className={styles.log}>
                    <h3>Пояснения к акту:</h3>
                </div>
                {data.fileExplain.map((item, i) => {
                    const fileExplainExtension = item.startsWith('https') ? getFileExtension(item) : '';
                    const explainFile = filesObj[fileExplainExtension];

                    return (
                        <div key={i}>
                            <p className={styles.companyName}>{data.name}</p>
                            <div className={styles.document}>
                                {explainFile}
                                {item.startsWith('https') ? (
                                    <div>
                                        <p className={styles.actName}>Пояснения</p>
                                        <p className={styles.download} onClick={() => window.open(item)}>
                                            Скачать
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className={styles.textContent}>{item}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={styles.logs}>
                {data.history && data.history.map((item, index) => (
                    <div key={index}>
                        {item.admin && (
                            <>
                                <div>
                                    <p style={{ marginTop: "10px", marginLeft: "15px" }}>{item.admin}</p>
                                    <div className={styles.questionText}>
                                        <p>
                                            {item.label}
                                        </p>
                                    </div>
                                    <div>
                                        {
                                            item.fileUrls && (
                                                item.fileUrls.map((file, i) => {
                                                    const fileExplainExtension = file.startsWith('https') ? getFileExtension(file) : '';
                                                    const fileName = file.startsWith('https') ? getFileNameFromUrl(file) : '';
                                                    const explainFile = !filesObj[fileExplainExtension] && <Document />;
                                                    return (
                                                        <div key={i}>
                                                            <p style={{ marginLeft: "15px" }}>{item.admin}</p>
                                                            <div className={styles.fileInfo}>
                                                                {explainFile}
                                                                <p>{fileName}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                            </>
                        )}
                        <HighlightedText item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

ChangesLog.propTypes = {
    data: PropTypes.object,
}

export default ChangesLog