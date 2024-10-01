import { useEffect, useState, useNavigate } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";
import EditTaskModal from "./EditTaskModal";
import { MdModeEditOutline } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import "./Home.css";
import { toast } from "react-toastify";
import { FiSun } from "react-icons/fi";
import { FiMoon } from "react-icons/fi";
function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addloading, setAddLoading] = useState(false);
  const [completeLoadinng, setCompleteLoading] = useState(false);
  const [updateLoadinng, setUpdateLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(""); // State for error message
  const token = localStorage.getItem("token"); // Retrieve JWT from localStorage

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId; // Extract userId from token
  const backendUrl = `${import.meta.env.VITE_UBASE_URL}/${userId}/todos`;

  useEffect(() => {
    if (window.matchMedia("(prefers-color-schema:dark)").matches) {
      setDark(true);
    }
  }, []);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const handleTheme = () => {
      setDark(!dark);
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in headers
        },
      })
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("couldn't fetch the tasks", error);
      });
  }, [backendUrl, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddLoading(true);
    if (task.trim() === "") {
      setError("Please enter a task");
      setAddLoading(false); // Stop loading spinner when error occurs
      return;
    }
    setError(""); // Clear error message if input is not empty

    axios
      .post(
        `${backendUrl}`,
        { title: task, completed: false },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in headers
          },
        }
      )
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTask("");
        setAddLoading(false);
      })
      .catch((error) => {
        setAddLoading(false);
        console.error("couldn't create the task", error);
        toast.error("couldnt create the task");
      });
  };

  const handleDelete = (id) => {
    setDeleteLoading(true);
    axios
      .delete(`${backendUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in headers
        },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
        setDeleteLoading(false);
      })
      .catch((error) => {
        console.error("an error occurred while deleting", error);
        toast.error("couldnt delete the task! Try refreshing the page");
        setDeleteLoading(false);
      });
  };

  const handleClearCompleted = () => {
    axios
      .delete(`${backendUrl}/clear-completed/todos`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in headers
        },
      })
      .then(() => {
        setTasks(tasks.filter((task) => !task.completed));
      })
      .catch((error) => {
        console.error("Error clearing completed tasks", error);
        toast.error("Failed to clear completed tasks");
      });
  };

  const handleComplete = (id) => {
    setCompleteLoading(true);

    const task = tasks.find((task) => task._id === id);
    axios
      .put(
        `${backendUrl}/${id}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT in headers
          },
        }
      )
      .then((response) => {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
        setCompleteLoading(false);
      
      })
      .catch((error) => {
        console.error("There was an error updating the task!", error);
        toast.error("couldnt update the task! Try refreshing the page");
        setCompleteLoading(false);
      });
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalIsOpen(true);
  };

  const handleSaveEdit = (editedTask) => {
    setUpdateLoading(true);
    axios
      .put(`${backendUrl}/${editedTask._id}`, editedTask, {
        headers: {
          Authorization: `Bearer ${token}`, // Include JWT in headers
        },
      })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task._id === editedTask._id ? response.data : task
          )
        );
        setUpdateLoading(false);
        setModalIsOpen(false); // Close modal after successful update
        toast.success("Task updated successfully");
      })
      .catch((error) => {
        console.error("Error updating the task", error);
        toast.error("Failed to update the task! Try to refresh the page");
        setUpdateLoading(false);
      });
  };

  const navigate = useNavigate;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading-dots ">
        <div className="dark:bg-white"></div>
        <div className="dark:bg-white"></div>
        <div className="dark:bg-white"></div>
      </div>
    );
  }

  const incompleteTasksCount = tasks.filter((task) => !task.completed).length;
  const completeTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-10 dark:text-white">
      <div className="flex text-center justify-center gap-40">
      <h1 className="mb-10 text-5xl font-bold ">Today's Plan</h1>
      {dark ? <FiSun className="mt-2 ml-10 cursor-pointer text-2xl" onClick={()=>setDark(false)}/> : <FiMoon className="mt-2 ml-10 cursor-pointer text-2xl" onClick={()=>setDark(true)}/>}
      </div>
       
      <form action="" className="mb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          {error && (
            <p className="text-left ml-2 text-red-500 mt-2 font-bold text-2xl">
              {error}
            </p>
          )}{" "}
          {/* Render error message */}
          <label htmlFor="Task" className="text-left ml-3 font-bold"></label>
          <input
            onChange={(e) => setTask(e.target.value)}
            type="text"
            value={task}
            className="font-bold text-lg h-10 indent-2 border-2 border-collapse rounded-md focus:outline-double outline-blue-400 text-black"
            placeholder="add task ...."
          />
        </div>
        <div className="flex justify-start">
          <button className="bg-blue-600 text-white p-2 mt-3 font-bold rounded-md hover:bg-blue-500" id="button" disabled={addloading}>
            {addloading ? <div className="spinner"></div> : "Add"}
          </button>
        </div>
      </form>
      <div className="text-right  flex  mb-10 justify-between">
        <p className="font-bold text-2xl">
          Incomplete Tasks: {incompleteTasksCount}
        </p>
        <p className="font-bold text-2xl">
          Complete Tasks: {completeTasksCount}
        </p>
        <p className="font-bold text-2xl">Total Tasks: {totalTasks}</p>
        {/* <button
          className="bg-red-500 px-5 py-2 text-white text-xl font-bold rounded-md ml-20"
          onClick={handleClearCompleted}
        >
          Clear Complete
        </button> */}
        {/* <button
          className="bg-red-500 px-5 py-2 text-white text-xl font-bold rounded-md ml-20"
          onClick={handleLogout}
        >
          Logout
        </button> */}
      </div>
      {tasks.length === 0 ? (
        <p className="font-bold text-lg">No Tasks to display</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between bg-white p-5 mb-1 rounded-md dark:bg-slate-700"
          >
            <p
              className={`font-bold text-xl ${
                task.completed ? "line-through" : "line-clamp-none"
              }`}
            >
              {task.title}
            </p>
            <div className="flex gap-10">
              <IoMdCheckmark
                onClick={() => handleComplete(task._id)}
                className={` font-bold text-xl hover:cursor-pointer ${
                  task.completed ? "text-green-500" : "text-black dark:text-white"
                }`}
              />
              <FaDeleteLeft
                onClick={() => handleDelete(task._id)}
                className="font-bold text-xl hover:cursor-pointer"
              />

              <MdModeEditOutline
                onClick={() => handleEdit(task)}
                className="font-bold text-xl hover:cursor-pointer"
              />
            </div>
          </div>
        ))
      )}
      <EditTaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        task={selectedTask}
        onSave={handleSaveEdit}
      />
      {deleteLoading ? <h1 className="mt-3">Deleting Task...</h1> : ""}
      {completeLoadinng ? <h1 className="mt-3">Completing Task...</h1> : ""}
      {updateLoadinng ? <h1 className="mt-3">Updating Task...</h1> : ""}

      <hr className="mt-10 " />
      <p className="font-bold mt-3">© Nziza Prince 2024</p>
    </div>
  );
}

export default Home;
