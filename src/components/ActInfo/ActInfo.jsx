import styles from '../../pages/DetailedApplication/DetailedApplication.module.scss';
import { Document } from '../../pages/DetailedApplication/Svgs';

const getFileExtension = (url) => {
    if (url.startsWith('http')) {
        const pathname = new URL(url).pathname;
        const ext = pathname.substring(pathname.lastIndexOf("."));
        return ext;
    }
    return '';
};

// const getFileNameFromUrl = (url) => {
//     try {
//         const pathname = new URL(url).pathname;
//         const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
//         return fileName;
//     } catch (err) {
//         console.error('Error extracting file name from URL:', err);
//         return 'Файл';
//     }
// };

const ActInfo = ({ data, filesObj }) => {
    // Функция для отображения файлов
    const renderFiles = (files, type) => {
        return files.map((item, i) => {
            // const fileName = item.startsWith('https') ? getFileNameFromUrl(item) : '';
            const fileActExtension = getFileExtension(item);
            const actFile = filesObj[fileActExtension] ? filesObj[fileActExtension] : <Document />;

            return (
                <div key={i} className={styles.item}>
                    <p className={styles.companyName}>{data.name}</p>
                    <div className={styles.document}>
                        {actFile}
                        <div>
                            {item.startsWith('http') ? (
                                <div>
                                    {type}
                                    {/* <p className={styles.actName}>{fileName.split('@')[1]}</p> */}
                                    <p className={styles.download} onClick={() => window.open(item)}>Скачать</p>
                                </div>
                            ) : (
                                <p className={styles.actName}>{item}</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div>
            {/* Отображаем все файлы, включая fileAct, previousDocuments и другие */}
            {data.fileAct && renderFiles(data.fileAct, 'Акт сверки')}
            {data.previousDocuments && renderFiles(data.previousDocuments, 'Предыдущие документы')}
            {data.allDocuments && renderFiles(data.allDocuments, 'УПД, КС-2, КС-3, акты выполненных работ')}
            {data.cart60file && renderFiles(data.cart60file, 'Карточка 60 счета заинтересованного периода')}
        </div>
    );
};

export default ActInfo;
