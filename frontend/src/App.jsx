// ============ IMPORTS =========== //
import { useState } from 'react';
import './App.css'
// import axios from 'axios';

function App() {
  const [emailLogin, setEmailLogin] = useState(""); // What the user types into the email box
  const [passwordLogin, setPasswordLogin] = useState(""); // What the user types into the password box
  const [loginStatus, setLoginStatus] = useState(null); // Message to say if the login was successful or not

  // Function to save user inputs into their corresponding states
  // Use can reuse the same function for both by adding names/ids onto each input
  // That way you can use an if/else to know which one triggered the function
  // and then update the correct state based on that

  function handleChange(e) {
    if (e.target.name === "email") {
      setEmailLogin(e.target.value);
    } else if (e.target.name === "password") {
      setPasswordLogin(e.target.value);
    }
  }

  // Function to handle the login
  function handleLogin(e) {
    e.preventDefault(); // prevent the form refreshing the page

    // Validate that the user has entered things before sending the fetch
    if (!emailLogin.trim() || !passwordLogin.trim()) {
      setLoginStatus({ text: "Please enter both an email and password 🙏", type: "error" })
      return
    }
    
    // Fetch request - sending the login details to the backend as a POST request
    fetch("http://localhost:4000/api/login", {    
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ email: emailLogin, password: passwordLogin })
    })
    .then((res) => {
      console.log(res);

      // Successful login
      if (res.status === 200) {
        console.log("Successful login")
        setLoginStatus({ text: "You logged In! 🥳", type: "success" })
        setEmailLogin("");
        setPasswordLogin("");
      }

      // Unsuccessful login - credentials not provided
      if (res.status === 400) {
        console.log("Failed login");
        setLoginStatus({ text: "Please enter both an email and password 🙏", type: "error" })
        throw new Error(`Both email and password are required!`)
      }

      // Unsuccessful login - credentials wrong
      if (res.status === 401) {
        console.log("Failed login");
        setLoginStatus({ text: "Your email or password was incorrect! 🥺", type: "error" })
        throw new Error(`Your email or password was incorrect!`)
      }

    })
    .catch((error) => console.error(error))

  }

  
  // Using axios
  //Function to handle the login
  //  function handleLogin(e) {
  //   e.preventDefault()

  //   // Validate that the user has entered things before sending the fetch
  //   if (!emailLogin.trim() || !passwordLogin.trim()) {
  //     setLoginStatus({ text: "Please enter both an email and password 🙏", type: "error" })
  //     return
  //   }
    
  //   // fetch request
  //   axios.post("http://localhost:4000/api/login", { email: emailLogin, password: passwordLogin })
  //   .then((res) => {
  //     console.log(res)

  //      // Successful login
  //     if (res.status === 200) {
  //       console.log("Successful login")
  //       setLoginStatus({ text: "You logged In! 🥳", type: "success" })
  //       setEmailLogin("");
  //       setPasswordLogin("");
  //     }

  //   })
  //   .catch((error) =>{
  //     console.log(error);
  //     console.log(error.response);
      
  //     // Unsuccessful login - credentials not provided
  //     if (error.response && error.response.status === 400) {
  //       setLoginStatus({ text: "Please enter both an email and password!", type: "error" })
  //     }

  //     // Unsuccessful login - credentials wrong
  //     if (error.response && error.response.status === 401) {
  //       setLoginStatus({ text: "Your email or password was incorrect! 🥺", type: "error" })
  //     }

  //   })

  // }


  return (
    <div className="outerContainer">
      <h1>Full Stack Login Form</h1>

      {/* ===== FORM ELEMENTS ====== */}
      <form className="form">
        {/* Email text box */}
        <label htmlFor='email'>Email:</label>
        {/* <input type="email" className='textbox' name='email' onChange={handleChange} /> */}
        {/* You can also use an inline function to update the state, see below ⬇️ */}
        <input
          type="email"
          className="textbox"
          name="email"
          onChange={(e) => setEmailLogin(e.target.value)}
          value={emailLogin} // Adding this value on will mean that we can clear the textbox
          id='email'
        />
        <br />

        {/* Password text box */}
        <label htmlFor='password'>Password:</label>
        {/* <input type="password" className='textbox' name='password' onChange={handleChange} /> */}
        {/* You can also use an inline function to update the state, see below ⬇️ */}
        <input
          type="password"
          className="textbox"
          name="password"
          onChange={(e) => setPasswordLogin(e.target.value)}
          value={passwordLogin} // Adding this value on will mean that we can clear the textbox
          id='password'
        />
        <br />

        {/* Submit button */}
        <button name="login" type="submit" onClick={handleLogin}>
          Login
        </button>
        <br />

        {/* This message will only display once the login was either successful or failed */}
        {loginStatus && <p className={loginStatus.type}>{loginStatus.text}</p>}
      </form>
    </div>
  );
}

export default App
