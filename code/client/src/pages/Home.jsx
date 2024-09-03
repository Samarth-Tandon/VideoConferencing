import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import { AuthContext } from "../context/authContext";
import { SocketContext } from "../context/SocketContext";
import { CgEnter } from "react-icons/cg";
import { RiVideoAddFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Groups2Icon from "@mui/icons-material/Groups2";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BoltIcon from "@mui/icons-material/Bolt";

import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [newMeetDate, setNewMeetDate] = useState("none");
  const [newMeetTime, setNewMeetTime] = useState("none");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomError, setJoinRoomError] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { socket, setMyMeets, newMeetType, setNewMeetType } =
    useContext(SocketContext);

  const userId = localStorage.getItem("userId")?.toString();
  const userName = localStorage.getItem("userName")?.toString();

  const handleLogIn = () => {
    navigate("/login");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    logout();
  };

  const handleCreateRoom = () => {
    socket.emit("create-room", {
      userId,
      roomName,
      newMeetType,
      newMeetDate,
      newMeetTime,
    });
  };

  const handleJoinRoom = async () => {
    await socket.emit("user-code-join", { roomId: joinRoomId });
    setRoomName("");
  };

  useEffect(() => {
    socket.on("room-exists", ({ roomId }) => {
      navigate(`/meet/${roomId}`);
    });
    socket.on("room-not-exist", () => {
      setJoinRoomId("");
      setJoinRoomError("Room doesn't exist! Please try again.");
    });
    socket.emit("fetch-my-meets", { userId });
    socket.on("meets-fetched", async ({ myMeets }) => {
      console.log("myMeets", myMeets);
      setMyMeets(myMeets);
    });
  }, [socket, navigate, userId, setMyMeets]);

  return (
    <div className="homePage">
      <div className="homePage-hero">
        <div className="home-header">
          <div className="home-logo">
            <h2>We Connect</h2>
          </div>

          {!userName || userName === "null" ? (
            <div className="header-before-login">
              <button onClick={handleLogIn}>Login</button>
            </div>
          ) : (
            <div className="header-after-login">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  {userName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link className="dropdown-options" to="/profile">
                      Profile
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-options"
                    onClick={handleLogOut}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>

        <div className="home-container container">
          {!userName || userName === "null" ? (
            <div className="home-app-intro">
              <h2>
                Unbounded <b>Connections:</b> Elevate Your Meetings with Free,
                Future-Forward <b>Video Conferencing!!</b>
              </h2>

              <button
                onClick={handleLogIn}
                style={{
                  marginTop: "120px",
                  justifyContent: "center",
                  textAlign: "center",
                }} // Adjust the value as needed
              >
                Join Now..
              </button>
            </div>
          ) : (
            <>
              <div className="home-app-intro">
                <span className="welcome">Welcome!! {userName},</span>
                <h2>
                  Unbounded Connections: Elevate Your Meetings with Free,
                  Future-Forward Video Conferencing!!
                </h2>
              </div>
              <div className="home-meet-container">
                <div className="create-meet">
                  <input
                    type="text"
                    placeholder="Name your meet..."
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    <RiVideoAddFill /> New meet
                  </button>
                </div>
                <p>or</p>
                <div className="join-meet">
                  <input
                    type="text"
                    placeholder="Enter code..."
                    onChange={(e) => setJoinRoomId(e.target.value)}
                  />
                  <button onClick={handleJoinRoom}>
                    <CgEnter /> Join Meet
                  </button>
                </div>
                <span>{joinRoomError}</span>
              </div>

              {/* Modal */}
              <div
                className="modal fade"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  style={{ width: "30vw" }}
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="staticBackdropLabel">
                        Create New Meet
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInput"
                          placeholder="Name your meet"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Meet name</label>
                      </div>

                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => setNewMeetType(e.target.value)}
                      >
                        <option selected>Choose meet type</option>
                        <option value="instant">Instant meet</option>
                        <option value="scheduled">Schedule for later</option>
                      </select>

                      {newMeetType === "scheduled" && (
                        <>
                          <p
                            style={{
                              margin: "10px 0px 0px 0px",
                              color: "rgb(2, 34, 58)",
                            }}
                          >
                            Meet Date:
                          </p>
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) => setNewMeetDate(e.target.value)}
                          />
                          <p
                            style={{
                              margin: "10px 0px 0px 0px",
                              color: "rgb(2, 34, 58)",
                            }}
                          >
                            Meet Time:
                          </p>
                          <input
                            type="time"
                            className="form-control"
                            onChange={(e) => setNewMeetTime(e.target.value)}
                          />
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreateRoom}
                        data-bs-dismiss="modal"
                      >
                        Create meet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="about-app-container">
        <div className="box">
          <div className="box-inner">
            <div className="box-front">
              <h2>Connect Anytime, Anywhere!</h2>
              <p>
                Our video conference app brings people closer with easy
                connectivity and affordability. Experience seamless virtual
                meetings, collaborate effortlessly, and stay connected across
                the globe. Say goodbye to distance and hello to convenience!
              </p>
            </div>
            <div className="box-back">
              <h2>Your Passport to Seamless Communication!</h2>
              <p>
                Unlock the world of effortless connectivity with our video
                conference app. Stay connected with colleagues, friends, and
                family, no matter where they are. Say goodbye to expensive
                travel and hello to affordable, hassle-free meetings.
              </p>
            </div>
          </div>
        </div>

        <div className="about-cards">
          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <Groups2Icon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Easy Group Conference!! Bringing chaos to order, one virtual
                group hug at a time!
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <CalendarMonthIcon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Schedule Your Meets! Because no one ever missed a meeting they
                couldn't reschedule.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <CurrencyRupeeIcon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Completely Free, Forever! The only thing cheaper than free? Our
                sense of humor.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <StopCircleIcon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Unlimited Recording, No Fuss! Because who doesn't love
                revisiting awkward silences on repeat?
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <QuestionAnswerIcon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Chat, Because Talking Is Overrated! For when emojis speak louder
                than words.
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="about-card-body">
            <Card.Body>
              <Card.Title className="about-card-title">
                <span>
                  <BoltIcon />
                </span>
              </Card.Title>
              <Card.Text className="about-card-text">
                Lightning Fast, Even During a Thunderstorm! The only thing
                faster than our connection? The excuses you'll come up with to
                avoid meetings.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="icon-container">
          <div className="social-icon-container">
            <a href="#">
              <GoogleIcon />
            </a>
            <a href="#">
              <FacebookIcon />
            </a>
            <a href="#">
              <InstagramIcon />
            </a>
            <a href="#">
              <TwitterIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
