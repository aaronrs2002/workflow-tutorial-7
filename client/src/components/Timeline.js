
import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import TicketList from "./TicketList";
import axios from "axios";

const Timeline = (props) => {
    let [loaded, setLoaded] = useState(false);
    let [performingUpdate, setPerformingUpdate] = useState(false);
    let [currentData, setCurrentData] = useState({
        eventName: "default",
        timelineHeight: 350,
        series: [
            {
                data: null
            }
        ],
        options: {
            fill: {
                colors: ['#F44336', '#E91E63', '#9C27B0', '#008FFB', '#00E396', '#775DD0', '#00E396', '#ED6E5F', '#B0EBF7', '#E1C366', "#AB63F7", "#C3EDBB"]
            },
            chart: {
                height: 350,
                type: 'rangeBar'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                    dataLabels: {

                        hideOverflowingLabels: false
                    }
                }
            },
            dataLabels: {
                enabled: false,
                formatter: function (val, opts) {
                    var label = opts.w.globals.labels[opts.dataPointIndex]

                    return label.toUpperCase();
                },
                style: {
                    fontSize: '1rem',
                    fontWeight: 'bold',
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                }

            },
            type: 'datetime',
            xaxis: {
                type: 'datetime',
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                    showDuplicates: false,
                    trim: false,
                    minHeight: undefined,
                    maxHeight: 120,
                    style: {
                        colors: [],
                        fontSize: '1rem',
                        fontFamily: 'Raleway, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                    offsetX: 0,
                    offsetY: 0,
                    format: 'MMM/dd h:mm TT',
                    formatter: undefined,
                    datetimeUTC: false,
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MMM 'yy",
                        day: 'dd MMM',
                        hour: 'HH:mm',
                    },
                },

            },
            tooltip: {
                theme: "light",
                x: {
                    format: 'MMM dd h:mm TT'
                },



            },
            yaxis: {
                show: true
            },
            grid: {
                row: {
                    colors: ['#f3f4f5', '#fff'],
                    opacity: 1
                }
            }
        },
    });

    const populateFields = () => {
        let tempData = currentData;
        setPerformingUpdate((performingUpdate) => true);

        let whichTicket = document.querySelector("[name='ticketList']").value
        if (whichTicket === "default") {
            props.setActiveTicket((activeTicket) => null);
            return false;
        }
        props.setActiveTicket((activeTicket) => whichTicket);
        sessionStorage.setItem("activeTicket", whichTicket);
        props.getMessages(whichTicket);

        let endYear = whichTicket.substring(whichTicket.indexOf("-due-") + 5).substring(0, 4);
        let endMonth = whichTicket.substring(whichTicket.indexOf("-due-") + 5).substring(5, 7);
        let endDay = whichTicket.substring(whichTicket.indexOf("-due-") + 5).substring(8, 10);

        let starting = whichTicket.substring(0, 10);
        let ending = endYear + "-" + endMonth + "-" + endDay;
        let colorNumber = Math.floor(Math.random() * tempData.options.length);
        let tempColor = tempData.options.fill.colors[colorNumber];

        let selectedTimeline = [{
            x: whichTicket.substring(whichTicket.lastIndexOf(":") + 1),
            y: [
                new Date(starting).getTime(),
                new Date(ending).getTime()
            ],
            fillColor: tempColor
        }];

        tempData.series[0].data = selectedTimeline;
        tempData.series[0].timelineHeight = selectedTimeline.length * 95;

        setCurrentData((currentData) => tempData);
        setTimeout(() => {
            setPerformingUpdate((performingUpdate) => false);
        }, 1000);
    }

    useEffect(() => {
        if (loaded === false) {
            if (props.ticketInfo === null) {
                props.getTickets(props.userEmail);
            } else if (sessionStorage.getItem("activeTicket")) {
                document.querySelector("option[value='" + sessionStorage.getItem("activeTicket") + "']").selected = true;
                populateFields();
            }
            setLoaded((loaded) => true);
        }
    }, []);



    return (<div className="row">
        {props.ticketInfo !== null ?

            <div className="col-md-12">
                <TicketList ticketInfo={props.ticketInfo} populateFields={populateFields} />
            </div>
            : null}
        <div className="col=md-12">
            <h2>Timeline</h2>
        </div>
        <div className="col-md-12">
            <div className="block" data-chart="timeline">
                {(typeof currentData.series[0].data) !== null && performingUpdate === false ?
                    <ReactApexChart options={currentData.options} series={currentData.series} type="rangeBar" height={currentData.timelineHeight} width={window.innerWidth - 50} />
                    : <div className="loader"></div>}
            </div>
        </div>
    </div>)
}

export default Timeline;