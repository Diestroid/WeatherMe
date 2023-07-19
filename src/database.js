import mysql from "mysql";
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'login_weather'
}); 

connection.connect((error)=>{
    if(error){
        console.log(''+error);
        return;
    }
    console.log('DATABASE IS CONNECTED :D!');
});

export default connection;