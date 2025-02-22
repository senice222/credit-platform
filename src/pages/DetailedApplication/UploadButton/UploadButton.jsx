import { useRef, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import styles from "./UploadButton.module.scss";
import { Document } from "../Svgs";
import PropTypes from 'prop-types'

const UploadButton = ({ uploads, setUploads }) => {
  const [networkSpeed, setNetworkSpeed] = useState(1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;
                      
    if (connection) {
      const speedMap = {
        'slow-2g': 0.1,    // 100 KB/s
        '2g': 0.25,        // 250 KB/s
        '3g': 1,           // 1 MB/s
        '4g': 10,          // 10 MB/s
        '5g': 20,          // 20 MB/s
        'wifi': 10,        // 10 MB/s
        'ethernet': 50     // 50 MB/s
      };

      console.log('Тип соединения:', connection.effectiveType);
      const speed = speedMap[connection.effectiveType] || 1;
      console.log('Расчетная скорость:', speed, 'MB/s');
      setNetworkSpeed(speed);

      // Обновляем скорость при изменении соединения
      connection.addEventListener('change', () => {
        const newSpeed = speedMap[connection.effectiveType] || 1;
        console.log('Соединение изменилось. Новая скорость:', newSpeed, 'MB/s');
        setNetworkSpeed(newSpeed);
      });
    } else {
      console.log('Network Information API не поддерживается');
    }
  }, []);

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (index) => {
    setUploads((prevUploads) => {
      const newUploads = [...prevUploads];
      if (newUploads[index] && newUploads[index].timerId) {
        clearInterval(newUploads[index].timerId);
      }
      return newUploads.filter((_, i) => i !== index);
    });
  };

  const uploadFile = async (file, index) => {
    return new Promise((resolve, reject) => {
      const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
      let offset = 0;
      let progress = 0;

      const delay = Math.max(
        (CHUNK_SIZE / (networkSpeed * 1024 * 1024)) * 1000,
        100
      );

      const readNextChunk = () => {
        const chunk = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();

        reader.onload = () => {
          offset += chunk.size;
          
          setTimeout(() => {
            progress = Math.min(Math.round((offset / file.size) * 100), 99);
            
            setUploads((prevUploads) => {
              const newUploads = [...prevUploads];
              if (newUploads[index]) {
                newUploads[index].progress = progress;
              }
              return newUploads;
            });

            if (offset < file.size) {
              readNextChunk();
            } else {
              setTimeout(() => {
                setUploads((prevUploads) => {
                  const newUploads = [...prevUploads];
                  if (newUploads[index]) {
                    newUploads[index].progress = 100;
                    newUploads[index].uploaded = true;
                  }
                  return newUploads;
                });
                resolve();
              }, 500);
            }
          }, delay);
        };

        reader.onerror = () => {
          setUploads((prevUploads) => {
            const newUploads = [...prevUploads];
            if (newUploads[index]) {
              newUploads[index].error = true;
            }
            return newUploads;
          });
          reject(new Error('Ошибка чтения файла'));
        };

        reader.readAsArrayBuffer(chunk);
      };

      readNextChunk();
    });
  };

  const handleFiles = (files) => {
    if (files?.length) {
      const newUploads = Array.from(files).map((file) => ({
        file,
        progress: 0,
        uploaded: false,
        error: false
      }));
      
      setUploads((prevUploads) => {
        const updatedUploads = [...prevUploads, ...newUploads];
        newUploads.forEach((_, i) => {
          uploadFile(files[i], prevUploads.length + i).catch(console.error);
        });
        return updatedUploads;
      });
    }
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFiles,
    noClick: true
  });

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className={styles.wrapper} {...getRootProps()}>
      <div onClick={handleContainerClick} className={styles.container}>
        <input
          {...getInputProps()}
          ref={fileInputRef}
          onChange={handleFileUpload}
          className={styles.input}
        />
        <div className={styles.content}>
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6.66602 13.3333L9.99935 10M9.99935 10L13.3327 13.3333M9.99935 10V17.5M16.666 13.9524C17.6839 13.1117 18.3327 11.8399 18.3327 10.4167C18.3327 7.88536 16.2807 5.83333 13.7493 5.83333C13.5673 5.83333 13.3969 5.73833 13.3044 5.58145C12.2177 3.73736 10.2114 2.5 7.91602 2.5C4.46424 2.5 1.66602 5.29822 1.66602 8.75C1.66602 10.4718 2.36222 12.0309 3.48847 13.1613"
                stroke="#344054"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className={styles.text}>
            <span className={styles.firstText}>
              {isDragActive ? 'Перетащите файлы сюда' : 'Нажмите здесь'}
            </span>
            <span>{!isDragActive && 'или перетащите файлы сюда'}</span>
          </p>
        </div>
      </div>
      {uploads?.length > 0 && (
        <div className={styles.uploadList}>
          {uploads?.map((upload, index) => (
            <div key={index} className={styles.uploadItem}>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>
                  <div className={styles.topDiv}>
                    <div style={{ display: 'flex' }}>
                      <div className={styles.svg}>
                        <Document />
                      </div>
                      <h2>{upload.file.name}</h2>
                    </div>
                    <span
                      className={styles.deleteMark}
                      onClick={() => handleDeleteFile(index)}
                    >
                      🗑️
                    </span>
                  </div>
                  <p className={styles.descr}>
                    {formatBytes(upload.file.size)}
                  </p>
                </div>
                <div className={styles.progressBarWrapper}>
                  <div
                    className={`${styles.progressBar} ${upload.error ? styles.errorBar : ''}`}
                    style={{ width: `${upload.progress}%` }}
                  />
                  <p>{upload.error ? 'Ошибка загрузки' : `${upload.progress}%`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

UploadButton.propTypes = {
  uploads: PropTypes.array.isRequired,
  setUploads: PropTypes.func.isRequired
}

export default UploadButton;
