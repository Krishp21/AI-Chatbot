import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

// app.get('/', (req, res, next) => {
//   res.send('Hello World!');
// });

const PORT = process.env.PORT || 5000;
connectToDatabase().then(()=>{
  app.listen(PORT,()=>console.log("Server Open and connected to Database"));

}).catch((err)=> console.log(err));

