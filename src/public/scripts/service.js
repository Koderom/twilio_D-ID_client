async function saveFileFromURL(url){
    return new Promise( async (resolve, reject) => {
        try {
            const response = await axios.post('http://127.0.0.1:4000/api/store-file',{
                url: url
            });
            resolve({filename: response.data.filename, filetype: response.data.filetype});   
        } catch (error) {
            reject(error);
        }
    })
}