import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import styled from "styled-components"
import { binanceAPI, rateAPI, upbitTicksAPI } from "../api"
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

const VolumeContainer = styled.div`
    width: 100%;
    color: white;
`

const Ticks = ({options, binanceCoins}) => {
    const [upbitCoin, setUpbitCoin] = useState([])
    const [price, setPrice] = useState([])
    const [time, setTime] = useState([])
    const [volume, setVolume] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data1 = await rateAPI()
                const rate = data1.conversion_rates.KRW
                console.log(rate)

                const data2 = await upbitTicksAPI()
                setUpbitCoin(data2)
                setPrice((prevPrice) => [...prevPrice, ...data2.map((price) => price.trade_price)])
                setTime((prevTime) => [...prevTime, ...data2.map((time) => time.trade_time_utc)])
                setVolume((prevVolume) => [...prevVolume, ...data2.map((vol) => vol.trade_volume)])
            
                const data3 = await binanceAPI()
                const changeWon = data3.price * rate
                setBinancePriceArray((prevPrice) => [...prevPrice, changeWon])
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()

        setInterval(() => {
            fetchData()
        }, 6000);

        Chart.register(zoomPlugin)
    }, [])


    const lineChart = {
        labels: time,
        datasets: [
            {
                label: binanceCoins.symbol,
                data: binancePriceArray,
                fill: false,
                borderColor: 'yellow',
                tension: 0.1,
            },
            {
                label: upbitCoin.map((title) => title.market),
                data: price,
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
        ],
    }

    const barChart = {
        labels: time,
        datasets: [
            {
                label: 14,
                data: 13,
                fill: false,
                borderColor: 'yellow',
                tension: 0.1,
            },
            {
                label: upbitCoin.map((title) => title.market),
                data: volume,
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
        ],
    }

    const barOptions = {
        scales: {
            y: {
                type: 'linear',
                position: 'left',
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 0
        },
        tooltips: {
            enabled: true,
            intersect: true,
            mode: 'index'
        },
        plugins: {
            zoom: {
                zoom: {
                    darg: {
                        enabled: true,
                        threshold: 3,
                    },
                    mode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
            }
        }
    }

    return (
        <VolumeContainer>
        <Line data={lineChart} options={options} />
        <Bar data={barChart} options={barOptions} />
        </VolumeContainer>
    )
}

export default Ticks;