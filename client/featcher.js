import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

const fetcher = async (method, url, ...rest) => {
    const res = await axios[method](url, ...rest);
    return res.data;
}

export default fetcher;

/*
get: axios.get(url[, config])
delete: axios.delete(url[, config])
post: axios.post(url, data[, config]);
put: axios.put(url, data[, config]);
*/ 

// post, put의 경우 data인자가 추가로 들어와야 하기 때문에 ...rest로 함수 만듬