import { Dropdown } from 'antd';
import { Space } from 'antd';
import styles from '../DetailedApplication.module.scss'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { fetcher, url } from '../../../core/axios';

const StatusDropdown = ({ data }) => {
  const { mutate } = useSWRConfig()
  const statusStyles = {
    'В работе': styles.inactive,
    'На уточнении': styles.onClarification,
    'Отклонена': styles.blocked,
    'На рассмотрении': styles.active,
    'Рассмотрена': styles.active
  }

  const handleChangeStatus = async (newStatus) => {
    try {

      await fetcher(`${url}/application/change-status/${data.owner}`, {
        method: 'PUT',
        body: JSON.stringify({
          _id: data._id,
          status: newStatus
        }),
      })

      await mutate(`${url}/application/detailed/${data._id}`)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const items = [
    {
      key: '1',
      label: (
        <a onClick={() => {
          handleChangeStatus("В работе")
        }}>
          В работе
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={() => {
          handleChangeStatus("На рассмотрении")
        }}>
          На рассмотрении
        </a>
      ),
    },
  ];

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown menu={{ items }} placement="bottomLeft" arrow>
          <div className={styles.linkBlock}>
            <span className={statusStyles[data?.status]}>{data?.status}</span>
          </div>
        </Dropdown>
      </Space>
    </Space>
  );
};

StatusDropdown.propTypes = {
  data: PropTypes.any.isRequired,
};

export default StatusDropdown;