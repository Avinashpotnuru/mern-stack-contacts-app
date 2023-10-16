import logo from "./logo.svg";
import "./App.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import axios from "axios";
import { useEffect, useState } from "react";

import { AiTwotoneDelete, AiOutlineEdit } from "react-icons/ai";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState({ name: "", number: "" });

  const [contactList, setContact] = useState([]);

  const [updateId, setId] = useState(null);

  const { name, number } = user;

  const [err, setError] = useState("");

  const [toggle, setToggle] = useState(true);

  const getContacts = async () => {
    const contactRes = await axios.get("http://localhost:4000/allcontacts");
    setContact(contactRes.data);
    // console.log(contactRes);
  };

  const addContact = async () => {
    console.log("add");

    try {
      const response = await axios.post(
        "http://localhost:4000/addcontacts",
        user
      );

      console.log("res", response);
      if (response.status === 201) {
        setUser({ name: "", number: "" });
        // window.location.reload();
      }
      window.location.reload();
      toast.info(response?.data?.message);
      setError(response?.data?.message);
    } catch (err) {
      console.log(err);
      setError(err?.message);
    }
  };

  const deleteContact = async (id) => {
    console.log(id);

    const res = await axios.delete(`http://localhost:4000/${id}`);
    console.log("res", res);

    if (res.status === 200) {
      window.location.reload();
    }
  };

  const updateContact = async (id) => {
    setId(id);
    setToggle(false);
    const res = await axios.get(`http://localhost:4000/${id}`);
    if (res.status === 200) {
      const data = await res.data;
      console.log(data);
      setUser({ name: data?.name, number: data?.number });
    }
  };

  const editContact = async () => {
    const update = await axios.put(`http://localhost:4000/${updateId}`, user);
    if (update.status === 201) {
      setUser({ name: "", number: "" });
      setToggle(true);
      window.location.reload();
    }
  };

  function eventHandler(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }
  const submitHandler = (e) => {
    console.log("trigger");
    e.preventDefault();

    if (name.length > 0 && number.length >= 10) {
      addContact();
    }
  };
  const updateSubmitHandler = (e) => {
    console.log("trigger Upadte");
    e.preventDefault();

    if (name.length > 0 && number.length >= 10) {
      editContact();
    }
  };

  useEffect(() => {
    getContacts();
    console.log("hello");
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="form shadow-lg p-5">
        {toggle ? (
          <Form onSubmit={submitHandler} autoComplete="true">
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={eventHandler}
                name="name"
                value={name}
                type="text"
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Mobile number</Form.Label>
              <Form.Control
                maxLength={10}
                type="text"
                name="number"
                value={number}
                onChange={eventHandler}
                placeholder="enter your number"
              />
            </Form.Group>
            {err ? <p className="text-danger">{err}</p> : ""}

            <Button variant="primary" type="submit">
              Add Contact
            </Button>
          </Form>
        ) : (
          <Form onSubmit={updateSubmitHandler} autoComplete="true">
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onChange={eventHandler}
                name="name"
                value={name}
                type="text"
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Mobile number</Form.Label>
              <Form.Control
                maxLength={10}
                type="text"
                name="number"
                value={number}
                onChange={eventHandler}
                placeholder="enter your number"
              />
            </Form.Group>
            {err && <p className="text-danger">{err}</p>}

            <Button onClick={editContact} variant="primary">
              Update Contact
            </Button>
          </Form>
        )}
      </div>

      {contactList.length <= 0 ? (
        <h1 className="text-danger mb-5">no contacts</h1>
      ) : (
        <table className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>NUMBER</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {contactList.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>{item.number}</td>

                <td>
                  <AiOutlineEdit
                    onClick={() => updateContact(item?._id)}
                    className="ml-4 mx-3"
                  />
                  <AiTwotoneDelete onClick={() => deleteContact(item?._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
