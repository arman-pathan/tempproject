import React, { Component } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants/routes";

import cardimage from "../../images/onesouth3.jpg";
import Navbar from "../Common/Navbar/Navbar";
import NavbarUser from "../Common/NavbarUser/NavbarUser";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "./GuestDashboard.css";
import { Link } from "react-router-dom";

const cardimagestyle = {
  width: "100%",
  height: "150%"
};

class GuestDashboard extends Component {
  constructor(props) {
    super(props);

    // const { city, startDate, endDate, properties } = this.props.location.state;

    this.state = {
      email: window.localStorage.getItem("user"),
      properties: [],
      startDate: "",
      endDate: "",
      checkedIn: false,
      checkOut: false,
      cancelled: false,
      openhomeClock: ""
    };
  }

  handlecheckIn(propertyID, startDate, endDate) {
    console.log("checkin hit");
    console.log("property id", propertyID);
    console.log("start date handle checkin", startDate);

    var sd = new Date(startDate);
    var start = moment(sd).format("YYYY-MM-DD");
    console.log("start date formatted handle checkin", start);

    console.log("end date handle checkin", endDate);
    var ed = new Date(endDate);
    var end = moment(ed).format("YYYY-MM-DD");
    console.log("end date formatted handle checkin", end);

    const requestBody = {
      propertyID: propertyID.toString(),
      startDate: start,
      endDate: end,
      checkInTime: this.state.openhomeClock
    };

    console.log("checkin req body ", requestBody);

    axios
      .put(API_ENDPOINT + "/booking/checkin", requestBody)
      .then(response => {
        if (response.status == 200) {
          window.alert(response.data);
          window.alert("Email Sent! Please check email for checkin details");

          this.setState({
            checkedIn: true
          });
        }
      })
      .catch(error => {
        console.log("ERROR OBJECT", error.response.data);

        window.alert(error.response.data);
      });
  }

  handlecheckOut(propertyID, startDate, endDate) {
    console.log("checkout hit");
    console.log("property id", propertyID);
    console.log("start date handle checkout", startDate);

    var sd = new Date(startDate);
    var start = moment(sd).format("YYYY-MM-DD");
    console.log("start date formatted handle checkout", start);

    console.log("end date handle checkout", endDate);
    var ed = new Date(endDate);
    var end = moment(ed).format("YYYY-MM-DD");
    console.log("end date formatted handle checkout", end);

    const requestBody = {
      propertyID: propertyID.toString(),
      startDate: start,
      endDate: end,
      checkOutTime: this.state.openhomeClock //check here
    };

    console.log("checkout req body ", requestBody);

    axios
      .put(API_ENDPOINT + "/booking/checkout", requestBody)
      .then(response => {
        if (response.status == 200) {
          window.alert(response.data);
          window.alert("Email Sent! Please check email for checkout details");

          this.setState({
            checkOut: true
          });
        }
      })
      .catch(error => {
        console.log("ERROR OBJECT", error.response.data);

        window.alert(error.response.data);
      });
  }
  handleCancel(propertyID, startDate, endDate) {
    console.log("cancel hit");
    console.log("property id", propertyID);
    console.log("start date handle cancel", startDate);

    var sd = new Date(startDate);
    var start = moment(sd).format("YYYY-MM-DD");
    console.log("start date formatted handle cancel", start);

    console.log("end date handle cancel", endDate);
    var ed = new Date(endDate);
    var end = moment(ed).format("YYYY-MM-DD");
    console.log("end date formatted handle cancel", end);

    const requestBody = {
      propertyID: propertyID.toString(),
      startDate: start,
      endDate: end,
      cancelTime: this.state.openhomeClock
    };

    console.log("cancel req body ", requestBody);

    axios
      .post(API_ENDPOINT + "/booking/user/cancel", requestBody)
      .then(response => {
        if (response.status == 200) {
          window.alert(response.data);
          window.alert(
            "Email Sent! Please check email for Cancellation details"
          );

          this.setState(
            {
              cancelled: true
            },
            () => {
              window.location.reload();
            }
          );
        }
      })
      .catch(error => {});
  }

  componentDidMount() {
    axios
      .get(API_ENDPOINT + "/clock/current")
      .then(response => {
        console.log("CLOCK API time", response.data);

        // var check = new Date(response.data);
        // var dateS = moment(check).format("YYYY-MM-DD");
        // var timeS = moment(check).format("HH:MM");
        // var dateFinal = dateS + " " + timeS;

        if (response.status == 200) {
          this.setState({
            openhomeClock: response.data
          });
        }
      })
      .catch(error => {
        console.log("ERROR OBJECT", error);
      });

    axios
      .get(`${API_ENDPOINT}/dashboard/user/${this.state.email}`)
      .then(response => {
        console.log("LIST OF PROPERTIES DID MOUNT", response.data);

        if (response.status == 200) {
          this.setState({
            properties: response.data
          });
        }
      });
  }

