import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100vh;
`

const Main = () => {
    const [upBitCoins, setUpBitCoins] = useState([])
    const [timeArray, setTimeArray] = useState([])
    const [upBitPriceArray, setUpBitPriceArray] = useState([])
    const [binanceCoins, setBinanceCoins] = useState([])
    const [binancePriceArray, setBinancePriceArray] = useState([])
    const [price, setPrice] = useState()
    
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response1 = await fetch(`https://v6.exchangerate-api.com/v6/3daf2baaecbc1ae5683a3992/latest/USD`)
                const data1 = await response1.json()
                const rate = data1.conversion_rates.KRW

                const response2 = await fetch('https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=1')
                const data2 = await response2.json()
                const upbitPrice = data2.map((data) => data.trade_price)
                setUpBitCoins(data2)
                setTimeArray((prevTimeArray) => [...prevTimeArray, ...data2.map((time) => time.candle_date_time_kst.slice(11, 16))])
                setUpBitPriceArray((prevPriceArray) => [...prevPriceArray, ...data2.map((price) => price.trade_price)])
                
                const response3 = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
                const data3 = await response3.json();
                const binancePrice = data3.price * rate
                const price = binancePrice.toFixed(2)
                setBinanceCoins(data3)
                setBinancePriceArray((prevPriceArray) => [...prevPriceArray, price])
                
                setPrice((binancePrice+upbitPrice[0])/2)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()

        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const maxLength = 200
        if (maxLength < timeArray.length) {
            setTimeArray((prevTimeArray) => prevTimeArray.slice(prevTimeArray.length - maxLength));
            setUpBitPriceArray((prevPriceArray) => prevPriceArray.slice(prevPriceArray.length - maxLength))
            setBinancePriceArray((prevPriceArray) => prevPriceArray.slice(prevPriceArray.length - maxLength))
        }
    }, [timeArray]);

    console.log(price)

    const lineChart = {
        labels: timeArray,
        datasets: [
            {
                label: binanceCoins.symbol,
                data: binancePriceArray,
                fill: false,
                borderColor: 'yellow',
                tension: 0.1,
            },
            {
                label: upBitCoins.map((coin) => coin.market),
                data: upBitPriceArray,
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
        ],
    }

    const options = {
        scales: {
            y: {
                type: 'linear',
                min: Math.floor(price-500000),
                max: Math.floor(price+500000),
                position: 'left',
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 0
        }
    }

    return (
        <>
            <Container>
                <Line data={lineChart} options={options} />
            </Container>
        </>
    )
}

export default Main;