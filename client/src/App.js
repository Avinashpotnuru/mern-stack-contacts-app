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

  const [toggle, setToggle] = useState(true);

  const [updateUI, setUpdateUI] = useState(false);

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

        setUpdateUI((prev) => !prev);
        toast.info(response?.data?.message);
      }

      toast.warning(response?.data?.error);
    } catch (err) {
      console.log(err);
      toast.warning(err?.message);
    }
  };

  const deleteContact = async (id) => {
    console.log(id);

    const res = await axios.delete(`http://localhost:4000/${id}`);
    console.log("res", res);

    if (res.status === 200) {
      setUpdateUI((prev) => !prev);
      toast.warn(res?.data?.message);
    }
  };

  const updateContact = async (id) => {
    setId(id);
    setToggle(false);
    const res = await axios.get(`http://localhost:4000/${id}`);
    console.log(res);
    if (res.status === 200) {
      const data = await res.data;
      // console.log(data);
      setUser({ name: data?.name, number: data?.number });
      // toast.info(res.data?.message);
    }
  };

  const editContact = async () => {
    try {
      const update = await axios.put(`http://localhost:4000/${updateId}`, user);
      console.log(update);
      if (update.status === 201) {
        setUser({ name: "", number: "" });
        setToggle(true);
        setUpdateUI((prev) => !prev);
        toast.info(update.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
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
    } else {
      toast.error("number length should minimum 10 and name not empty");
    }
  };
  const updateSubmitHandler = (e) => {
    e.preventDefault();

    if (name.length > 0 && number.length >= 10) {
      editContact();
    }
  };

  useEffect(() => {
    getContacts();
    console.log("hello");
  }, [updateUI]);

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
      <h1>contact app</h1>
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
                value={number.replace(/[^0-9]/g, "")}
                onChange={eventHandler}
                placeholder="enter your number"
              />
            </Form.Group>

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
                value={number.replace(/[^0-9]/g, "")}
                onChange={eventHandler}
                placeholder="enter your number"
              />
            </Form.Group>

            <Button onClick={editContact} variant="primary">
              Update Contact
            </Button>
          </Form>
        )}
      </div>
      <div className="table_container">
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
    </div>
  );
}

export default App;
