import React, { useState } from "react";
import styles from "../Styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "foo" && password === "bar") {
      localStorage.setItem("loggedIn", true);
      navigate("/home");
    } else {
      setError(true);
    }
  };
  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <form action="" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="username">UserName</label>

        <input
          type="text"
          placeholder=" Enter UserName"
          autoComplete="off"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label htmlFor="username">Password</label>

        <input
          type="password"
          placeholder=" Enter Password"
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p>Invalid Username and Password</p>}
        <button type="submit">Login</button>
      </form>
    </motion.div>
  );
};

export default Login;
