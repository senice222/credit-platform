import { useState } from "react";
import { Trash, Pencil } from "../../components/Svgs/Svgs";
import style from "./Settings.module.scss";
import useSWR, { useSWRConfig } from "swr";
import { fetcher, url } from "../../core/axios";
import SettingsModal from "../../components/Modals/AddUserModal/AddUserModal";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";

const Settings = () => {
  const [active, setActive] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const { data } = useSWR(`${url}/admins`, fetcher);
  const [searchInput, setSearchInput] = useState("");
  const admin = useSelector((state) => state.admin.data);
  const { mutate } = useSWRConfig();

  const handleDelete = async (id) => {
    await mutate(
      `${url}/admins`,
      fetcher(`${url}/admin/${id}`, {
        method: "DELETE",
      })
    );
  };

  const filteredData =
    data &&
    data.filter((item) =>
      item.login.toLowerCase().includes(searchInput.toLowerCase())
    );

  if (!admin) return <Loader />;

  return (
    <>
      <SettingsModal
        admin={currentAdmin}
        isActive={active}
        setActive={() => setActive((prev) => !prev)}
      />
      <div className={style.wrapper}>
        <div className={style.topDiv}>
          <h2>Настройки ролей</h2>
          <button
            onClick={() => {
              setCurrentAdmin(null);
              setActive(true);
            }}
          >
            + Добавить
          </button>
        </div>
        <div className={style.topWrapper}>
          <p></p>
          <div className={style.searchBar}>
            <input
              type="text"
              placeholder="Поиск по имени пользователя"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className={style.container}>
          <table className={style.usersTable}>
            <thead>
              <tr>
                <th>Логин</th>
                <th>Доступ к разделам</th>
                <th>Комментарий</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* {data.map((order: Order) => ( */}
              {filteredData &&
                filteredData.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className={style.loginDiv}>
                        {item.login}
                        {item.superAdmin && (
                          <div className={style.superAdminSign}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="6"
                              height="6"
                              viewBox="0 0 6 6"
                              fill="none"
                            >
                              <circle cx="3" cy="3" r="3" fill="#9E77ED" />
                            </svg>
                            <p>Суперадмин</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={style.roles}>
                        {item.access.map((item, i) => (
                          <p key={i}>{item}</p>
                        ))}
                      </div>
                    </td>
                    <td>{item.comment}</td>
                    <td>
                      <div className={style.itemsPencil}>
                        {item._id !== admin._id && !item.superAdmin && (
                          <div onClick={() => handleDelete(item._id)}>
                            <Trash />
                          </div>
                        )}
                        <div
                          onClick={() => {
                            setCurrentAdmin(item);
                            setActive(true);
                          }}
                        >
                          <Pencil />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              {/* ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Settings;