  render() {
    console.log(this.state.internetAvailable);
    console.log("TIME", this.state.openhomeClock);

    //PROPERTY CARD CODE:
    let propertyCard = this.state.properties.map(property => {
      console.log(
        "property bookings start date: ",
        property.booking[0].startDate
      );
      console.log("property bookings end date: ", property.booking[0].endDate);

      var imgLink =
        "https://firebasestorage.googleapis.com/v0/b/openhome275-9ad6a.appspot.com/o/images";
      var nameArr = property.prop.images.split(",");
      const image = imgLink + nameArr[0];

      return (
        <div>
          <div class="card mb-3 ml-4" style={{ "max-width": "540px" }}>
            <div class="row no-gutters">
              <div class="col-md-4">
                <img class="card-img" src={image} style={{ height: "15rem" }} />{" "}
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">{property.prop.propertyName}</h5>
                  <p class="card-text">
                    <p>
                      {" "}
                      <i class="fas fa-map-marker-alt iconscolor"></i>{" "}
                      {property.prop.address.street != null
                        ? property.prop.address.street
                        : "899"}{" "}
                      , {property.prop.address.city} ,{" "}
                      {property.prop.address.state}, {property.prop.address.zip}{" "}
                    </p>
                    <span>
                      {" "}
                      <i class="fa fa-home iconscolor" />{" "}
                      {property.prop.propertyType}{" "}
                    </span>
                    <span>
                      {" "}
                      <i class="fa fa-bed iconscolor" />{" "}
                      {property.prop.bedroomCount}{" "}
                    </span>
                    <span>
                      {" "}
                      <i class="fas fa-parking iconscolor"></i>{" "}
                      {property.prop.parking.available ? "Yes" : "No" || "Yes"}{" "}
                    </span>
                    <span>
                      {" "}
                      <i class="fas fa-wifi iconscolor"></i>{" "}
                      {property.prop.internetAvailable ? "Yes" : "No" || "Yes"}{" "}
                    </span>
                  </p>
                  <p>{property.prop.description}</p>
                  {/* CHANGED DATE FORMAT */}
                  <p>
                    {" "}
                    Start Date:{" "}
                    {moment(new Date(property.booking[0].startDate)).format(
                      "YYYY-MM-DD"
                    )}{" "}
                  </p>
                  <p>
                    {" "}
                    End Date:{" "}
                    {moment(new Date(property.booking[0].endDate)).format(
                      "YYYY-MM-DD"
                    )}{" "}
                  </p>
                  <p class="card-text">
                    <small class="text-muted mr-4">
                      {/* CHECK IN BUTTON WILL ONLY BE SEEN IF CHECKIN=FALSE */}
                      {!property.prop.checkedIn && (
                        <button
                          class="btn btn-outline-dark btn-sm"
                          onClick={this.handlecheckIn.bind(
                            this,
                            property.prop.propertyID,
                            property.booking[0].startDate,
                            property.booking[0].endDate
                          )}
                        >
                          Check In
                        </button>
                      )}
                    </small>

                    <small class="text-muted mr-4">
                      {/* CHECK OUT BUTTON WILL ONLY BE SEEN IF CHECKIN=TRUE */}
                      {property.prop.checkedIn && (
                        <button
                          class="btn btn-outline-dark btn-sm"
                          onClick={this.handlecheckOut.bind(
                            this,
                            property.prop.propertyID,
                            property.booking[0].startDate,
                            property.booking[0].endDate
                          )}
                        >
                          Check Out
                        </button>
                      )}
                    </small>
                  </p>
                  <div>
                    <small class="text-muted">
                      <button
                        class="btn btn-outline-dark btn-md"
                        onClick={this.handleCancel.bind(
                          this,
                          property.prop.propertyID,
                          property.booking[0].startDate,
                          property.booking[0].endDate
                        )}
                      >
                        Cancel Booking
                      </button>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    //PROPERTY CARD CODE ENDS

    /*******BILLING HISTORY MAP*********/
    let bookingSummary = this.state.properties.map(book => {
      var propBooking = book.booking;

      return propBooking.map(allBookings => {
        console.log("insode booking summary map:::" + allBookings.propertyID);

        return (
          <tr>
            <td>{allBookings.propertyID}</td>
            <td>{allBookings.ownerID}</td>
            <td>
              {moment(new Date(allBookings.startDate)).format("YYYY-MM-DD")}
            </td>
            <td>
              {moment(new Date(allBookings.endDate)).format("YYYY-MM-DD")}
            </td>
            <td>{allBookings.bookedPrice}</td>
            {/* might need to add format --> .format("YYYY-MM-DD HH:MM")  FOR BELOW 2 LINES*/}
            <td>{allBookings.checkInTime}</td>
            <td>{allBookings.checkOutTime}</td>
            <td>
              {allBookings.payment != null
                ? allBookings.payment
                : "Not Checked in Yet"}
            </td>
          </tr>
        );
      });
    });

    return (
      <div>
        <div class="container-fluid dashbackground">
          <div class="row ">
            <NavbarUser />
          </div>
          <div
            class="row search-sec"
            style={{ "margin-top": "8%", background: "whitesmoke" }}
          >
            {/* SEARCH BAR STARTS */}

            <div class="container"></div>

            {/* SEARCH BAR ENDS */}
          </div>
          <div>
            {" "}
            <h1> BOOKED PROPERTIES </h1>{" "}
          </div>
          <div class="row">
            {" "}
            <br />
          </div>
          <div class="row">
            <div class="col-lg-8 col-md-6 col-sm-6 ">
              {/* INSERT PROPERTY CARD HERE */}
              {propertyCard}
            </div>
            <div class="col-lg-8 col-md-8 col-sm-8 ">
              <div class="card w-55">
                <div class="card-body">
                  <h5 class="card-title">
                    Monthly Billing Summary Details{" "}
                    <i class="fas fa-info-circle"></i>
                  </h5>

                  {/* <p>
                    <b>DETAILS</b>
                  </p> */}
                  <table>
                    <tr>
                      <td>
                        {" "}
                        <b>PropertyID </b>
                      </td>
                      <td>
                        <b>Owner </b>{" "}
                      </td>
                      <td>
                        <b>Start Date </b>{" "}
                      </td>
                      <td>
                        <b>End Date </b>
                      </td>
                      <td>
                        <b>Booked Price </b>
                      </td>
                      <td>
                        <b>Check In </b>{" "}
                      </td>
                      <td>
                        <b>Check Out </b>
                      </td>
                      <td>
                        <b>Payment </b>
                      </td>
                    </tr>

                    {bookingSummary}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuestDashboard;
