import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../Styles/Home.module.css";
import Loader from "./Loader";
const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sort, setSort] = useState("asc");
  const [sortField, setSortField] = useState("name");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    fetch(`https://randomuser.me/api/?page=${page}&results=3`)
      .then((res) => res.json())
      .then((data) => {
        setUsers((prevUsers) => {
          return [
            ...new Set([...prevUsers, ...data.results.map((user) => user)]),
          ];
        });
        setFilteredUsers((prevUsers) => {
          return [
            ...new Set([...prevUsers, ...data.results.map((user) => user)]),
          ];
        });
        setHasMore(data.results.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParams = params.get("search");
    if (searchParams) {
      setSearch(searchParams);
    }
  }, [location.search]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        return (
          user.name.first.toLowerCase().includes(search.toLowerCase()) ||
          user.name.last.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [search]);

  useEffect(() => {
    if (sort === "asc") {
      setFilteredUsers(
        [...filteredUsers].sort((a, b) =>
          a[sortField].first > b[sortField].first ? 1 : -1
        )
      );
    } else {
      setFilteredUsers(
        [...filteredUsers].sort((a, b) =>
          a[sortField].first < b[sortField].first ? 1 : -1
        )
      );
    }
  }, [sort, sortField]);

  const observer = React.useRef();
  const lastUserElementRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSort("asc");
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };
  return (
    <div className={styles.container}>
      <h1>Users List</h1>
      <button className={styles.logout} onClick={logout}>
        Logout
      </button>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
        />
      </div>
      <div className={styles.list}>
        <div className={styles.listHeader}>
          <button
            className={styles.listHeaderItem}
            onClick={() => handleSort("name")}
          >
            Name
          </button>
          <button
            className={styles.listHeaderItem}
            onClick={() => handleSort("email")}
          >
            Email
          </button>
          <button
            className={styles.listHeaderItem}
            onClick={() => handleSort("phone")}
          >
            Phone
          </button>
        </div>
        <div className={styles.listBody}>
          {filteredUsers.map((user, index) => {
            if (filteredUsers.length === index + 1) {
              return (
                <div
                  className={styles.listItem}
                  key={user.email}
                  ref={lastUserElementRef}
                >
                  <div className={styles.listItemName}>
                    <img src={user.picture.thumbnail} alt="user" />
                  </div>
                  <div className={styles.listItemNameText}>
                    {user.name.first} {user.name.last}
                  </div>
                  <div className={styles.listItemEmail}>{user.email}</div>
                  <div className={styles.listItemPhone}>{user.phone}</div>
                </div>
              );
            } else {
              return (
                <div className={styles.listItem} key={user.email}>
                  <div className={styles.listItemName}>
                    <img src={user.picture.thumbnail} alt="user" />
                  </div>
                  <div className={styles.listItemNameText}>
                    Name: {user.name.first} {user.name.last}
                  </div>
                  <div className={styles.listItemEmail}>
                    Email: {user.email}
                  </div>
                  <div className={styles.listItemPhone}>
                    Mobile: {user.phone}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className={styles.loader}>{loading && <Loader />}</div>
      <div className={styles.error}>{error && "Error"}</div>
    </div>
  );
};

export default Home;
