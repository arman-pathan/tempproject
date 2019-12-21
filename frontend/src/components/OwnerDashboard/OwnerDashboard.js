import React, { Component } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../constants/routes";

import cardimage from "../../images/onesouth3.jpg";
import Navbar from "../Common/Navbar/Navbar";
import NavbarOwner from "../Common/NavbarOwner/NavbarOwner";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import $ from "jquery";
import "./OwnerDashboard.css";

import { Link } from "react-router-dom";

const cardimagestyle = {
  width: "100%",
  height: "150%"
};

class OwnerDashboard extends Component {
  constructor(props) {
    super(props);

    // const { city, startDate, endDate, properties } = this.props.location.state;

    this.state = {
      email: window.localStorage.getItem("host"),
      properties: [],
      //propertyState:[],
      startDate: "",
      endDate: "",
      editedFlag: false,
      cancelled: false,
      openhomeClock: "",
      deleted: false,
      booking: [],
      isBooking: false,
      blankFlag: false,
      deleted: false
    };
  }

  handleDelete(propID) {
    console.log("prop ID delete", propID);

    var propertyID = propID.toString();

    axios
      .post(`${API_ENDPOINT}/posting/remove/${propertyID}`)
      .then(response => {
        console.log("RESPONSE STATUS: ", response.status);

        if (response.status == 200) {
          console.log("inside response");
          window.alert(response.data);
          this.setState(
            {
              deleted: true
            },
            () => {
              window.location.reload();
            }
          );
        }
      })
      .catch(error => {
        console.log("ERROR OBJECT", error);
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
      .post(API_ENDPOINT + "/booking/owner/cancel", requestBody)
      .then(response => {
        if (response.status == 200) {
          window.alert(response.data);
          window.alert("Email Sent! Please check email for Cancel details");

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
      .catch(error => {
        console.log("ERROR OBJECT", error);
      });
  }

  componentDidMount() {
    axios.get(API_ENDPOINT + "/clock/current").then(response => {
      console.log("CLOCK API", response.data);

      var check = new Date(response.data);
      var dateS = moment(check).format("YYYY-MM-DD");
      var timeS = moment(check).format("HH:MM");
      var dateFinal = dateS + " " + timeS;

      if (response.status == 200) {
        this.setState({
          openhomeClock: dateFinal
        });
      }
    });

    // this.setState({ isBooking: false });
    axios
      .get(`${API_ENDPOINT}/dashboard/owner/${this.state.email}`)
      .then(response => {
        console.log("RESPONSE STATUS: ", response.status);
        console.log("LIST OF OWNER PROPERTIES DID MOUNT", response.data);
        console.log("LIST OF OWNER PROPERTIES DID MOUNT", response.data[0]);

        // const propertiesArray = Object.keys(response.data).map(
        //   i => response.data[i]
        // );
        // // const propertiesArray = Object.values(response.data);
        // console.log("prop array ", propertiesArray);

        if (response.status == 200) {
          console.log("inside response");

          if (response.data.length == 0) {
            this.setState({
              blankFlag: true
            });
          } else {
            response.data.forEach(element => {
              element.isBooking = false;
              if (element.booking && element.booking.length > 0) {
                element.isBooking = true;
              }
            });

            this.setState(
              {
                isBooking: true,
                properties: response.data,
                booking: response.data[0].booking
              },
              () => {
                console.log("properties............: " + this.state.properties);
                console.log("booking array............: " + this.state.booking);
              }
            );
          }

          // else if (
          //   response.data &&
          //   response.data[0].booking &&
          //   response.data[0].booking.length >= 1
          // ) {
          //   this.setState(
          //     {
          //       isBooking: true,
          //       properties: response.data,
          //       booking: response.data[0].booking
          //     },
          //     () => {
          //       console.log("properties............: " + this.state.properties);
          //       console.log("booking array............: " + this.state.booking);
          //     }
          //   );
          // } else {
          //   this.setState(
          //     {
          //       isBooking: false,
          //       properties: response.data
          //     },
          //     () => {
          //       console.log("properties............: " + this.state.properties);
          //     }
          //   );
          // }
        }
      });
  }

  render() {
    console.log("TIME", this.state.openhomeClock);

    //PROPERTY CARD CODE:
    let propertyCard = this.state.properties.map(property => {
      var imgLink =
        "https://firebasestorage.googleapis.com/v0/b/openhome275-9ad6a.appspot.com/o/images";
      var nameArr = property.prop.images.split(",");
      const image = imgLink + nameArr[0];
      console.log("Property:::::: " + property);
      //console.log("checkin time type: "+typeof(property.checkInTime) + "checkin time: ")
      return (
        <div>
          <div class="card mb-3 ml-4" style={{ "max-width": "540px" }}>
            <div class="row no-gutters">
              <div class="col-md-4">
                <img class="card-img" src={image} style={{ height: "11rem" }} />{" "}
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
                  {/* <p>
                    {" "}
                    Start Date:{" "}
                    {
                    

                    property.booking.length() > 0 ?
                      property.booking[0].startDate
                    : "Not started yet!"
                    }{" "}
                  </p>
                  <p>
                    {" "}
                    End Date:{" "}
                    {property.booking.length() > 0 &&
                      property.booking[0].endDate}{" "}
                  </p> */}
                  <p class="card-text">
                    <small class="text-muted mr-4">
                      <Link
                        class="btn btn-outline-dark btn-sm"
                        to={{
                          pathname: "/editproperty",
                          state: {
                            propertyID: property.prop.propertyID,
                            property: property.prop,
                            changeDate: this.state.openhomeClock
                          }
                        }}
                      >
                        Manage Posting
                      </Link>
                    </small>
                  </p>
                  {/* DISABLING CANCEL BUTTON FOR NON BOOKED PROPERTIES */}
                  {property.isBooking && (
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
                  )}

                  <br />
                  <p>
                    <small class="text-muted">
                      <button
                        class="btn btn-outline-dark btn-md"
                        onClick={this.handleDelete.bind(
                          this,
                          property.prop.propertyID
                        )}
                      >
                        Delete Property
                      </button>
                    </small>
                  </p>
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
            <td>{allBookings.userID}</td>
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
              {" "}
              {allBookings.payment != null
                ? allBookings.payment
                : "Not Checked in Yet"}
            </td>
          </tr>
        );
      });
    });

    return (
      <div class="">
        <div class="container-fluid dashbackground">
          <div class="row ">
            <NavbarOwner />
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
            <h1 style={{ color: "white" }}> ALL RESERVATIONS </h1>{" "}
          </div>
          <div class="row">
            {" "}
            <br />
          </div>
          <div class="row">
            <div class="col-lg-8 col-md-6 col-sm-6 ">
              {/* INSERT PROPERTY CARD HERE */}

              {propertyCard}
              {/* DEMO PROPERTY CARD STARTS */}
              {/* <div class="card mb-3 ml-6" style={{ "max-width": "540px" }}>
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <img
                      class="card-img"
                      src={cardimage}
                      //    style={{ height: "11rem" }}
                    />{" "}
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">Property title</h5>
                      <p class="card-text">
                        <p>
                          {" "}
                          <i class="fas fa-map-marker-alt iconscolor"></i>{" "}
                          ADDRESS{" "}
                        </p>
                        <span>
                          {" "}
                          <i class="fa fa-home iconscolor" /> sdf{" "}
                        </span>
                        <span>
                          {" "}
                          <i class="fa fa-bed iconscolor" /> da{" "}
                        </span>
                        <span>
                          {" "}
                          <i class="fas fa-parking iconscolor"></i> sdfss{" "}
                        </span>
                        <span>
                          {" "}
                          <i class="fas fa-wifi iconscolor"></i>Sleeps: sfsad{" "}
                        </span>
                      </p>
                      <p>
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <p class="card-text">
                        <small class="text-muted mr-4">
                          <button
                            class="btn btn-outline-dark btn-sm"
                            onClick={this.handlecheckIn()}
                          >
                            Check In
                          </button>
                        </small>

                        <small class="text-muted">
                          <button
                            class="btn btn-outline-dark btn-sm"
                            onClick={this.handlecheckOut()}
                          >
                            Check Out
                          </button>
                        </small>
                      </p>
                      <div>
                        <small class="text-muted">
                          <button
                            class="btn btn-outline-dark btn-sm"
                            onClick={this.handleCancel()}
                          >
                            Cancel
                          </button>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* DEMO PROPERTY CARD ENDS */}
              {/* <div class="row border border-primary">
                <div
                  class="media mediastyle col-lg-8 col-md-8"
                  style={{ "margin-left": "10%" }}
                >
                  <div class="media-left col-lg-4 col-md-4 col-sm-4 border border-primary">
                    <a href="#">
                      {" "}
                      <img
                        class="media-object"
                        src={cardimage}
                        style={cardimagestyle}
                      />{" "}
                    </a>
                  </div>

                  <div class="media-body col-lg-6 col-md-6 col-sm-6 ">
                    <h4> PROPERTY NAME </h4>
                    <p>
                      {" "}
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Natus voluptate suscipit explicabo distinctio sit magnam
                      consectetur modi, vero eaque eos asperiores placeat vitae
                      et reiciendis commodi voluptatibus, expedita sint
                      voluptas.
                    </p>
                    <p>
                      {" "}
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Natus voluptate suscipit explicabo distinctio sit magnam
                      consectetur modi, vero eaque eos asperiores placeat vitae
                      et reiciendis commodi voluptatibus, expedita sint
                      voluptas.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
            <div class="col-lg-8 col-md-6 col-sm-6 ">
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
                        <b>PropertyID</b>
                      </td>
                      <td>
                        {" "}
                        <b>Guest</b>
                      </td>
                      <td>
                        <b>Start Date</b>
                      </td>
                      <td>
                        {" "}
                        <b> End Date</b>
                      </td>
                      <td>
                        {" "}
                        <b>Booked Price</b>
                      </td>
                      <td>
                        <b> Check In</b>
                      </td>
                      <td>
                        <b>Check Out</b>
                      </td>
                      <td>
                        <b>Payment</b>
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

export default OwnerDashboard;
