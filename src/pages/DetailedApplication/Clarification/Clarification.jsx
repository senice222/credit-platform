import PropTypes from 'prop-types'
import styles from '../DetailedApplication.module.scss'
import { Pdf, Docs, Document } from "../Svgs";

const getFileExtension = (url) => {
    const pathname = new URL(url).pathname;
    const ext = pathname.substring(pathname.lastIndexOf('.'));
    return ext;
}

const Clarifications = ({ clarificationsAnswer }) => {
    const filesObj = {
        ".pdf": <Pdf />,
        ".docx": <Docs />
    }
    return (
        <div style={{ width: "100%", textAlign: "left" }}>
            {
                clarificationsAnswer.text && (
                    <div className={styles.textClarification}>
                        <p>{clarificationsAnswer.text}</p>
                    </div>
                )
            }

            {clarificationsAnswer.files.length > 0 && (
                <div className={styles.filesClarification}>
                    {clarificationsAnswer.files.map((file, fileIndex) => {
                        const fileExtension = getFileExtension(file);
                        const Icon = filesObj[fileExtension] || <Document />;
                        return (
                            <div key={fileIndex} className={styles.fileItem}>
                                {Icon}
                                <div>
                                    <p>{`Файл уточнения ${fileIndex + 1}${fileExtension}`}</p>
                                    <a href={`${file}`} download>Скачать</a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

Clarifications.propTypes = {
    data: PropTypes.obj,
    clarificationsAnswer: PropTypes.array.isRequired,
}


export default Clarifications;