
export const rateAPI = async () => {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/3daf2baaecbc1ae5683a3992/latest/USD`)
    const data = await response.json()

    return data
}

export const upbitMinutesAPI = async () => {
    const response = await fetch('https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=1')
    const data = await response.json()

    return data
}

export const upbitTicksAPI = async () => {
    const response = await fetch('https://api.upbit.com/v1/trades/ticks?market=KRW-BTC&count=1')
    const data = await response.json()

    return data
}

export const binanceAPI = async () => {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    const data = await response.json();

    return data
}